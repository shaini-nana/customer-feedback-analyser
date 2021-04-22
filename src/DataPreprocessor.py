import csv
import nltk
from pathlib import Path
from Lemmatizer import lemmatize_sentence
from StopWordRemoval import remove_stop_words

nltk.download('punkt')
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
# add the reviews file name which you need to analyze reviews upon
selectedReviewsFile = 'mcdonalds'
reviewFile = open('../reviews/scrapedReviews/' + selectedReviewsFile + '.csv')
reviewReader = csv.reader(reviewFile)

# pizza-hut
# foodItems = ["chicken", "beef", "seafood", "pepperoni", "wings", "bread", "cheese"]

# mcdonalds
foodItems = ["burger", "chicken", "beef", "fries", "big mac", "cheese"]
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
for index, row in enumerate(reviewReader):

    # obtaining each review
    content = ((row[0].strip().split('\t'))[0]).split('|')
    review_number = content[0]
    rating = content[1]
    review = content[2]
    overallReviews.append(str(review_number) + "|" + rating + "|" + review)

    # lemmatize each review
    processedReview = lemmatize_sentence(review)
    # remove stop words in each review
    processedReview = remove_stop_words(processedReview)
    overallReviewsAdvanced.append(str(review_number) + "|" + rating + "|" + processedReview)

    # splitting the sentences of each review
    reviewSentences = tokenizer.tokenize(review)

    # looping through each sentence of the focused review
    for reviewSentence in reviewSentences:
        processedSentence = reviewSentence.lower()
        # lemmatize each review sentence
        processedSentenceWithAdvancePreprocessing = lemmatize_sentence(processedSentence)
        # remove stop words in each sentence
        processedSentenceWithAdvancePreprocessing = remove_stop_words(processedSentenceWithAdvancePreprocessing)

        # looping each review sentence through each food item
        # to check if the review sentence is about any of the identified food items
        for inx, foodItem in enumerate(foodItems):
            if foodItem in  processedSentence:
                foodReviews[inx].append(processedSentence)
                foodReviewsAdvance[inx].append(processedSentenceWithAdvancePreprocessing)

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

Path("../accuracy/" + selectedReviewsFile).mkdir(parents=True, exist_ok=True)
Path("../accuracy/" + selectedReviewsFile + "/advance").mkdir(parents=True, exist_ok=True)


# create/open csv files specific to each food item
with open("../accuracy/" + selectedReviewsFile + "/overall.csv", 'w', newline='') as file:
    writer = csv.writer(file)
    # loop through each food item to create specific directories to get the reviews
    for overallReview in overallReviews:
        # write each food item specific reviews to the respective food item csv file
        writer.writerow([overallReview])

with open("../accuracy/" + selectedReviewsFile + "/advance/overall.csv", 'w', newline='') as file:
    writer = csv.writer(file)
    # loop through each food item to create specific directories to get the reviews
    for overallReview in overallReviewsAdvanced:
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

    Path("../reviews/processedReviews/" + selectedReviewsFile + "/advance").mkdir(parents=True, exist_ok=True)

    # loop through each food item to create specific directories to get the reviews
    for inx, foodItem in enumerate(foodItems):
        # create/open csv files specific to each food item
        with open("../reviews/processedReviews/" + selectedReviewsFile + "/advance" + "/" + foodItem + ".csv", 'w', newline='') as file:
            writer = csv.writer(file)
            # write each food item specific reviews to the respective food item csv file
            for foodReview in foodReviewsAdvance[inx]:
                writer.writerow([foodReview])

else:
    print("Filtered food reviews NOT found !!!")
