import 'package:flutter/material.dart';

class AppColors {
  static const primary = Color(0xFF5B6FB1);
  static const white = Colors.white;
  static final primaryLight = primary.withOpacity(0.3);
  static final primaryMedium = primary.withOpacity(0.5);
  static const error = Colors.red;
  static const success = Colors.green;
  static const warning = Color(0xFFFFB020);
}

class AppSizes {
  static const double paddingPage = 24.0;
  static const double borderRadius = 16.0;
  static const double spacing = 16.0;
  static const double spacingLarge = 32.0;
  static const double buttonHeight = 56.0;
  static const double iconSize = 24.0;
  static const double avatarRadius = 20.0;
  static const double cardRadius = 12.0;
}

class AppStrings {
  static const appName = 'FNH';
  static const signIn = 'Sign in';
  static const signUp = 'Sign up';
  static const email = 'Email';
  static const password = 'Password';
  static const forgotPassword = 'Forgot password?';
  static const rememberMe = 'Remember me';
}
