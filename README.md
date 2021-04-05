# Customer Feedback Analyser
Automating Text-Based Customer Feedback Analysis to Derive Business Analytics.
Important business analytics will be provided under the below mentioned aspects:
- Analytics on the overall business reviews
- Analytics on each food item reviews

# Technologies and Languages
- Python
- Node Js

# How To Execute The Tool
This tool consists of 3 individual components as stated below:
- Data Scraper
- Data Preprocessor
- Sentiment Analyzer

Further in order to view the final analytical results run the `Customer Feedback Analyzer Web Application` on your local machine.

# How To Execute Data Scraper

# How To Execute Data Preprocessor
- Step 1: Open terminal and move to the `src` directory. 
Make sure you are on the `customer-feedback-analyser/src` directory before executing the `DataPreprocessor.py` script.

- Step 2: Add the correct reviews file name to the variable `selectedReviewsFile` in the 
`src/DataPreprocessor.py` file and in the `src/sentimentAnalyzer.js` file.

- Step 3: Add the food items which you need to have the individual reviews drilled down to. 
This needs to be entered as array items to the variable `foodItems` in the `src/DataPreprocessor.py` file and in the `src/sentimentAnalyzer.js` file.

- Step 4: Being in the `src` directory (`customer-feedback-analyser/src`) execute the following command.
``
    python3 DataPreprocessor/DataPreprocessor.py
``

- Step 5: Filtered reviews will be grouped based on the provided food items.
Food item wise grouped reviews will be found in a directory created within the `reviews/processedReviews` directory.
This will be only created if the reviews were relating to any of the provided food items.

# How To Execute Sentiment Analyzer
- Step 1: Be in the `src` directory location (`customer-feedback-analyser/src`) before executing the `sentimentAnalyzer.js` script. 

- Step 2: Install the required node modules to run the `SentimentAnalyzer.js` by running the below command.
`yarn`

- Step 3: Create `config.json` file within the `SentimentAnalyzer` directory.

- Step 3: Create AWS account, login to it and obtain the AWS keys which needs to be added to the `SentimentAnalyzer/config.json`.

- Step 4: Execute the below command to run the `src/sentimentAnalyzer.js` script.
`yarn start`

# How To Run the Customer Feedback Analyzer Web Application
