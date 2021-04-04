const fs = require('fs');
var parse = require('csv-parse');

const aws = require('./aws.js');

const params = {
  LanguageCode: 'en',
  Text: 'Food is really good and tasty'
};

const reviewsToBeAnalyzed = [];

const readCSV = pathToFile => {
  fs.createReadStream(pathToFile)
    .pipe(parse({delimiter: ':'}))
    .on('data', (row) => {
      reviewsToBeAnalyzed.push(row[0])
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Number of reviews to be processed: ${reviewsToBeAnalyzed.length}`);
    });
};

readCSV("../DataScraper/reviews_01.csv");
aws.analyzeSentiment(params);
