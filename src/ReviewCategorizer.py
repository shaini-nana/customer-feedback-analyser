import csv
import nltk
from pathlib import Path
from Lemmatizer import lemmatize_sentence
from StopWordRemoval import remove_stop_words

overallReviews = []
overallReviewsAdvanced = []

# add the reviews file name which you need to analyze reviews upon
selectedReviewsFile = 'hilton'

reviewFile = open('../reviews/scrapedReviews/' + selectedReviewsFile + '.csv')
reviewReader = csv.reader(reviewFile)

# fill with proper human annotation - this needs to be done each time the analysis business is changed
actualClassification = [1, 4, 1, 1, 1, 1, 1, 4, 1, 2, 2, 1, 4, 1, 1, 2, 1, 2, 2, 4, 4, 2, 4, 1, 1, 4, 1, 1, 1, 2, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 4, 4, 2]
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



