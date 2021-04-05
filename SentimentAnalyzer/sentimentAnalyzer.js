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
let overallPositiveReviewCount = 0;
let overallPositiveScore = 0.00;
let overallNegativeReviewCount = 0;
let overallNegativeScore = 0.00;
let overallNeutralReviewCount = 0;
let overallNeutralScore = 0.00;
let overallMixedReviewCount = 0;
let overallMixedScore = 0.00;

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
        overallPositiveScore += data.SentimentScore.Positive;
        overallNegativeScore += data.SentimentScore.Negative;
        overallNeutralScore += data.SentimentScore.Neutral;
        overallMixedScore += data.SentimentScore.Mixed;

        if (data.Sentiment === 'POSITIVE') {
          overallPositiveReviewCount ++;
        } else if (data.Sentiment === 'NEGATIVE') {
          overallNegativeReviewCount ++;
        } else if (data.Sentiment === 'NEUTRAL') {
          overallNeutralReviewCount ++;
        } else {
          overallMixedReviewCount ++;
        }
        return data;
      }).catch(error => {
        console.log(`Error occurred... ${error.stack}`)
      })
    );
  }
  return results;
};

const printResults = () => {
  console.log("========= Results of the Sentiment Analysis ==========");

  console.log(`Overall Positive Review Count: ${overallPositiveReviewCount} || Overall Positivity Score: ${overallPositiveScore}`);
  console.log(`Overall Negative Review Count: ${overallNegativeReviewCount} || Overall Negative Score: ${overallNegativeScore}`);
  console.log(`Overall Neutral Review Count: ${overallNeutralReviewCount} || Overall Neutral Score: ${overallNeutralScore}`);
  console.log(`Overall Mixed Review Count: ${overallMixedReviewCount} || Overall Mixed Score: ${overallMixedScore}`);
};

const getOverallReviewAnalytics = pathToFile => {
  fs.createReadStream(pathToFile)
    .pipe(parse({delimiter: ':'}))
    .on('data', (row) => {
      reviewsToBeAnalyzed.push(row[0])
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Number of reviews to be processed: ${reviewsToBeAnalyzed.length}`);
      await Promise.all(analyzeSentiments(reviewsToBeAnalyzed));
      printResults();
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

        console.log(`${foodItems[index]}: ${JSON.stringify(results)}`)
      });

    foodItemWiseAnalytics.push(foodItemWiseAnalyticalScore);
  }
};

// getting the overall analytics on all available reviews
// getOverallReviewAnalytics(pathToOverallAnalytics);

// getting the food item wise analytics on all available food item reviews
getFoodItemsReviewAnalytics();
