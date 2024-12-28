import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:mobile/services/TokenService.dart';
import 'dart:io' show Platform;

class UserService {
  final String baseUrl =
      Platform.isAndroid ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

  // Cập nhật thông tin cá nhân
  Future<Map<String, dynamic>> updatePersonalInfo({
    required String firstname,
    required String lastname,
    required String gender,
    required DateTime dob,
  }) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/user/personal'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'firstname': firstname,
          'lastname': lastname,
          'gender': gender,
          'dob': dob.toIso8601String(),
        }),
      );

      final data = json.decode(response.body);
      if (data['success']) {
        await TokenService.saveUserData(json.encode(data['user']));
      }
      return data;
    } catch (e) {
      throw Exception('Lỗi cập nhật thông tin: $e');
    }
  }

  // Cập nhật thông tin liên hệ
  Future<Map<String, dynamic>> updateContactInfo({
    required String phone,
    required String address,
  }) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/user/contact'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'phone': phone,
          'address': address,
        }),
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200) {
        // Save updated user data
        if (data['rs'] != null) {
          await TokenService.saveUserData(json.encode(data['rs']));
        }
        return {'success': true, 'message': 'Cập nhật thông tin thành công'};
      }

      throw Exception(data['message'] ?? 'Cập nhật thông tin thất bại');
    } catch (e) {
      throw Exception('Lỗi cập nhật thông tin: $e');
    }
  }

  // Đổi mật khẩu
  Future<Map<String, dynamic>> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/user/password'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'oldPassword': currentPassword,
          'newPassword': newPassword,
        }),
      );

      final data = json.decode(response.body);

      // Kiểm tra các loại lỗi cụ thể
      if (response.statusCode == 400) {
        final message = data['message']?.toString().toLowerCase() ?? '';
        if (message.contains('incorrect') ||
            message.contains('mật khẩu không đúng')) {
          throw Exception('Mật khẩu hiện tại không trùng khớp');
        }
      }

      if (response.statusCode == 200 && (data['success'] ?? false)) {
        return {'success': true, 'message': 'Đổi mật khẩu thành công'};
      }

      throw Exception(data['message'] ?? 'Đổi mật khẩu thất bại');
    } catch (e) {
      if (e.toString().contains('Failed host lookup')) {
        throw Exception('Không thể kết nối đến server');
      }
      rethrow;
    }
  }

  // Cập nhật email
  Future<Map<String, dynamic>> updateEmail({
    required String primaryEmail,
    String? backupEmail,
  }) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      print('Request body: ${json.encode({
            'email': primaryEmail,
            if (backupEmail != null && backupEmail.isNotEmpty)
              'backupEmail': backupEmail,
          })}');

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/user/me/email'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'email': primaryEmail,
          if (backupEmail != null && backupEmail.isNotEmpty)
            'backupEmail': backupEmail,
        }),
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      final data = json.decode(response.body);

      if (response.statusCode == 401) {
        throw Exception('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      }

      if (response.statusCode == 200) {
        if (data['success'] == true) {
          // Save updated user data if available
          if (data['rs'] != null) {
            await TokenService.saveUserData(json.encode(data['rs']));
          }
          return {
            'success': true,
            'message': data['message'] ?? 'Email đã được cập nhật'
          };
        } else {
          throw Exception(data['message'] ?? 'Cập nhật email thất bại');
        }
      }

      // Handle error cases
      if (response.statusCode == 400) {
        throw Exception(data['message'] ?? 'Email không hợp lệ');
      }

      if (response.statusCode == 409) {
        throw Exception(data['message'] ?? 'Email đã được sử dụng');
      }

      throw Exception(data['message'] ?? 'Cập nhật email thất bại');
    } catch (e) {
      print('Error updating email: $e');
      if (e.toString().contains('Failed host lookup')) {
        throw Exception('Không thể kết nối đến server');
      }
      rethrow;
    }
  }

  // Cập nhật thuộc tính cá nhân
  Future<Map<String, dynamic>> updateAttributes({
    required double height,
    required double weight,
    required int sleepHours,
    required String activityLevel,
    required String dietaryPreferences,
    required String healthCondition,
    required String stressLevel,
    required String fitnessExperience,
    required String fitnessGoal,
    String? exercisePreferences,
  }) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      // Đầu tiên lấy ID của attributes
      final attributesResponse = await getAttributes();
      if (!attributesResponse['success'] ||
          attributesResponse['attributes'] == null) {
        throw Exception('Không thể lấy thông tin attributes');
      }
      final attributesId = attributesResponse['attributes']['_id'];

      final response = await http.put(
        Uri.parse('$baseUrl/api/v1/attributes/$attributesId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'height': height,
          'weight': weight,
          'sleepHours': sleepHours,
          'activityLevel': activityLevel,
          'dietaryPreferences': dietaryPreferences,
          'heathCondition': healthCondition,
          'stressLevel': stressLevel,
          'fitnessExperience': fitnessExperience,
          'fitnessGoal': fitnessGoal,
          if (exercisePreferences != null)
            'exercisePreferences': exercisePreferences,
        }),
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return {
          'success': true,
          'message': 'Cập nhật thuộc tính thành công',
          'attributes': data['updateAttributes']
        };
      }

      throw Exception(data['message'] ?? 'Lỗi cập nhật thuộc tính');
    } catch (e) {
      throw Exception('Lỗi cập nhật thuộc tính: $e');
    }
  }

  // Lấy thông tin thuộc tính
  Future<Map<String, dynamic>> getAttributes() async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/attributes/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200) {
        return {'success': true, 'attributes': data['attributes']};
      }

      throw Exception(data['message'] ?? 'Lỗi lấy thông tin thuộc tính');
    } catch (e) {
      throw Exception('Lỗi lấy thông tin thuộc tính: $e');
    }
  }

  Future<Map<String, dynamic>> getUserInfo() async {
    try {
      // First try to get user data from local storage
      final userData = await TokenService.getUserData();
      if (userData != null) {
        final data = json.decode(userData);
        if (data is Map<String, dynamic>) {
          return {'success': true, 'user': data};
        }
      }

      // If no local data or invalid format, then fetch from server
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/user/me'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        final user = data['user'];
        await TokenService.saveUserData(json.encode(user));
        return {'success': true, 'user': user};
      }
      throw Exception(data['mes'] ?? 'Failed to load user info');
    } catch (e) {
      throw Exception('Lỗi lấy thông tin người dùng: $e');
    }
  }

  // Lấy chi tiết bài post
  Future<List<Map<String, dynamic>>> getUserPosts(List<String> postIds) async {
    try {
      final token = await TokenService.getToken();
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực');
      }

      List<Map<String, dynamic>> posts = [];
      for (String postId in postIds) {
        final response = await http.get(
          Uri.parse('$baseUrl/api/v1/post/$postId'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );

        final data = json.decode(response.body);
        if (data['success'] && data['rs'] != null) {
          posts.add(data['rs']);
        }
      }
      return posts;
    } catch (e) {
      print('Error getting user posts: $e');
      throw Exception('Lỗi lấy thông tin bài viết: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getUserQuestions(
      List<String> questionIds) async {
    try {
      final token = await TokenService.getToken();
      List<Map<String, dynamic>> questions = [];

      for (String questionId in questionIds) {
        final response = await http.get(
          Uri.parse('$baseUrl/api/v1/question/$questionId'),
          headers: {
            'Authorization': 'Bearer $token',
          },
        );

        final data = json.decode(response.body);
        if (data['success']) {
          questions.add(data['rs']);
        }
      }

      return questions;
    } catch (e) {
      throw Exception('Failed to load questions: $e');
    }
  }

  Future<Map<String, dynamic>> getUserById(String userId) async {
    try {
      final token = await TokenService.getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/api/v1/user/$userId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      return data;
    } catch (e) {
      throw Exception('Failed to get user info: $e');
    }
  }
}
