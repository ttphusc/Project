import 'package:flutter/material.dart';
import '../configs/Constants.dart';

class RecommendationPage extends StatelessWidget {
  const RecommendationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        backgroundColor: AppColors.primary,
        elevation: 0,
      ),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.only(
              left: 20,
              right: 20,
              bottom: 20,
            ),
            decoration: const BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(24),
                bottomRight: Radius.circular(24),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(
                      Icons.auto_awesome,
                      color: Colors.white,
                      size: 24,
                    ),
                    SizedBox(width: 8),
                    Text(
                      'Recommended For You',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Discover content perfectly matched to your interests',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildRecommendationCard(
                  avatar: 'assets/images/avatar.jpg',
                  name: 'Marvin McKinney',
                  time: 'about 1 hours ago',
                  title:
                      'Wholesome Eats: Nutritious Recipes to Keep You Energized',
                  content:
                      'Eating well doesn\'t have to be complicated! With the right balance of ingredients, you can prepare meals that are both delicious and packed with the nutrients your body needs to stay energized and healthy.',
                  likes: '12.3K',
                  comments: '374',
                ),
                const SizedBox(height: 16),
                _buildRecommendationCard(
                  avatar: 'assets/images/avatar.jpg',
                  name: 'Jacob Jones',
                  time: 'about 4 hours ago',
                  title:
                      'Move & Thrive: Comprehensive Fitness Routines for Every Body and Level',
                  content:
                      'Eating well doesn\'t have to be complicated! With the right balance of ingredients, you can prepare meals that are both delicious and packed with the nutrients your body needs to stay energized and healthy. In this post, we\'re sharing some wholesome recipes that will nourish your body and keep you feeling great throughout the day.',
                  likes: '8.2K',
                  comments: '256',
                ),
                const SizedBox(height: 16),
                _buildRecommendationCard(
                  avatar: 'assets/images/avatar.jpg',
                  name: 'Sarah Wilson',
                  time: 'about 6 hours ago',
                  title:
                      'Mindful Movement: Yoga Poses for Stress Relief and Flexibility',
                  content:
                      'Discover the transformative power of yoga for both mind and body. These carefully selected poses will help you reduce stress, improve flexibility, and find your inner balance. Perfect for beginners and advanced practitioners alike.',
                  likes: '9.1K',
                  comments: '428',
                ),
              ],
            ),
          ),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
                elevation: 0,
              ),
              child: const Text(
                'Get Recommendations',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendationCard({
    required String avatar,
    required String name,
    required String time,
    required String title,
    required String content,
    required String likes,
    required String comments,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primary.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundImage: AssetImage(avatar),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: AppColors.primary,
                        ),
                      ),
                      Text(
                        time,
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(
                    Icons.close,
                    size: 24,
                    color: AppColors.primary.withOpacity(0.5),
                  ),
                  onPressed: () {},
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary.withOpacity(0.8),
                  ),
                ),
                if (content.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(
                    content,
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey[600],
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Read the whole post...',
                    style: TextStyle(
                      color: AppColors.primary,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
                if (likes.isNotEmpty && comments.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(
                        Icons.favorite_border,
                        color: AppColors.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        likes,
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          color: AppColors.primary.withOpacity(0.8),
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Icon(
                        Icons.chat_bubble_outline,
                        color: AppColors.primary,
                        size: 20,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        comments,
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          color: AppColors.primary.withOpacity(0.8),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
