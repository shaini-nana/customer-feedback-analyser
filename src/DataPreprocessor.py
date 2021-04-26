import csv
import nltk
from pathlib import Path
from Lemmatizer import Lemmatizer
from StopWordRemover import StopWordRemover

nltk.download('punkt')
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

# pizza-hut
# foodItems = ["chicken", "beef", "pepperoni", "wings", "bread sticks", "cheese"]

# mcdonalds
# foodItems = ["burger", "chicken", "beef", "fries", "big mac", "cheese"]

# subway
# foodItems = ["chicken", "beef", "cheese", "sandwich"]

# the-cheesecake-factory
# foodItems = ["salad", "chicken", "bbq", "pasta"]

class DataPreprocessor:

    def __init__(self, businessName):
        self.selectedReviewsFile = businessName
        self.scrapeLocation = '../reviews/scrapedReviews/' + self.selectedReviewsFile + '.csv'
        self.foodItems = ["burger", "chicken", "beef", "fries", "big mac", "cheese"]
        self.foodReviews = []
        self.foodReviewsAdvance = []
        self.overallReviews = []
        self.overallReviewsAdvanced = []
        self.isCategorizedReviews = bool(0)
        self.lemmatizer = Lemmatizer()
        self.stopWordRemover = StopWordRemover()

    def preprocess_reviews(self):
        reviewFile = open(self.scrapeLocation)
        reviewReader = csv.reader(reviewFile)

        for foodRevCategory in self.foodItems:
            self.foodReviews.append([])
            self.foodReviewsAdvance.append([])

        print("======= Start reading through the reviews =======")
        # looping through the reviews csv
        for index, row in enumerate(reviewReader):

            # obtaining each review
            content = ((row[0].strip().split('\t'))[0]).split('|')
            review_number = content[0]
            rating = content[1]
            review = content[2]
            self.overallReviews.append(str(review_number) + "|" + rating + "|" + review)

            # lemmatize each review
            processedReview = self.lemmatizer.lemmatize_sentence(review)
            # remove stop words in each review
            processedReview = self.stopWordRemover.remove_stop_words(processedReview)
            self.overallReviewsAdvanced.append(str(review_number) + "|" + rating + "|" + processedReview)

            # splitting the sentences of each review
            reviewSentences = tokenizer.tokenize(review)

            # looping through each sentence of the focused review
            for reviewSentence in reviewSentences:
                processedSentence = reviewSentence.lower()
                # lemmatize each review sentence
                processedSentenceWithAdvancePreprocessing = self.lemmatizer.lemmatize_sentence(processedSentence)
                # remove stop words in each sentence
                processedSentenceWithAdvancePreprocessing = self.stopWordRemover.remove_stop_words(processedSentenceWithAdvancePreprocessing)

                # looping each review sentence through each food item
                # to check if the review sentence is about any of the identified food items
                for inx, foodItem in enumerate(self.foodItems):
                    if foodItem in  processedSentence:
                        self.foodReviews[inx].append(processedSentence)
                        self.foodReviewsAdvance[inx].append(processedSentenceWithAdvancePreprocessing)

        for reviewCategories in self.foodReviews:
            if len(reviewCategories) != 0:
                self.isCategorizedReviews = bool(10)
                break


        # create a directory within the DataPreprocessor directory
        # to store all the preprocessed reviews
        Path("../reviews/processedReviews/" + self.selectedReviewsFile).mkdir(parents=True, exist_ok=True)
        Path("../reviews/processedReviews/" + self.selectedReviewsFile + "/advance").mkdir(parents=True, exist_ok=True)

        # create/open csv files specific to each food item
        with open("../reviews/processedReviews/" + self.selectedReviewsFile + "/advance/overall.csv", 'w', newline='') as file:
            writer = csv.writer(file)
            # loop through each food item to create specific directories to get the reviews
            for overallReview in self.overallReviewsAdvanced:
                # write each food item specific reviews to the respective food item csv file
                writer.writerow([overallReview])


        # create/open csv files specific to each food item
        with open("../reviews/processedReviews/" + self.selectedReviewsFile + "/overall.csv", 'w', newline='') as file:
            writer = csv.writer(file)
            # loop through each food item to create specific directories to get the reviews
            for overallReview in self.overallReviews:
                # write each food item specific reviews to the respective food item csv file
                writer.writerow([overallReview])

        Path("../accuracy/" + self.selectedReviewsFile).mkdir(parents=True, exist_ok=True)
        Path("../accuracy/" + self.selectedReviewsFile + "/advance").mkdir(parents=True, exist_ok=True)


        # create/open csv files specific to each food item
        with open("../accuracy/" + self.selectedReviewsFile + "/overall.csv", 'w', newline='') as file:
            writer = csv.writer(file)
            # loop through each food item to create specific directories to get the reviews
            for overallReview in self.overallReviews:
                # write each food item specific reviews to the respective food item csv file
                writer.writerow([overallReview])

        with open("../accuracy/" + self.selectedReviewsFile + "/advance/overall.csv", 'w', newline='') as file:
            writer = csv.writer(file)
            # loop through each food item to create specific directories to get the reviews
            for overallReview in self.overallReviewsAdvanced:
                # write each food item specific reviews to the respective food item csv file
                writer.writerow([overallReview])


        if self.isCategorizedReviews:
            print("Filtered food reviews FOUND !!!")
            # create a directory within the DataPreprocessor directory
            # to store all the preprocessed each food item specific reviews
            Path("../reviews/processedReviews/" + self.selectedReviewsFile).mkdir(parents=True, exist_ok=True)

            # loop through each food item to create specific directories to get the reviews
            for inx, foodItem in enumerate(self.foodItems):
                # create/open csv files specific to each food item
                with open("../reviews/processedReviews/" + self.selectedReviewsFile + "/" + foodItem + ".csv", 'w', newline='') as file:
                    writer = csv.writer(file)
                    # write each food item specific reviews to the respective food item csv file
                    for foodReview in self.foodReviews[inx]:
                        writer.writerow([foodReview])

            Path("../reviews/processedReviews/" + self.selectedReviewsFile + "/advance").mkdir(parents=True, exist_ok=True)

            # loop through each food item to create specific directories to get the reviews
            for inx, foodItem in enumerate(self.foodItems):
                # create/open csv files specific to each food item
                with open("../reviews/processedReviews/" + self.selectedReviewsFile + "/advance" + "/" + foodItem + ".csv", 'w', newline='') as file:
                    writer = csv.writer(file)
                    # write each food item specific reviews to the respective food item csv file
                    for foodReview in self.foodReviewsAdvance[inx]:
                        writer.writerow([foodReview])

        else:
            print("Filtered food reviews NOT found !!!")

dataPreprocessor = DataPreprocessor("mcdonalds")
dataPreprocessor.preprocess_reviews()
