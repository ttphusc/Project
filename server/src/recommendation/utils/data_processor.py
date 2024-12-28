def calculate_user_compatibility(post, user_attributes):
    if not user_attributes or not post:
        return 0.3  # Return base score instead of 0
    
    score = 0.3  # Base score to avoid 0% matches
    max_score = 1.0
    
    # Fitness level matching (30%)
    if post.get('excercises'):
        for exercise in post['excercises']:
            if exercise.get('level', '').lower() == user_attributes.get('fitnessExperience', '').lower():
                score += 0.3
                break
    
    # Dietary preferences matching (20%)
    if post.get('recipes') and user_attributes.get('dietaryPreferences') != 'None':
        diet_pref = user_attributes.get('dietaryPreferences', '').lower()
        for recipe in post['recipes']:
            recipe_name = recipe.get('name', '').lower()
            if diet_pref in recipe_name:
                score += 0.2
                break
    
    # Exercise preferences matching (20%)
    if post.get('excercises') and user_attributes.get('exercisePreferences') != 'Mixed':
        exercise_pref = user_attributes.get('exercisePreferences', '').lower()
        for exercise in post['excercises']:
            if exercise.get('category', '').lower() == exercise_pref:
                score += 0.2
                break
    
    # Normalize score
    return min(score, max_score)