import 'package:flutter/material.dart';
import '../pages/HomePage.dart';
import '../pages/Messages.dart';
import '../pages/PersonalProfile.dart';
import '../pages/CreatePost.dart';
import '../pages/CreateQuestion.dart';
import '../pages/CreateEvent.dart';

class AppRoutes {
  static const String home = '/';
  static const String signIn = '/sign-in';
  static const String signUp = '/sign-up';
  static const String profile = '/profile';
  static const String messages = '/messages';
  static const String createPost = '/create-post';
  static const String createQuestion = '/create-question';
  static const String createEvent = '/create-event';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      // case signIn:
      //   return MaterialPageRoute(builder: (_) => const LoginPage());
      // case signUp:
      //   return MaterialPageRoute(builder: (_) => const RegisterPage());
      case home:
        return MaterialPageRoute(builder: (_) => const HomePage());
      case profile:
        return MaterialPageRoute(builder: (_) => const ProfilePage());
      case messages:
        return MaterialPageRoute(builder: (_) => const MessagesPage());
      case createPost:
        return MaterialPageRoute(builder: (_) => const CreatePostPage());
      case createQuestion:
        return MaterialPageRoute(builder: (_) => const CreateQuestionPage());
      case createEvent:
        return MaterialPageRoute(builder: (_) => const CreateEventPage());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
