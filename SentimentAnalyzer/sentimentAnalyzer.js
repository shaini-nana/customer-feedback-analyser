const AWS = require("aws-sdk");

AWS.config.loadFromPath('./config.json');

const comprehend = new AWS.Comprehend({
  apiVersion: '2017-11-27'
});

const params = {
  LanguageCode: 'en',
  Text: 'Food is really good and tasty'
};


const analyzeSentiment = sentiment => {

  comprehend.detectSentiment(sentiment).promise().then(async data => {
    console.log(`Success Result.... : ${JSON.stringify(data)}`);
  }).catch(error => {
    console.log(`Error occurred... ${error.stack}`)
  })
};

analyzeSentiment(params);
