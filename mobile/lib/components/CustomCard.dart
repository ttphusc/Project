import 'package:flutter/material.dart';
import '../configs/Constants.dart';

class CustomCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final Color? backgroundColor;
  final double? elevation;
  final double? width;
  final double? height;
  final VoidCallback? onTap;
  final BorderRadius? borderRadius;

  const CustomCard({
    super.key,
    required this.child,
    this.padding,
    this.backgroundColor,
    this.elevation,
    this.width,
    this.height,
    this.onTap,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    Widget card = Container(
      width: width,
      height: height,
      padding: padding ?? const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: backgroundColor ?? Colors.white,
        borderRadius:
            borderRadius ?? BorderRadius.circular(AppSizes.cardRadius),
        boxShadow: [
          if (elevation != null)
            BoxShadow(
              color: Colors.grey.withOpacity(0.08),
              spreadRadius: elevation! * 0.5,
              blurRadius: elevation! * 2,
              offset: Offset(0, elevation! * 0.5),
            ),
        ],
      ),
      child: child,
    );

    return onTap != null
        ? InkWell(
            onTap: onTap,
            borderRadius:
                borderRadius ?? BorderRadius.circular(AppSizes.cardRadius),
            child: card,
          )
        : card;
  }
}
