import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mobile/services/TokenService.dart';
import 'dart:io';

class AuthService {
  final String baseUrl = dotenv.env['SERVER_URL']!;

  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String firstname,
    required String phone,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/user/register'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'password': password,
          'firstname': firstname,
          'phone': phone,
        }),
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi đăng ký: $e');
    }
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/user/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      final data = json.decode(response.body);

      if (data['success'] == true) {
        // Lưu token
        await TokenService.saveToken(data['accessToken']);
        // Lưu user data
        await TokenService.saveUserData(json.encode(data['userData']));
      }

      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi đăng nhập: $e');
    }
  }

  Future<Map<String, dynamic>> createPost({
    required String title,
    required String content,
    required List<String> tags,
    Map<String, dynamic>? recipe,
    Map<String, dynamic>? exercise,
  }) async {
    try {
      // Lấy token từ TokenService
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/post'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'title': title,
          'content': content,
          'tags': tags,
          if (recipe != null) 'recipe': recipe,
          if (exercise != null) 'exercise': exercise,
        }),
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi tạo bài viết: $e');
    }
  }

  Future<Map<String, dynamic>> createQuestion({
    required String title,
    required String content,
    required List<String> tags,
  }) async {
    try {
      // Lấy token từ TokenService
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/question'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'title': title,
          'content': content,
          'tags': tags,
        }),
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi tạo câu hỏi: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getPosts() async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/post'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);

      if (data['success'] == true) {
        final posts = List<Map<String, dynamic>>.from(data['posts']);

        List<Map<String, dynamic>> processedPosts = [];

        for (var post in posts) {
          try {
            final userResponse = await http.get(
              Uri.parse('$baseUrl/api/v1/user/${post['idAuthor']}'),
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer $token',
              },
            );

            final userData = json.decode(userResponse.body);

            if (userData['success'] == true) {
              final user = userData['rs'];
              processedPosts.add({
                ...post,
                'user': {
                  '_id': user['_id'] ?? '',
                  'firstname': user['firstname'] ?? 'Unknown',
                  'lastname': user['lastname'] ?? '',
                  'avatar': user['avatar'] ?? 'assets/images/avatar.jpg',
                },
              });
            }
          } catch (e) {
            processedPosts.add({
              ...post,
              'user': {
                '_id': '',
                'firstname': 'Unknown',
                'lastname': '',
                'avatar': 'assets/images/avatar.jpg',
              },
            });
          }
        }

        return processedPosts;
      } else {
        throw Exception(data['message'] ?? 'Không thể lấy danh sách bài viết');
      }
    } catch (e) {
      print('Error getting posts: $e');
      throw Exception('Đã xảy ra lỗi khi lấy danh sách bài viết: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getQuestions() async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/question'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);

      if (data['success'] == true) {
        final questions = List<Map<String, dynamic>>.from(data['questions']);
        List<Map<String, dynamic>> processedQuestions = [];

        for (var question in questions) {
          try {
            final userResponse = await http.get(
              Uri.parse('$baseUrl/api/v1/user/${question['idAuthor']}'),
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer $token',
              },
            );

            final userData = json.decode(userResponse.body);

            if (userData['success'] == true) {
              final user = userData['rs'];
              processedQuestions.add({
                ...question,
                'user': {
                  '_id': user['_id'] ?? '',
                  'firstname': user['firstname'] ?? 'Unknown',
                  'lastname': user['lastname'] ?? '',
                  'avatar': user['avatar'] ?? 'assets/images/avatar.jpg',
                },
              });
            }
          } catch (e) {
            processedQuestions.add({
              ...question,
              'user': {
                '_id': '',
                'firstname': 'Unknown',
                'lastname': '',
                'avatar': 'assets/images/avatar.jpg',
              },
            });
          }
        }

        return processedQuestions;
      } else {
        throw Exception(data['message'] ?? 'Không thể lấy danh sách câu hỏi');
      }
    } catch (e) {
      print('Error getting questions: $e');
      throw Exception('Đã xảy ra lỗi khi lấy danh sách câu hỏi: $e');
    }
  }

  Future<Map<String, dynamic>> createPostReport({
    required String postId,
    required String reasonReport,
  }) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      // Chỉ gửi báo cáo bài viết
      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/report/post/$postId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'reasonReport': reasonReport,
        }),
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi báo cáo bài viết: $e');
    }
  }

  Future<Map<String, dynamic>> createQuestionReport({
    required String questionId,
    required String reasonReport,
  }) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/report/question/$questionId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'reasonReport': reasonReport,
        }),
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi báo cáo câu hỏi: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getMyRoomChats() async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/listmyroomchat'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);

      if (data['success'] == true &&
          data['rs'] != null &&
          data['rs']['roomChats'] != null) {
        List<Map<String, dynamic>> rooms = [];
        for (var chat in data['rs']['roomChats']) {
          final userData = await TokenService.getUserData();
          final currentUserId = json.decode(userData!)['_id'];

          final userInfo = chat['idUserStart']['_id'] == currentUserId
              ? chat['idUserEnd']
              : chat['idUserStart'];

          if (userInfo != null) {
            rooms.add({
              'id': chat['_id'],
              'name': '${userInfo['firstname']} ${userInfo['lastname'] ?? ''}'
                  .trim(),
              'avatar': userInfo['avatar'] ?? 'assets/images/avatar.jpg',
              'lastMessage': chat['messages']?.isNotEmpty == true
                  ? chat['messages'].last['message']
                  : 'Chưa có tin nhắn',
              'lastMessageTime': chat['messages']?.isNotEmpty == true
                  ? chat['messages'].last['createdAt']
                  : '',
              'isOnline': false,
              'unreadCount': 0,
              'idUserStart': chat['idUserStart']['_id'],
              'idUserEnd': chat['idUserEnd']['_id'],
            });
          }
        }
        return rooms;
      }
      return [];
    } catch (e) {
      print('Error fetching room chats: $e');
      return [];
    }
  }

  Future<Map<String, dynamic>> postMyRoomChats({
    required String roomId,
    required String message,
    String? image,
  }) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/listmyroomchat'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'message': message,
          if (image != null) 'image': image,
        }),
      );

      final data = json.decode(response.body);
      print('Send message response: $data');

      if (data['success'] == true) {
        return data;
      } else {
        throw Exception(data['message'] ?? 'Không thể gửi tin nhắn');
      }
    } catch (e) {
      print('Error sending message: $e');
      throw Exception('Đã xảy ra lỗi khi gửi tin nhắn: $e');
    }
  }

  Future<Map<String, dynamic>> sendMessage({
    required String roomId,
    required String receiverId,
    required String message,
    String? image,
  }) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/api/v1/message/$roomId/receiver/$receiverId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'message': message,
          if (image != null) 'image': image,
        }),
      );

      final data = json.decode(response.body);
      if (data['success']) {
        // Gửi thông báo
        try {
          await http.post(
            Uri.parse('$baseUrl/api/v1/notification/$receiverId'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
            body: json.encode({
              'receiverId': receiverId,
            }),
          );
        } catch (e) {
          print('Error sending notification: $e');
        }
      }
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi gửi tin nhắn: $e');
    }
  }

  Future<Map<String, dynamic>> getRoomChat(String roomId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/roomchat/$roomId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi lấy thông tin phòng chat: $e');
    }
  }

  Future<String?> uploadImage(File imageFile) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      var request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/api/v1/post/upload-image'),
      );

      request.headers['Authorization'] = 'Bearer $token';
      request.files.add(
        await http.MultipartFile.fromPath('image', imageFile.path),
      );

      var response = await request.send();
      var responseData = await response.stream.bytesToString();
      var data = json.decode(responseData);

      if (data['success']) {
        return data['imageUrl'];
      }
      return null;
    } catch (e) {
      print('Error uploading image: $e');
      return null;
    }
  }

  Future<List<String>> getPostImages(String postId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/post/$postId/images'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (data['success'] == true) {
        return List<String>.from(data['images']);
      } else {
        throw Exception(data['message'] ?? 'Không thể lấy ảnh bài viết');
      }
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi lấy ảnh bài viết: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getNotifications() async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/notification/all'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (data['success'] == true) {
        return List<Map<String, dynamic>>.from(data['rs']);
      }
      return [];
    } catch (e) {
      print('Error fetching notifications: $e');
      return [];
    }
  }

  Future<bool> markNotificationAsRead(String notificationId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/notification/$notificationId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data['success'] == true;
    } catch (e) {
      print('Error marking notification as read: $e');
      return false;
    }
  }

  Future<Map<String, dynamic>> likePost(String postId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/post/like/$postId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi thích bài viết: $e');
    }
  }

  Future<Map<String, dynamic>> dislikePost(String postId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/post/dislike/$postId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi không thích bài viết: $e');
    }
  }

  Future<Map<String, dynamic>> likeQuestion(String questionId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/question/like/$questionId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi thích câu hỏi: $e');
    }
  }

  Future<Map<String, dynamic>> dislikeQuestion(String questionId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/question/dislike/$questionId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi không thích câu hỏi: $e');
    }
  }

  Future<Map<String, dynamic>> commentQuestion(
      String questionId, String comment) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/question/comment/$questionId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'comment': comment,
        }),
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi thêm bình luận: $e');
    }
  }

  Future<Map<String, dynamic>> replyQuestionComment(
      String questionId, String commentId, String reply) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse(
            '$baseUrl/api/v1/question/comment/$questionId/reply/$commentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'comment': reply,
        }),
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi trả lời bình luận: $e');
    }
  }

  Future<Map<String, dynamic>> likeQuestionComment(
      String questionId, String commentId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse(
            '$baseUrl/api/v1/question/comment/like/$questionId/$commentId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi thích bình luận: $e');
    }
  }

  Future<Map<String, dynamic>> getFavoriteList(String favoriteListId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/favoritelist/$favoriteListId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi lấy danh sách yêu thích: $e');
    }
  }

  Future<Map<String, dynamic>> getEvents(int page) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      print('Fetching events...');
      print('Token: $token');

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/event'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      final data = json.decode(response.body);

      if (data['success']) {
        // Lấy danh sách events từ trường totalEvents
        final List<dynamic> eventsList = data['totalEvents'] ?? [];

        return {
          'success': true,
          'events': eventsList,
          'totalPages': data['totalPages'] ?? 1,
        };
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Failed to load events',
        };
      }
    } catch (e) {
      print('Error fetching events: $e');
      throw Exception('Đã xảy ra lỗi khi lấy danh sách sự kiện: $e');
    }
  }

  Future<Map<String, dynamic>> joinEvent(String eventId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/event/join/$eventId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Đã xảy ra lỗi khi tham gia sự kiện: $e');
    }
  }

  Future<Map<String, dynamic>> toggleFavorite(
      String itemId, String type) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/favoritelist/$type/$itemId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);

      // Lưu trạng thái yêu thích vào local storage
      if (data['success']) {
        await TokenService.saveData(
            'favorite_$itemId', data['isFavorited'].toString());
      }

      return {
        'success': data['success'],
        'isFavorited': data['isFavorited'],
        'message': data['isFavorited']
            ? 'Đã thêm vào danh sách yêu thích'
            : 'Đã xóa khỏi danh sách yêu thích'
      };
    } catch (e) {
      print('Error toggling favorite: $e');
      throw Exception('Không thể cập nhật danh sách yêu thích: $e');
    }
  }

  Future<Map<String, dynamic>> getFavoriteListName(
      String favoriteListId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/favoritelist/name/$favoriteListId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      print('Error getting favorite list name: $e');
      throw Exception('Đã xảy ra lỗi khi lấy tên danh sách yêu thích: $e');
    }
  }

  Future<Map<String, dynamic>> updateFavoriteListName({
    required String favoriteListId,
    required String newName,
  }) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/favoritelist/name/$favoriteListId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'name': newName,
        }),
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      print('Error updating favorite list name: $e');
      throw Exception('Đã xảy ra lỗi khi cập nhật tên danh sách yêu thích: $e');
    }
  }

  Future<Map<String, dynamic>> getFavoriteListAuthor(String authorId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/user/$authorId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      print('Error getting favorite list author: $e');
      throw Exception('Đã xảy ra lỗi khi lấy thông tin tác giả: $e');
    }
  }

  Future<Map<String, dynamic>> getPostAuthor(String postId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/post/$postId/author'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      print('Post author response: ${response.body}');
      final data = json.decode(response.body);
      return data;
    } catch (e) {
      print('Error getting post author: $e');
      throw Exception('Đã xảy ra lỗi khi lấy thông tin tác giả bài viết: $e');
    }
  }

  Future<Map<String, dynamic>> getQuestionAuthor(String questionId) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/question/$questionId/author'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      print('Question author response: ${response.body}');
      final data = json.decode(response.body);
      return data;
    } catch (e) {
      print('Error getting question author: $e');
      throw Exception('Đã xảy ra lỗi khi lấy thông tin tác giả câu hỏi: $e');
    }
  }
}
