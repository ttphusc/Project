import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

class TextPreprocessor:
    @staticmethod
    def clean_text(text):
        # Lowercase
        text = text.lower()
        # Remove special characters
        text = re.sub(r'[^\w\s]', '', text)
        # Remove numbers
        text = re.sub(r'\d+', '', text)
        return text
    
    @staticmethod
    def tokenize(text):
        return word_tokenize(text)