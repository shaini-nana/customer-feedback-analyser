import csv
import os
from pathlib import Path
from sklearn.metrics import f1_score, precision_score, recall_score

class AccuracyCalculator:

    def __init__(self, businessName):
        self.selectedReviewsFile = businessName
        self.actual_values = []
        self.predicted_values = []
        self.actual_values_advance = []
        self.predicted_values_advance = []

    def read_accuracy_values(self):
        reviewFile = open('../accuracy/' + self.selectedReviewsFile + '/overall_final.csv')
        reviewReader = csv.reader(reviewFile)

        for row in enumerate(reviewReader):
            self.actual_values.append(int((row[1])[1]))
            self.predicted_values.append(int((row[1])[2]))

    def read_accuracy_values_advance(self):
        reviewFile = open('../accuracy/' + self.selectedReviewsFile + '/advance/overall_final.csv')
        reviewReader = csv.reader(reviewFile)

        for row in enumerate(reviewReader):
            self.actual_values_advance.append(int((row[1])[1]))
            self.predicted_values_advance.append(int((row[1])[2]))

    def store_accuracy_values(self, path, type, val1, val2, val3):
        with open(path, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([type, val1, val2, val3])

    def calculate_micro_accuracy_scores(self, actual, prediction, dirPath):
        f1_micro = f1_score(actual, prediction, average='micro')
        precision_micro = precision_score(actual, prediction, average='micro')
        recall_micro = recall_score(actual, prediction, average='micro')

        Path(dirPath).mkdir(parents=True, exist_ok=True)
        self.store_accuracy_values(dirPath + "/accuracy.csv", 'micro', f1_micro, precision_micro, recall_micro)

    def calculate_weighted_accuracy_scores(self, actual, prediction, dirPath):
        f1_weighted = f1_score(actual, prediction, average='weighted')
        precision_weighted = precision_score(actual, prediction, average='weighted')
        recall_weighted = recall_score(actual, prediction, average='weighted')

        Path(dirPath).mkdir(parents=True, exist_ok=True)
        self.store_accuracy_values(dirPath + "/accuracy.csv", 'weighted', f1_weighted, precision_weighted, recall_weighted)

accuracyCalculator = AccuracyCalculator("pizza-hut")

accuracyCalculator.read_accuracy_values()
accuracyCalculator.read_accuracy_values_advance()

dirPath = "../accuracy/" + accuracyCalculator.selectedReviewsFile
filename = dirPath + "/accuracy.csv"
if os.path.exists(filename):
    os.remove(filename)

print("Start calculate micro accuracy scores for overall accuracy for: ", accuracyCalculator.selectedReviewsFile)
accuracyCalculator.calculate_micro_accuracy_scores(accuracyCalculator.actual_values, accuracyCalculator.predicted_values, dirPath)
print("End calculate micro accuracy scores for overall accuracy for: ", accuracyCalculator.selectedReviewsFile)

print("Start calculate weighted accuracy scores for overall accuracy for: ", accuracyCalculator.selectedReviewsFile)
accuracyCalculator.calculate_weighted_accuracy_scores(accuracyCalculator.actual_values, accuracyCalculator.predicted_values, dirPath)
print("End calculate weighted accuracy scores for overall accuracy for: ", accuracyCalculator.selectedReviewsFile)

dirPath = "../accuracy/" + accuracyCalculator.selectedReviewsFile + "/advance"
filename = dirPath + "/accuracy.csv"
if os.path.exists(filename):
    os.remove(filename)

print("Start calculate micro accuracy scores for overall advance accuracy for: ", accuracyCalculator.selectedReviewsFile)
accuracyCalculator.calculate_micro_accuracy_scores(accuracyCalculator.actual_values_advance, accuracyCalculator.predicted_values_advance, dirPath)
print("End calculate micro accuracy scores for overall advance accuracy for: ", accuracyCalculator.selectedReviewsFile)

print("Start calculate weighted accuracy scores for overall advance accuracy for: ", accuracyCalculator.selectedReviewsFile)
accuracyCalculator.calculate_weighted_accuracy_scores(accuracyCalculator.actual_values_advance, accuracyCalculator.predicted_values_advance, dirPath)
print("End calculate weighted accuracy scores for overall advance accuracy for: ", accuracyCalculator.selectedReviewsFile)
