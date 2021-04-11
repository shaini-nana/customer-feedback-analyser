import csv
import nltk
from pathlib import Path
from Lemmatizer import lemmatize_sentence

nltk.download('punkt')
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

# add the reviews file name which you need to analyze reviews upon
selectedReviewsFile = 'reviews_01'

reviewFile = open('../reviews/scrapedReviews/' + selectedReviewsFile + '.csv')
reviewReader = csv.reader(reviewFile)

# @todo improve the food items list to be in line with scraped reviews
foodItems = ["burger", "pizza"]
# @todo initializing food item related reviews array
foodReviews = []
foodReviewsAdvance = []

overallReviews = []
overallReviewsAdvanced = []

isCategorizedReviews = bool(0)

for foodRevCategory in foodItems:
    foodReviews.append([])
    foodReviewsAdvance.append([])

print("======= Start reading through the reviews =======")
# looping through the reviews csv
for row in reviewReader:

    # obtaining each review
    review = (row[0].strip().split('\t'))[0]
    overallReviews.append(review)

    # lemmatize each review
    processedReview = lemmatize_sentence(review)
    overallReviewsAdvanced.append(processedReview)

    # splitting the sentences of each review
    reviewSentences = tokenizer.tokenize(review)

    # looping through each sentence of the focused review
    for reviewSentence in reviewSentences:
        processedSentence = reviewSentence.lower()
        # lemmatize each review sentence
        processedReview = lemmatize_sentence(processedSentence)

        # looping each review sentence through each food item
        # to check if the review sentence is about any of the identified food items
        for inx, foodItem in enumerate(foodItems):
            if foodItem in  processedSentence:
                foodReviews[inx].append(processedSentence)

for reviewCategories in foodReviews:
    if len(reviewCategories) != 0:
        isCategorizedReviews = bool(10)
        break


# create a directory within the DataPreprocessor directory
# to store all the preprocessed reviews
Path("../reviews/processedReviews/" + selectedReviewsFile).mkdir(parents=True, exist_ok=True)
Path("../reviews/processedReviews/" + selectedReviewsFile + "/advance").mkdir(parents=True, exist_ok=True)

# create/open csv files specific to each food item
with open("../reviews/processedReviews/" + selectedReviewsFile + "/advance/overall.csv", 'w', newline='') as file:
    writer = csv.writer(file)
    # loop through each food item to create specific directories to get the reviews
    for overallReview in overallReviewsAdvanced:
        # write each food item specific reviews to the respective food item csv file
        writer.writerow([overallReview])


# create/open csv files specific to each food item
with open("../reviews/processedReviews/" + selectedReviewsFile + "/overall.csv", 'w', newline='') as file:
    writer = csv.writer(file)
    # loop through each food item to create specific directories to get the reviews
    for overallReview in overallReviews:
        # write each food item specific reviews to the respective food item csv file
        writer.writerow([overallReview])


if isCategorizedReviews:
    print("Filtered food reviews FOUND !!!")
    # create a directory within the DataPreprocessor directory
    # to store all the preprocessed each food item specific reviews
    Path("../reviews/processedReviews/" + selectedReviewsFile).mkdir(parents=True, exist_ok=True)

    # loop through each food item to create specific directories to get the reviews
    for inx, foodItem in enumerate(foodItems):
        # create/open csv files specific to each food item
        with open("../reviews/processedReviews/" + selectedReviewsFile + "/" + foodItem + ".csv", 'w', newline='') as file:
            writer = csv.writer(file)
            # write each food item specific reviews to the respective food item csv file
            for foodReview in foodReviews[inx]:
                writer.writerow([foodReview])
else:
    print("Filtered food reviews NOT found !!!")
