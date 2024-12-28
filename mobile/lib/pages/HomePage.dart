import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import 'PostDetail.dart';
import 'CreatePost.dart';
import 'CreateQuestion.dart';
import 'Messages.dart';
import 'PersonalProfile.dart';
import 'CreateEvent.dart';
import 'Recommendation.dart';
import 'FavoritesPage.dart';
import 'CalendarPage.dart';
import 'PostsPage.dart';
import 'QuestionsPage.dart';
import '../services/AuthService.dart';
import 'dart:convert';
import '../services/TokenService.dart';
import 'NotificationPage.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'QuestionDetail.dart';
import 'dart:async';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final AuthService _authService = AuthService();
  List<Map<String, dynamic>> _combinedItems = [];
  bool _isLoading = false;
  String? selectedReport;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  int _unreadNotifications = 0;
  late IO.Socket socket;

  @override
  void initState() {
    super.initState();
    _loadData();
    _fetchUnreadNotifications();
    _initializeSocket();
  }

  void _initializeSocket() async {
    final userData = await TokenService.getUserData();
    if (userData == null) return;

    final user = json.decode(userData);
    final token = await TokenService.getToken();

    try {
      socket = IO.io(
        const String.fromEnvironment('SERVER_URL'),
        <String, dynamic>{
          'transports': ['websocket'],
          'auth': {'token': token},
          'extraHeaders': {'Authorization': 'Bearer $token'},
          'autoConnect': true,
          'reconnection': true,
          'reconnectionDelay': 1000,
          'reconnectionDelayMax': 5000,
          'reconnectionAttempts': double.infinity,
        },
      );

      socket.onConnect((_) {
        print('Socket connected successfully');
      });

      socket.onConnectError((data) {
        print('Socket Connect Error: $data');
        // Attempt to reconnect
        if (!socket.connected) {
          socket.connect();
        }
      });

      socket.onDisconnect((_) {
        print('Socket Disconnected - Attempting to reconnect...');
        // Attempt to reconnect
        if (!socket.connected) {
          socket.connect();
        }
      });

      socket.onError((data) {
        print('Socket Error: $data');
        // Attempt to reconnect on error
        if (!socket.connected) {
          socket.connect();
        }
      });

      // Ensure initial connection
      if (!socket.connected) {
        socket.connect();
      }

      // Set up periodic connection check
      Timer.periodic(const Duration(seconds: 30), (timer) {
        if (!socket.connected) {
          print(
              'Periodic check: Socket disconnected - Attempting to reconnect...');
          socket.connect();
        }
      });

      socket.on('send_notification', (data) {
        print('Received notification: $data');
        if (user['_id'] == data['receiverId']) {
          setState(() {
            _unreadNotifications++;
          });

          if (!mounted) return;

          final createdAt =
              DateTime.parse(data['notification']['createdAt']).toLocal();
          final now = DateTime.now();
          String formattedTime;

          if (now.difference(createdAt).inMinutes < 1) {
            formattedTime = 'Vừa xong';
          } else if (now.difference(createdAt).inHours < 1) {
            formattedTime = '${now.difference(createdAt).inMinutes} phút trước';
          } else if (now.difference(createdAt).inDays < 1) {
            formattedTime = '${now.difference(createdAt).inHours} giờ trước';
          } else {
            formattedTime =
                '${createdAt.hour.toString().padLeft(2, '0')}:${createdAt.minute.toString().padLeft(2, '0')}';
          }

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              behavior: SnackBarBehavior.floating,
              margin: const EdgeInsets.all(16),
              duration: const Duration(seconds: 4),
              content: Container(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundImage: NetworkImage(
                        data['notification']['senderId']['avatar'] ??
                            'https://via.placeholder.com/150',
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  '${data['notification']['senderId']['firstname']} ${data['notification']['senderId']['lastname']}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              Text(
                                formattedTime,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            data['notification']['content'] ?? '',
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              action: SnackBarAction(
                label: 'XEM',
                textColor: Colors.blue,
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const NotificationPage(),
                    ),
                  );
                },
              ),
            ),
          );
        }
      });
    } catch (e) {
      print('Socket initialization error: $e');
    }
  }

  @override
  void dispose() {
    socket.disconnect();
    socket.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final posts = await _authService.getPosts();
      final questions = await _authService.getQuestions();

      _combinedItems = [
        ...posts.map((post) => {...post, 'type': 'post'}),
        ...questions.map((question) => {...question, 'type': 'question'}),
      ];

      _combinedItems.sort((a, b) {
        final DateTime dateA = DateTime.parse(a['createdAt']);
        final DateTime dateB = DateTime.parse(b['createdAt']);
        return dateB.compareTo(dateA);
      });

      setState(() {});
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _fetchUnreadNotifications() async {
    try {
      final notifications = await _authService.getNotifications();
      final unreadCount = notifications
          .where((notification) => !(notification['isRead'] ?? false))
          .length;
      setState(() {
        _unreadNotifications = unreadCount;
      });
    } catch (e) {
      print('Error fetching notifications: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.grey[50],
      drawer: _buildDrawer(),
      appBar: AppBar(
        toolbarHeight: 70,
        titleSpacing: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16),
          child: IconButton(
            icon: const Icon(Icons.menu, color: AppColors.primary, size: 32),
            onPressed: () {
              _scaffoldKey.currentState?.openDrawer();
            },
          ),
        ),
        title: Container(
          margin: const EdgeInsets.only(right: 16, left: 16),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(25),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Row(
            children: [
              Icon(
                Icons.search,
                color: AppColors.primary.withOpacity(0.5),
                size: 24,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  showCursor: false,
                  decoration: InputDecoration(
                    hintText: 'Search something...',
                    hintStyle: TextStyle(
                      color: AppColors.primary.withOpacity(0.5),
                      fontSize: 16,
                    ),
                    border: InputBorder.none,
                  ),
                ),
              ),
            ],
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Stack(
              children: [
                IconButton(
                  icon: const Icon(Icons.notifications_outlined,
                      color: AppColors.primary, size: 32),
                  onPressed: () async {
                    await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const NotificationPage(),
                      ),
                    );
                    _fetchUnreadNotifications();
                  },
                ),
                if (_unreadNotifications > 0)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        _unreadNotifications.toString(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : ListView.builder(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                itemCount: _combinedItems.length + 1,
                itemBuilder: (context, index) {
                  if (index == 0) {
                    return Column(
                      children: [
                        _buildCreatePost(context),
                        const SizedBox(height: 20),
                      ],
                    );
                  }

                  final item = _combinedItems[index - 1];
                  final user = item['user'] as Map<String, dynamic>?;
                  final tags =
                      (item['tags'] as List<dynamic>?)?.cast<String>() ?? [];

                  if (item['type'] == 'post') {
                    final images = item['images'] as List<dynamic>?;
                    return Column(
                      children: [
                        _buildPost(
                          avatar: user?['avatar'] ?? 'assets/images/avatar.jpg',
                          name:
                              '${user?['firstname'] ?? 'Unknown'} ${user?['lastname'] ?? ''}'
                                  .trim(),
                          time: _formatTime(item['createdAt']),
                          title: item['title'] ?? '',
                          content: item['content'] ?? '',
                          likes: '${(item['likes'] as List?)?.length ?? 0}',
                          comments:
                              '${(item['comments'] as List?)?.length ?? 0}',
                          context: context,
                          hasRecipe: item['recipe'] != null,
                          hasExercise: item['exercise'] != null,
                          postId: item['_id'],
                          images: images?.cast<String>(),
                          tags: tags,
                        ),
                        const SizedBox(height: 20),
                      ],
                    );
                  } else {
                    return Column(
                      children: [
                        _buildQuestion(
                          avatar: user?['avatar'] ?? 'assets/images/avatar.jpg',
                          name:
                              '${user?['firstname'] ?? 'Unknown'} ${user?['lastname'] ?? ''}'
                                  .trim(),
                          time: _formatTime(item['createdAt']),
                          title: item['title'] ?? '',
                          content: item['content'] ?? '',
                          likes: '${(item['likes'] as List?)?.length ?? 0}',
                          answers:
                              '${(item['comments'] as List?)?.length ?? 0}',
                          context: context,
                          questionId: item['_id'],
                          tags: tags,
                        ),
                        const SizedBox(height: 20),
                      ],
                    );
                  }
                },
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

  Widget _buildCreatePost(BuildContext context) {
    return GestureDetector(
      onTap: () {
        showModalBottomSheet(
          context: context,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          builder: (context) => Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildCreateOption(
                  context: context,
                  icon: Icons.post_add,
                  text: 'Create Post',
                  description: 'Share your thoughts, tips or experiences',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const CreatePostPage(),
                      ),
                    );
                  },
                ),
                _buildCreateOption(
                  context: context,
                  icon: Icons.help_outline,
                  text: 'Ask Question',
                  description: 'Get help from the community',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const CreateQuestionPage(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(16),
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
        child: Row(
          children: [
            FutureBuilder<String?>(
              future: TokenService.getUserData(),
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  final userData = json.decode(snapshot.data!);
                  return CircleAvatar(
                    radius: 24,
                    backgroundImage: userData['avatar'] != null &&
                            (userData['avatar'].startsWith('http') ||
                                userData['avatar'].startsWith('https'))
                        ? NetworkImage(userData['avatar']) as ImageProvider
                        : const AssetImage('assets/images/avatar.jpg'),
                  );
                }
                return const CircleAvatar(
                  radius: 24,
                  backgroundImage: AssetImage('assets/images/avatar.jpg'),
                );
              },
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Row(
                  children: [
                    Text(
                      'Create post /question',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 16,
                      ),
                    ),
                    const Spacer(),
                    Icon(
                      Icons.image_outlined,
                      color: AppColors.primary.withOpacity(0.7),
                      size: 26,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCreateOption({
    required BuildContext context,
    required IconData icon,
    required String text,
    required String description,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: AppColors.primary,
                size: 24,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    text,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
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
            Icon(
              Icons.arrow_forward_ios,
              color: Colors.grey[400],
              size: 16,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPost({
    required String avatar,
    required String name,
    required String time,
    required String title,
    required String content,
    required String likes,
    required String comments,
    required BuildContext context,
    required bool hasRecipe,
    required bool hasExercise,
    required String postId,
    List<String>? images,
    List<String>? tags,
  }) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ViewPostPage(
              avatar: avatar,
              name: name,
              time: time,
              title: title,
              content: content,
              likes: likes,
              comments: comments,
              postId: postId,
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
                  backgroundImage:
                      avatar.startsWith('http') || avatar.startsWith('https')
                          ? NetworkImage(avatar) as ImageProvider
                          : AssetImage(avatar),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 2),
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
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
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
                      if (hasRecipe || hasExercise) ...[
                        Container(
                          margin: const EdgeInsets.only(left: 6),
                          width: 1,
                          height: 12,
                          color: const Color(0xFFB27B16).withOpacity(0.3),
                        ),
                        const SizedBox(width: 6),
                        if (hasRecipe)
                          const Icon(
                            Icons.restaurant_menu_outlined,
                            color: Color(0xFFB27B16),
                            size: 14,
                          ),
                        if (hasExercise)
                          const Icon(
                            Icons.fitness_center_outlined,
                            color: Color(0xFFB27B16),
                            size: 14,
                          ),
                      ],
                    ],
                  ),
                ),
                PopupMenuButton<String>(
                  icon: const Icon(Icons.more_horiz),
                  offset: const Offset(0, 5),
                  color: const Color(0xFFF1F5F9),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  position: PopupMenuPosition.under,
                  onSelected: (String value) async {
                    if (value == 'favorite') {
                      try {
                        final response =
                            await _authService.toggleFavorite(postId, 'post');
                        if (response['success']) {
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
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Error: ${e.toString()}'),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      }
                    } else if (value == 'report') {
                      showReportDialog(context, postId: postId);
                    }
                  },
                  itemBuilder: (BuildContext context) => [
                    PopupMenuItem<String>(
                      value: 'favorite',
                      height: 40,
                      child: Row(
                        children: [
                          Icon(
                            Icons.bookmark_border,
                            color: Colors.blue[600],
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Add to Favorite',
                            style: TextStyle(
                              color: Colors.grey[800],
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                    ),
                    PopupMenuItem<String>(
                      value: 'report',
                      height: 40,
                      child: Row(
                        children: [
                          Icon(
                            Icons.report_outlined,
                            color: Colors.blue[600],
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Report',
                            style: TextStyle(
                              color: Colors.grey[800],
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                height: 1.4,
              ),
            ),
            if (content.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text(
                content,
                style: TextStyle(
                  fontSize: 15,
                  color: Colors.grey[800],
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 12),
              InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ViewPostPage(
                        avatar: avatar,
                        name: name,
                        time: time,
                        title: title,
                        content: content,
                        likes: likes,
                        comments: comments,
                        postId: postId,
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
            const SizedBox(height: 20),
            if (tags != null && tags.isNotEmpty) ...[
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: tags
                    .map((tag) => Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            borderRadius: BorderRadius.circular(12),
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
              const SizedBox(height: 12),
            ],
            Row(
              children: [
                const Icon(
                  Icons.favorite_border,
                  color: AppColors.primary,
                  size: 28,
                ),
                const SizedBox(width: 8),
                Text(
                  likes,
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
                  comments,
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
                          right: index < images.length - 1 ? 8 : 0),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          images[index],
                          fit: BoxFit.cover,
                          width: 200,
                          height: 200,
                          errorBuilder: (context, error, stackTrace) {
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
            if (hasRecipe) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey[200]!),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.restaurant_menu_outlined,
                            color: AppColors.primary, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Recipe',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Click to view recipe details',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
            if (hasExercise) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey[200]!),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.fitness_center_outlined,
                            color: AppColors.primary, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Exercise',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Click to view exercise details',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
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

  void showReportDialog(BuildContext context,
      {String? postId, String? questionId}) {
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
                        isSelected: selectedReport ==
                            'Inaccurate or misleading information',
                        onSelect: () {
                          setState(() {
                            selectedReport =
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
                        isSelected:
                            selectedReport == 'Encouraging dangerous workouts',
                        onSelect: () {
                          setState(() {
                            selectedReport = 'Encouraging dangerous workouts';
                          });
                        },
                      ),
                      _buildReportOption(
                        context: context,
                        icon: Icons.block_outlined,
                        text: 'Abusive or harassing content',
                        description:
                            'Contains harassment, hate speech, or inappropriate content',
                        isSelected:
                            selectedReport == 'Abusive or harassing content',
                        onSelect: () {
                          setState(() {
                            selectedReport = 'Abusive or harassing content';
                          });
                        },
                      ),
                      _buildReportOption(
                        context: context,
                        icon: Icons.medical_services_outlined,
                        text: 'Promotion of unsafe products or methods',
                        description:
                            'Promotes harmful supplements or dangerous weight loss methods',
                        isSelected: selectedReport ==
                            'Promotion of unsafe products or methods',
                        onSelect: () {
                          setState(() {
                            selectedReport =
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
                        isSelected: selectedReport == 'Scam or fraud',
                        onSelect: () {
                          setState(() {
                            selectedReport = 'Scam or fraud';
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
                          onPressed: selectedReport == null
                              ? null
                              : () {
                                  Navigator.pop(context);
                                  showConfirmReportDialog(
                                    context,
                                    selectedReport!,
                                    postId: postId,
                                    questionId: questionId,
                                  );
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

  void showConfirmReportDialog(BuildContext context, String reportReason,
      {String? postId, String? questionId}) {
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
                      postId ?? questionId ?? 'Unknown ID',
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
                          if (selectedReport == null) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                    'Please select a reason for reporting'),
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                            return;
                          }

                          try {
                            if (postId != null) {
                              final response =
                                  await _authService.createPostReport(
                                postId: postId,
                                reasonReport: selectedReport!,
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
                            } else if (questionId != null) {
                              final response =
                                  await _authService.createQuestionReport(
                                questionId: questionId,
                                reasonReport: selectedReport!,
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

  Widget _buildDrawer() {
    return Drawer(
      backgroundColor: Colors.white,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.fromLTRB(24, 16, 24, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'FNH',
                    style: TextStyle(
                      fontFamily: 'Lobster',
                      fontSize: 34,
                      color: AppColors.primary,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Menu',
                    style: TextStyle(
                      fontSize: 19,
                      color: AppColors.primary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Column(
                  children: [
                    _buildDrawerItem(
                      icon: Icons.flag_outlined,
                      title: 'Post',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const PostsPage(),
                          ),
                        );
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.help_outline,
                      title: 'Question',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const QuestionsPage(),
                          ),
                        );
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.calendar_today_outlined,
                      title: 'Event',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const CreateEventPage(),
                          ),
                        );
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.favorite_border,
                      title: 'Favourites',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const FavoritesPage(),
                          ),
                        );
                      },
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 8),
                      child: Divider(height: 1),
                    ),
                    _buildDrawerItem(
                      icon: Icons.chat_bubble_outline,
                      title: 'Chat',
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const MessagesPage(),
                          ),
                        );
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.star_border,
                      title: 'Recommendation',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const RecommendationPage(),
                          ),
                        );
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.calendar_month_outlined,
                      title: 'Calendar',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const CalendarPage(),
                          ),
                        );
                      },
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 8),
                      child: Divider(height: 1),
                    ),
                    _buildDrawerItem(
                      icon: Icons.person_outline,
                      title: 'Profile',
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ProfilePage(),
                          ),
                        );
                      },
                    ),
                    _buildDrawerItem(
                      icon: Icons.settings_outlined,
                      title: 'Settings',
                      onTap: () {},
                    ),
                    _buildDrawerItem(
                      icon: Icons.logout_outlined,
                      title: 'Log out',
                      onTap: () {},
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(25),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: BorderRadius.circular(25),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    icon,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 16),
                Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.primary,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuestion({
    required String avatar,
    required String name,
    required String time,
    required String title,
    required String content,
    required String likes,
    required String answers,
    required BuildContext context,
    required String questionId,
    List<String>? tags,
  }) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => QuestionDetail(
              avatar: avatar,
              name: name,
              time: time,
              title: title,
              content: content,
              likes: likes,
              answers: answers,
              questionId: questionId,
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
                  backgroundImage:
                      avatar.startsWith('http') || avatar.startsWith('https')
                          ? NetworkImage(avatar) as ImageProvider
                          : AssetImage(avatar),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 2),
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
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFCE7F3),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Question',
                        style: TextStyle(
                          color: Color(0xFFBE185D),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                PopupMenuButton<String>(
                  icon: const Icon(Icons.more_horiz),
                  offset: const Offset(0, 5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  position: PopupMenuPosition.under,
                  onSelected: (String value) async {
                    if (value == 'favorite') {
                      try {
                        final response = await _authService.toggleFavorite(
                            questionId, 'question');
                        if (response['success']) {
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
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Error: ${e.toString()}'),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      }
                    } else if (value == 'report') {
                      showReportDialog(context, questionId: questionId);
                    }
                  },
                  itemBuilder: (BuildContext context) => [
                    PopupMenuItem<String>(
                      value: 'favorite',
                      height: 40,
                      child: Row(
                        children: [
                          Icon(
                            Icons.bookmark_border,
                            color: Colors.blue[600],
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Add to Favorite',
                            style: TextStyle(
                              color: Colors.grey[800],
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                    ),
                    PopupMenuItem<String>(
                      value: 'report',
                      height: 40,
                      child: Row(
                        children: [
                          Icon(
                            Icons.report_outlined,
                            color: Colors.blue[600],
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Report',
                            style: TextStyle(
                              color: Colors.grey[800],
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                height: 1.4,
              ),
            ),
            if (content.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text(
                content,
                style: TextStyle(
                  fontSize: 15,
                  color: Colors.grey[800],
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 12),
              InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => QuestionDetail(
                        avatar: avatar,
                        name: name,
                        time: time,
                        title: title,
                        content: content,
                        likes: likes,
                        answers: answers,
                        questionId: questionId,
                      ),
                    ),
                  );
                },
                child: const Text(
                  'Read the whole question...',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
            const SizedBox(height: 20),
            if (tags != null && tags.isNotEmpty) ...[
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: tags
                    .map((tag) => Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            borderRadius: BorderRadius.circular(12),
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
              const SizedBox(height: 12),
            ],
            Row(
              children: [
                const Icon(
                  Icons.favorite_border,
                  color: AppColors.primary,
                  size: 28,
                ),
                const SizedBox(width: 8),
                Text(
                  likes,
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
                  answers,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
