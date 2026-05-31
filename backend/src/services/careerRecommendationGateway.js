const { recommendFromCvData } = require('./careerAiService');
const { predictWithTensorFlow } = require('./tensorflowAiClient');

async function getCareerRecommendation(cvData = {}) {
  const useTensorFlow = String(process.env.USE_TENSORFLOW_AI || 'true').toLowerCase() !== 'false';

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
      ...result,
      engine: result.engine || 'tensorflow-fastapi',
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
