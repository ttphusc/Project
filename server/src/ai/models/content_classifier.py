from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import sys
import os
import numpy as np

# Thêm đường dẫn gốc vào sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config

class ContentClassifier:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base")
        
        # Tải mô hình đã huấn luyện
        self.model = AutoModelForSequenceClassification.from_pretrained(
            "vinai/phobert-base",
            # "./trained_model/phobert-base",
            num_labels=len(Config.VIOLATION_TYPES)
        )
        
        # Chuyển sang chế độ evaluation
        self.model.eval()
    
    def predict(self, text, reason):
        with torch.no_grad():
            # Tiền xử lý dữ liệu đầu vào
            inputs = self.tokenizer(
                text,
                reason,
                padding=True,
                truncation=True,
                max_length=512,
                return_tensors="pt"
            )
            
            # Thêm xử lý device nếu có GPU
            if torch.cuda.is_available():
                inputs = {k: v.cuda() for k, v in inputs.items()}
                self.model = self.model.cuda()
            
            outputs = self.model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=1)
            
            return predictions.cpu().numpy().tolist()
    
    def train(self, train_data, labels):
        self.model.train()
        optimizer = torch.optim.AdamW(self.model.parameters(), lr=2e-5)
        
        for epoch in range(num_epochs):
            for batch, label in zip(train_data, labels):
                optimizer.zero_grad()
                outputs = self.model(**batch)
                loss = outputs.loss
                loss.backward()
                optimizer.step()
    
    def check_content(self, content, reason_report):
        try:
            cleaned_content = self.preprocessor.clean_text(content)
            predictions = self.classifier.predict(cleaned_content, reason_report)
            
            if predictions is None:
                raise ValueError("Không thể thực hiện dự đoán")
            
            violation_score = predictions[0][self._get_violation_index(reason_report)]
            
            return {
                'is_violation': bool(violation_score > Config.THRESHOLD),
                'confidence_score': float(violation_score),
                'reason': str(reason_report),
                'violation_type': str(self._get_violation_type(reason_report))
            }
        except Exception as e:
            print(f"Lỗi kiểm duyệt nội dung: {str(e)}")
            return None