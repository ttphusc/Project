import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import '../services/UserService.dart';
import 'Messages.dart';
import 'PersonalInformationPage.dart';
import 'ContactDetailsPage.dart';
import 'ChangePasswordPage.dart';
import 'EmailSettingsPage.dart';
import 'ProfileAttributesPage.dart';
import 'PostDetail.dart';
import 'QuestionDetail.dart';

class ProfilePage extends StatefulWidget {
  final String? userId;

  const ProfilePage({super.key, this.userId});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final UserService _userService = UserService();
  bool _isLoading = true;
  Map<String, dynamic>? userData;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    try {
      setState(() => _isLoading = true);
      final response = widget.userId != null
          ? await _userService.getUserById(widget.userId!)
          : await _userService.getUserInfo();

      if (response['success']) {
        setState(() {
          // Handle both cases: user data from getUserById and getUserInfo
          userData = response['rs'] ?? response['user'];
        });
      } else {
        throw Exception('Failed to load user data');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi tải thông tin: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    final String fullName = userData != null
        ? '${userData!['firstname'] ?? ''} ${userData!['lastname'] ?? ''}'
            .trim()
        : 'User Name';
    final String email = userData?['email'] ?? 'No email';
    final String phone = userData?['phone'] ?? 'No phone';
    final String address = userData?['address'] ?? 'No address';
    final String? avatarUrl = userData?['avatar'];

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.primary),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined,
                color: AppColors.primary),
            onPressed: () {},
          ),
          IconButton(
            icon:
                const Icon(Icons.keyboard_arrow_down, color: AppColors.primary),
            onPressed: () {
              showMenu(
                context: context,
                position: const RelativeRect.fromLTRB(1000, 100, 20, 0),
                elevation: 8,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                color: Colors.white,
                items: [
                  _buildMenuItem(
                    icon: Icons.person_outline,
                    title: 'Personal Information',
                    context: context,
                  ),
                  _buildMenuItem(
                    icon: Icons.contact_phone_outlined,
                    title: 'Contact Details',
                    context: context,
                  ),
                  _buildMenuItem(
                    icon: Icons.lock_outline,
                    title: 'Change Password',
                    context: context,
                  ),
                  _buildMenuItem(
                    icon: Icons.email_outlined,
                    title: 'Email Settings',
                    context: context,
                  ),
                  _buildMenuItem(
                    icon: Icons.badge_outlined,
                    title: 'Profile Attributes',
                    context: context,
                  ),
                ],
              );
            },
          ),
          const SizedBox(width: 8),
        ],
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: _loadUserData,
        child: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                color: Colors.white,
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundImage: avatarUrl != null
                          ? NetworkImage(avatarUrl)
                          : const AssetImage('assets/images/avatar.jpg')
                              as ImageProvider,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      fullName,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildStatColumn(
                            userData?['posts']?.toString() ?? '0', 'Post'),
                        _buildStatColumn(
                            userData?['followers']?.toString() ?? '0',
                            'Follower'),
                        _buildStatColumn(
                            userData?['following']?.toString() ?? '0',
                            'Following'),
                      ],
                    ),
                    const SizedBox(height: 20),
                    _buildInfoRow(Icons.email, 'Email', email),
                    const SizedBox(height: 12),
                    _buildInfoRow(Icons.location_on, 'Address', address),
                    const SizedBox(height: 12),
                    _buildInfoRow(Icons.phone, 'Phone', phone),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text('Follow'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => const MessagesPage(),
                                ),
                              );
                            },
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              side: const BorderSide(color: AppColors.primary),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text(
                              'Messages',
                              style: TextStyle(color: AppColors.primary),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: AppColors.primary),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: IconButton(
                            icon: const Icon(Icons.more_horiz,
                                color: AppColors.primary),
                            onPressed: () {},
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Container(
                color: Colors.white,
                child: DefaultTabController(
                  length: 2,
                  child: Column(
                    children: [
                      const TabBar(
                        tabs: [
                          Tab(text: 'Post'),
                          Tab(text: 'Question'),
                        ],
                        labelColor: AppColors.primary,
                        unselectedLabelColor: Colors.grey,
                        indicatorColor: AppColors.primary,
                      ),
                      SizedBox(
                        height: 500,
                        child: TabBarView(
                          children: [
                            _buildPostsTab(userData),
                            _buildQuestionsTab(userData),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatColumn(String count, String label) {
    final displayCount = int.tryParse(count)?.toString() ?? '0';

    return Column(
      children: [
        Text(
          displayCount,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppColors.primary,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 16,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 20),
        const SizedBox(width: 8),
        Text(
          '$label:',
          style: TextStyle(
            fontSize: 16,
            color: Colors.grey[600],
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              color: AppColors.primary,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  Widget _buildPostsTab(Map<String, dynamic>? userData) {
    if (userData == null || userData['posts'] == null) {
      return const Center(
        child: Text('No posts yet'),
      );
    }

    // Nếu posts là một số (string), hiển thị thông báo
    if (userData['posts'] is String) {
      return Center(
        child: Text('Number of posts: ${userData['posts']}'),
      );
    }

    // Nếu posts là một list, hiển thị danh sách posts
    if (userData['posts'] is List) {
      final postIds = userData['posts'] as List;
      if (postIds.isEmpty) {
        return const Center(
          child: Text('No posts yet'),
        );
      }

      return FutureBuilder<List<Map<String, dynamic>>>(
        future: _userService.getUserPosts(postIds.cast<String>()),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final posts = snapshot.data ?? [];
          if (posts.isEmpty) {
            return const Center(child: Text('No posts yet'));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: posts.length,
            itemBuilder: (context, index) {
              try {
                final post = posts[index];
                String timeAgo = 'Unknown time';

                if (post['createdAt'] != null) {
                  try {
                    if (post['createdAt'] is String) {
                      timeAgo = _getTimeAgo(post['createdAt']);
                    } else if (post['createdAt'] is Map) {
                      final createdAtMap = post['createdAt'] as Map;
                      if (createdAtMap['\$date'] != null) {
                        timeAgo = _getTimeAgo(createdAtMap['\$date']);
                      }
                    }
                  } catch (e) {
                    print('Error parsing time: $e');
                  }
                }

                // Xử lý nội dung post
                String title = '';
                String content = '';

                try {
                  if (post['title'] != null) {
                    title = post['title']
                        .toString()
                        .replaceAll(RegExp(r'<[^>]*>'), '');
                  }

                  if (post['content'] != null) {
                    content = post['content']
                        .toString()
                        .replaceAll(RegExp(r'<[^>]*>'), '');
                  }
                } catch (e) {
                  print('Error parsing content: $e');
                }

                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ViewPostPage(
                            avatar: userData['avatar'] ??
                                'assets/images/avatar.jpg',
                            name:
                                '${userData['firstname'] ?? ''} ${userData['lastname'] ?? ''}'
                                    .trim(),
                            time: timeAgo,
                            title: title,
                            content: content,
                            likes:
                                (post['likes'] as List?)?.length.toString() ??
                                    '0',
                            comments: (post['comments'] as List?)
                                    ?.length
                                    .toString() ??
                                '0',
                            postId: post['_id'],
                          ),
                        ),
                      );
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              backgroundImage: userData['avatar'] != null
                                  ? NetworkImage(userData['avatar'])
                                  : const AssetImage('assets/images/avatar.jpg')
                                      as ImageProvider,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '${userData['firstname'] ?? ''} ${userData['lastname'] ?? ''}'
                                        .trim(),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.primary,
                                    ),
                                  ),
                                  Text(
                                    timeAgo,
                                    style: TextStyle(
                                        color: Colors.grey[600], fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.more_horiz),
                              onPressed: () {},
                              color: AppColors.primary,
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (title.isNotEmpty) ...[
                                    Text(
                                      title,
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 8),
                                  ],
                                  if (content.isNotEmpty)
                                    Text(
                                      content,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        color: Colors.black87,
                                      ),
                                      maxLines: 3,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: Row(
                                children: [
                                  const Icon(Icons.favorite_border,
                                      color: AppColors.primary, size: 28),
                                  const SizedBox(width: 8),
                                  Text(
                                    post['likes']?.length?.toString() ?? '0',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(width: 24),
                                  const Icon(Icons.chat_bubble_outline,
                                      color: AppColors.primary, size: 28),
                                  const SizedBox(width: 8),
                                  Text(
                                    post['comments']?.length?.toString() ?? '0',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(width: 24),
                                  Icon(Icons.remove_red_eye_outlined,
                                      color: Colors.grey[600], size: 28),
                                  const SizedBox(width: 8),
                                  Text(
                                    '${post['views'] ?? 0} views',
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              } catch (e) {
                print('Error rendering post at index $index: $e');
                return const SizedBox.shrink();
              }
            },
          );
        },
      );
    }

    // Trường hợp khác
    return const Center(
      child: Text('No posts yet'),
    );
  }

  String _getTimeAgo(dynamic timestamp) {
    if (timestamp == null) return 'Unknown time';

    try {
      DateTime dateTime;
      if (timestamp is String) {
        dateTime = DateTime.parse(timestamp);
      } else if (timestamp is int) {
        dateTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
      } else {
        return 'Unknown time';
      }

      final now = DateTime.now();
      final difference = now.difference(dateTime);

      if (difference.inDays > 0) {
        return '${difference.inDays} days ago';
      } else if (difference.inHours > 0) {
        return '${difference.inHours} hours ago';
      } else if (difference.inMinutes > 0) {
        return '${difference.inMinutes} minutes ago';
      } else {
        return 'Just now';
      }
    } catch (e) {
      print('Error formatting timestamp: $e');
      return 'Unknown time';
    }
  }

  Widget _buildQuestionsTab(Map<String, dynamic>? userData) {
    if (userData == null || userData['questions'] == null) {
      return const Center(
        child: Text('No questions yet'),
      );
    }

    // Nếu questions là một số (string), hiển thị thông báo
    if (userData['questions'] is String) {
      return Center(
        child: Text('Number of questions: ${userData['questions']}'),
      );
    }

    // Nếu questions là một list, hiển thị danh sách questions
    if (userData['questions'] is List) {
      final questionIds = userData['questions'] as List;
      if (questionIds.isEmpty) {
        return const Center(
          child: Text('No questions yet'),
        );
      }

      return FutureBuilder<List<Map<String, dynamic>>>(
        future: _userService.getUserQuestions(questionIds.cast<String>()),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final questions = snapshot.data ?? [];
          if (questions.isEmpty) {
            return const Center(child: Text('No questions yet'));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: questions.length,
            itemBuilder: (context, index) {
              try {
                final question = questions[index];
                String timeAgo = 'Unknown time';

                if (question['createdAt'] != null) {
                  try {
                    if (question['createdAt'] is String) {
                      timeAgo = _getTimeAgo(question['createdAt']);
                    } else if (question['createdAt'] is Map) {
                      final createdAtMap = question['createdAt'] as Map;
                      if (createdAtMap['\$date'] != null) {
                        timeAgo = _getTimeAgo(createdAtMap['\$date']);
                      }
                    }
                  } catch (e) {
                    print('Error parsing time: $e');
                  }
                }

                // Xử lý nội dung question
                String title = '';
                String content = '';

                try {
                  if (question['title'] != null) {
                    title = question['title']
                        .toString()
                        .replaceAll(RegExp(r'<[^>]*>'), '');
                  }

                  if (question['content'] != null) {
                    content = question['content']
                        .toString()
                        .replaceAll(RegExp(r'<[^>]*>'), '');
                  }
                } catch (e) {
                  print('Error parsing content: $e');
                }

                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => QuestionDetail(
                            avatar: userData['avatar'] ??
                                'assets/images/avatar.jpg',
                            name:
                                '${userData['firstname'] ?? ''} ${userData['lastname'] ?? ''}'
                                    .trim(),
                            time: timeAgo,
                            title: title,
                            content: content,
                            likes: (question['likes'] as List?)
                                    ?.length
                                    .toString() ??
                                '0',
                            answers: (question['comments'] as List?)
                                    ?.length
                                    .toString() ??
                                '0',
                            questionId: question['_id'],
                          ),
                        ),
                      );
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              backgroundImage: userData['avatar'] != null
                                  ? NetworkImage(userData['avatar'])
                                  : const AssetImage('assets/images/avatar.jpg')
                                      as ImageProvider,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '${userData['firstname'] ?? ''} ${userData['lastname'] ?? ''}'
                                        .trim(),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.primary,
                                    ),
                                  ),
                                  Text(
                                    timeAgo,
                                    style: TextStyle(
                                        color: Colors.grey[600], fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.more_horiz),
                              onPressed: () {},
                              color: AppColors.primary,
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (title.isNotEmpty) ...[
                                    Text(
                                      title,
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 8),
                                  ],
                                  if (content.isNotEmpty)
                                    Text(
                                      content,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        color: Colors.black87,
                                      ),
                                      maxLines: 3,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: Row(
                                children: [
                                  const Icon(Icons.favorite_border,
                                      color: AppColors.primary, size: 28),
                                  const SizedBox(width: 8),
                                  Text(
                                    question['likes']?.length?.toString() ??
                                        '0',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(width: 24),
                                  const Icon(Icons.chat_bubble_outline,
                                      color: AppColors.primary, size: 28),
                                  const SizedBox(width: 8),
                                  Text(
                                    question['comments']?.length?.toString() ??
                                        '0',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(width: 24),
                                  Icon(Icons.remove_red_eye_outlined,
                                      color: Colors.grey[600], size: 28),
                                  const SizedBox(width: 8),
                                  Text(
                                    '${question['views'] ?? 0} views',
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              } catch (e) {
                print('Error rendering question at index $index: $e');
                return const SizedBox.shrink();
              }
            },
          );
        },
      );
    }

    // Trường hợp khác
    return const Center(
      child: Text('No questions yet'),
    );
  }

  PopupMenuItem<void> _buildMenuItem({
    required IconData icon,
    required String title,
    required BuildContext context,
  }) {
    return PopupMenuItem<void>(
      height: 48,
      child: Row(
        children: [
          Icon(
            icon,
            color: AppColors.primary,
            size: 22,
          ),
          const SizedBox(width: 12),
          Text(
            title,
            style: const TextStyle(
              color: AppColors.primary,
              fontSize: 15,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
      onTap: () {
        if (title == 'Personal Information') {
          Future.delayed(const Duration(seconds: 0), () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const PersonalInformationPage(),
              ),
            );
          });
        } else if (title == 'Contact Details') {
          Future.delayed(const Duration(seconds: 0), () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const ContactDetailsPage(),
              ),
            );
          });
        } else if (title == 'Change Password') {
          Future.delayed(const Duration(seconds: 0), () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const ChangePasswordPage(),
              ),
            );
          });
        } else if (title == 'Email Settings') {
          Future.delayed(const Duration(seconds: 0), () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const EmailSettingsPage(),
              ),
            );
          });
        } else if (title == 'Profile Attributes') {
          Future.delayed(const Duration(seconds: 0), () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const ProfileAttributesPage(),
              ),
            );
          });
        }
      },
    );
  }
}
