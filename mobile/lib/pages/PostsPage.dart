import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import '../services/AuthService.dart';
import 'PostDetail.dart';

class PostsPage extends StatefulWidget {
  const PostsPage({super.key});

  @override
  State<PostsPage> createState() => _PostsPageState();
}

class _PostsPageState extends State<PostsPage> {
  final AuthService _authService = AuthService();
  List<Map<String, dynamic>> _posts = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadPosts();
  }

  Future<void> _loadPosts() async {
    setState(() => _isLoading = true);
    try {
      final posts = await _authService.getPosts();
      setState(() {
        _posts = posts;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      setState(() => _isLoading = false);
    }
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Posts'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.primary,
        elevation: 0.5,
      ),
      body: RefreshIndicator(
        onRefresh: _loadPosts,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _posts.length,
                itemBuilder: (context, index) {
                  final post = _posts[index];
                  final user = post['user'] as Map<String, dynamic>?;
                  final images = post['images'] as List<dynamic>?;
                  final tags =
                      (post['tags'] as List<dynamic>?)?.cast<String>() ?? [];

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ViewPostPage(
                              avatar:
                                  user?['avatar'] ?? 'assets/images/avatar.jpg',
                              name:
                                  '${user?['firstname'] ?? 'Unknown'} ${user?['lastname'] ?? ''}'
                                      .trim(),
                              time: _formatTime(post['createdAt']),
                              title: post['title'] ?? '',
                              content: post['content'] ?? '',
                              likes: '${(post['likes'] as List?)?.length ?? 0}',
                              comments:
                                  '${(post['comments'] as List?)?.length ?? 0}',
                              postId: post['_id'],
                            ),
                          ),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withOpacity(0.08),
                              spreadRadius: 2,
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  radius: 24,
                                  backgroundImage: user?['avatar'] != null &&
                                          (user?['avatar'].startsWith('http') ||
                                              user?['avatar']
                                                  .startsWith('https'))
                                      ? NetworkImage(user?['avatar'])
                                          as ImageProvider
                                      : const AssetImage(
                                          'assets/images/avatar.jpg'),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        '${user?['firstname'] ?? 'Unknown'} ${user?['lastname'] ?? ''}'
                                            .trim(),
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                          color: AppColors.primary,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        _formatTime(post['createdAt']),
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 14,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFFF9E6),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Text(
                                        'Post',
                                        style: TextStyle(
                                          color: Color(0xFFB27B16),
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      if (post['recipe'] != null ||
                                          post['exercise'] != null) ...[
                                        Container(
                                          margin:
                                              const EdgeInsets.only(left: 6),
                                          width: 1,
                                          height: 12,
                                          color: const Color(0xFFB27B16)
                                              .withOpacity(0.3),
                                        ),
                                        const SizedBox(width: 6),
                                        if (post['recipe'] != null)
                                          const Icon(
                                            Icons.restaurant_menu_outlined,
                                            color: Color(0xFFB27B16),
                                            size: 14,
                                          ),
                                        if (post['exercise'] != null)
                                          const Icon(
                                            Icons.fitness_center_outlined,
                                            color: Color(0xFFB27B16),
                                            size: 14,
                                          ),
                                      ],
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              post['title'] ?? '',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                height: 1.4,
                              ),
                            ),
                            if (post['content']?.isNotEmpty ?? false) ...[
                              const SizedBox(height: 12),
                              Text(
                                post['content'] ?? '',
                                style: TextStyle(
                                  fontSize: 15,
                                  color: Colors.grey[800],
                                  height: 1.5,
                                ),
                                maxLines: 3,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 12),
                              InkWell(
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => ViewPostPage(
                                        avatar: user?['avatar'] ??
                                            'assets/images/avatar.jpg',
                                        name:
                                            '${user?['firstname'] ?? 'Unknown'} ${user?['lastname'] ?? ''}'
                                                .trim(),
                                        time: _formatTime(post['createdAt']),
                                        title: post['title'] ?? '',
                                        content: post['content'] ?? '',
                                        likes:
                                            '${(post['likes'] as List?)?.length ?? 0}',
                                        comments:
                                            '${(post['comments'] as List?)?.length ?? 0}',
                                        postId: post['_id'],
                                      ),
                                    ),
                                  );
                                },
                                child: const Text(
                                  'Read the whole post...',
                                  style: TextStyle(
                                    color: AppColors.primary,
                                    fontSize: 15,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                            if (tags.isNotEmpty) ...[
                              const SizedBox(height: 16),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: tags
                                    .map((tag) => Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: Colors.grey[200],
                                            borderRadius:
                                                BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            tag,
                                            style: TextStyle(
                                              color: Colors.grey[700],
                                              fontSize: 12,
                                            ),
                                          ),
                                        ))
                                    .toList(),
                              ),
                            ],
                            const SizedBox(height: 16),
                            Row(
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
                            if (images != null && images.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              SizedBox(
                                height: 200,
                                child: ListView.builder(
                                  scrollDirection: Axis.horizontal,
                                  itemCount: images.length,
                                  itemBuilder: (context, index) {
                                    return Padding(
                                      padding: EdgeInsets.only(
                                          right: index < images.length - 1
                                              ? 8
                                              : 0),
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(8),
                                        child: Image.network(
                                          images[index],
                                          fit: BoxFit.cover,
                                          width: 200,
                                          height: 200,
                                          errorBuilder:
                                              (context, error, stackTrace) {
                                            return Container(
                                              width: 200,
                                              height: 200,
                                              color: Colors.grey[300],
                                              child: const Icon(Icons.error),
                                            );
                                          },
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}
