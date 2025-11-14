import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';

const PredictionForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    hypertension: '',
    heart_disease: '',
    ever_married: '',
    work_type: '',
    Residence_type: '',
    avg_glucose_level: '',
    bmi: '',
    smoking_status: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 0 || formData.age > 120) {
      newErrors.age = 'Age must be between 0 and 120';
    }
    if (formData.hypertension === '') newErrors.hypertension = 'Hypertension status is required';
    if (formData.heart_disease === '') newErrors.heart_disease = 'Heart disease status is required';
    if (!formData.ever_married) newErrors.ever_married = 'Marital status is required';
    if (!formData.work_type) newErrors.work_type = 'Work type is required';
    if (!formData.Residence_type) newErrors.Residence_type = 'Residence type is required';
    if (!formData.avg_glucose_level) {
      newErrors.avg_glucose_level = 'Glucose level is required';
    } else if (formData.avg_glucose_level < 0 || formData.avg_glucose_level > 500) {
      newErrors.avg_glucose_level = 'Glucose level must be between 0 and 500';
    }
    if (!formData.bmi) {
      newErrors.bmi = 'BMI is required';
    } else if (formData.bmi < 10 || formData.bmi > 100) {
      newErrors.bmi = 'BMI must be between 10 and 100';
    }
    if (!formData.smoking_status) newErrors.smoking_status = 'Smoking status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToast({ message: 'Please fill all required fields correctly', type: 'error' });
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('/predict', {
        ...formData,
        age: parseFloat(formData.age),
        hypertension: parseInt(formData.hypertension),
        heart_disease: parseInt(formData.heart_disease),
        avg_glucose_level: parseFloat(formData.avg_glucose_level),
        bmi: parseFloat(formData.bmi)
      });

      const predictionData = {
        ...response.data,
        inputData: formData
      };

      const history = JSON.parse(localStorage.getItem('strokeHistory') || '[]');
      history.unshift(predictionData);
      if (history.length > 10) history.pop();
      localStorage.setItem('strokeHistory', JSON.stringify(history));

      navigate('/result', { state: predictionData });
    } catch (error) {
      console.error('Prediction error:', error);
      setToast({ 
        message: error.response?.data?.error || 'Prediction failed. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Stroke Risk Assessment
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please provide accurate information for better prediction
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                    errors.gender ? 'border-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="text-danger text-sm mt-1">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age * <span className="text-gray-500 text-xs">(years)</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 45"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                    errors.age ? 'border-danger' : 'border-gray-300'
                  }`}
                />
                {errors.age && <p className="text-danger text-sm mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hypertension *
                </label>
                <select
                  name="hypertension"
                  value={formData.hypertension}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                    errors.hypertension ? 'border-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
                {errors.hypertension && <p className="text-danger text-sm mt-1">{errors.hypertension}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Heart Disease *
                </label>
                <select
                  name="heart_disease"
                  value={formData.heart_disease}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                    errors.heart_disease ? 'border-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
                {errors.heart_disease && <p className="text-danger text-sm mt-1">{errors.heart_disease}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ever Married *
                </label>
                <select
                  name="ever_married"
                  value={formData.ever_married}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                    errors.ever_married ? 'border-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.ever_married && <p className="text-danger text-sm mt-1">{errors.ever_married}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Type *
                </label>
                <select
                  name="work_type"
                  value={formData.work_type}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                    errors.work_type ? 'border-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Work Type</option>
                  <option value="Private">Private</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Govt_job">Government Job</option>
                  <option value="children">Children</option>
                  <option value="Never_worked">Never Worked</option>
                </select>
                {errors.work_type && <p className="text-danger text-sm mt-1">{errors.work_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Residence Type *
                </label>
                <select
                  name="Residence_type"
                  value={formData.Residence_type}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                    errors.Residence_type ? 'border-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Residence</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
                {errors.Residence_type && <p className="text-danger text-sm mt-1">{errors.Residence_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Average Glucose Level * <span className="text-gray-500 text-xs">(mg/dL)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="avg_glucose_level"
                  value={formData.avg_glucose_level}
                  onChange={handleChange}
                  placeholder="e.g., 120.5"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                    errors.avg_glucose_level ? 'border-danger' : 'border-gray-300'
                  }`}
                />
                {errors.avg_glucose_level && <p className="text-danger text-sm mt-1">{errors.avg_glucose_level}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  BMI * <span className="text-gray-500 text-xs">(kg/m²)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleChange}
                  placeholder="e.g., 25.3"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                    errors.bmi ? 'border-danger' : 'border-gray-300'
                  }`}
                />
                {errors.bmi && <p className="text-danger text-sm mt-1">{errors.bmi}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Smoking Status *
                </label>
                <select
                  name="smoking_status"
                  value={formData.smoking_status}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white ${
                    errors.smoking_status ? 'border-danger' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="never smoked">Never Smoked</option>
                  <option value="formerly smoked">Formerly Smoked</option>
                  <option value="smokes">Smokes</option>
                  <option value="Unknown">Unknown</option>
                </select>
                {errors.smoking_status && <p className="text-danger text-sm mt-1">{errors.smoking_status}</p>}
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner /> : 'Predict Risk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
