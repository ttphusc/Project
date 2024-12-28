from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Ví dụ về dữ liệu nội dung
documents = [
    "The Avengers is a superhero movie with action and adventure",
    "Harry Potter is a fantasy movie with magic",
    "Avengers Endgame is a superhero movie with time travel",
]

# Vector hóa dữ liệu bằng TF-IDF
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(documents)

# Tính toán độ tương đồng cosine giữa các nội dung
similarity_matrix = cosine_similarity(tfidf_matrix)

# In ma trận độ tương đồng
print(similarity_matrix)
