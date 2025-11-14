import React from 'react';
import { useNavigate } from 'react-router-dom';

const StrokeHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
              🏥 Stroke Prediction System
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Advanced AI-powered stroke risk assessment
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8 animate-slide-up">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Understanding Stroke Risk Factors
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <span className="text-3xl">🎂</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Age</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Risk increases with age, especially after 55
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-3xl">❤️</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Heart Health</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Hypertension and heart disease are major factors
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-3xl">🍬</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Glucose Levels</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    High blood sugar increases stroke risk
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-3xl">⚖️</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Body Mass Index</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Maintaining healthy weight is crucial
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-3xl">🚭</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Smoking Status</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Smoking significantly increases risk
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-3xl">💼</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Lifestyle</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Work type and activity level matter
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/predict')}
              className="bg-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Prediction →
            </button>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/history')}
                className="text-primary dark:text-blue-400 hover:underline"
              >
                View History
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => navigate('/performance')}
                className="text-primary dark:text-blue-400 hover:underline"
              >
                Model Performance
              </button>
            </div>
          </div>

          <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            <p>⚠️ This tool is for educational purposes only.</p>
            <p>Always consult with healthcare professionals for medical advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrokeHome;
