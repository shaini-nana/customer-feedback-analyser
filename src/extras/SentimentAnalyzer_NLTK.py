import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
nltk.download('vader_lexicon')

def classify_sentiment(sentence):
    sentimentAnalyzer = SentimentIntensityAnalyzer()
    sentimentAnalyzerScore = sentimentAnalyzer.polarity_scores(sentence)
    if sentimentAnalyzerScore["compound"] >= 0.6:
        return "POSITIVE"
    elif sentimentAnalyzerScore["compound"] <= -0.6:
        return "NEGATIVE"
    elif (sentimentAnalyzerScore["compound"] > -0.6 and sentimentAnalyzerScore["compound"] <= -0.3) or (sentimentAnalyzerScore["compound"] >= 0.3 and sentimentAnalyzerScore["compound"] < 0.6):
        return "MIXED"
    else:
        return "NEUTRAL"



print(classify_sentiment("superb excellent service and foods are pizza very tasty"))
