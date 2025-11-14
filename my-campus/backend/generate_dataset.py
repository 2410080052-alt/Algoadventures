import pandas as pd
import numpy as np

np.random.seed(42)

n_samples = 5000

data = {
    'gender': np.random.choice(['Male', 'Female'], n_samples),
    'age': np.random.randint(18, 90, n_samples),
    'hypertension': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
    'heart_disease': np.random.choice([0, 1], n_samples, p=[0.90, 0.10]),
    'ever_married': np.random.choice(['Yes', 'No'], n_samples, p=[0.65, 0.35]),
    'work_type': np.random.choice(['Private', 'Self-employed', 'Govt_job', 'children', 'Never_worked'], n_samples),
    'Residence_type': np.random.choice(['Urban', 'Rural'], n_samples),
    'avg_glucose_level': np.random.uniform(55, 270, n_samples),
    'bmi': np.random.uniform(15, 50, n_samples),
    'smoking_status': np.random.choice(['formerly smoked', 'never smoked', 'smokes', 'Unknown'], n_samples)
}

df = pd.DataFrame(data)

stroke_probability = (
    (df['age'] > 60).astype(int) * 0.3 +
    df['hypertension'] * 0.2 +
    df['heart_disease'] * 0.25 +
    (df['avg_glucose_level'] > 200).astype(int) * 0.15 +
    (df['bmi'] > 30).astype(int) * 0.1 +
    (df['smoking_status'] == 'smokes').astype(int) * 0.15
)

stroke_probability = np.clip(stroke_probability, 0, 1)
df['stroke'] = (np.random.random(n_samples) < stroke_probability).astype(int)

missing_indices = np.random.choice(df.index, size=int(0.05 * n_samples), replace=False)
df.loc[missing_indices, 'bmi'] = np.nan

df.to_csv('stroke_dataset.csv', index=False)
print(f"Dataset created with {len(df)} samples")
print(f"Stroke cases: {df['stroke'].sum()} ({df['stroke'].mean()*100:.2f}%)")
print(f"Missing BMI values: {df['bmi'].isna().sum()}")
