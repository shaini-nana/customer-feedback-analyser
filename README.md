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
- Step 1: Open terminal and make sure you are on the project root location.

- Step 2: Add the correct reviews file name to the variable `selectedReviewsFile` in the 
`DataPreprocessor/DataPreprocessor.py` file and in the `SentimentAnalyzer/sentimentAnalyzer.js` file, because the preprocessor will be running against the specified file.

- Step 3: Add the food items which you need to have the individual reviews drilled down to. 
This needs to be entered as array items to the variable `foodItems` in the `DataPreprocessor/DataPreprocessor.py` file.

- Step 4: Being in project root location (`/customer-feedback-analyser`) execute the following command.
``
    python3 DataPreprocessor/DataPreprocessor.py
``

- Step 5: Filtered reviews will be grouped based on the provided food items.
Food item wise grouped reviews will be found in a directory created within the `DataPreprocessor` directory.
This will be only created if the reviews were relating to any of the provided food items.

# How To Execute Sentiment Analyzer
- Step 1: Be on the project root location (`/customer-feedback-analyser`) and execute the following command to move in to the `SentimentAnalyzer` directory.
`cd SentimentAnalyzer/`

- Step 2: Install the required node modules to run the `SentimentAnalyzer` by running the below command.
`yarn`

- Step 3: Create `config.json` file within the `SentimentAnalyzer` directory.

- Step 3: Create AWS account, login to it and obtain the AWS keys which needs to be added to the `SentimentAnalyzer/config.json`.

# How To Run the Customer Feedback Analyzer Web Application
