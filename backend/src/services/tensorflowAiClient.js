const { collectCvText } = require('./careerAiService');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const AI_SERVICE_TIMEOUT_MS = Number(process.env.AI_SERVICE_TIMEOUT_MS || 7000);

function buildPayload(cvData = {}) {
  return {
    text: collectCvText(cvData),
    cvData,
  };
}

async function predictWithTensorFlow(cvData = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AI_SERVICE_TIMEOUT_MS);

  try {
    const response = await fetch(`${AI_SERVICE_URL.replace(/\/$/, '')}/predict-career`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(cvData)),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`TensorFlow service error ${response.status}: ${detail}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  predictWithTensorFlow,
};
