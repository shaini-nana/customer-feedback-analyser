import csv
import os
from pathlib import Path
from sklearn.metrics import f1_score, precision_score, recall_score

actual_values = []
predicted_values = []
actual_values_advance = []
predicted_values_advance = []

f1_macro = 0
precision_macro = 0
recall_macro = 0

f1_weighted = 0
precision_weighted = 0
recall_weighted = 0

selectedReviewsFile = 'hilton'

def read_accuracy_values():
    reviewFile = open('../accuracy/' + selectedReviewsFile + '/overall_final.csv')
    reviewReader = csv.reader(reviewFile)

    for row in enumerate(reviewReader):
        actual_values.append(int((row[1])[1]))
        predicted_values.append(int((row[1])[2]))

def read_accuracy_values_advance():
    reviewFile = open('../accuracy/' + selectedReviewsFile + '/advance/overall_final.csv')
    reviewReader = csv.reader(reviewFile)

    for row in enumerate(reviewReader):
        actual_values_advance.append(int((row[1])[1]))
        predicted_values_advance.append(int((row[1])[2]))

def store_accuracy_values(path, type, val1, val2, val3):
    with open(path, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([type, val1, val2, val3])

def calculate_micro_accuracy_scores(actual, prediction, dirPath):
    f1_micro = f1_score(actual, prediction, average='micro')
    precision_micro = precision_score(actual, prediction, average='micro')
    recall_micro = recall_score(actual, prediction, average='micro')

    Path(dirPath).mkdir(parents=True, exist_ok=True)
    store_accuracy_values(dirPath + "/accuracy.csv", 'micro', f1_micro, precision_micro, recall_micro)

def calculate_macro_accuracy_scores(actual, prediction, dirPath):
    f1_macro = f1_score(actual, prediction, average='macro')
    precision_macro = precision_score(actual, prediction, average='macro')
    recall_macro = recall_score(actual, prediction, average='macro')

    Path(dirPath).mkdir(parents=True, exist_ok=True)
    store_accuracy_values(dirPath + "/accuracy.csv", 'macro', f1_macro, precision_macro, recall_macro)

def calculate_weighted_accuracy_scores(actual, prediction, dirPath):
    f1_weighted = f1_score(actual, prediction, average='weighted')
    precision_weighted = precision_score(actual, prediction, average='weighted')
    recall_weighted = recall_score(actual, prediction, average='weighted')

    Path(dirPath).mkdir(parents=True, exist_ok=True)
    store_accuracy_values(dirPath + "/accuracy.csv", 'weighted', f1_weighted, precision_weighted, recall_weighted)


read_accuracy_values()
read_accuracy_values_advance()

dirPath = "../accuracy/" + selectedReviewsFile
filename = dirPath + "/accuracy.csv"
if os.path.exists(filename):
    os.remove(filename)

print("Start calculate micro accuracy scores for overall accuracy for: ", selectedReviewsFile)
calculate_micro_accuracy_scores(actual_values, predicted_values, dirPath)
print("End calculate micro accuracy scores for overall accuracy for: ", selectedReviewsFile)

print("Start calculate weighted accuracy scores for overall accuracy for: ", selectedReviewsFile)
calculate_weighted_accuracy_scores(actual_values, predicted_values, dirPath)
print("End calculate weighted accuracy scores for overall accuracy for: ", selectedReviewsFile)

print("Start calculate macro accuracy scores for overall accuracy for: ", selectedReviewsFile)
calculate_macro_accuracy_scores(actual_values, predicted_values, dirPath)
print("Start calculate macro accuracy scores for overall accuracy for: ", selectedReviewsFile)

dirPath = "../accuracy/" + selectedReviewsFile + "/advance"
filename = dirPath + "/accuracy.csv"
if os.path.exists(filename):
    os.remove(filename)

print("Start calculate micro accuracy scores for overall advance accuracy for: ", selectedReviewsFile)
calculate_micro_accuracy_scores(actual_values_advance, predicted_values_advance, dirPath)
print("End calculate micro accuracy scores for overall advance accuracy for: ", selectedReviewsFile)

print("Start calculate weighted accuracy scores for overall advance accuracy for: ", selectedReviewsFile)
calculate_weighted_accuracy_scores(actual_values_advance, predicted_values_advance, dirPath)
print("End calculate weighted accuracy scores for overall advance accuracy for: ", selectedReviewsFile)

print("Start calculate macro accuracy scores for overall advance accuracy for: ", selectedReviewsFile)
calculate_macro_accuracy_scores(actual_values_advance, predicted_values_advance, dirPath)
print("End calculate macro accuracy scores for overall advance accuracy for: ", selectedReviewsFile)
