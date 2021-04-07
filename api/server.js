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

  const review = req.query.reviewName;
  logger.info(`Fetching overall analytics for review: ${review}`);

  const overallReviewAnalytics = [];

  fs.createReadStream(`../reviews/AnalyzedReviewScores/${review}/overall.csv`)
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

module.exports = {
  app,
  server
};
