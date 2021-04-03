# Customer Feedback Analyser
Automating Text-Based Customer Feedback Analysis to Derive Business Analytics

# Technologies and Languages
- Python
- Node Js

# How To Execute The Tool
This tool consists of 3 individual components as stated below:
- Data Scraper
- Data Preprocessor
- Sentiment Analyzer

Further in order to view the final analytical results run the frontend application on your local machine.
Instructions can be found in the section - 
[How To Run the Customer Feedback Analyzer Web Application](#How To Run the Customer Feedback Analyzer Web Application)

# How To Execute Data Scraper

# How To Execute Data Preprocessor
- Step 1: Open terminal and make sure you are on the project root location.

- Step 2: Add the correct reviews file name to the variable `selectedReviewsFile` in the 
`DataPreprocessor/DataPreprocessor.py` file, because the preprocessor will be running against the specified file.

- Step 3: Add the food items which you need to have the individual reviews drilled down to. 
This needs to be entered as array items to the variable `foodItems` in the `DataPreprocessor/DataPreprocessor.py` file.

- Step 4: Being in project root location (`/customer-feedback-analyser`) execute the following command.
``
    python3 DataPreprocessor/DataPreprocessor.py
``

# How To Execute Sentiment Analyzer
- Step 1: Be on the project root location (`/customer-feedback-analyser`) and execute the following command to move in to the `SentimentAnalyzer` directory.
`cd SentimentAnalyzer/`

# How To Run the Customer Feedback Analyzer Web Application
