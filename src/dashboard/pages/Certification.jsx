import CertificationForm from '../../form/steps/CertificationForm';

function Certification({ formData, setFormData, setActivePage }) {
  return <CertificationForm formData={formData} setFormData={setFormData} setActivePage={setActivePage} isEdit />;
}

export default Certification;
