const { recommendFromCvData, collectCvText, correctCareerPrediction } = require('./careerAiService');
const { predictWithTensorFlow } = require('./tensorflowAiClient');

async function getCareerRecommendation(cvData = {}) {
  const useTensorFlow = String(process.env.USE_TENSORFLOW_AI || 'true').toLowerCase() !== 'false';
  const inputText = collectCvText(cvData);

  if (!useTensorFlow) {
    return {
      ...recommendFromCvData(cvData),
      engine: 'node-keyword-fallback',
      fromTensorFlow: false,
    };
  }

  try {
    const result = await predictWithTensorFlow(cvData);
    return {
      ...correctCareerPrediction(inputText, result),
      engine: result.engine || 'tensorflow-fastapi-with-backend-correction',
      fromTensorFlow: true,
    };
  } catch (err) {
    const fallback = recommendFromCvData(cvData);
    return {
      ...fallback,
      engine: 'node-keyword-fallback',
      fromTensorFlow: false,
      tensorflowWarning: err.message || 'TensorFlow AI service tidak aktif, memakai fallback backend.',
    };
  }
}

module.exports = {
  getCareerRecommendation,
};
