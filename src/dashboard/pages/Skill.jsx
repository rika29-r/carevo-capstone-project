import SkillForm from '../../form/steps/SkillForm';

function Skill({ formData, setFormData, setActivePage }) {
  return <SkillForm formData={formData} setFormData={setFormData} setActivePage={setActivePage} isEdit />;
}

export default Skill;
