const express = require('express');
const fs = require('fs');
const parse = require('csv-parse');

let logger = require('./logger');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

const server = app.listen(port, () =>
  logger.info(`Customer Feedback Analyzer API is listening on port ${port}!`)
);

app.get('/overallAnalytics', (req, res) => {

  logger.info(`Fetching overall analytics`);

  const overallReviewAnalytics = [];

  // @todo obtain name of the review as a query param
  fs.createReadStream(`../reviews/AnalyzedReviewScores/reviews_01/overall.csv`)
    .pipe(parse({delimiter: ':', from_line: 2}))
    .on('data', (row) => {
      overallReviewAnalytics.push(row[0]);
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Number of reviews to be processed: ${overallReviewAnalytics.length}`);
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

module.exports = {
  app,
  server
};
