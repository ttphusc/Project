import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import '../services/AuthService.dart';
import 'QuestionDetail.dart';

class QuestionsPage extends StatefulWidget {
  const QuestionsPage({super.key});

  @override
  State<QuestionsPage> createState() => _QuestionsPageState();
}

class _QuestionsPageState extends State<QuestionsPage> {
  final AuthService _authService = AuthService();
  List<Map<String, dynamic>> _questions = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  Future<void> _loadQuestions() async {
    setState(() => _isLoading = true);
    try {
      final questions = await _authService.getQuestions();
      setState(() {
        _questions = questions;
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
        title: const Text('Questions'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.primary,
        elevation: 0.5,
      ),
      body: RefreshIndicator(
        onRefresh: _loadQuestions,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _questions.length,
                itemBuilder: (context, index) {
                  final question = _questions[index];
                  final user = question['user'] as Map<String, dynamic>?;
                  final tags =
                      (question['tags'] as List<dynamic>?)?.cast<String>() ??
                          [];

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => QuestionDetail(
                              avatar:
                                  user?['avatar'] ?? 'assets/images/avatar.jpg',
                              name:
                                  '${user?['firstname'] ?? 'Unknown'} ${user?['lastname'] ?? ''}'
                                      .trim(),
                              time: _formatTime(question['createdAt']),
                              title: question['title'] ?? '',
                              content: question['content'] ?? '',
                              likes:
                                  '${(question['likes'] as List?)?.length ?? 0}',
                              answers:
                                  '${(question['comments'] as List?)?.length ?? 0}',
                              questionId: question['_id'],
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
                                        _formatTime(question['createdAt']),
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
                              ],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              question['title'] ?? '',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                height: 1.4,
                              ),
                            ),
                            if (question['content']?.isNotEmpty ?? false) ...[
                              const SizedBox(height: 12),
                              Text(
                                question['content'] ?? '',
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
                                      builder: (context) => QuestionDetail(
                                        avatar: user?['avatar'] ??
                                            'assets/images/avatar.jpg',
                                        name:
                                            '${user?['firstname'] ?? 'Unknown'} ${user?['lastname'] ?? ''}'
                                                .trim(),
                                        time:
                                            _formatTime(question['createdAt']),
                                        title: question['title'] ?? '',
                                        content: question['content'] ?? '',
                                        likes:
                                            '${(question['likes'] as List?)?.length ?? 0}',
                                        answers:
                                            '${(question['comments'] as List?)?.length ?? 0}',
                                        questionId: question['_id'],
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
