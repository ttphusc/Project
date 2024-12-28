import 'package:flutter/material.dart';
import 'package:mobile/services/AuthService.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:mobile/services/TokenService.dart';
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class NotificationPage extends StatefulWidget {
  const NotificationPage({Key? key}) : super(key: key);

  @override
  _NotificationPageState createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  final AuthService _authService = AuthService();
  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = true;
  late IO.Socket socket;

  @override
  void initState() {
    super.initState();
    _fetchNotifications();
    _initializeSocket();
  }

  void _initializeSocket() async {
    final userData = await TokenService.getUserData();
    if (userData == null) return;

    final user = json.decode(userData);
    final token = await TokenService.getToken();
    final String baseUrl = dotenv.env['SERVER_URL'] ?? 'http://10.0.2.2:3000';

    socket = IO.io(baseUrl, <String, dynamic>{
      'transports': ['websocket', 'polling'],
      'autoConnect': false,
      'forceNew': true,
      'extraHeaders': {'Authorization': 'Bearer $token'}
    });

    try {
      socket.onConnecting((data) => print('Notification Socket connecting...'));
      socket.onConnect((_) {
        print('Notification Socket connected successfully');
        socket.emit('join_notification', user['_id']);
      });

      socket.onConnectError((data) {
        print('Notification Socket Connect Error: $data');
      });

      socket.onDisconnect((_) {
        print('Notification Socket Disconnected');
      });

      socket.onError((data) {
        print('Notification Socket Error: $data');
      });

      socket.on('send_notification', (data) {
        if (user['_id'] == data['receiverId']) {
          setState(() {
            _notifications.insert(0, {
              ...data['notification'],
              'createdAt': DateTime.now().toIso8601String(),
              'isRead': false,
            });
          });

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                    data['notification']['content'] ?? 'Bạn có thông báo mới'),
                duration: const Duration(seconds: 3),
                action: SnackBarAction(
                  label: 'Xem',
                  onPressed: () {},
                ),
              ),
            );
          }
        }
      });

      socket.connect();
    } catch (e) {
      print('Notification Socket initialization error: $e');
    }
  }

  @override
  void dispose() {
    socket.disconnect();
    socket.dispose();
    super.dispose();
  }

  Future<void> _fetchNotifications() async {
    setState(() => _isLoading = true);
    try {
      final notifications = await _authService.getNotifications();
      setState(() {
        _notifications = notifications;
        _isLoading = false;
      });
    } catch (e) {
      print('Error: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _markAsRead(String notificationId) async {
    try {
      final success = await _authService.markNotificationAsRead(notificationId);
      if (success) {
        setState(() {
          _notifications = _notifications.map((notification) {
            if (notification['_id'] == notificationId) {
              return {...notification, 'isRead': true};
            }
            return notification;
          }).toList();
        });
      }
    } catch (e) {
      print('Error marking as read: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Thông báo'),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Text(
                '${_notifications.where((n) => !n['isRead']).length} chưa đọc',
                style: TextStyle(
                  color: Colors.blue[700],
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _fetchNotifications,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _notifications.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _notifications.length,
                    itemBuilder: (context, index) {
                      final notification = _notifications[index];
                      return _buildNotificationCard(notification);
                    },
                  ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.blue[50],
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.notifications_outlined,
              size: 40,
              color: Colors.blue[500],
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Không có thông báo',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Bạn sẽ nhận được thông báo khi có hoạt động mới',
            style: TextStyle(color: Colors.grey),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(Map<String, dynamic> notification) {
    final isRead = notification['isRead'] ?? false;
    final createdAt = DateTime.parse(notification['createdAt']).toLocal();
    final now = DateTime.now();

    // Format thời gian
    String formattedTime;
    if (now.difference(createdAt).inMinutes < 1) {
      formattedTime = 'Vừa xong';
    } else if (now.difference(createdAt).inHours < 1) {
      formattedTime = '${now.difference(createdAt).inMinutes} phút trước';
    } else if (now.difference(createdAt).inDays < 1) {
      formattedTime = '${now.difference(createdAt).inHours} giờ trước';
    } else {
      // Format ngày giờ đầy đủ
      formattedTime =
          '${createdAt.day}/${createdAt.month}/${createdAt.year} ${createdAt.hour.toString().padLeft(2, '0')}:${createdAt.minute.toString().padLeft(2, '0')}';
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: isRead ? 1 : 2,
      color: isRead ? Colors.white : Colors.blue[50],
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(
          radius: 25,
          backgroundImage: NetworkImage(
            notification['senderId']?['avatar'] ??
                'https://via.placeholder.com/150',
          ),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                notification['senderId']?['firstname'] ?? 'Người dùng',
                style: TextStyle(
                  fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                  color: Colors.blue[700],
                ),
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
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Text(
            notification['content'] ?? '',
            style: TextStyle(
              color: isRead ? Colors.grey[600] : Colors.black87,
              fontSize: 14,
            ),
          ),
        ),
        trailing: !isRead
            ? IconButton(
                icon: const Icon(Icons.check_circle_outline),
                onPressed: () => _markAsRead(notification['_id']),
                color: Colors.blue[400],
              )
            : Icon(
                Icons.check_circle,
                color: Colors.green[400],
              ),
      ),
    );
  }
}
