import 'dart:convert';
import 'dart:io';
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../configs/Constants.dart';
import '../services/AuthService.dart';
import '../services/TokenService.dart';

/// Model for chat messages
class ChatMessage {
  final String text;
  final String time;
  final bool isMe;
  final String? image;

  ChatMessage({
    required this.text,
    required this.time,
    required this.isMe,
    this.image,
  });
}

/// Main messages page showing list of chat rooms
class MessagesPage extends StatefulWidget {
  const MessagesPage({super.key});

  @override
  State<MessagesPage> createState() => _MessagesPageState();
}

class _MessagesPageState extends State<MessagesPage> {
  final AuthService _authService = AuthService();
  List<Map<String, dynamic>> _rooms = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadRooms();
  }

  Future<void> _loadRooms() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      final rooms = await _authService.getMyRoomChats();

      if (mounted) {
        setState(() {
          _rooms = rooms;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _rooms = [];
          _isLoading = false;
          _error = e.toString();
        });
      }
    }
  }

  void refreshRooms() {
    _loadRooms();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: _buildAppBar(),
      body: _buildBody(),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      title: const Text(
        'Messages',
        style: TextStyle(
          color: AppColors.primary,
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
      ),
      actions: [
        _buildRefreshButton(),
      ],
    );
  }

  Widget _buildRefreshButton() {
    return IconButton(
      icon: _isLoading
          ? const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
              ),
            )
          : const Icon(Icons.refresh, color: AppColors.primary),
      onPressed: () async {
        if (!_isLoading) {
          setState(() => _isLoading = true);
          await _loadRooms();
          setState(() => _isLoading = false);
        }
      },
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return _buildErrorView();
    }

    if (_rooms.isEmpty) {
      return const Center(child: Text('Không có cuộc trò chuyện nào'));
    }

    return _buildMessagesList();
  }

  Widget _buildErrorView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('Error: $_error'),
          ElevatedButton(
            onPressed: _loadRooms,
            child: const Text('Thử lại'),
          ),
        ],
      ),
    );
  }

  Widget _buildMessagesList() {
    return RefreshIndicator(
      onRefresh: _loadRooms,
      child: ListView.builder(
        itemCount: _rooms.length,
        itemBuilder: (context, index) {
          final room = _rooms[index];
          return _buildMessageItem(
            name: room['name'] ?? 'Unknown',
            message: room['lastMessage'] ?? 'No messages',
            time: room['lastMessageTime'] ?? '',
            avatar: room['avatar'] ?? 'assets/images/avatar.jpg',
            isOnline: room['isOnline'] ?? false,
            unreadCount: room['unreadCount'] ?? 0,
            context: context,
          );
        },
      ),
    );
  }

  Widget _buildMessageItem({
    required String name,
    required String message,
    required String time,
    required String avatar,
    bool isOnline = false,
    int unreadCount = 0,
    required BuildContext context,
  }) {
    // Format thời gian
    String formattedTime = '';
    if (time.isNotEmpty) {
      try {
        final DateTime messageTime = DateTime.parse(time);
        final DateTime now = DateTime.now();
        final Duration difference = now.difference(messageTime);

        if (difference.inDays > 0) {
          formattedTime = '${difference.inDays}d ago';
        } else if (difference.inHours > 0) {
          formattedTime = '${difference.inHours}h ago';
        } else if (difference.inMinutes > 0) {
          formattedTime = '${difference.inMinutes}m ago';
        } else {
          formattedTime = 'Just now';
        }
      } catch (e) {
        formattedTime = time;
      }
    }

    return GestureDetector(
      onTap: () async {
        await navigateToChat(context, name, avatar, isOnline);
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(
            bottom: BorderSide(
              color: Colors.grey[200]!,
              width: 1,
            ),
          ),
        ),
        child: ListTile(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          leading: CircleAvatar(
            radius: 28,
            backgroundImage: _getAvatarImage(avatar),
          ),
          title: Text(
            name,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.primary,
            ),
          ),
          subtitle: Text(
            message,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          trailing: Text(
            formattedTime,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
          ),
        ),
      ),
    );
  }

  ImageProvider _getAvatarImage(String avatar) {
    try {
      if (avatar.startsWith('http') || avatar.startsWith('https')) {
        return NetworkImage(avatar);
      } else if (avatar.startsWith('assets/')) {
        return AssetImage(avatar);
      } else if (avatar.startsWith('/uploads/')) {
        // Nếu là đường dẫn tương đối từ server
        return NetworkImage('http://10.0.2.2:3000$avatar');
      } else {
        // Fallback cho ảnh mặc định
        return const AssetImage('assets/images/avatar.jpg');
      }
    } catch (e) {
      return const AssetImage('assets/images/avatar.jpg');
    }
  }

  Future<void> navigateToChat(
      BuildContext context, String name, String avatar, bool isOnline) async {
    try {
      final room = _rooms.firstWhere((room) => room['name'] == name);

      final userDataStr = await TokenService.getUserData();
      if (userDataStr == null) {
        throw Exception('Không tìm thấy thông tin người dùng');
      }

      final userData = json.decode(userDataStr);
      final currentUserId = userData['_id'];

      // Xác định receiverId từ room data
      String receiverId;
      if (room['idUserStart'] == currentUserId) {
        receiverId = room['idUserEnd'];
      } else {
        receiverId = room['idUserStart'];
      }

      if (!context.mounted) return;

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ChatDetailPage(
            name: name,
            avatar: avatar,
            isOnline: isOnline,
            roomId: room['id'],
            receiverId: receiverId,
          ),
        ),
      );
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể mở cuộc trò chuyện: $e')),
      );
    }
  }
}

/// Chat detail page showing individual conversation
class ChatDetailPage extends StatefulWidget {
  final String name;
  final String avatar;
  final String roomId;
  final String receiverId;
  final bool isOnline;

  const ChatDetailPage({
    super.key,
    required this.name,
    required this.avatar,
    required this.roomId,
    required this.receiverId,
    this.isOnline = false,
  });

  @override
  State<ChatDetailPage> createState() => _ChatDetailPageState();
}

class _ChatDetailPageState extends State<ChatDetailPage> {
  final TextEditingController _messageController = TextEditingController();
  final AuthService _authService = AuthService();
  List<ChatMessage> messages = [];
  bool _isLoading = true;
  Timer? _messageTimer;
  late IO.Socket socket;
  final ImagePicker _picker = ImagePicker();
  File? _selectedImage;
  final ScrollController _scrollController = ScrollController();
  String? currentUserId;

  @override
  void initState() {
    super.initState();
    _getCurrentUserId();
    _initializeSocket();
    _loadMessages();
  }

  Future<void> _getCurrentUserId() async {
    final userDataStr = await TokenService.getUserData();
    if (userDataStr != null) {
      final userData = json.decode(userDataStr);
      currentUserId = userData['_id'];
    }
  }

  void _initializeSocket() {
    final String baseUrl = dotenv.env['SERVER_URL'] ?? 'http://10.0.2.2:3000';

    socket = IO.io(baseUrl, <String, dynamic>{
      'transports': ['websocket', 'polling'],
      'autoConnect': true,
      'forceNew': true,
      'reconnection': true,
      'reconnectionAttempts': 10,
      'reconnectionDelay': 2000,
      'reconnectionDelayMax': 5000,
      'timeout': 10000,
      'pingTimeout': 5000,
      'pingInterval': 3000,
    });

    socket.connect();

    socket.onConnecting((data) => print('Socket connecting...'));
    socket.onConnectError((data) => print('Socket connection error: $data'));
    socket.onError((data) => print('Socket error: $data'));
    socket.onDisconnect((_) => print('Socket disconnected'));

    socket.onConnect((_) {
      print('Socket connected successfully');
      _joinChat();
    });

    socket.on('send_message', (data) async {
      final String roomId = data['idRoomChat']?.toString() ?? '';
      final String senderId = data['senderId'] is Map
          ? data['senderId']['_id']?.toString() ?? ''
          : data['senderId']?.toString() ?? '';

      // Chỉ xử lý tin nhắn nếu:
      // 1. Đúng phòng chat
      // 2. Người gửi không phải là người dùng hiện tại
      if (roomId == widget.roomId && senderId != currentUserId && mounted) {
        final newMessage = ChatMessage(
          text: data['message'] ?? '',
          time: _formatTime(DateTime.now().toIso8601String()),
          isMe: false,
          image: data['image']?.isNotEmpty == true ? data['image'] : null,
        );

        setState(() {
          messages.add(newMessage);
        });

        // Auto scroll to bottom
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (_scrollController.hasClients) {
            _scrollController.animateTo(
              _scrollController.position.maxScrollExtent,
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOut,
            );
          }
        });

        // Refresh room list
        context.findAncestorStateOfType<_MessagesPageState>()?.refreshRooms();
      }
    });
  }

  void _joinChat() async {
    final userData = await TokenService.getUserData();
    if (userData != null) {
      final user = json.decode(userData);
      socket.emit('join_chat', user['_id']);
    }
  }

  Future<void> _loadMessages({bool showLoading = true}) async {
    try {
      if (showLoading) {
        setState(() {
          _isLoading = true;
        });
      }

      final response = await _authService.getRoomChat(widget.roomId);

      if (response['success'] && response['rs'] != null) {
        final currentRoom = response['rs'];
        final userData = await TokenService.getUserData();
        final currentUserId = json.decode(userData!)['_id'];

        if (currentRoom['messages'] != null) {
          final List<dynamic> messageList = currentRoom['messages'];

          if (mounted) {
            setState(() {
              messages = messageList.map((msg) {
                return ChatMessage(
                  text: msg['message'] ?? '',
                  time: _formatTime(msg['createdAt']),
                  isMe: msg['senderId']['_id'] == currentUserId,
                  image: msg['image']?.isNotEmpty == true ? msg['image'] : null,
                );
              }).toList();
            });

            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (_scrollController.hasClients) {
                _scrollController.jumpTo(
                  _scrollController.position.maxScrollExtent,
                );
              }
            });
          }
        }
      }
    } catch (e) {
      if (mounted && showLoading) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi khi tải tin nhắn: $e')),
        );
      }
    } finally {
      if (mounted && showLoading) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  String _formatTime(String? timeStr) {
    if (timeStr == null) return '';

    try {
      final DateTime messageTime = DateTime.parse(timeStr);
      final DateTime now = DateTime.now();
      final Duration difference = now.difference(messageTime);

      if (difference.inDays > 0) {
        return '${difference.inDays}d ago';
      } else if (difference.inHours > 0) {
        return '${difference.inHours}h ago';
      } else if (difference.inMinutes > 0) {
        return '${difference.inMinutes}m ago';
      } else {
        return 'Just now';
      }
    } catch (e) {
      print('Error formatting time: $e');
      return timeStr;
    }
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.trim().isEmpty) return;

    try {
      final messageText = _messageController.text;
      _messageController.clear();

      final userDataStr = await TokenService.getUserData();
      if (userDataStr == null) return;

      final userData = json.decode(userDataStr);
      final currentUserId = userData['_id'];

      // Gửi tin nhắn qua API trước
      final response = await _authService.sendMessage(
        roomId: widget.roomId,
        receiverId: widget.receiverId,
        message: messageText,
        image: _selectedImage?.path,
      );

      if (response['success']) {
        // Chỉ thêm tin nhắn vào UI sau khi API thành công
        final newMessage = ChatMessage(
          text: messageText,
          time: _formatTime(DateTime.now().toIso8601String()),
          isMe: true,
          image: _selectedImage?.path,
        );

        if (mounted) {
          setState(() {
            messages.add(newMessage);
            _selectedImage = null; // Clear selected image
          });

          // Auto scroll to bottom
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (_scrollController.hasClients) {
              _scrollController.animateTo(
                _scrollController.position.maxScrollExtent,
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeOut,
              );
            }
          });
        }

        // Emit socket event để thông báo cho các client khác
        socket.emit('send_message', {
          'idRoomChat': widget.roomId,
          'senderId': currentUserId,
          'receiverId': widget.receiverId,
          'message': messageText,
          'image': _selectedImage?.path,
        });
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Không thể gửi tin nhắn')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi khi gửi tin nhắn: $e')),
        );
      }
    }
  }

  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        final imageUrl = await _authService.uploadImage(File(image.path));
        if (imageUrl != null) {
          setState(() => _selectedImage = File(image.path));
        }
      }
    } catch (e) {
      print('Error picking image: $e');
    }
  }

  ImageProvider _getAvatarImage(String avatar) {
    try {
      if (avatar.startsWith('http') || avatar.startsWith('https')) {
        return NetworkImage(avatar);
      } else if (avatar.startsWith('assets/')) {
        return AssetImage(avatar);
      } else if (avatar.startsWith('/uploads/')) {
        // Nếu là đường dẫn tương đối từ server
        return NetworkImage('http://10.0.2.2:3000$avatar');
      } else {
        // Fallback cho ảnh mặc định
        return const AssetImage('assets/images/avatar.jpg');
      }
    } catch (e) {
      return const AssetImage('assets/images/avatar.jpg');
    }
  }

  @override
  void dispose() {
    socket.disconnect();
    socket.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            CircleAvatar(
              radius: 20,
              backgroundImage: _getAvatarImage(widget.avatar),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.name,
                  style: const TextStyle(
                    color: Colors.black87,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (widget.isOnline)
                  const Text(
                    'Online',
                    style: TextStyle(
                      color: Colors.green,
                      fontSize: 12,
                    ),
                  ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.black87),
            onPressed: () => _loadMessages(showLoading: true),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _loadMessages,
                    child: ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(16),
                      itemCount: messages.length,
                      itemBuilder: (context, index) {
                        final message = messages[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: Row(
                            mainAxisAlignment: message.isMe
                                ? MainAxisAlignment.end
                                : MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              if (!message.isMe) ...[
                                CircleAvatar(
                                  radius: 16,
                                  backgroundImage:
                                      _getAvatarImage(widget.avatar),
                                ),
                                const SizedBox(width: 8),
                              ],
                              Column(
                                crossAxisAlignment: message.isMe
                                    ? CrossAxisAlignment.end
                                    : CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    constraints: BoxConstraints(
                                      maxWidth:
                                          MediaQuery.of(context).size.width *
                                              0.7,
                                    ),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: message.isMe
                                          ? const Color(0xFFE3F2FD)
                                          : Colors.grey[200],
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          message.text,
                                          style: const TextStyle(
                                            fontSize: 16,
                                            color: Colors.black87,
                                          ),
                                        ),
                                        if (message.image != null) ...[
                                          const SizedBox(height: 8),
                                          ClipRRect(
                                            borderRadius:
                                                BorderRadius.circular(12),
                                            child: Image.asset(
                                              message.image!,
                                              width: 200,
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    message.time,
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                              if (message.isMe) ...[
                                const SizedBox(width: 8),
                                Container(
                                  width: 32,
                                  height: 32,
                                  decoration: BoxDecoration(
                                    color: Colors.red,
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Center(
                                    child: Image.asset(
                                      'assets/images/vietnam_flag.png',
                                      width: 20,
                                      height: 20,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        );
                      },
                    ),
                  ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                top: BorderSide(color: Colors.grey[200]!),
              ),
            ),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.image, color: Colors.blue),
                  onPressed: _pickImage,
                ),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: TextField(
                      controller: _messageController,
                      decoration: const InputDecoration(
                        hintText: 'Enter your message...',
                        border: InputBorder.none,
                        hintStyle: TextStyle(color: Colors.grey),
                      ),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send, color: Colors.blue),
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
