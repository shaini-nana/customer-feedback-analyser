import csv
import nltk
from pathlib import Path
from Lemmatizer import lemmatize_sentence
from StopWordRemoval import remove_stop_words

overallReviews = []
overallReviewsAdvanced = []

# add the reviews file name which you need to analyze reviews upon
selectedReviewsFile = 'reviews_01'

reviewFile = open('../reviews/scrapedReviews/' + selectedReviewsFile + '.csv')
reviewReader = csv.reader(reviewFile)

actualClassification = [1,2,1,1]
# looping through the reviews csv
for index, row in enumerate(reviewReader):

    # obtaining each review
    review = (row[0].strip().split('\t'))[0]
    overallReviews.append(str(index+1) + "|" + str(actualClassification[index]) + "|" + review)

    # lemmatize each review
    processedReview = lemmatize_sentence(review)
    # remove stop words in each review
    processedReview = remove_stop_words(processedReview)
    overallReviewsAdvanced.append(str(index+1) + "|" + processedReview)


Path("../accuracy/" + selectedReviewsFile).mkdir(parents=True, exist_ok=True)
Path("../accuracy/" + selectedReviewsFile + "/advance").mkdir(parents=True, exist_ok=True)


# create/open csv files specific to each food item
with open("../accuracy/" + selectedReviewsFile + "/overall.csv", 'w', newline='') as file:
    writer = csv.writer(file)
    # loop through each food item to create specific directories to get the reviews
    for overallReview in overallReviews:
        # write each food item specific reviews to the respective food item csv file
        writer.writerow([overallReview])
