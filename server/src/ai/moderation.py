import json
import sys
import os
from decimal import Decimal

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.content_classifier import ContentClassifier
from utils.text_preprocessing import TextPreprocessor
from config import Config

class ContentModerator:
    def __init__(self):
        self.classifier = ContentClassifier()
        self.preprocessor = TextPreprocessor()
        
    def check_content(self, content, reason_report):
        try:
            # Kiểm tra reason_report có hợp lệ
            if reason_report not in Config.VIOLATION_TYPES.values():
                raise ValueError(f"Invalid reason_report: {reason_report}")
            
            # Làm sạch nội dung
            cleaned_content = self.preprocessor.clean_text(content)
            
            # 1. ML-based check
            predictions = self.classifier.predict(cleaned_content, reason_report)
            ml_score = predictions[0][self._get_violation_index(reason_report)]
            
            # 2. Rule-based check
            violation_type = self._get_violation_type(reason_report)
            keyword_matches = self._check_keywords(cleaned_content.lower(), violation_type)
            
            # 3. Kết hợp cả hai phương pháp
            final_score = self._calculate_final_score(
                ml_score, 
                keyword_matches,
                violation_type
            )
            
            # 4. Xác định vi phạm dựa trên ngưỡng
            is_violation = final_score > Config.THRESHOLD
            
            return {
                'is_violation': is_violation,
                'confidence_score': float(final_score),
                'reason': str(reason_report),
                'violation_type': str(violation_type),
                'detected_keywords': keyword_matches if is_violation else []
            }
            
        except Exception as e:
            print(f"Error in content moderation: {str(e)}")
            return None
            
    def _check_keywords(self, content, violation_type):
        """Kiểm tra từ khóa vi phạm trong nội dung"""
        if violation_type not in Config.VIOLATION_KEYWORDS:
            return []
            
        matched_keywords = [
            keyword for keyword in Config.VIOLATION_KEYWORDS[violation_type]
            if keyword in content
        ]
        return matched_keywords
        
    def _calculate_final_score(self, ml_score, keyword_matches, violation_type):
        """Tính điểm vi phạm cuối cùng dựa trên ML và keywords"""
        # Base score từ ML
        final_score = ml_score
        
        # Tăng điểm mạnh hơn khi phát hiện từ khóa nguy hiểm
        if keyword_matches:
            # Tăng từ 0.4 thay vì 0.3
            keyword_score = min(0.4 * len(keyword_matches), 0.95)
            final_score = max(final_score, keyword_score)
        
        # Tăng hệ số severity cho dangerous
        severity_multiplier = Config.VIOLATION_SEVERITY.get(violation_type, 1.0)
        if violation_type == "dangerous":
            severity_multiplier *= 1.2  # Tăng thêm 20% cho dangerous
            
        final_score *= severity_multiplier
        return min(final_score, 1.0)
    
    def _get_violation_index(self, reason):
        return list(Config.VIOLATION_TYPES.values()).index(reason)
    
    def _get_violation_type(self, reason):
        return next(
            (k for k, v in Config.VIOLATION_TYPES.items() if v == reason),
            None
        )

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        moderator = ContentModerator()
        result = moderator.check_content(
            input_data['content'],
            input_data['reason_report']
        )
        print(json.dumps(result, default=str))
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
