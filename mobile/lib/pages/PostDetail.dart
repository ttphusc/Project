import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../services/AuthService.dart';
import '../services/TokenService.dart';
import 'dart:io' show Platform;
import 'PersonalProfile.dart';

class Comment {
  final String id;
  final String content;
  final Map<String, dynamic> user;
  final String createdAt;
  final int likes;
  final List<Comment> replies;

  Comment({
    required this.id,
    required this.content,
    required this.user,
    required this.createdAt,
    required this.likes,
    this.replies = const [],
  });
}

class ViewPostPage extends StatefulWidget {
  final String avatar;
  final String name;
  final String time;
  final String title;
  final String content;
  final String likes;
  final String comments;
  final String postId;

  const ViewPostPage({
    super.key,
    required this.avatar,
    required this.name,
    required this.time,
    required this.title,
    required this.content,
    required this.likes,
    required this.comments,
    required this.postId,
  });

  @override
  State<ViewPostPage> createState() => _ViewPostPageState();
}

class _ViewPostPageState extends State<ViewPostPage> {
  final TextEditingController _commentController = TextEditingController();
  final AuthService _authService = AuthService();
  List<Comment> _comments = [];
  bool _isLoading = false;
  final String baseUrl =
      Platform.isAndroid ? 'http://10.0.2.2:5001' : 'http://localhost:5001';
  List<String> _tags = [];
  int _views = 0;
  Map<String, dynamic>? _recipe;
  Map<String, dynamic>? _exercise;
  bool _showRecipe = false;
  bool _showExercise = false;
  bool _isLiked = false;
  int _likeCount = 0;

  @override
  void initState() {
    super.initState();
    _loadComments();
    _loadRecipeAndExercise();
    _checkLikeStatus();
  }

  Future<void> _loadComments() async {
    try {
      setState(() => _isLoading = true);
      final token = await TokenService.getToken();
      final baseUrl =
          Platform.isAndroid ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/post/${widget.postId}'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (data['success']) {
        setState(() {
          _tags = List<String>.from(data['rs']['tags'] ?? []);
          _views = data['rs']['views'] ?? 0;
        });

        List<Comment> processedComments = [];

        for (var comment in data['rs']['comments']) {
          try {
            // Lấy thông tin user cho mỗi comment
            final userResponse = await http.get(
              Uri.parse('$baseUrl/api/v1/user/${comment['postedBy']}'),
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer $token',
              },
            );

            final userData = json.decode(userResponse.body);
            Map<String, dynamic> userInfo = {};

            if (userData['success'] == true) {
              final user = userData['rs'];
              userInfo = {
                '_id': user['_id'] ?? '',
                'firstname': user['firstname'] ?? 'Unknown',
                'lastname': user['lastname'] ?? '',
                'avatar': user['avatar'] ?? 'https://via.placeholder.com/150',
              };
            }

            // Xử lý replies
            List<Comment> processedReplies = [];
            for (var reply in (comment['replies'] as List? ?? [])) {
              // Lấy thông tin user cho mỗi reply
              final replyUserResponse = await http.get(
                Uri.parse('$baseUrl/api/v1/user/${reply['postedBy']}'),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer $token',
                },
              );

              final replyUserData = json.decode(replyUserResponse.body);
              Map<String, dynamic> replyUserInfo = {};

              if (replyUserData['success'] == true) {
                final replyUser = replyUserData['rs'];
                replyUserInfo = {
                  '_id': replyUser['_id'] ?? '',
                  'firstname': replyUser['firstname'] ?? 'Unknown',
                  'lastname': replyUser['lastname'] ?? '',
                  'avatar':
                      replyUser['avatar'] ?? 'https://via.placeholder.com/150',
                };
              }

              processedReplies.add(Comment(
                id: reply['_id'],
                content: reply['comment'],
                user: replyUserInfo,
                createdAt: reply['dateCreate'] ?? reply['createdAt'],
                likes: reply['likes']?.length ?? 0,
              ));
            }

            processedComments.add(Comment(
              id: comment['_id'],
              content: comment['comment'],
              user: userInfo,
              createdAt: comment['dateCreate'] ?? comment['createdAt'],
              likes: comment['likes']?.length ?? 0,
              replies: processedReplies,
            ));
          } catch (e) {
            print('Error fetching user data: $e');
            processedComments.add(Comment(
              id: comment['_id'],
              content: comment['comment'],
              user: {
                '_id': '',
                'firstname': 'Unknown',
                'lastname': '',
                'avatar': 'https://via.placeholder.com/150',
              },
              createdAt: comment['dateCreate'] ?? comment['createdAt'],
              likes: comment['likes']?.length ?? 0,
              replies: [],
            ));
          }
        }

        setState(() {
          _comments = processedComments;
        });
      }
    } catch (e) {
      print('Error loading comments: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load comments: $e')),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _postComment() async {
    if (_commentController.text.trim().isEmpty) return;

    try {
      final token = await TokenService.getToken();
      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/post/comment/${widget.postId}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'comment': _commentController.text,
        }),
      );

      final data = json.decode(response.body);
      if (data['success']) {
        _commentController.clear();
        _loadComments();
      }
    } catch (e) {
      print('Error posting comment: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to post comment: $e'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Widget _buildComments() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_comments.isEmpty) {
      return const Center(
        child: Text('No comments yet. Be the first to comment!'),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _comments.length,
      itemBuilder: (context, index) {
        final comment = _comments[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: _buildCommentItem(
            comment.user['firstname'] ?? 'Unknown',
            comment.content,
            _formatTime(comment.createdAt),
            comment.likes.toString(),
            comment.user,
            comment.replies,
            comment.id,
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.primary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            GestureDetector(
              onTap: () async {
                try {
                  final token = await TokenService.getToken();
                  final baseUrl = Platform.isAndroid
                      ? 'http://10.0.2.2:5001'
                      : 'http://localhost:5001';
                  final response = await http.get(
                    Uri.parse('$baseUrl/api/v1/post/${widget.postId}'),
                    headers: {
                      'Authorization': 'Bearer $token',
                    },
                  );

                  final data = json.decode(response.body);
                  if (data['success'] &&
                      data['rs'] != null &&
                      data['rs']['postedBy'] != null) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            ProfilePage(userId: data['rs']['postedBy']),
                      ),
                    );
                  }
                } catch (e) {
                  print('Error navigating to profile: $e');
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to load profile: $e')),
                  );
                }
              },
              child: CircleAvatar(
                radius: 22,
                backgroundImage: widget.avatar.startsWith('http') ||
                        widget.avatar.startsWith('https')
                    ? NetworkImage(widget.avatar)
                    : AssetImage(widget.avatar) as ImageProvider,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    widget.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    widget.time,
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
              icon: const Icon(Icons.more_horiz, color: AppColors.primary),
              onPressed: () {
                showModalBottomSheet(
                  context: context,
                  isScrollControlled: true,
                  shape: const RoundedRectangleBorder(
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(20)),
                  ),
                  builder: (context) => Container(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _buildOptionButton(
                          icon: Icons.bookmark_border,
                          text: 'Add to Favorite',
                          onTap: () async {
                            try {
                              final response = await _authService
                                  .toggleFavorite(widget.postId, 'post');
                              if (response['success']) {
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(response['isFavorited']
                                        ? 'Added to favorites'
                                        : 'Removed from favorites'),
                                    behavior: SnackBarBehavior.floating,
                                  ),
                                );
                              }
                            } catch (e) {
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Error: ${e.toString()}'),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            }
                          },
                        ),
                        _buildOptionButton(
                          icon: Icons.report_outlined,
                          text: 'Report',
                          onTap: () {
                            Navigator.pop(context);
                            showReportDialog(context);
                          },
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
        titleSpacing: 0,
        actions: const [SizedBox(width: 16)],
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              color: Colors.white,
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.title,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    widget.content,
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey[800],
                      height: 1.6,
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (_showRecipe) _buildRecipeSection(),
                  if (_showExercise) _buildExerciseSection(),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _tags
                        .map((tag) => Container(
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
                                  color: Colors.grey[800],
                                  fontSize: 14,
                                ),
                              ),
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      InkWell(
                        onTap: _handleLike,
                        child: Icon(
                          _isLiked ? Icons.favorite : Icons.favorite_border,
                          color:
                              _isLiked ? AppColors.primary : Colors.grey[600],
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        _likeCount.toString(),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color:
                              _isLiked ? AppColors.primary : Colors.grey[600],
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
                        widget.comments,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(width: 24),
                      Icon(
                        Icons.remove_red_eye_outlined,
                        color: Colors.grey[600],
                        size: 28,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '$_views views',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Comments',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildComments(),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildCommentInput(),
    );
  }

  Widget _buildCommentItem(
    String name,
    String comment,
    String time,
    String likes,
    Map<String, dynamic> user,
    List<Comment> replies,
    String commentId,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              GestureDetector(
                onTap: () {
                  if (user['_id'] != null) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ProfilePage(userId: user['_id']),
                      ),
                    );
                  }
                },
                child: CircleAvatar(
                  radius: 20,
                  backgroundImage: NetworkImage(
                    user['avatar'] ?? 'https://via.placeholder.com/150',
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${user['firstname']} ${user['lastname']}'.trim(),
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      comment,
                      style: const TextStyle(fontSize: 14),
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              IconButton(
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                icon: const Icon(Icons.close, color: AppColors.primary),
                onPressed: () {
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    shape: const RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.vertical(top: Radius.circular(20)),
                    ),
                    builder: (context) => Container(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _buildOptionButton(
                            icon: Icons.report_outlined,
                            text: 'Report Comment',
                            onTap: () {
                              Navigator.pop(context);
                              showReportDialog(context);
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Text(
                time,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 12,
                ),
              ),
              const Spacer(),
              TextButton(
                onPressed: () {
                  _showReplyInput(commentId);
                },
                child: const Text('Reply'),
              ),
              const SizedBox(width: 8),
              InkWell(
                onTap: () => _handleLikeComment(commentId),
                child: Row(
                  children: [
                    const Icon(
                      Icons.favorite_border,
                      color: AppColors.primary,
                      size: 20,
                    ),
                    const SizedBox(width: 4),
                    Text(likes),
                  ],
                ),
              ),
            ],
          ),
          if (replies.isNotEmpty) ...[
            const SizedBox(height: 16),
            ...replies.map((reply) => Padding(
                  padding: const EdgeInsets.only(left: 32),
                  child: _buildReplyItem(
                    reply.user['firstname'] ?? 'Unknown',
                    reply.content,
                    _formatTime(reply.createdAt),
                    reply.likes.toString(),
                    reply.user,
                    commentId,
                  ),
                )),
          ],
        ],
      ),
    );
  }

  Widget _buildReplyItem(
    String name,
    String comment,
    String time,
    String likes,
    Map<String, dynamic> user,
    String parentCommentId,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              GestureDetector(
                onTap: () {
                  if (user['_id'] != null) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ProfilePage(userId: user['_id']),
                      ),
                    );
                  }
                },
                child: CircleAvatar(
                  radius: 16,
                  backgroundImage: NetworkImage(
                    user['avatar'] ?? 'https://via.placeholder.com/150',
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                user['firstname'] ?? 'Unknown',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            comment,
            style: const TextStyle(fontSize: 14),
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              Text(
                time,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 12,
                ),
              ),
              const Spacer(),
              TextButton(
                onPressed: () {
                  _showReplyInput(parentCommentId);
                },
                child: const Text('Reply', style: TextStyle(fontSize: 12)),
              ),
              InkWell(
                onTap: () => _handleLikeComment(parentCommentId),
                child: Row(
                  children: [
                    const Icon(
                      Icons.favorite_border,
                      color: AppColors.primary,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(likes, style: const TextStyle(fontSize: 12)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showReplyInput(String commentId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  FutureBuilder<String?>(
                    future: TokenService.getUserData(),
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        final userData = json.decode(snapshot.data!);
                        return CircleAvatar(
                          radius: 20,
                          backgroundImage: userData['avatar'] != null &&
                                  (userData['avatar'].startsWith('http') ||
                                      userData['avatar'].startsWith('https'))
                              ? NetworkImage(userData['avatar'])
                              : const NetworkImage(
                                  'https://via.placeholder.com/150'),
                        );
                      }
                      return const CircleAvatar(
                        radius: 20,
                        backgroundImage:
                            NetworkImage('https://via.placeholder.com/150'),
                      );
                    },
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: TextField(
                        controller: _commentController,
                        decoration: InputDecoration(
                          hintText: 'Write your response here...',
                          hintStyle: TextStyle(color: Colors.grey[600]),
                          border: InputBorder.none,
                        ),
                        maxLines: null,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  IconButton(
                    icon: const Icon(Icons.send, color: AppColors.primary),
                    onPressed: () => _postReply(commentId),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _postReply(String commentId) async {
    if (_commentController.text.trim().isEmpty) return;

    try {
      final token = await TokenService.getToken();
      final response = await http.put(
        Uri.parse(
            '$baseUrl/api/v1/post/comment/${widget.postId}/reply/$commentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'comment': _commentController.text,
        }),
      );

      final data = json.decode(response.body);
      if (data['success']) {
        _commentController.clear();
        Navigator.pop(context); // Đóng input dialog
        _loadComments(); // Reload comments để cập nhật UI
      }
    } catch (e) {
      print('Error posting reply: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to post reply: $e'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Widget _buildCommentInput() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, -1),
          ),
        ],
      ),
      child: Row(
        children: [
          FutureBuilder<String?>(
            future: TokenService.getUserData(),
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                final userData = json.decode(snapshot.data!);
                return CircleAvatar(
                  radius: 20,
                  backgroundImage: userData['avatar'] != null &&
                          (userData['avatar'].startsWith('http') ||
                              userData['avatar'].startsWith('https'))
                      ? NetworkImage(userData['avatar'])
                      : const NetworkImage('https://via.placeholder.com/150'),
                );
              }
              return const CircleAvatar(
                radius: 20,
                backgroundImage:
                    NetworkImage('https://via.placeholder.com/150'),
              );
            },
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(24),
              ),
              child: TextField(
                controller: _commentController,
                decoration: InputDecoration(
                  hintText: 'Write a comment...',
                  hintStyle: TextStyle(color: Colors.grey[600]),
                  border: InputBorder.none,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          IconButton(
            icon: const Icon(Icons.send, color: AppColors.primary),
            onPressed: _postComment,
          ),
        ],
      ),
    );
  }

  Widget _buildOptionButton({
    required IconData icon,
    required String text,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Row(
          children: [
            Icon(icon, color: AppColors.primary, size: 24),
            const SizedBox(width: 12),
            Text(
              text,
              style: const TextStyle(
                fontSize: 16,
                color: Colors.black87,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void showReportDialog(BuildContext context) {
    String? localSelectedReport;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
          ),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.report_problem,
                        color: Colors.red,
                        size: 24,
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Report Content',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Help us understand what\'s wrong with this post',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.black54,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                SingleChildScrollView(
                  child: Column(
                    children: [
                      _buildReportOption(
                        context: context,
                        icon: Icons.info_outline,
                        text: 'Inaccurate or misleading information',
                        description:
                            'Content contains false or misleading health/fitness information',
                        isSelected: localSelectedReport ==
                            'Inaccurate or misleading information',
                        onSelect: () {
                          setState(() {
                            localSelectedReport =
                                'Inaccurate or misleading information';
                          });
                        },
                      ),
                      _buildReportOption(
                        context: context,
                        icon: Icons.warning_amber_outlined,
                        text: 'Encouraging dangerous workouts',
                        description:
                            'Promotes unsafe exercise techniques or dangerous practices',
                        isSelected: localSelectedReport ==
                            'Encouraging dangerous workouts',
                        onSelect: () {
                          setState(() {
                            localSelectedReport =
                                'Encouraging dangerous workouts';
                          });
                        },
                      ),
                      _buildReportOption(
                        context: context,
                        icon: Icons.block_outlined,
                        text: 'Abusive or harassing content',
                        description:
                            'Contains harassment, hate speech, or inappropriate content',
                        isSelected: localSelectedReport ==
                            'Abusive or harassing content',
                        onSelect: () {
                          setState(() {
                            localSelectedReport =
                                'Abusive or harassing content';
                          });
                        },
                      ),
                      _buildReportOption(
                        context: context,
                        icon: Icons.medical_services_outlined,
                        text: 'Promotion of unsafe products or methods',
                        description:
                            'Promotes harmful supplements or dangerous weight loss methods',
                        isSelected: localSelectedReport ==
                            'Promotion of unsafe products or methods',
                        onSelect: () {
                          setState(() {
                            localSelectedReport =
                                'Promotion of unsafe products or methods';
                          });
                        },
                      ),
                      _buildReportOption(
                        context: context,
                        icon: Icons.attach_money,
                        text: 'Scam or fraud',
                        description:
                            'Suspicious activities or fraudulent content',
                        isSelected: localSelectedReport == 'Scam or fraud',
                        onSelect: () {
                          setState(() {
                            localSelectedReport = 'Scam or fraud';
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          child: const Text(
                            'Cancel',
                            style: TextStyle(
                              color: Colors.black87,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: localSelectedReport == null
                              ? null
                              : () {
                                  Navigator.pop(context);
                                  showConfirmReportDialog(
                                      context, localSelectedReport!);
                                },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'Submit Report',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildReportOption({
    required BuildContext context,
    required IconData icon,
    required String text,
    required String description,
    required bool isSelected,
    required VoidCallback onSelect,
  }) {
    return InkWell(
      onTap: onSelect,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        color: isSelected ? Colors.grey[100] : Colors.transparent,
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? AppColors.primary : Colors.grey[600],
              size: 24,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    text,
                    style: TextStyle(
                      fontSize: 16,
                      color: isSelected ? Colors.black : Colors.black87,
                      fontWeight:
                          isSelected ? FontWeight.w500 : FontWeight.normal,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            Radio<String>(
              value: text,
              groupValue: isSelected ? text : null,
              onChanged: (value) => onSelect(),
              activeColor: AppColors.primary,
            ),
          ],
        ),
      ),
    );
  }

  void showConfirmReportDialog(BuildContext context, String reportReason) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  children: [
                    const Icon(
                      Icons.report_problem,
                      color: Colors.red,
                      size: 24,
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Confirm Report',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Review your report details before submitting',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.black54,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () {
                        Navigator.pop(context);
                        showReportDialog(context);
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 20),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF9E6),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  children: [
                    Icon(
                      Icons.warning_amber_rounded,
                      color: Color(0xFFFFB020),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Important Notice',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Color(0xFFB27B16),
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'False reports may result in action being taken against your account. Please ensure your report is accurate and follows our community guidelines.',
                            style: TextStyle(
                              color: Color(0xFFB27B16),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 20),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.report_outlined, color: Colors.grey[700]),
                        const SizedBox(width: 8),
                        Text(
                          'Report Details',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.grey[700],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Reason for Report',
                      style: TextStyle(
                        color: Colors.black54,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      reportReason,
                      style: const TextStyle(
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Post ID',
                      style: TextStyle(
                        color: Colors.black54,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.postId,
                      style: TextStyle(
                        fontSize: 16,
                        fontFamily: 'Monospace',
                        color: Colors.grey[800],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  'Our team will review your report and take appropriate action if necessary. You may be contacted for additional information.',
                  style: TextStyle(
                    color: Colors.grey[600],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  children: [
                    Expanded(
                      child: TextButton(
                        onPressed: () {
                          Navigator.pop(context);
                          showReportDialog(context);
                        },
                        child: const Text(
                          'Cancel',
                          style: TextStyle(
                            color: Colors.black87,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () async {
                          try {
                            final response =
                                await _authService.createPostReport(
                              postId: widget.postId,
                              reasonReport: reportReason,
                            );
                            if (response['success'] == true) {
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content:
                                      Text('Report submitted successfully!'),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            } else {
                              throw Exception(response['message'] ??
                                  'Unable to submit report');
                            }
                          } catch (e) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(e.toString()),
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                          }
                        },
                        icon: const Icon(Icons.send),
                        label: const Text(
                          'Submit Report',
                          style: TextStyle(fontSize: 16),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatTime(String dateStr) {
    final date = DateTime.parse(dateStr).toLocal();
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inHours < 1) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inDays < 1) {
      return '${difference.inHours}h ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }

  Future<void> _handleLikeComment(String commentId) async {
    try {
      final token = await TokenService.getToken();
      final response = await http.put(
        Uri.parse(
            '$baseUrl/api/v1/post/comment/like/${widget.postId}/$commentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (data['success']) {
        // Reload comments để cập nhật UI
        _loadComments();
      }
    } catch (e) {
      print('Error liking comment: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to like comment: $e'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _loadRecipeAndExercise() async {
    try {
      final token = await TokenService.getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/post/${widget.postId}'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (data['success']) {
        // Kiểm tra và lấy dữ liệu recipe
        if (data['rs']['recipes'] != null &&
            data['rs']['recipes'] is List &&
            (data['rs']['recipes'] as List).isNotEmpty) {
          final recipeId =
              data['rs']['recipes'][0].toString(); // Convert to String
          final recipeResponse = await http.get(
            Uri.parse('$baseUrl/api/v1/recipe/$recipeId'),
            headers: {
              'Authorization': 'Bearer $token',
            },
          );

          final recipeData = json.decode(recipeResponse.body);
          if (recipeData['success']) {
            final responseData = recipeData['response'];
            setState(() {
              _recipe = {
                'name': responseData['name']?.toString() ?? '',
                'cookingTime': responseData['cooktime']?.toString() ?? '',
                'calories': responseData['calories']?.toString() ?? '',
                'ingredients': responseData['ingredients']?.toString() ?? '',
                'instructions': responseData['instructions']?.toString() ?? ''
              };
              _showRecipe = true;
            });
          }
        }

        // Kiểm tra và lấy dữ liệu exercise
        if (data['rs']['excercises'] != null &&
            data['rs']['excercises'] is List &&
            (data['rs']['excercises'] as List).isNotEmpty) {
          final exerciseId =
              data['rs']['excercises'][0].toString(); // Convert to String
          final exerciseResponse = await http.get(
            Uri.parse('$baseUrl/api/v1/excercise/$exerciseId'),
            headers: {
              'Authorization': 'Bearer $token',
            },
          );

          final exerciseData = json.decode(exerciseResponse.body);
          if (exerciseData['success']) {
            final excerciseData = exerciseData['excercise'];
            setState(() {
              _exercise = {
                'name': excerciseData['name']?.toString() ?? '',
                'primaryMuscles':
                    excerciseData['primaryMuscles']?.toString() ?? '',
                'secondaryMuscles':
                    excerciseData['secondaryMuscles']?.toString() ?? '',
                'equipment': excerciseData['equipment']?.toString() ?? '',
                'instructions': excerciseData['instructions']?.toString() ?? ''
              };
              _showExercise = true;
            });
          }
        }
      }
    } catch (e) {
      print('Error loading recipe and exercise: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load recipe and exercise: $e'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  Widget _buildRecipeSection() {
    if (!_showRecipe || _recipe == null) return const SizedBox.shrink();

    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Recipe Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.restaurant_menu,
                    color: AppColors.primary,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  _recipe!['name'] ?? 'Recipe',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Cooking Info
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  _buildInfoRow(
                    Icons.timer,
                    'Cooking time',
                    _recipe!['cookingTime'] ?? '',
                  ),
                  const SizedBox(height: 8),
                  _buildInfoRow(
                    Icons.local_fire_department,
                    'Calories',
                    _recipe!['calories'] ?? '',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Ingredients Section
            _buildSectionTitle('Ingredients'),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _recipe!['ingredients'] ?? '',
                style: TextStyle(
                  color: Colors.grey[800],
                  height: 1.5,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Instructions Section
            _buildSectionTitle('Instructions'),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _recipe!['instructions'] ?? '',
                style: TextStyle(
                  color: Colors.grey[800],
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExerciseSection() {
    if (!_showExercise || _exercise == null) return const SizedBox.shrink();

    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Exercise Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.fitness_center,
                    color: AppColors.primary,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  _exercise!['name'] ?? 'Exercise',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Muscles Info
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  _buildInfoRow(
                    Icons.accessibility_new,
                    'Primary Muscles',
                    _exercise!['primaryMuscles'] ?? '',
                  ),
                  const SizedBox(height: 8),
                  _buildInfoRow(
                    Icons.accessibility_new,
                    'Secondary Muscles',
                    _exercise!['secondaryMuscles'] ?? '',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Equipment Section
            _buildSectionTitle('Equipment'),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _exercise!['equipment'] ?? '',
                style: TextStyle(
                  color: Colors.grey[800],
                  height: 1.5,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Instructions Section
            _buildSectionTitle('Instructions'),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _exercise!['instructions'] ?? '',
                style: TextStyle(
                  color: Colors.grey[800],
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        color: AppColors.primary,
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.grey[600]),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: const TextStyle(
            fontWeight: FontWeight.w500,
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: TextStyle(
              color: Colors.grey[700],
            ),
          ),
        ),
      ],
    );
  }

  Future<void> _checkLikeStatus() async {
    try {
      final token = await TokenService.getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/post/${widget.postId}'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (data['success']) {
        final userData = await TokenService.getUserData();
        final userId = json.decode(userData!)['_id'];

        setState(() {
          _likeCount = (data['rs']['likes'] as List?)?.length ?? 0;
          _isLiked = (data['rs']['likes'] as List?)?.contains(userId) ?? false;
        });
      }
    } catch (e) {
      print('Error checking like status: $e');
    }
  }

  Future<void> _handleLike() async {
    try {
      final response = await _authService.likePost(widget.postId);
      if (response['success']) {
        setState(() {
          _isLiked = !_isLiked;
          _likeCount = _isLiked ? _likeCount + 1 : _likeCount - 1;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to like post: $e')),
      );
    }
  }
}
