import 'package:flutter/material.dart';
import '../configs/Constants.dart';
import '../services/UserService.dart';

class EmailSettingsPage extends StatefulWidget {
  const EmailSettingsPage({super.key});

  @override
  State<EmailSettingsPage> createState() => _EmailSettingsPageState();
}

class _EmailSettingsPageState extends State<EmailSettingsPage> {
  final UserService _userService = UserService();
  final _formKey = GlobalKey<FormState>();

  TextEditingController? _primaryEmailController;
  TextEditingController? _backupEmailController;

  String primaryEmail = '';
  String backupEmail = '';
  bool isEditing = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _primaryEmailController = TextEditingController();
    _backupEmailController = TextEditingController();
    _loadUserData();
  }

  @override
  void dispose() {
    _primaryEmailController?.dispose();
    _backupEmailController?.dispose();
    super.dispose();
  }

  Future<void> _loadUserData() async {
    setState(() => _isLoading = true);
    try {
      final response = await _userService.getUserInfo();
      if (response['success'] && response['user'] != null) {
        final user = response['user'];
        setState(() {
          primaryEmail = user['email']?.toString() ?? '';
          backupEmail = user['backupEmail']?.toString() ?? '';
          _primaryEmailController?.text = primaryEmail;
          _backupEmailController?.text = backupEmail;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error loading user data: ${e.toString()}'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _handleCancel() {
    setState(() {
      _primaryEmailController?.text = primaryEmail;
      _backupEmailController?.text = backupEmail;
      isEditing = false;
    });
  }

  Future<void> _handleUpdate() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      final response = await _userService.updateEmail(
        primaryEmail: _primaryEmailController?.text.trim() ?? '',
        backupEmail: _backupEmailController?.text.trim(),
      );

      if (mounted) {
        if (response['success']) {
          setState(() {
            primaryEmail = _primaryEmailController?.text.trim() ?? '';
            backupEmail = _backupEmailController?.text.trim() ?? '';
            isEditing = false;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(response['message'] ?? 'Email đã được cập nhật'),
              backgroundColor: Colors.green,
              behavior: SnackBarBehavior.floating,
              duration: const Duration(seconds: 2),
            ),
          );

          // Reload user data after successful update
          _loadUserData();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(response['message'] ?? 'Cập nhật email thất bại'),
              backgroundColor: Colors.red,
              behavior: SnackBarBehavior.floating,
              duration: const Duration(seconds: 3),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        String errorMessage = e.toString().replaceAll('Exception: ', '');
        print('Error updating email: $errorMessage');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorMessage),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Widget _buildEmailField(
    String label,
    TextEditingController? controller,
    bool isPrimary,
    IconData icon,
  ) {
    if (controller == null) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: AppColors.primary, size: 20),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Stack(
          children: [
            TextFormField(
              enabled: isEditing,
              controller: controller,
              textDirection: TextDirection.ltr,
              textAlign: TextAlign.left,
              style: TextStyle(
                fontSize: 16,
                color: isEditing ? Colors.black87 : Colors.black45,
              ),
              decoration: InputDecoration(
                prefixIcon:
                    const Icon(Icons.email_outlined, color: AppColors.primary),
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
                hintText: isPrimary
                    ? 'Enter primary email'
                    : 'Add a backup email address',
                hintTextDirection: TextDirection.ltr,
                alignLabelWithHint: true,
              ),
              validator: (value) {
                if (isPrimary && (value == null || value.isEmpty)) {
                  return 'Primary email is required';
                }
                if (value != null && value.isNotEmpty) {
                  final emailRegex =
                      RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                  if (!emailRegex.hasMatch(value)) {
                    return 'Invalid email format';
                  }
                }
                return null;
              },
              textInputAction: TextInputAction.next,
              keyboardType: TextInputType.emailAddress,
            ),
            if (isPrimary && !isEditing)
              Positioned(
                right: 12,
                top: 12,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green[50],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'Primary',
                    style: TextStyle(
                      color: Colors.green[800],
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'Email Settings',
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
                        Icon(Icons.shield_outlined, color: Colors.blue[600]),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Security Notice',
                                style: TextStyle(
                                  color: Colors.blue[800],
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Your backup email will receive notifications related to account security and can be used to reset your password.',
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
                        _buildEmailField(
                          'Primary Email',
                          _primaryEmailController,
                          true,
                          Icons.email_outlined,
                        ),
                        const SizedBox(height: 24),
                        _buildEmailField(
                          'Backup Email',
                          _backupEmailController,
                          false,
                          Icons.add_circle_outline,
                        ),
                        const SizedBox(height: 32),
                        if (!isEditing)
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: () => setState(() => isEditing = true),
                              icon: const Icon(Icons.email_outlined,
                                  color: Colors.white),
                              label: const Text(
                                'Edit Emails',
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
                          )
                        else
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: _handleCancel,
                                  icon: const Icon(Icons.close,
                                      color: AppColors.primary),
                                  label: const Text(
                                    'Cancel',
                                    style: TextStyle(color: AppColors.primary),
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
              color: Colors.black.withOpacity(0.1),
              child: const Center(
                child: CircularProgressIndicator(),
              ),
            ),
        ],
      ),
    );
  }
}
