const express = require('express');
const fs = require('fs');
const parse = require('csv-parse');
const cors = require('cors');

let logger = require('./logger');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const server = app.listen(port, () =>
  logger.info(`Customer Feedback Analyzer API is listening on port ${port}!`)
);

app.get('/overallAnalytics', (req, res) => {

  const review = req.query.reviewName;
  const readStream = req.query.isAdvance === 'true' ? `../reviews/AnalyzedReviewScores/${review}/advance/overall.csv` : `../reviews/AnalyzedReviewScores/${review}/overall.csv`;
  logger.info(`Fetching overall analytics for review from: ${readStream}`);

  const overallReviewAnalytics = [];

  fs.createReadStream(readStream)
    .pipe(parse({delimiter: ':', from_line: 2}))
    .on('data', (row) => {
      overallReviewAnalytics.push(row[0]);
    })
    .on('end', async () => {
      console.log(`Ovarall analytics for review: ${review} file successfully processed`);
      const analytics = overallReviewAnalytics[0].split(',');
      const overallAnalytics = {
        totalNumberOfReviews: Number(analytics[0]),
        positiveScore: Number(analytics[1]),
        positiveReviewCount: Number(analytics[2]),
        negativeScore: Number(analytics[3]),
        negativeReviewCount: Number(analytics[4]),
        neutralScore: Number(analytics[5]),
        neutralReviewCount: Number(analytics[6]),
        mixedScore: Number(analytics[7]),
        mixedReviewCount: Number(analytics[8]),
      };
      res.send(overallAnalytics);
    });
});


app.get('/foodAnalytics', (req, res) => {

  const review = req.query.reviewName;
  const readStream = req.query.isAdvance === 'true' ? `../reviews/AnalyzedReviewScores/${review}/advance/foodItemReviews.csv` : `../reviews/AnalyzedReviewScores/${review}/foodItemReviews.csv`;
  logger.info(`Fetching food analytics for review from: ${readStream}`);

  const foodReviewAnalytics = [];
  const results = [];

  fs.createReadStream(readStream)
    .pipe(parse({delimiter: ':'}))
    .on('data', (row) => {
      foodReviewAnalytics.push(row[0]);
    })
    .on('end', async () => {
      console.log(`Ovarall analytics for review: ${review} file successfully processed`);
      foodReviewAnalytics.forEach(foodReview => {
        const analytics = foodReview.split(',');
        const result = {
          foodItem: analytics[0],
          totalNumberOfReviews: Number(analytics[1]),
          positiveScore: Number(analytics[2]),
          positiveReviewCount: Number(analytics[3]),
          negativeScore: Number(analytics[4]),
          negativeReviewCount: Number(analytics[5]),
          neutralScore: Number(analytics[6]),
          neutralReviewCount: Number(analytics[7]),
          mixedScore: Number(analytics[8]),
          mixedReviewCount: Number(analytics[9]),
        };
        results.push(result);
      });
      res.send(results);
    });
});

module.exports = {
  app,
  server
};
