import sys
import json
import os
import numpy as np

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from models.ContentBasedModel import ContentBasedModel
from utils.data_processor import calculate_user_compatibility

def get_recommendations(user_data, all_posts, top_n=2):
    try:
        if not user_data or not all_posts:
            return []
            
        # Lấy danh sách ID các bài post đã favorite một cách an toàn
        favorite_post_ids = []
        if (user_data.get('idFavoriteList') and 
            user_data['idFavoriteList'].get('idPost')):
            favorite_post_ids = [
                str(post.get('_id', '')) 
                for post in user_data['idFavoriteList']['idPost']
            ]

        # Lọc bỏ các bài post đã favorite
        filtered_posts = [
            post for post in all_posts 
            if str(post.get('_id', '')) not in favorite_post_ids
        ]

        if not filtered_posts:
            return []

        # Initialize và tính toán recommendations
        content_model = ContentBasedModel()
        content_model.fit(filtered_posts)
        
        content_scores = content_model.get_recommendations(user_data, filtered_posts)
        compatibility_scores = np.array([
            calculate_user_compatibility(post, user_data.get('idAttributes', {}))
            for post in filtered_posts
        ])
        
        final_scores = 0.4 * content_scores + 0.6 * compatibility_scores
        
        recommended_indices = np.argsort(final_scores)[::-1][:top_n]
        recommendations = [filtered_posts[idx] for idx in recommended_indices]
        
        return [{
            'post': post,
            'compatibility_score': float(compatibility_scores[idx]),
            'content_score': float(content_scores[idx]),
            'final_score': float(final_scores[idx])
        } for idx, post in enumerate(recommendations)]

    except Exception as e:
        print(f"Error in get_recommendations: {str(e)}", file=sys.stderr)
        return []

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        recommendations = get_recommendations(
            input_data['user'],
            input_data['posts']
        )
        print(json.dumps(recommendations))
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)