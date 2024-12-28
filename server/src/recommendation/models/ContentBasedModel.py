from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class ContentBasedModel:
    def __init__(self):
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.content_matrix = None
        self.post_indices = {}
        
    def preprocess_post(self, post):
        features = []
        features.extend([post['title'], post['content']])
        
        if 'recipes' in post and post['recipes']:
            for recipe in post['recipes']:
                features.extend([
                    recipe['name'],
                    ' '.join(recipe.get('ingredients', [])),
                    recipe.get('instructions', '')
                ])
                
        if 'excercises' in post and post['excercises']:
            for exercise in post['excercises']:
                features.extend([
                    exercise['name'],
                    exercise.get('level', ''),
                    ' '.join(exercise.get('primaryMuscles', [])),
                    ' '.join(exercise.get('secondaryMuscles', [])),
                    exercise.get('category', '')
                ])
                
        return ' '.join(str(f) for f in features if f)

    def fit(self, posts):
        processed_posts = []
        for idx, post in enumerate(posts):
            content = self.preprocess_post(post)
            processed_posts.append(content)
            self.post_indices[str(post['_id'])] = idx
            
        self.content_matrix = self.tfidf.fit_transform(processed_posts)
        
    def get_recommendations(self, user_data, all_posts):
        try:
            user_prefs = user_data.get('idAttributes', {})
            favorite_posts = user_data.get('idFavoriteList', {}).get('idPost', [])
            
            content_scores = np.zeros(len(all_posts))
            
            # Nếu user chưa có favorite posts, tính similarity dựa trên user preferences
            if not favorite_posts:
                # Tạo "virtual post" từ user preferences
                virtual_post = {
                    'title': '',
                    'content': '',
                    'recipes': [],
                    'excercises': [{
                        'name': '',
                        'level': user_prefs.get('fitnessExperience', ''),
                        'category': user_prefs.get('exercisePreferences', ''),
                        'primaryMuscles': [],
                        'secondaryMuscles': []
                    }]
                }
                
                # Thêm virtual post vào cuối danh sách để tính similarity
                all_posts_with_virtual = all_posts + [virtual_post]
                self.fit(all_posts_with_virtual)
                
                # Tính similarity với virtual post
                virtual_idx = len(all_posts_with_virtual) - 1
                similarities = cosine_similarity(
                    self.content_matrix[virtual_idx:virtual_idx+1],
                    self.content_matrix[:-1]  # Bỏ virtual post
                ).flatten()
                content_scores = similarities
                
            else:
                # Tính similarity dựa trên favorite posts như cũ
                self.fit(all_posts)
                for fav_post in favorite_posts:
                    fav_post_id = str(fav_post.get('_id', ''))
                    if fav_post_id in self.post_indices:
                        idx = self.post_indices[fav_post_id]
                        similarities = cosine_similarity(
                            self.content_matrix[idx:idx+1],
                            self.content_matrix
                        ).flatten()
                        content_scores += similarities

            # Normalize scores và đảm bảo điểm tối thiểu
            if np.any(content_scores):
                content_scores = content_scores / np.max(content_scores)
                # Đặt ngưỡng điểm tối thiểu là 0.3
                content_scores = np.maximum(content_scores, 0.3)
                
            return content_scores
            
        except Exception as e:
            print(f"Error in ContentBasedModel: {str(e)}")
            return np.zeros(len(all_posts))