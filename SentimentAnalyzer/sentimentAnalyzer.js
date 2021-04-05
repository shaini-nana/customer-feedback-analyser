const fs = require('fs');
const parse = require('csv-parse');
const AWS = require("aws-sdk");

AWS.config.loadFromPath('./config.json');

const comprehend = new AWS.Comprehend({
  apiVersion: '2017-11-27'
});

const params = {
  LanguageCode: 'en',
  Text: 'Food is really good and tasty'
};

const reviewsToBeAnalyzed = [];
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

const basePathForOverallReviews = "../DataScraper";
const selectedReviewsFile = "reviews_01";
const pathToOverallAnalytics = `${basePathForOverallReviews}/${selectedReviewsFile}.csv`;

const basePathForFoodItemWiseReviews = "./reviews_01";
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
        console.log(`Error occurred... ${error.stack}`);
        return error;
      })
    );
  }
  return results;
};

const printResults = score => {
  console.log(`========= Results of the Sentiment Analysis for: ${score.fooItem} ==========`);

  console.log(`Overall Positive Review Count: ${score.overallPositiveReviewCount} || Overall Positivity Score: ${score.overallPositiveScore}`);
  console.log(`Overall Negative Review Count: ${score.overallNegativeReviewCount} || Overall Negative Score: ${score.overallNegativeScore}`);
  console.log(`Overall Neutral Review Count: ${score.overallNeutralReviewCount} || Overall Neutral Score: ${score.overallNeutralScore}`);
  console.log(`Overall Mixed Review Count: ${score.overallMixedReviewCount} || Overall Mixed Score: ${score.overallMixedScore}`);
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

const getOverallReviewAnalytics = pathToFile => {
  fs.createReadStream(pathToFile)
    .pipe(parse({delimiter: ':'}))
    .on('data', (row) => {
      reviewsToBeAnalyzed.push(row[0])
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Number of reviews to be processed: ${reviewsToBeAnalyzed.length}`);
      const results = await Promise.all(analyzeSentiments(reviewsToBeAnalyzed));
      const analyticalScore = getAnalyticalScores(results, overallAnalyticalScores);
      printResults(analyticalScore);
    });
};

const getFoodItemsReviewAnalytics = () => {
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
    fs.createReadStream(`../DataPreprocessor/${selectedReviewsFile}/${foodItems[index]}.csv`)
      .pipe(parse({delimiter: ':'}))
      .on('data', (row) => {
        foodItemWiseReviews.push(row[0])
      })
      .on('end', async () => {
        console.log(`CSV file successfully processed. Number of reviews to be processed: ${foodItemWiseReviews.length}`);
        // upon completing reading the respective reviews file analyze the reviews using AWS comprehend
        const results = await Promise.all(analyzeSentiments(foodItemWiseReviews));
        const score = getAnalyticalScores(results, foodItemWiseAnalyticalScore);
        foodItemWiseAnalytics.push(score);
        printResults(score);
      });
  }
};

// getting the overall analytics on all available reviews
getOverallReviewAnalytics(pathToOverallAnalytics);

// getting the food item wise analytics on all available food item reviews
getFoodItemsReviewAnalytics();
