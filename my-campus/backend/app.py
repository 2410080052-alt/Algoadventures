from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import json
import os

app = Flask(__name__)
CORS(app)

model = None
scaler = None
label_encoders = None
model_metrics = None

def load_model():
    global model, scaler, label_encoders, model_metrics
    try:
        model = joblib.load('model.pkl')
        scaler = joblib.load('scaler.pkl')
        label_encoders = joblib.load('label_encoders.pkl')
        
        if os.path.exists('model_metrics.json'):
            with open('model_metrics.json', 'r') as f:
                model_metrics = json.load(f)
        
        print("Model loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/metrics', methods=['GET'])
def get_metrics():
    if model_metrics is None:
        return jsonify({'error': 'Model metrics not available'}), 404
    return jsonify(model_metrics)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        data = request.json
        
        required_fields = [
            'gender', 'age', 'hypertension', 'heart_disease', 
            'ever_married', 'work_type', 'Residence_type', 
            'avg_glucose_level', 'bmi', 'smoking_status'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        try:
            age = float(data['age'])
            avg_glucose_level = float(data['avg_glucose_level'])
            bmi = float(data['bmi'])
            
            if age < 0 or age > 120:
                return jsonify({'error': 'Age must be between 0 and 120'}), 400
            if avg_glucose_level < 0 or avg_glucose_level > 500:
                return jsonify({'error': 'Glucose level must be between 0 and 500'}), 400
            if bmi < 10 or bmi > 100:
                return jsonify({'error': 'BMI must be between 10 and 100'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid numeric values'}), 400
        
        input_data = {
            'gender': data['gender'],
            'age': age,
            'hypertension': int(data['hypertension']),
            'heart_disease': int(data['heart_disease']),
            'ever_married': data['ever_married'],
            'work_type': data['work_type'],
            'Residence_type': data['Residence_type'],
            'avg_glucose_level': avg_glucose_level,
            'bmi': bmi,
            'smoking_status': data['smoking_status']
        }
        
        categorical_columns = ['gender', 'ever_married', 'work_type', 'Residence_type', 'smoking_status']
        for col in categorical_columns:
            try:
                input_data[col] = label_encoders[col].transform([input_data[col]])[0]
            except ValueError:
                return jsonify({'error': f'Invalid value for {col}'}), 400
        
        feature_order = ['gender', 'age', 'hypertension', 'heart_disease', 'ever_married', 
                        'work_type', 'Residence_type', 'avg_glucose_level', 'bmi', 'smoking_status']
        features = np.array([[input_data[col] for col in feature_order]])
        
        features_scaled = scaler.transform(features)
        
        prediction_proba = model.predict_proba(features_scaled)[0]
        stroke_probability = float(prediction_proba[1])
        
        if stroke_probability < 0.3:
            risk_level = 'Low'
            recommendation = 'Your stroke risk is low. Maintain a healthy lifestyle with regular exercise, balanced diet, and routine health check-ups.'
        elif stroke_probability < 0.6:
            risk_level = 'Medium'
            recommendation = 'Your stroke risk is moderate. Please consult with a healthcare provider for a comprehensive evaluation. Focus on managing blood pressure, glucose levels, and maintaining a healthy weight.'
        else:
            risk_level = 'High'
            recommendation = 'Your stroke risk is high. It is strongly recommended to consult with a healthcare provider immediately. Regular monitoring and lifestyle modifications are crucial.'
        
        response = {
            'probability': round(stroke_probability * 100, 2),
            'risk_level': risk_level,
            'recommendation': recommendation,
            'timestamp': pd.Timestamp.now().isoformat()
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/retrain', methods=['POST'])
def retrain():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({'error': 'Only CSV files are supported'}), 400
        
        file.save('new_dataset.csv')
        
        import subprocess
        result = subprocess.run(['python3', 'train_model.py'], capture_output=True, text=True)
        
        if result.returncode == 0:
            load_model()
            return jsonify({
                'message': 'Model retrained successfully',
                'metrics': model_metrics
            })
        else:
            return jsonify({'error': 'Retraining failed', 'details': result.stderr}), 500
    
    except Exception as e:
        return jsonify({'error': f'Retraining failed: {str(e)}'}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    if load_model():
        print("Model loaded successfully!")
    else:
        print("Warning: Model not loaded. Please train the model first.")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
