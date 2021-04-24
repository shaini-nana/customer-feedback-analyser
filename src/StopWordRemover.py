import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

nltk.download('stopwords')

class StopWordRemover:

    def __init__(self):
        pass

    def remove_stop_words(self, sentence):

        stop_words = set(stopwords.words('english'))

        word_tokens = word_tokenize(sentence)

        filtered_sentence = []

        for w in word_tokens:
            if w not in stop_words:
                filtered_sentence.append(w)

        return " ".join(filtered_sentence)
