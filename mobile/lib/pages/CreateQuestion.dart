import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import '../services/AuthService.dart';

class CreateQuestionPage extends StatefulWidget {
  const CreateQuestionPage({super.key});

  @override
  State<CreateQuestionPage> createState() => _CreateQuestionPageState();
}

class _CreateQuestionPageState extends State<CreateQuestionPage> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _tagsController = TextEditingController();
  final TextEditingController _detailsController = TextEditingController();
  int tagCount = 0;
  bool _isLoading = false;
  final AuthService _authService = AuthService();

  @override
  void dispose() {
    _titleController.dispose();
    _tagsController.dispose();
    _detailsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.primary),
          onPressed: () => Navigator.pop(context),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: AppColors.primary,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.help_outline, color: Colors.white, size: 24),
                    SizedBox(width: 8),
                    Text(
                      'Ask a Question',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Share your question with the community\nand get helpful answers',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildQuestionTitle(),
                    const SizedBox(height: 24),
                    _buildTagsSection(),
                    const SizedBox(height: 24),
                    _buildQuestionDetails(),
                    const SizedBox(height: 24),
                    _buildButtons(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuestionTitle() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          children: [
            Icon(Icons.title, color: AppColors.primary, size: 22),
            SizedBox(width: 8),
            Text(
              'Question Title',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        _buildTextField(
          controller: _titleController,
          hintText: 'Give your post a title...',
        ),
      ],
    );
  }

  Widget _buildTagsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          children: [
            Icon(Icons.tag_outlined, color: AppColors.primary, size: 22),
            SizedBox(width: 8),
            Text(
              'Add tags',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        _buildTextField(
          controller: _tagsController,
          hintText: 'Add up to 5 tags separated by space',
          onChanged: (value) {
            setState(() {
              tagCount =
                  value.trim().split(' ').where((tag) => tag.isNotEmpty).length;
            });
          },
        ),
        const SizedBox(height: 4),
        Text(
          '$tagCount/5 tags',
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildQuestionDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          children: [
            Icon(Icons.description_outlined,
                color: AppColors.primary, size: 22),
            SizedBox(width: 8),
            Text(
              'Question Details',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        _buildTextField(
          controller: _detailsController,
          hintText: 'Describe your question in detail...',
          maxLines: 5,
        ),
      ],
    );
  }

  Widget _buildButtons() {
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: () {
              // TODO: Implement image upload
            },
            icon: const Icon(Icons.image_outlined, color: Colors.white),
            label: const Text(
              'Upload',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: ElevatedButton.icon(
            onPressed: _isLoading ? null : _handleCreateQuestion,
            icon: const Icon(Icons.send, color: Colors.white),
            label: Text(
              _isLoading ? 'Creating...' : 'Create',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    int maxLines = 1,
    void Function(String)? onChanged,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: TextField(
        controller: controller,
        maxLines: maxLines,
        onChanged: onChanged,
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(color: Colors.grey[400], fontSize: 14),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(12),
        ),
      ),
    );
  }

  Future<void> _handleCreateQuestion() async {
    if (_titleController.text.isEmpty || _detailsController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Vui lòng điền tiêu đề và nội dung câu hỏi')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      // Xử lý tags từ chuỗi thành List
      final List<String> tagsList = _tagsController.text
          .split(' ')
          .map((tag) => tag.trim())
          .where((tag) => tag.isNotEmpty)
          .toList();

      if (tagsList.length > 5) {
        throw Exception('Không thể thêm quá 5 tags');
      }

      final response = await _authService.createQuestion(
        title: _titleController.text,
        content: _detailsController.text,
        tags: tagsList,
      );

      if (response['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Câu hỏi đã được tạo thành công')),
        );
        Navigator.pop(context, true);
      } else {
        throw Exception(response['message'] ?? 'Không thể tạo câu hỏi');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }
}
