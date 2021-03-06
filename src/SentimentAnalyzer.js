const fs = require('fs');
const parse = require('csv-parse');
const AWS = require("aws-sdk");
const{ backOff } = require('exponential-backoff');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { get } = require('lodash');

AWS.config.loadFromPath('./config.json');

const selectedReviewsFile = "pizza-hut";

// pizza-hut
const foodItems = ["chicken", "beef", "pepperoni", "wings", "bread sticks", "cheese"];

// mcdonalds
// const foodItems = ["burger", "chicken", "beef", "fries", "big mac", "cheese"];

// subway
// const foodItems = ["chicken", "beef", "cheese", "sandwich"];

// the-cheesecake-factory
// const foodItems = ["salad", "chicken", "bbq", "pasta"];

let reviewsToBeAnalyzed = [];
let reviewsToBeAnalyzed_advance = [];

let reviewAccuraciesToAnalyze = [];
let reviewAccuraciesToAnalyze_advance = [];

const foodItemWiseAnalytics = [];
let overallAnalyticalScores = {
  fooItem: "Overall",
  overallPositiveReviewCount: 0,
  overallPositiveScore: 0.00,
  overallNegativeReviewCount: 0,
  overallNegativeScore: 0.00,
  overallNeutralReviewCount: 0,
  overallNeutralScore: 0.00,
  overallMixedReviewCount: 0,
  overallMixedScore: 0.00
};
let overallAdvanceAnalyticalScores = {
  fooItem: "Overall Advance",
  overallPositiveReviewCount: 0,
  overallPositiveScore: 0.00,
  overallNegativeReviewCount: 0,
  overallNegativeScore: 0.00,
  overallNeutralReviewCount: 0,
  overallNeutralScore: 0.00,
  overallMixedReviewCount: 0,
  overallMixedScore: 0.00
};

const basePathForProcessedReviews = "../reviews/processedReviews";

const pathToOverallAnalytics = `${basePathForProcessedReviews}/${selectedReviewsFile}/overall.csv`;
const pathToAdvanceOverallAnalytics = `${basePathForProcessedReviews}/${selectedReviewsFile}/advance/overall.csv`;

const basePathToAnalyticalScores = `../reviews/AnalyzedReviewScores/${selectedReviewsFile}`;
const basePathToAdvanceAnalyticalScores = `../reviews/AnalyzedReviewScores/${selectedReviewsFile}/advance`;

const basePathForAccuracyOfReviews = `../accuracy/${selectedReviewsFile}/overall.csv`;
const basePathForAccuracyOfReviews_advance = `../accuracy/${selectedReviewsFile}/advance/overall.csv`;
const basePathForAccuracyOfReviews_final = `../accuracy/${selectedReviewsFile}/overall_final.csv`;
const basePathForAccuracyOfReviews_advance_final = `../accuracy/${selectedReviewsFile}/advance/overall_final.csv`;

const comprehend = new AWS.Comprehend({
  apiVersion: '2017-11-27'
});

const callComprehendWithBackOff = (params)=>{
  return backOff(() => comprehend.detectSentiment(params).promise());
};

const analyzeSentiments = reviews => {
  const results = [];
  for (let index = 0; index < reviews.length; index ++) {
    let params = {
      LanguageCode: 'en',
      Text: ''
    };
    params.Text = reviews[index];
    results.push(
      callComprehendWithBackOff(params).then(async data => {
        data.reviewId = (reviews[index].split('|'))[0];
        return data;
      }).catch(error => {
        console.log(`Error occurred in analysing sentiments via AWS: ${JSON.stringify(error.stack)}`);
      })
    );
  }
  return results;
};

const printResults = score => {
  console.log(`========= Results of the Sentiment Analysis for: ${score.fooItem} ==========`);

  console.log(`Positive Review Count: ${score.overallPositiveReviewCount} || Positivity Score: ${score.overallPositiveScore}`);
  console.log(`Negative Review Count: ${score.overallNegativeReviewCount} || Negative Score: ${score.overallNegativeScore}`);
  console.log(`Neutral Review Count: ${score.overallNeutralReviewCount} || Neutral Score: ${score.overallNeutralScore}`);
  console.log(`Mixed Review Count: ${score.overallMixedReviewCount} || Mixed Score: ${score.overallMixedScore}`);
};

const getAnalyticalScores = (results, scoreRecorder) => {
  let analyticalScore = scoreRecorder;
  results.forEach(result => {
    analyticalScore.overallPositiveScore += get(result, 'SentimentScore.Positive');
    analyticalScore.overallNegativeScore += get(result, 'SentimentScore.Negative');
    analyticalScore.overallNeutralScore += get(result, 'SentimentScore.Neutral');
    analyticalScore.overallMixedScore += get(result, 'SentimentScore.Mixed');

    if (result.Sentiment === 'POSITIVE') {
      analyticalScore.overallPositiveReviewCount ++;
    } else if (result.Sentiment === 'NEGATIVE') {
      analyticalScore.overallNegativeReviewCount ++;
    } else if (result.Sentiment === 'NEUTRAL') {
      if (get(result, 'SentimentScore.Positive') >= get(result, 'SentimentScore.Negative')) {
        // positive is greater than negative
        if (get(result, 'SentimentScore.Positive') >= get(result, 'SentimentScore.Mixed')) {
          // Positive is the second greatest
          analyticalScore.overallPositiveReviewCount ++;
        } else {
          // mixed is the second greatest
          analyticalScore.overallMixedReviewCount ++;
        }

      } else {
        // negative is greater than positive
        if (get(result, 'SentimentScore.Negative') >= get(result, 'SentimentScore.Mixed')) {
          // negative is the second greatest
          analyticalScore.overallNegativeReviewCount ++;
        } else {
          // mixed is the second greatest
          analyticalScore.overallMixedReviewCount ++;
        }
      }
    } else {
      analyticalScore.overallMixedReviewCount ++;
    }
  });
  return analyticalScore;
};

const convertSentimentToValue = (sentimentResult) => {
  let result = 3;
  if (sentimentResult.Sentiment === 'POSITIVE') {
    result = 1;
  } else if (sentimentResult.Sentiment === 'NEGATIVE') {
    result = 2;
  } else if (sentimentResult.Sentiment === 'NEUTRAL') {
    if (sentimentResult.SentimentScore.Positive >= sentimentResult.SentimentScore.Negative) {
      // positive is greater than negative
      if (sentimentResult.SentimentScore.Positive >= sentimentResult.SentimentScore.Mixed) {
        // Positive is the second greatest
        result = 1;
      }

    } else {
      // negative is greater than positive
      if (sentimentResult.SentimentScore.Negative >= sentimentResult.SentimentScore.Mixed) {
        // negative is the second greatest
        result = 2;
      }
    }
  }
  return result;
};

const findResult = (results, revId) => {
  let correctRes;
  for (let index = 0; index < results.length; index ++) {
    if (results[index].reviewId === revId) {
      correctRes = results[index];
      break;
    }
  }
  return correctRes;
};

const getOverallReviewAnalytics = (pathToFile, pathToStore, reviewsToAnalyze, accuraciesToAnalyze, scoreResults, pathForAccuracyOfReviews, pathForAccuracyOfReviewsFinal) => {
  reviewsToAnalyze = [];
  accuraciesToAnalyze = [];
  fs.createReadStream(pathToFile)
    .pipe(parse({}))
    .on('data', (row) => {
      reviewsToAnalyze.push(row[0])
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed ${pathToFile}. Number of reviews to be processed: ${reviewsToAnalyze.length}`);
      // analyze all the reviews using AWS comprehend
      const results = await Promise.all(analyzeSentiments(reviewsToAnalyze));
      // calculate the analytical scores for all reviews
      const analyticalScore = getAnalyticalScores(results, scoreResults);
      // print results
      printResults(analyticalScore);
      // write results to file
      if (!fs.existsSync(pathToStore)){
        fs.mkdirSync(pathToStore);
      }
      const csvWriter = createCsvWriter({
        path: `${pathToStore}/overall.csv`,
        header: [
          {id: 'totalReviews', title: 'Total Number of Reviews'},
          {id: 'positiveScore', title: 'Positive Score'},
          {id: 'positiveReviewCount', title: 'Positive Review Count'},
          {id: 'negativeScore', title: 'Negative Score'},
          {id: 'negativeReviewCount', title: 'Negative Review Count'},
          {id: 'neutralScore', title: 'Neutral Score'},
          {id: 'neutralReviewCount', title: 'Neutral Review Count'},
          {id: 'mixedScore', title: 'Mixed Score'},
          {id: 'mixedReviewCount', title: 'Mixed Review Count'}
        ]
      });
      const data = [
        {
          totalReviews: reviewsToAnalyze.length,
          positiveScore: analyticalScore.overallPositiveScore,
          positiveReviewCount: analyticalScore.overallPositiveReviewCount,
          negativeScore: analyticalScore.overallNegativeScore,
          negativeReviewCount: analyticalScore.overallNegativeReviewCount,
          neutralScore: analyticalScore.overallNeutralScore,
          neutralReviewCount: analyticalScore.overallNeutralReviewCount,
          mixedScore: analyticalScore.overallMixedScore,
          mixedReviewCount: analyticalScore.overallMixedReviewCount
        }
      ];
      csvWriter
        .writeRecords(data)
        .then(()=> console.log('The overall classification completed'));

      if (fs.existsSync(pathForAccuracyOfReviewsFinal)){
        fs.unlinkSync(pathForAccuracyOfReviewsFinal);
      }
      fs.createReadStream(pathForAccuracyOfReviews)
        .pipe(parse({}))
        .on('data', (row) => {
          accuraciesToAnalyze.push(row[0])
        })
        .on('end', async () => {
          accuraciesToAnalyze.forEach(reviewAcc => {
            const reviewAccSplit = reviewAcc.split('|');
            const csvWriter = createCsvWriter({
              path: `${pathForAccuracyOfReviewsFinal}`,
              header: [
                {id: 'reviewId', title: 'Review Id'},
                {id: 'actualSentiment', title: 'Actual Sentiment'},
                {id: 'predictedSentiment', title: 'Predicted Sentiment'},
                {id: 'review', title: 'Review'},
              ],
              append: true
            });
            const data = [
              {
                reviewId: reviewAccSplit[0],
                actualSentiment: reviewAccSplit[1],
                predictedSentiment: convertSentimentToValue(findResult(results, reviewAccSplit[0])),
                review: reviewAccSplit[2]
              }
            ];
            csvWriter
              .writeRecords(data)
              .then(()=> console.log('The overall analytical scores written successfully'));
          });
          const endprocessingTime = new Date().getTime();
          console.log("Overall processing completed at: ", endprocessingTime);
          console.log("Total time taken: ", (endprocessingTime - startprocessingTime));
        })
    });
};

const getFoodItemsReviewAnalytics = (readStream, writeStream) => {
  const filePath = `${writeStream}/foodItemReviews.csv`;
  if (fs.existsSync(filePath)){
    fs.unlinkSync(filePath);
  }

  // loop through each identified food item
  for (let index = 0; index < foodItems.length; index++) {
    let foodItemWiseReviews = [];
    let foodItemWiseAnalyticalScore = {
      fooItem: foodItems[index],
      overallPositiveReviewCount: 0,
      overallPositiveScore: 0.00,
      overallNegativeReviewCount: 0,
      overallNegativeScore: 0.00,
      overallNeutralReviewCount: 0,
      overallNeutralScore: 0.00,
      overallMixedReviewCount: 0,

      overallMixedScore: 0.00
    };

    // per each food item open up the respective reviews file and start reading it
    fs.createReadStream(`${readStream}/${foodItems[index]}.csv`)
      .pipe(parse({}))
      .on('data', (row) => {
        foodItemWiseReviews.push(row[0])
      })
      .on('end', async () => {
        console.log(`CSV file successfully processed. Number of reviews to be processed: ${foodItemWiseReviews.length}`);
        // upon completing reading the respective reviews file analyze the reviews using AWS comprehend
        const results = await Promise.all(analyzeSentiments(foodItemWiseReviews));
        // calculate the analytical scores for each food item
        const score = getAnalyticalScores(results, foodItemWiseAnalyticalScore);
        // store the scores
        foodItemWiseAnalytics.push(score);
        // print results
        printResults(score);
        // write results to file
        if (!fs.existsSync(writeStream)){
          fs.mkdirSync(writeStream);
        }
        const csvWriter = createCsvWriter({
          path: filePath,
          header: [
            {id: 'foodItem', title: 'Food Item'},
            {id: 'totalReviews', title: 'Total Number of Reviews'},
            {id: 'positiveScore', title: 'Positive Score'},
            {id: 'positiveReviewCount', title: 'Positive Review Count'},
            {id: 'negativeScore', title: 'Negative Score'},
            {id: 'negativeReviewCount', title: 'Negative Review Count'},
            {id: 'neutralScore', title: 'Neutral Score'},
            {id: 'neutralReviewCount', title: 'Neutral Review Count'},
            {id: 'mixedScore', title: 'Mixed Score'},
            {id: 'mixedReviewCount', title: 'Mixed Review Count'}
          ],
          append: true
        });
        const data = [
          {
            foodItem: foodItems[index],
            totalReviews: foodItemWiseReviews.length,
            positiveScore: score.overallPositiveScore,
            positiveReviewCount: score.overallPositiveReviewCount,
            negativeScore: score.overallNegativeScore,
            negativeReviewCount: score.overallNegativeReviewCount,
            neutralScore: score.overallNeutralScore,
            neutralReviewCount: score.overallNeutralReviewCount,
            mixedScore: score.overallMixedScore,
            mixedReviewCount: score.overallMixedReviewCount
          }
        ];
        csvWriter
          .writeRecords(data)
          .then(()=> console.log('The detail analytical scores written successfully'));

        const endprocessingTime = new Date().getTime();
        console.log("Detail processing completed at: ", endprocessingTime);
        console.log("Total time taken: ", (endprocessingTime - startprocessingTime));
      });
  }
};

const startprocessingTime = new Date().getTime();
console.log("Processing started at: ", startprocessingTime);

// getting the overall analytics on all available reviews
getOverallReviewAnalytics(pathToOverallAnalytics, basePathToAnalyticalScores, reviewsToBeAnalyzed, reviewAccuraciesToAnalyze, overallAnalyticalScores, basePathForAccuracyOfReviews, basePathForAccuracyOfReviews_final);

// getting the overall analytics on all available reviews - with advance preprocessing
getOverallReviewAnalytics(pathToAdvanceOverallAnalytics, basePathToAdvanceAnalyticalScores, reviewsToBeAnalyzed_advance, reviewAccuraciesToAnalyze_advance, overallAdvanceAnalyticalScores, basePathForAccuracyOfReviews_advance, basePathForAccuracyOfReviews_advance_final);

// getting the food item wise analytics on all available food item reviews
getFoodItemsReviewAnalytics(`${basePathForProcessedReviews}/${selectedReviewsFile}`, basePathToAnalyticalScores);

// getting the food item wise analytics on all available food item reviews - with advance preprocessing
getFoodItemsReviewAnalytics(`${basePathForProcessedReviews}/${selectedReviewsFile}/advance`, basePathToAdvanceAnalyticalScores);
