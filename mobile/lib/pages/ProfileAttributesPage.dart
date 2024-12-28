import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import '../services/UserService.dart';

class ProfileAttributesPage extends StatefulWidget {
  const ProfileAttributesPage({super.key});

  @override
  State<ProfileAttributesPage> createState() => _ProfileAttributesPageState();
}

class _ProfileAttributesPageState extends State<ProfileAttributesPage> {
  final UserService _userService = UserService();
  final _formKey = GlobalKey<FormState>();

  String? activityLevel;
  String? dietaryPreferences;
  String? healthCondition;
  String? stressLevel;
  String? fitnessExperience;
  String? fitnessGoal;
  String? exercisePreferences;

  double? height;
  double? weight;
  int? sleepHours;

  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAttributes();
  }

  Future<void> _loadAttributes() async {
    setState(() => _isLoading = true);
    try {
      final response = await _userService.getAttributes();

      if (response['success'] && response['attributes'] != null) {
        final attributes = response['attributes'];
        setState(() {
          // Convert numeric values safely
          height = (attributes['height'] is int)
              ? (attributes['height'] as int).toDouble()
              : attributes['height']?.toDouble();

          weight = (attributes['weight'] is int)
              ? (attributes['weight'] as int).toDouble()
              : attributes['weight']?.toDouble();

          sleepHours = attributes['sleepHours'];

          // Handle string values
          activityLevel = attributes['activityLevel']?.toString();
          dietaryPreferences = attributes['dietaryPreferences']?.toString();
          healthCondition = attributes['heathCondition']?.toString();
          stressLevel = attributes['stressLevel']?.toString();
          fitnessExperience = attributes['fitnessExperience']?.toString();
          fitnessGoal = attributes['fitnessGoal']?.toString();
          exercisePreferences = attributes['exercisePreferences']?.toString();
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi tải dữ liệu: ${e.toString()}'),
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

  Future<void> _handleUpdate() async {
    if (!_formKey.currentState!.validate()) return;

    // Validate required fields
    if (height == null || weight == null || sleepHours == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Vui lòng điền đầy đủ thông tin'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    try {
      final response = await _userService.updateAttributes(
        height: height!,
        weight: weight!,
        sleepHours: sleepHours!,
        activityLevel: activityLevel ?? 'Moderately Active',
        dietaryPreferences: dietaryPreferences ?? 'None',
        healthCondition: healthCondition ?? 'None',
        stressLevel: stressLevel ?? 'Medium',
        fitnessExperience: fitnessExperience ?? 'Beginner',
        fitnessGoal: fitnessGoal ?? 'Maintenance',
        exercisePreferences: exercisePreferences ?? 'Mixed',
      );

      if (mounted) {
        if (response['success']) {
          final attributes = response['attributes'];
          if (attributes != null) {
            setState(() {
              height = (attributes['height'] is int)
                  ? (attributes['height'] as int).toDouble()
                  : attributes['height']?.toDouble();
              weight = (attributes['weight'] is int)
                  ? (attributes['weight'] as int).toDouble()
                  : attributes['weight']?.toDouble();
              sleepHours = attributes['sleepHours'];
              activityLevel = attributes['activityLevel']?.toString();
              dietaryPreferences = attributes['dietaryPreferences']?.toString();
              healthCondition = attributes['heathCondition']?.toString();
              stressLevel = attributes['stressLevel']?.toString();
              fitnessExperience = attributes['fitnessExperience']?.toString();
              fitnessGoal = attributes['fitnessGoal']?.toString();
              exercisePreferences =
                  attributes['exercisePreferences']?.toString();
            });
          }

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Thuộc tính đã được cập nhật'),
              backgroundColor: Colors.green,
            ),
          );
        } else {
          throw Exception(response['message'] ?? 'Cập nhật thất bại');
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Lỗi: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
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

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'Personal Attributes',
          style: TextStyle(color: AppColors.primary),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.primary),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                border: Border.all(color: Colors.blue[100]!),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.info, color: Colors.blue),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Health & Fitness Details',
                              style: TextStyle(
                                color: Colors.blue,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Help us personalize your experience by providing your health and fitness details',
                              style: TextStyle(
                                color: Colors.blue[700],
                                fontSize: 14,
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
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        _buildNumberField(
                          'Height (cm)',
                          Icons.height,
                          height?.toString(),
                          (value) =>
                              setState(() => height = double.tryParse(value)),
                          (value) {
                            if (value == null || value.isEmpty) {
                              return 'Vui lòng nhập chiều cao';
                            }
                            final number = double.tryParse(value);
                            if (number == null || number <= 0) {
                              return 'Chiều cao không hợp lệ';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        _buildNumberField(
                          'Weight (kg)',
                          Icons.monitor_weight_outlined,
                          weight?.toString(),
                          (value) =>
                              setState(() => weight = double.tryParse(value)),
                          (value) {
                            if (value == null || value.isEmpty) {
                              return 'Vui lòng nhập cân nặng';
                            }
                            final number = double.tryParse(value);
                            if (number == null || number <= 0) {
                              return 'Cân nặng không hợp lệ';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        _buildNumberField(
                          'Sleep Hours',
                          Icons.bedtime_outlined,
                          sleepHours?.toString(),
                          (value) =>
                              setState(() => sleepHours = int.tryParse(value)),
                          (value) {
                            if (value == null || value.isEmpty) {
                              return 'Vui lòng nhập số giờ ngủ';
                            }
                            final number = int.tryParse(value);
                            if (number == null || number < 0 || number > 24) {
                              return 'Số giờ ngủ không hợp lệ';
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildDropdown(
                          'Activity Level',
                          Icons.directions_run,
                          activityLevel,
                          [
                            'Select level',
                            'Sedentary',
                            'Lightly Active',
                            'Moderately Active',
                            'Very Active',
                            'Super Active'
                          ],
                          (value) => setState(() => activityLevel = value),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _buildDropdown(
                          'Dietary Preferences',
                          Icons.restaurant_menu,
                          dietaryPreferences,
                          [
                            'None',
                            'Vegetarian',
                            'Vegan',
                            'Keto',
                            'Paleo',
                            'Mediterranean'
                          ],
                          (value) => setState(() => dietaryPreferences = value),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildDropdown(
                          'Health Condition',
                          Icons.favorite_outline,
                          healthCondition,
                          [
                            'None',
                            'Hypertension',
                            'Diabetes',
                            'Heart Disease',
                            'Asthma',
                            'Other'
                          ],
                          (value) => setState(() => healthCondition = value),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _buildDropdown(
                          'Stress Level',
                          Icons.mood,
                          stressLevel,
                          ['Low', 'Medium', 'High'],
                          (value) => setState(() => stressLevel = value),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildDropdown(
                          'Fitness Experience',
                          Icons.fitness_center,
                          fitnessExperience,
                          ['Beginner', 'Intermediate', 'Advanced'],
                          (value) => setState(() => fitnessExperience = value),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _buildDropdown(
                          'Fitness Goal',
                          Icons.track_changes,
                          fitnessGoal,
                          [
                            'Weight Loss',
                            'Muscle Gain',
                            'Maintenance',
                            'Endurance'
                          ],
                          (value) => setState(() => fitnessGoal = value),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildDropdown(
                    'Exercise Preferences',
                    Icons.sports_gymnastics,
                    exercisePreferences,
                    ['Cardio', 'Strength Training', 'Yoga', 'Mixed'],
                    (value) => setState(() => exercisePreferences = value),
                  ),
                  const SizedBox(height: 32),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => Navigator.pop(context),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            side: const BorderSide(color: AppColors.primary),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'Cancel',
                            style: TextStyle(color: AppColors.primary),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _handleUpdate,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'Save Changes',
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNumberField(
    String label,
    IconData icon,
    String? value,
    void Function(String) onChanged,
    String? Function(String?)? validator,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 18, color: AppColors.primary),
            const SizedBox(width: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        TextFormField(
          initialValue: value?.toString() ?? '',
          keyboardType: TextInputType.number,
          validator: validator,
          onChanged: onChanged,
          decoration: InputDecoration(
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 12,
              vertical: 8,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.grey),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.grey),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.primary),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDropdown(
    String label,
    IconData icon,
    String? value,
    List<String> items,
    void Function(String?) onChanged,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 18, color: AppColors.primary),
            const SizedBox(width: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: value,
          decoration: InputDecoration(
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 12,
              vertical: 8,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.grey),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.grey),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.primary),
            ),
          ),
          items: items
              .map((item) => DropdownMenuItem(
                    value: item,
                    child: Text(item),
                  ))
              .toList(),
          onChanged: onChanged,
        ),
      ],
    );
  }
}
