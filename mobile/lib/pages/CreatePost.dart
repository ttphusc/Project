import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import '../services/AuthService.dart';

class CreatePostPage extends StatefulWidget {
  const CreatePostPage({super.key});

  @override
  State<CreatePostPage> createState() => _CreatePostPageState();
}

class _CreatePostPageState extends State<CreatePostPage> {
  bool isRecipeExpanded = true;
  bool isExerciseExpanded = true;

  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _tagsController = TextEditingController();
  final TextEditingController _contentController = TextEditingController();

  final TextEditingController _recipeNameController = TextEditingController();
  final TextEditingController _ingredientsController = TextEditingController();
  final TextEditingController _instructionsController = TextEditingController();
  final TextEditingController _cookingTimeController = TextEditingController();
  final TextEditingController _caloriesController = TextEditingController();

  final TextEditingController _exerciseNameController = TextEditingController();
  final TextEditingController _equipmentController = TextEditingController();
  final TextEditingController _primaryMusclesController =
      TextEditingController();
  final TextEditingController _secondaryMusclesController =
      TextEditingController();
  final TextEditingController _exerciseInstructionsController =
      TextEditingController();
  String? _selectedDifficulty;

  final AuthService _authService = AuthService();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildAppBar(),
      body: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildMainPostSection(),
                    const SizedBox(height: 16),
                    _buildRecipeSection(),
                    _buildExerciseSection(),
                    const SizedBox(height: 24),
                    _buildBottomButtons(),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // MARK: - App Bar
  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: AppColors.primary),
        onPressed: () => Navigator.pop(context),
        padding: const EdgeInsets.symmetric(horizontal: 8),
      ),
      backgroundColor: Colors.white,
      elevation: 0,
    );
  }

  // MARK: - Header Section
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: AppColors.primary,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.edit_outlined, color: Colors.white),
              SizedBox(width: 8),
              Text(
                'Create a Post',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Share your thoughts, recipes, or exercises\nwith the community',
            style: TextStyle(
              color: Colors.white.withOpacity(0.9),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  // MARK: - Main Post Section
  Widget _buildMainPostSection() {
    return Column(
      children: [
        _buildTextField(
          hintText: 'Give your post a title...',
          fillColor: Colors.grey[50],
          controller: _titleController,
        ),
        const SizedBox(height: 12),
        _buildTextField(
          hintText: 'Add tags (separated by commas)',
          prefixIcon: Icons.tag_outlined,
          fillColor: Colors.grey[50],
          controller: _tagsController,
        ),
        const SizedBox(height: 12),
        _buildTextField(
          hintText: 'Write your post content...',
          maxLines: 5,
          fillColor: Colors.grey[50],
          controller: _contentController,
        ),
      ],
    );
  }

  // MARK: - Recipe Section
  Widget _buildRecipeSection() {
    return ExpansionTile(
      title: const Row(
        children: [
          Icon(Icons.restaurant_menu_outlined,
              color: AppColors.primary, size: 20),
          SizedBox(width: 8),
          Text('Recipe Added', style: TextStyle(color: AppColors.primary)),
        ],
      ),
      initiallyExpanded: isRecipeExpanded,
      onExpansionChanged: (expanded) =>
          setState(() => isRecipeExpanded = expanded),
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildRecipeField(
              'Recipe Name',
              Icons.restaurant_menu_outlined,
              'E.g., Homemade Pizza, Chicken Curry, etc.',
              controller: _recipeNameController,
            ),
            _buildRecipeField(
              'Ingredients',
              Icons.shopping_basket_outlined,
              'List your ingredients here...',
              maxLines: 3,
              controller: _ingredientsController,
            ),
            _buildRecipeField(
              'Cooking Instructions',
              Icons.description_outlined,
              'Write your cooking instructions step by step...',
              maxLines: 4,
              controller: _instructionsController,
            ),
            _buildRecipeField(
              'Cooking Time',
              Icons.access_time,
              'E.g., 30 minutes, 1 hour',
              controller: _cookingTimeController,
            ),
            _buildRecipeField(
              'Calories',
              Icons.local_fire_department_outlined,
              'E.g., 350 kcal per serving',
              controller: _caloriesController,
            ),
          ],
        ),
      ],
    );
  }

  // MARK: - Exercise Section
  Widget _buildExerciseSection() {
    return ExpansionTile(
      title: const Row(
        children: [
          Icon(Icons.fitness_center_outlined,
              color: AppColors.primary, size: 20),
          SizedBox(width: 8),
          Text('Exercise Added', style: TextStyle(color: AppColors.primary)),
        ],
      ),
      initiallyExpanded: isExerciseExpanded,
      onExpansionChanged: (expanded) =>
          setState(() => isExerciseExpanded = expanded),
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildExerciseField(
              'Exercise Name',
              Icons.fitness_center_outlined,
              'E.g., Push-ups, Squats, etc.',
              controller: _exerciseNameController,
            ),
            _buildExerciseLevelField(),
            _buildExerciseField(
              'Required Equipment',
              Icons.handyman_outlined,
              'List required equipment...',
              maxLines: 2,
              controller: _equipmentController,
            ),
            _buildExerciseField(
              'Primary Muscles',
              Icons.accessibility_new,
              'E.g., Chest, Quadriceps',
              controller: _primaryMusclesController,
            ),
            _buildExerciseField(
              'Secondary Muscles',
              Icons.accessibility_new,
              'E.g., Triceps, Hamstrings',
              controller: _secondaryMusclesController,
            ),
            _buildExerciseField(
              'Exercise Instructions',
              Icons.description_outlined,
              'Write detailed exercise instructions...',
              maxLines: 4,
              controller: _exerciseInstructionsController,
            ),
          ],
        ),
      ],
    );
  }

  // MARK: - Bottom Buttons
  Widget _buildBottomButtons() {
    return Row(
      children: [
        Expanded(
          child: _buildActionButton(
            'Upload',
            Icons.image_outlined,
            onPressed: () {
              // TODO: Implement image upload
            },
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildActionButton(
            _isLoading ? 'Creating...' : 'Create',
            Icons.send,
            onPressed: _isLoading ? null : _handleCreatePost,
          ),
        ),
      ],
    );
  }

  // MARK: - Helper Widgets
  Widget _buildRecipeField(
    String label,
    IconData icon,
    String hintText, {
    int maxLines = 1,
    TextEditingController? controller,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel(label, icon),
        _buildTextField(
          hintText: hintText,
          maxLines: maxLines,
          fillColor: Colors.grey[50],
          controller: controller,
        ),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildExerciseField(String label, IconData icon, String hintText,
      {int maxLines = 1, TextEditingController? controller}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel(label, icon),
        _buildTextField(
            hintText: hintText,
            maxLines: maxLines,
            fillColor: Colors.grey[50],
            controller: controller),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildExerciseLevelField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel('Difficulty Level', Icons.bar_chart),
        _buildDropdownField(
            hintText: 'Select Level', fillColor: Colors.grey[50]),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildActionButton(String text, IconData icon,
      {VoidCallback? onPressed}) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, color: Colors.white),
      label: Text(
        text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        padding: const EdgeInsets.symmetric(vertical: 12),
      ),
    );
  }

  Widget _buildLabel(String text, [IconData? icon]) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          if (icon != null) ...[
            Icon(icon, size: 18, color: Colors.grey[700]),
            const SizedBox(width: 8),
          ],
          Text(
            text,
            style: TextStyle(
              color: Colors.grey[700],
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required String hintText,
    IconData? prefixIcon,
    int maxLines = 1,
    Color? fillColor,
    TextEditingController? controller,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: TextField(
        maxLines: maxLines,
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(color: Colors.grey[400], fontSize: 14),
          prefixIcon: prefixIcon != null
              ? Icon(prefixIcon, color: Colors.grey[400], size: 20)
              : null,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(12),
          fillColor: fillColor,
          filled: fillColor != null,
        ),
        controller: controller,
      ),
    );
  }

  Widget _buildDropdownField({
    required String hintText,
    Color? fillColor,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[300]!),
      ),
      child: DropdownButtonFormField<String>(
        value: _selectedDifficulty,
        decoration: InputDecoration(
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 12),
          fillColor: fillColor,
          filled: fillColor != null,
        ),
        hint: Text(hintText,
            style: TextStyle(color: Colors.grey[400], fontSize: 14)),
        items: ['Beginner', 'Intermediate', 'Advanced'].map((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
        onChanged: (value) => setState(() => _selectedDifficulty = value),
      ),
    );
  }

  void _handleCreatePost() {
    setState(() => _isLoading = true);

    // Xử lý tags từ chuỗi thành List
    final List<String> tagsList = _tagsController.text
        .split(',')
        .map((tag) => tag.trim())
        .where((tag) => tag.isNotEmpty)
        .toList();

    // Tạo recipe data nếu có nhập
    Map<String, dynamic>? recipe;
    if (isRecipeExpanded && _recipeNameController.text.isNotEmpty) {
      recipe = {
        'name': _recipeNameController.text,
        'ingredients': _ingredientsController.text,
        'instructions': _instructionsController.text,
        'cookingTime': _cookingTimeController.text,
        'calories': _caloriesController.text,
      };
    }

    // Tạo exercise data nếu có nhập
    Map<String, dynamic>? exercise;
    if (isExerciseExpanded && _exerciseNameController.text.isNotEmpty) {
      exercise = {
        'name': _exerciseNameController.text,
        'difficulty': _selectedDifficulty,
        'equipment': _equipmentController.text,
        'primaryMuscles': _primaryMusclesController.text,
        'secondaryMuscles': _secondaryMusclesController.text,
        'instructions': _exerciseInstructionsController.text,
      };
    }

    _authService
        .createPost(
      title: _titleController.text,
      content: _contentController.text,
      tags: tagsList,
      recipe: recipe,
      exercise: exercise,
    )
        .then((_) {
      setState(() => _isLoading = false);
      Navigator.pop(context);
    }).catchError((error) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.toString())),
      );
    });
  }
}
