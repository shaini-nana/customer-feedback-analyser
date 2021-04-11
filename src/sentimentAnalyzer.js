const fs = require('fs');
const parse = require('csv-parse');
const AWS = require("aws-sdk");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

AWS.config.loadFromPath('./config.json');

const comprehend = new AWS.Comprehend({
  apiVersion: '2017-11-27'
});

const params = {
  LanguageCode: 'en',
  Text: 'Food is really good and tasty'
};

let reviewsToBeAnalyzed = [];
let reviewsToBeAnalyzed_advance = [];
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
const selectedReviewsFile = "reviews_01";

const pathToOverallAnalytics = `${basePathForProcessedReviews}/${selectedReviewsFile}/overall.csv`;
const pathToAdvanceOverallAnalytics = `${basePathForProcessedReviews}/${selectedReviewsFile}/advance/overall.csv`;

const basePathToAnalyticalScores = `../reviews/AnalyzedReviewScores/${selectedReviewsFile}`;
const basePathToAdvanceAnalyticalScores = `../reviews/AnalyzedReviewScores/${selectedReviewsFile}/advance`;

// @todo improve the food items list to be in line with scraped reviews
const foodItems = ["burger", "pizza"];

const analyzeSentiments = reviews => {

  const results = [];

  for (let index = 0; index < reviews.length; index ++) {
    params.Text = reviews[index];
    results.push(
      comprehend.detectSentiment(params).promise().then(async data => {
        return data;
      }).catch(error => {
        console.log(`Error occurred... ${JSON.stringify(error.stack)}`);
        return error;
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
    analyticalScore.overallPositiveScore += result.SentimentScore.Positive;
    analyticalScore.overallNegativeScore += result.SentimentScore.Negative;
    analyticalScore.overallNeutralScore += result.SentimentScore.Neutral;
    analyticalScore.overallMixedScore += result.SentimentScore.Mixed;

    if (result.Sentiment === 'POSITIVE') {
      analyticalScore.overallPositiveReviewCount ++;
    } else if (result.Sentiment === 'NEGATIVE') {
      analyticalScore.overallNegativeReviewCount ++;
    } else if (result.Sentiment === 'NEUTRAL') {
      analyticalScore.overallNeutralReviewCount ++;
    } else {
      analyticalScore.overallMixedReviewCount ++;
    }
  });
  return analyticalScore;
};

const getOverallReviewAnalytics = (pathToFile, pathToStore, reviewsToAnalyze, scoreResults) => {
  reviewsToAnalyze = [];
  fs.createReadStream(pathToFile)
    .pipe(parse({delimiter: ':'}))
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
        .then(()=> console.log('The overall analytical scores written successfully'));
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
      .pipe(parse({delimiter: ':'}))
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
          .then(()=> console.log('The overall analytical scores written successfully'));
      });
  }
};

// getting the overall analytics on all available reviews
getOverallReviewAnalytics(pathToOverallAnalytics, basePathToAnalyticalScores, reviewsToBeAnalyzed, overallAnalyticalScores);
// getting the overall analytics on all available reviews - with advance preprocessing
getOverallReviewAnalytics(pathToAdvanceOverallAnalytics, basePathToAdvanceAnalyticalScores, reviewsToBeAnalyzed_advance, overallAdvanceAnalyticalScores);

// getting the food item wise analytics on all available food item reviews
getFoodItemsReviewAnalytics(`${basePathForProcessedReviews}/${selectedReviewsFile}`, basePathToAnalyticalScores);
// getting the food item wise analytics on all available food item reviews - with advance preprocessing
getFoodItemsReviewAnalytics(`${basePathForProcessedReviews}/${selectedReviewsFile}/advance`, basePathToAdvanceAnalyticalScores);
