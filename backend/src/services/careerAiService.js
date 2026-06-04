const { buildModelInputText } = require('../utils/careerTextBuilder');
const {
  normalizeText,
  normalizeCategoryName,
  getCoreRuleScores,
  getExtendedDomainScores,
  correctCareerPrediction,
  recommendFromText,
} = require('../utils/careerDomainRules');

function collectCvText(cvData = {}) {
  return buildModelInputText(cvData);
}

function recommendFromCvData(cvData = {}) {
  return recommendFromText(collectCvText(cvData));
}

module.exports = {
  normalizeText,
  collectCvText,
  normalizeCategoryName,
  getRuleScores: getCoreRuleScores,
  getCoreRuleScores,
  getExtendedDomainScores,
  correctCareerPrediction,
  recommendFromCvData,
};
