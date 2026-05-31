import json
from pathlib import Path
import numpy as np
import tensorflow as tf

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "career_model.keras"
VOCAB_PATH = BASE_DIR / "vocab.json"
LABELS_PATH = BASE_DIR / "labels.json"

LABELS = json.loads(LABELS_PATH.read_text(encoding="utf-8"))

TRAINING_DATA = {
    "Data Science": [
        "python sql data analysis machine learning tensorflow pandas dashboard statistics visualization",
        "data analyst excel sql python business intelligence analytics database postgresql",
        "machine learning ai model training data science numpy pandas visualization dashboard",
        "research data mining statistics python sql predictive analytics",
    ],
    "Software Engineering": [
        "react node express javascript frontend backend rest api fullstack database html css",
        "software engineer programming web application nodejs react api express git deployment",
        "backend developer express postgresql rest api authentication jwt server database",
        "frontend developer react css html vite bootstrap responsive ui api integration",
    ],
    "UI/UX Design": [
        "figma ui ux design prototype wireframe user research visual interface product design",
        "design systems architect figma component library user interface usability prototype",
        "creative technologist ui ux interaction design wireframe user journey research",
        "visual designer photoshop illustrator brand interface layout typography",
    ],
    "Culinary & Hospitality": [
        "chef cooking culinary kitchen food restaurant baking pastry recipe hospitality cuisine",
        "culinary specialist food product developer kitchen restaurant recipe menu hospitality",
        "baking pastry chef cuisine food preparation restaurant operations",
        "hospitality service kitchen cooking food safety chef",
    ],
    "Business & Product": [
        "business management product manager strategy project leadership communication finance operations",
        "business analyst product management market research sales marketing operation project management",
        "project manager leadership planning coordination communication stakeholder business strategy",
        "operations analyst finance business process strategy product roadmap",
    ],
    "Digital Marketing": [
        "digital marketing seo content social media campaign ads analytics brand copywriting",
        "social media specialist content strategist marketing campaign brand seo google ads",
        "marketing analytics content writing seo campaign performance social media",
        "copywriting brand campaign digital ads marketing content strategy",
    ],
}


def tokenize(text: str):
    return [token.strip().lower() for token in text.replace("/", " ").replace("&", " ").replace("-", " ").split() if token.strip()]


def build_vocab():
    vocab = sorted({token for rows in TRAINING_DATA.values() for text in rows for token in tokenize(text)})
    VOCAB_PATH.write_text(json.dumps(vocab, indent=2), encoding="utf-8")
    return vocab


def vectorize(text: str, vocab):
    tokens = set(tokenize(text))
    return np.array([1.0 if word in tokens else 0.0 for word in vocab], dtype=np.float32)


def main():
    vocab = build_vocab()
    x_rows = []
    y_rows = []

    for label_index, label in enumerate(LABELS):
        for text in TRAINING_DATA[label]:
            x_rows.append(vectorize(text, vocab))
            y_rows.append(label_index)

    x = np.stack(x_rows)
    y = tf.keras.utils.to_categorical(y_rows, num_classes=len(LABELS))

    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(len(vocab),)),
        tf.keras.layers.Dense(48, activation="relu"),
        tf.keras.layers.Dropout(0.1),
        tf.keras.layers.Dense(24, activation="relu"),
        tf.keras.layers.Dense(len(LABELS), activation="softmax"),
    ])

    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])
    model.fit(x, y, epochs=120, batch_size=4, verbose=0)
    model.save(MODEL_PATH)

    loss, acc = model.evaluate(x, y, verbose=0)
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Training accuracy: {acc:.2f}")
    print(f"Vocabulary size: {len(vocab)}")


if __name__ == "__main__":
    main()
