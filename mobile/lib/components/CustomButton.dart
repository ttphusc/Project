import 'package:flutter/material.dart';
import '../configs/Constants.dart';

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final bool filled;

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    required this.filled,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: AppSizes.buttonHeight,
      child: MaterialButton(
        onPressed: onPressed,
        elevation: filled ? 2 : 0,
        highlightElevation: filled ? 4 : 0,
        color: filled ? AppColors.primary : Colors.white.withOpacity(0.9),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSizes.borderRadius),
          side: filled
              ? BorderSide.none
              : const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              text,
              style: TextStyle(
                color: filled ? Colors.white : AppColors.primary,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            if (!filled) ...[
              const SizedBox(width: 8),
              Container(
                width: 32,
                height: 32,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primary,
                ),
                child: const Icon(
                  Icons.arrow_forward,
                  color: Colors.white,
                  size: 20,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
