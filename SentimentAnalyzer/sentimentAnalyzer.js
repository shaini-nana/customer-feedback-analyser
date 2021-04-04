const aws = require('./aws.js');

const params = {
  LanguageCode: 'en',
  Text: 'Food is really good and tasty'
};

aws.analyzeSentiment(params);
