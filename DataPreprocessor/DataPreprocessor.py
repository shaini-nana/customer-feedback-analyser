import csv
import nltk
nltk.download('punkt')

tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
reviewFile = open('DataScraper/reviews_01.csv')
reviewReader = csv.reader(reviewFile)

foodItems = ["burger", "pizza"]
reviews = [[],[]]

# looping through the reviews csv
for row in reviewReader:
    print("Sentences in Review Number ", row[0])
    print("=====================")

    # obtaining each review
    review = (row[0].strip().split('\t'))[0]
    # splitting the sentences of the review
    reviewSentences = tokenizer.tokenize(review)

    for index, reviewSentence in enumerate(reviewSentences):
        processedReview = reviewSentence.lower()
        print("Sentence: ", index, ": ", processedReview)

        for inx, foodItem in enumerate(foodItems):
            print(foodItem)
            if foodItem in  processedReview:
                reviews[inx].append(processedReview)
                print('word matched')

print("======== Filtered Food Reviews ========")
for reviewCategories in reviews:
    for review in reviewCategories:
        print(review)
