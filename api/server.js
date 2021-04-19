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

app.get('/accuracy', (req, res) => {

  const review = req.query.reviewName;
  const accuracyReadStream = req.query.isAdvance === 'true' ? `../accuracy/${review}/advance/accuracy.csv` : `../accuracy/${review}/accuracy.csv`;
  const statsReadStream = req.query.isAdvance === 'true' ? `../accuracy/${review}/advance/overall_final.csv` : `../accuracy/${review}/overall_final.csv`;
  logger.info(`Fetching overall analytics for review from: ${accuracyReadStream}`);
  const classificationScores = [];
  let reviewCount = 0;
  const overallAccuracyValue = {
    totalCounts : {
      count: 0,
      positiveCount: 0,
      negativeCount: 0,
      mixedCount: 0,
    },
    correctCounts : {
      count: 0,
      positiveCount: 0,
      negativeCount: 0,
      mixedCount: 0,
    }
  };

  fs.createReadStream(accuracyReadStream)
    .pipe(parse({}))
    .on('data', (row) => {
      classificationScores.push({
        type: row[0],
        f1: row[1],
        precision: row[2],
        recall: row[3],
      });
    })
    .on('end', async () => {
      console.log(`Overall classification scores for review: ${review} file successfully processed`);

      fs.createReadStream(statsReadStream)
        .pipe(parse({}))
        .on('data', (row) => {
          reviewCount += 1;
          const actual = row[1];
          const pred = row[2];
          if (actual == pred) {
            // adds the total correct classifications
            overallAccuracyValue.correctCounts.count += 1;
            if (actual == '1') {
              overallAccuracyValue.correctCounts.positiveCount += 1;
            }
            else if (actual == '2') {
              overallAccuracyValue.correctCounts.negativeCount += 1;
            }
            else if (actual == '3') {
              overallAccuracyValue.correctCounts.mixedCount += 1;
            }
          }

          if (actual == '1') {
            overallAccuracyValue.totalCounts.positiveCount += 1;
          }
          else if (actual == '2') {
            overallAccuracyValue.totalCounts.negativeCount += 1;
          }
          else if (actual == '3') {
            overallAccuracyValue.totalCounts.mixedCount += 1;
          }
        })
        .on('end', async () => {
          console.log(`Overall accuracies for review: ${review} file successfully processed`);
          overallAccuracyValue.totalCounts.count = reviewCount;
          res.send({
            overallAccuracyValue,
            classificationScores
          });
        });
    });
});

module.exports = {
  app,
  server
};
