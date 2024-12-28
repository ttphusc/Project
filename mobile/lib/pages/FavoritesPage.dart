import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import '../services/AuthService.dart';
import 'dart:convert';
import '../services/TokenService.dart';
import 'PostDetail.dart';
import 'QuestionDetail.dart';

class FavoritesPage extends StatefulWidget {
  const FavoritesPage({super.key});

  @override
  State<FavoritesPage> createState() => _FavoritesPageState();
}

class _FavoritesPageState extends State<FavoritesPage> {
  final AuthService _authService = AuthService();
  List<Map<String, dynamic>> _favoriteItems = [];
  bool _isLoading = true;
  String _activeTab = 'all'; // 'all', 'questions', 'posts'

  @override
  void initState() {
    super.initState();
    _loadFavoriteList();
  }

  Future<void> _loadFavoriteList() async {
    try {
      final userData = await TokenService.getUserData();
      if (userData == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please login to view favorite list')),
        );
        return;
      }

      final user = json.decode(userData);
      final favoriteListId = user['idFavoriteList'];

      final response = await _authService.getFavoriteList(favoriteListId);

      final items = (response['rs']['sortedItems'] as List)
          .map((item) => Map<String, dynamic>.from(item))
          .toList();

      List<Map<String, dynamic>> itemsWithAuthor = await Future.wait(
        items.map((item) async {
          final authorId = item['idAuthor']['_id'];
          try {
            final authorResponse =
                await _authService.getFavoriteListAuthor(authorId);
            if (authorResponse['success']) {
              final author = authorResponse['rs'];

              List<String> tags = [];
              if (item['tags'] != null) {
                if (item['tags'] is List) {
                  tags = (item['tags'] as List)
                      .map((tag) => tag.toString())
                      .toList();
                } else if (item['tags'] is String) {
                  tags = [item['tags'].toString()];
                }
              }

              return {
                ...item,
                'author': {
                  'firstname': author['firstname'] ?? 'Unknown',
                  'lastname': author['lastname'] ?? '',
                  'avatar': author['avatar'] ?? 'assets/images/avatar.jpg',
                  'email': author['email'],
                },
                'tags': tags,
              };
            }
          } catch (e) {}

          List<String> tags = [];
          if (item['tags'] != null) {
            if (item['tags'] is List) {
              tags =
                  (item['tags'] as List).map((tag) => tag.toString()).toList();
            } else if (item['tags'] is String) {
              tags = [item['tags'].toString()];
            }
          }

          return {
            ...item,
            'author': {
              'firstname': item['idAuthor']['firstname'] ?? 'Unknown',
              'lastname': item['idAuthor']['lastname'] ?? '',
              'avatar':
                  item['idAuthor']['avatar'] ?? 'assets/images/avatar.jpg',
              'email': item['idAuthor']['email'],
            },
            'tags': tags,
          };
        }),
      );

      if (mounted) {
        setState(() {
          _favoriteItems = itemsWithAuthor;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cannot load favorite list')),
        );
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _toggleFavorite(String itemId, String type) async {
    try {
      final userData = await TokenService.getUserData();
      if (userData == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please login to manage favorites')),
        );
        return;
      }

      final response = await _authService.toggleFavorite(itemId, type);
      if (response['success']) {
        // Reload the favorite list to reflect changes
        await _loadFavoriteList();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response['isFavorited']
                ? 'Added to favorites'
                : 'Removed from favorites'),
          ),
        );
      }
    } catch (e) {
      print('Error toggling favorite: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to update favorites')),
      );
    }
  }

  List<Map<String, dynamic>> get filteredItems {
    if (_activeTab == 'all') return _favoriteItems;
    return _favoriteItems.where((item) => item['type'] == _activeTab).toList();
  }

  Map<String, int> get itemCounts {
    final questions =
        _favoriteItems.where((item) => item['type'] == 'question').length;
    final posts = _favoriteItems.where((item) => item['type'] == 'post').length;
    return {
      'questions': questions,
      'posts': posts,
      'total': _favoriteItems.length,
    };
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('My Favorites'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.primary,
        elevation: 0.5,
      ),
      body: Column(
        children: [
          Container(
            color: Colors.white,
            child: Row(
              children: [
                _buildTabButton('All', 'all', _favoriteItems.length),
                _buildTabButton(
                  'Questions',
                  'question',
                  _favoriteItems
                      .where((item) => item['type'] == 'question')
                      .length,
                ),
                _buildTabButton(
                  'Posts',
                  'post',
                  _favoriteItems.where((item) => item['type'] == 'post').length,
                ),
              ],
            ),
          ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _buildContent(),
          ),
        ],
      ),
    );
  }

  Widget _buildContent() {
    final filteredItems = _getFilteredItems();

    if (filteredItems.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              _activeTab == 'question'
                  ? Icons.question_answer_outlined
                  : _activeTab == 'post'
                      ? Icons.article_outlined
                      : Icons.bookmark_border,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              _getEmptyMessage(),
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: filteredItems.length,
      itemBuilder: (context, index) {
        final item = filteredItems[index];
        return item['type'] == 'question'
            ? _buildQuestionCard(item)
            : _buildPostCard(item);
      },
    );
  }

  List<Map<String, dynamic>> _getFilteredItems() {
    switch (_activeTab) {
      case 'question':
        return _favoriteItems
            .where((item) => item['type'] == 'question')
            .toList();
      case 'post':
        return _favoriteItems.where((item) => item['type'] == 'post').toList();
      default:
        return _favoriteItems;
    }
  }

  String _getEmptyMessage() {
    switch (_activeTab) {
      case 'question':
        return 'No favorite questions yet';
      case 'post':
        return 'No favorite posts yet';
      default:
        return 'No favorite items yet';
    }
  }

  Widget _buildTabButton(String text, String tab, int count) {
    final isSelected = _activeTab == tab;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _activeTab = tab),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isSelected ? AppColors.primary : Colors.transparent,
                width: 2,
              ),
            ),
          ),
          child: Text(
            '$text ($count)',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isSelected ? AppColors.primary : Colors.grey[600],
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPostCard(Map<String, dynamic> post) {
    final author = post['author'] as Map<String, dynamic>? ??
        {
          'firstname': 'Unknown',
          'lastname': '',
          'avatar': 'assets/images/avatar.jpg',
        };

    final displayName =
        '${author['firstname']} ${author['lastname'] ?? ''}'.trim();

    final images = post['images'] as List<dynamic>?;

    List<String> tags = [];
    if (post['tags'] != null) {
      if (post['tags'] is List) {
        tags = (post['tags'] as List).map((tag) => tag.toString()).toList();
      } else if (post['tags'] is String) {
        tags = [post['tags'].toString()];
      }
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ViewPostPage(
                avatar: author['avatar']?.startsWith('http') == true
                    ? author['avatar']
                    : 'assets/images/avatar.jpg',
                name: displayName,
                time: _formatTime(post['createdAt']),
                title: post['title'] ?? '',
                content: post['content'] ?? '',
                likes: '${(post['likes'] as List?)?.length ?? 0}',
                comments: '${(post['comments'] as List?)?.length ?? 0}',
                postId: post['_id'],
              ),
            ),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with user info
            ListTile(
              leading: CircleAvatar(
                backgroundImage: _getAvatarImage(author['avatar']),
              ),
              title: Text(
                displayName,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(_formatTime(post['createdAt'])),
              trailing: IconButton(
                icon: const Icon(Icons.bookmark_remove),
                color: Colors.red[400],
                onPressed: () => _toggleFavorite(post['_id'], 'post'),
              ),
            ),
            // Post content
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    post['title'] ?? '',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    post['content'] ?? '',
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (tags.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: tags
                            .map((tag) => Container(
                                  margin: const EdgeInsets.only(right: 8),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[200],
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Text(
                                    '#$tag',
                                    style: TextStyle(
                                      color: Colors.grey[700],
                                      fontSize: 14,
                                    ),
                                  ),
                                ))
                            .toList(),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            // Stats row
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(
                    Icons.favorite_border,
                    color: AppColors.primary,
                    size: 28,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${(post['likes'] as List?)?.length ?? 0}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(width: 24),
                  const Icon(
                    Icons.chat_bubble_outline,
                    color: AppColors.primary,
                    size: 28,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${(post['comments'] as List?)?.length ?? 0}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuestionCard(Map<String, dynamic> question) {
    final author = question['author'] as Map<String, dynamic>? ??
        {
          'firstname': 'Unknown',
          'lastname': '',
          'avatar': 'assets/images/avatar.jpg',
        };
    final tags = (question['tags'] as List<dynamic>?)?.cast<String>() ?? [];

    final displayName =
        '${author['firstname']} ${author['lastname'] ?? ''}'.trim();

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => QuestionDetail(
                avatar: author['avatar']?.startsWith('http') == true
                    ? author['avatar']
                    : 'assets/images/avatar.jpg',
                name: displayName,
                time: _formatTime(question['createdAt']),
                title: question['title'] ?? '',
                content: question['content'] ?? '',
                likes: '${(question['likes'] as List?)?.length ?? 0}',
                answers: '${(question['comments'] as List?)?.length ?? 0}',
                questionId: question['_id'],
              ),
            ),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ListTile(
              leading: CircleAvatar(
                backgroundImage: _getAvatarImage(author['avatar']),
              ),
              title: Text(
                displayName,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(_formatTime(question['createdAt'])),
              trailing: IconButton(
                icon: const Icon(Icons.bookmark_remove),
                color: Colors.red[400],
                onPressed: () => _toggleFavorite(question['_id'], 'question'),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    question['title'] ?? '',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    question['content'] ?? '',
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (tags.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: tags
                            .map((tag) => Container(
                                  margin: const EdgeInsets.only(right: 8),
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[200],
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Text(
                                    '#$tag',
                                    style: TextStyle(
                                      color: Colors.grey[700],
                                      fontSize: 14,
                                    ),
                                  ),
                                ))
                            .toList(),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            // Stats row
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(
                    Icons.favorite_border,
                    color: AppColors.primary,
                    size: 28,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${(question['likes'] as List?)?.length ?? 0}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(width: 24),
                  const Icon(
                    Icons.chat_bubble_outline,
                    color: AppColors.primary,
                    size: 28,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${(question['comments'] as List?)?.length ?? 0}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(String? dateString) {
    if (dateString == null) return '';
    try {
      final date = DateTime.parse(dateString);
      final now = DateTime.now();
      final difference = now.difference(date);

      if (difference.inDays > 0) {
        return '${difference.inDays} days ago';
      } else if (difference.inHours > 0) {
        return '${difference.inHours} hours ago';
      } else if (difference.inMinutes > 0) {
        return '${difference.inMinutes} minutes ago';
      } else {
        return 'just now';
      }
    } catch (e) {
      return '';
    }
  }

  ImageProvider _getAvatarImage(String? avatarUrl) {
    if (avatarUrl != null && avatarUrl.startsWith('http')) {
      return NetworkImage(avatarUrl);
    }
    return const AssetImage('assets/images/avatar.jpg');
  }
}
