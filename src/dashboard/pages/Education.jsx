import EducationForm from '../../form/steps/EducationForm';

function Education({
  formData,
  setFormData,
}) {
  return (
    <EducationForm
      formData={formData}
      setFormData={setFormData}
      isEdit
    />
  );
}

export default Education;