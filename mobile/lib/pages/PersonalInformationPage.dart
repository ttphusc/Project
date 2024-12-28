import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import '../services/UserService.dart';

class PersonalInformationPage extends StatefulWidget {
  const PersonalInformationPage({super.key});

  @override
  State<PersonalInformationPage> createState() =>
      _PersonalInformationPageState();
}

class _PersonalInformationPageState extends State<PersonalInformationPage> {
  final UserService _userService = UserService();
  final _formKey = GlobalKey<FormState>();

  String firstname = '';
  String lastname = '';
  String? selectedGender;
  DateTime? dob;
  bool isEditing = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    setState(() => _isLoading = true);
    try {
      final response = await _userService.getUserInfo();
      if (response['success'] && response['user'] != null) {
        final user = response['user'];
        setState(() {
          firstname = user['firstname']?.toString().trim() ?? '';
          lastname = user['lastname']?.toString().trim() ?? '';
          selectedGender = user['gender']?.toString().toLowerCase() ?? '';
          dob = user['dob'] != null
              ? DateTime.parse(user['dob'].toString())
              : null;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading user data: ${e.toString()}')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    firstname = '';
    lastname = '';
    selectedGender = null;
    dob = null;
    super.dispose();
  }

  void _resetForm() {
    setState(() {
      firstname = '';
      lastname = '';
      selectedGender = null;
      dob = null;
      isEditing = false;
    });
    _loadUserData();
  }

  void _handleCancel() {
    _resetForm();
  }

  Future<void> _handleUpdate() async {
    if (!_formKey.currentState!.validate()) return;

    try {
      final response = await _userService.updatePersonalInfo(
        firstname: firstname,
        lastname: lastname,
        gender: selectedGender ?? '',
        dob: dob ?? DateTime.now(),
      );

      if (response['success']) {
        setState(() => isEditing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Thông tin đã được cập nhật')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi: ${e.toString()}')),
      );
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    if (!isEditing) return;

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: dob ?? DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primary,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != dob) {
      setState(() {
        dob = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        if (isEditing) {
          _resetForm();
        }
        return true;
      },
      child: Scaffold(
        backgroundColor: Colors.grey[50],
        appBar: AppBar(
          title: const Text(
            'Personal Information',
            style: TextStyle(
              color: AppColors.primary,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: AppColors.primary),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Stack(
          children: [
            SingleChildScrollView(
              child: Form(
                key: _formKey,
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
                      child: Row(
                        children: [
                          const Icon(Icons.info, color: Colors.blue),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Keep Your Profile Updated',
                                  style: TextStyle(
                                    color: Colors.blue,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Accurate personal information helps us provide you with a better, more personalized experience.',
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
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildInputField(
                            'First Name',
                            Icons.person_outline,
                            initialValue: firstname,
                            onChanged: (value) =>
                                setState(() => firstname = value),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Vui lòng nhập họ';
                              }
                              return null;
                            },
                            enabled: true,
                          ),
                          const SizedBox(height: 16),
                          _buildInputField(
                            'Last Name',
                            Icons.person_outline,
                            initialValue: lastname,
                            onChanged: (value) =>
                                setState(() => lastname = value),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Vui lòng nhập tên';
                              }
                              return null;
                            },
                            enabled: true,
                          ),
                          const SizedBox(height: 16),
                          _buildGenderDropdown(),
                          const SizedBox(height: 16),
                          _buildDateField(),
                          const SizedBox(height: 32),
                          if (isEditing)
                            Row(
                              children: [
                                Expanded(
                                  child: OutlinedButton.icon(
                                    onPressed: _handleCancel,
                                    icon: const Icon(Icons.close,
                                        color: AppColors.primary),
                                    label: const Text(
                                      'Cancel',
                                      style:
                                          TextStyle(color: AppColors.primary),
                                    ),
                                    style: OutlinedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 16),
                                      side: const BorderSide(
                                          color: AppColors.primary),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: ElevatedButton.icon(
                                    onPressed: _handleUpdate,
                                    icon: const Icon(Icons.save,
                                        color: Colors.white),
                                    label: const Text(
                                      'Save Changes',
                                      style: TextStyle(color: Colors.white),
                                    ),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppColors.primary,
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 16),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            )
                          else
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                onPressed: () =>
                                    setState(() => isEditing = true),
                                icon:
                                    const Icon(Icons.edit, color: Colors.white),
                                label: const Text(
                                  'Edit Profile',
                                  style: TextStyle(color: Colors.white),
                                ),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 16),
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
            if (_isLoading)
              Container(
                color: Colors.black.withOpacity(0.3),
                child: const Center(
                  child: CircularProgressIndicator(),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputField(
    String label,
    IconData icon, {
    bool enabled = true,
    String? initialValue,
    String? Function(String?)? validator,
    void Function(String)? onChanged,
  }) {
    final controller = TextEditingController(text: initialValue);

    controller.selection = TextSelection.fromPosition(
      TextPosition(offset: controller.text.length),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          enabled: enabled && isEditing,
          controller: controller,
          onChanged: onChanged,
          validator: validator,
          style: TextStyle(
            fontSize: 16,
            color: isEditing ? Colors.black87 : Colors.black45,
          ),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: AppColors.primary),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey.shade500),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey.shade500),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.primary),
            ),
            filled: true,
            fillColor: Colors.grey.shade50,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            disabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey.shade500),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildGenderDropdown() {
    if (selectedGender != null &&
        !['male', 'female', 'other'].contains(selectedGender)) {
      selectedGender = null;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Gender',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: selectedGender,
          decoration: InputDecoration(
            prefixIcon:
                const Icon(Icons.people_outline, color: AppColors.primary),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.grey),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: isEditing ? AppColors.primary : Colors.grey,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.primary),
            ),
            filled: true,
            fillColor: isEditing ? Colors.white : Colors.grey[50],
          ),
          style: TextStyle(
            color: isEditing ? Colors.black87 : Colors.black54,
            fontSize: 16,
          ),
          items: const [
            DropdownMenuItem(value: 'male', child: Text('Male')),
            DropdownMenuItem(value: 'female', child: Text('Female')),
            DropdownMenuItem(value: 'other', child: Text('Other')),
          ],
          onChanged: isEditing
              ? (value) {
                  setState(() => selectedGender = value);
                }
              : null,
          hint: Text(
            'Select gender',
            style: TextStyle(color: Colors.grey[600]),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please select gender';
            }
            return null;
          },
        ),
      ],
    );
  }

  Widget _buildDateField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Date of Birth',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 8),
        InkWell(
          onTap: isEditing ? () => _selectDate(context) : null,
          child: IgnorePointer(
            child: TextFormField(
              controller: TextEditingController(
                text: dob != null
                    ? "${dob!.day.toString().padLeft(2, '0')}/${dob!.month.toString().padLeft(2, '0')}/${dob!.year}"
                    : '',
              ),
              style: TextStyle(
                fontSize: 16,
                color: isEditing ? Colors.black87 : Colors.black54,
              ),
              decoration: InputDecoration(
                prefixIcon:
                    const Icon(Icons.cake_outlined, color: AppColors.primary),
                suffixIcon: Icon(
                  Icons.calendar_today,
                  color: isEditing ? AppColors.primary : Colors.grey,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: Colors.grey),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(
                    color: isEditing ? AppColors.primary : Colors.grey,
                  ),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: AppColors.primary),
                ),
                filled: true,
                fillColor: isEditing ? Colors.white : Colors.grey[50],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
