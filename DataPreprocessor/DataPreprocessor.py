import csv
import nltk

nltk.download('punkt')
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

reviewFile = open('DataScraper/reviews_01.csv')
reviewReader = csv.reader(reviewFile)

# @todo improve the food items list to be in line with scraped reviews
foodItems = ["burger", "pizza"]
# @todo initializing food item related reviews array
reviews = [[],[]]

isCategorizedReviews = bool(0)

print("======= Start reading through the reviews =======")
# looping through the reviews csv
for row in reviewReader:

    # obtaining each review
    review = (row[0].strip().split('\t'))[0]
    # splitting the sentences of each review
    reviewSentences = tokenizer.tokenize(review)

    # looping through each sentence of the focused review
    for reviewSentence in reviewSentences:
        processedSentence = reviewSentence.lower()

        # looping each review sentence through each food item
        # to check if the review sentence is about any of the identified food items
        for inx, foodItem in enumerate(foodItems):
            if foodItem in  processedSentence:
                reviews[inx].append(processedSentence)

for reviewCategories in reviews:
    if len(reviewCategories) != 0:
        isCategorizedReviews = bool(10)


if isCategorizedReviews:
    print("Filtered food reviews found")
else:
    print("Filtered food reviews not found")


# print(isCategorizedReviews)
# print("======== Filtered Food Reviews ========")
# print(len(reviews[0]))
# print(len(reviews[1]))
# for reviewCategories in reviews:
#     for review in reviewCategories:
#         print(review)
