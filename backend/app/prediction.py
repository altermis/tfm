import os
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import json

# Ruta al modelo
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'model.keras')
model = load_model(MODEL_PATH)

# Ruta al JSON con el índice-clase
CLASS_INDEX_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'class_indices.json')
with open(CLASS_INDEX_PATH, 'r') as f:
    class_indices = json.load(f)

# Invertir el dict para que: índice → clase
index_to_class = {v: k for k, v in class_indices.items()}

# Umbral mínimo de confianza
CONFIDENCE_THRESHOLD = 0.6

def predict_image(image_file):
    # Preprocesado
    img = Image.open(image_file).resize((128, 128))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predicción
    prediction = model.predict(img_array)[0]  # [0] para extraer el array de predicción
    predicted_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    if confidence < CONFIDENCE_THRESHOLD:
        predicted_class = "Desconocido"
    else:
        predicted_class = index_to_class[predicted_index]

    return {
        "class": predicted_class,
        "confidence": round(confidence, 3)
    }
