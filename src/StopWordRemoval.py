import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

nltk.download('stopwords')

def remove_stop_words(sentence):

    stop_words = set(stopwords.words('english'))

    word_tokens = word_tokenize(sentence)

    filtered_sentence = []

    for w in word_tokens:
        if w not in stop_words:
            filtered_sentence.append(w)

    return " ".join(filtered_sentence)
