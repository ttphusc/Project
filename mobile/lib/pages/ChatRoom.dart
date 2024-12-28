// import 'package:flutter/material.dart';

// class ChatMessage {
//   final String text;
//   final String time;
//   final bool isMe;
//   final String? image;

//   ChatMessage({
//     required this.text,
//     required this.time,
//     required this.isMe,
//     this.image,
//   });
// }

// class ChatDetailPage extends StatelessWidget {
//   final String name;
//   final String avatar;
//   final bool isOnline;

//   const ChatDetailPage({
//     super.key,
//     required this.name,
//     required this.avatar,
//     this.isOnline = false,
//   });

//   @override
//   Widget build(BuildContext context) {
//     print('ChatDetailPage built with name: $name');
//     final List<ChatMessage> messages = [
//       ChatMessage(
//         text: 'Hi',
//         time: '13:29:18',
//         isMe: false,
//       ),
//       ChatMessage(
//         text: 'Hello',
//         time: '15:01:08',
//         isMe: true,
//       ),
//       ChatMessage(
//         text: 'How can I help you?',
//         time: '15:06:57',
//         isMe: true,
//       ),
//       ChatMessage(
//         text: 'The medicine I bought',
//         time: '15:08:22',
//         isMe: false,
//         image: 'assets/images/medicine.jpg',
//       ),
//     ];

//     return Scaffold(
//       backgroundColor: Colors.white,
//       appBar: AppBar(
//         backgroundColor: Colors.white,
//         elevation: 0,
//         leading: IconButton(
//           icon: const Icon(Icons.arrow_back, color: Colors.black87),
//           onPressed: () => Navigator.pop(context),
//         ),
//         title: Row(
//           children: [
//             CircleAvatar(
//               radius: 20,
//               backgroundImage: AssetImage(avatar),
//             ),
//             const SizedBox(width: 12),
//             Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   name,
//                   style: const TextStyle(
//                     color: Colors.black87,
//                     fontSize: 16,
//                     fontWeight: FontWeight.w600,
//                   ),
//                 ),
//                 if (isOnline)
//                   const Text(
//                     'Online',
//                     style: TextStyle(
//                       color: Colors.green,
//                       fontSize: 12,
//                     ),
//                   ),
//               ],
//             ),
//           ],
//         ),
//         actions: [
//           IconButton(
//             icon: const Icon(Icons.more_vert, color: Colors.black87),
//             onPressed: () {},
//           ),
//         ],
//       ),
//       body: Column(
//         children: [
//           Expanded(
//             child: ListView.builder(
//               padding: const EdgeInsets.all(16),
//               itemCount: messages.length,
//               itemBuilder: (context, index) {
//                 final message = messages[index];
//                 return Padding(
//                   padding: const EdgeInsets.only(bottom: 16),
//                   child: Row(
//                     mainAxisAlignment: message.isMe
//                         ? MainAxisAlignment.end
//                         : MainAxisAlignment.start,
//                     crossAxisAlignment: CrossAxisAlignment.end,
//                     children: [
//                       if (!message.isMe) ...[
//                         CircleAvatar(
//                           radius: 16,
//                           backgroundImage: AssetImage(avatar),
//                         ),
//                         const SizedBox(width: 8),
//                       ],
//                       Column(
//                         crossAxisAlignment: message.isMe
//                             ? CrossAxisAlignment.end
//                             : CrossAxisAlignment.start,
//                         children: [
//                           Container(
//                             constraints: BoxConstraints(
//                               maxWidth: MediaQuery.of(context).size.width * 0.7,
//                             ),
//                             padding: const EdgeInsets.all(12),
//                             decoration: BoxDecoration(
//                               color: message.isMe
//                                   ? const Color(0xFFE3F2FD)
//                                   : Colors.grey[200],
//                               borderRadius: BorderRadius.circular(16),
//                             ),
//                             child: Column(
//                               crossAxisAlignment: CrossAxisAlignment.start,
//                               children: [
//                                 Text(
//                                   message.text,
//                                   style: const TextStyle(
//                                     fontSize: 16,
//                                     color: Colors.black87,
//                                   ),
//                                 ),
//                                 if (message.image != null) ...[
//                                   const SizedBox(height: 8),
//                                   ClipRRect(
//                                     borderRadius: BorderRadius.circular(12),
//                                     child: Image.asset(
//                                       message.image!,
//                                       width: 200,
//                                       fit: BoxFit.cover,
//                                     ),
//                                   ),
//                                 ],
//                               ],
//                             ),
//                           ),
//                           const SizedBox(height: 4),
//                           Text(
//                             message.time,
//                             style: TextStyle(
//                               fontSize: 12,
//                               color: Colors.grey[600],
//                             ),
//                           ),
//                         ],
//                       ),
//                       if (message.isMe) ...[
//                         const SizedBox(width: 8),
//                         Container(
//                           width: 32,
//                           height: 32,
//                           decoration: BoxDecoration(
//                             color: Colors.red,
//                             borderRadius: BorderRadius.circular(16),
//                           ),
//                           child: Center(
//                             child: Image.asset(
//                               'assets/images/vietnam_flag.png',
//                               width: 20,
//                               height: 20,
//                             ),
//                           ),
//                         ),
//                       ],
//                     ],
//                   ),
//                 );
//               },
//             ),
//           ),
//           Container(
//             padding: const EdgeInsets.all(16),
//             decoration: BoxDecoration(
//               color: Colors.white,
//               border: Border(
//                 top: BorderSide(color: Colors.grey[200]!),
//               ),
//             ),
//             child: Row(
//               children: [
//                 IconButton(
//                   icon: const Icon(Icons.image, color: Colors.blue),
//                   onPressed: () {},
//                 ),
//                 Expanded(
//                   child: Container(
//                     padding: const EdgeInsets.symmetric(horizontal: 16),
//                     decoration: BoxDecoration(
//                       color: Colors.grey[100],
//                       borderRadius: BorderRadius.circular(24),
//                     ),
//                     child: const TextField(
//                       decoration: InputDecoration(
//                         hintText: 'Enter your message...',
//                         border: InputBorder.none,
//                         hintStyle: TextStyle(color: Colors.grey),
//                       ),
//                     ),
//                   ),
//                 ),
//                 IconButton(
//                   icon: const Icon(Icons.send, color: Colors.blue),
//                   onPressed: () {},
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
