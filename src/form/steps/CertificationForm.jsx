import '../form.css';

function CertificationForm({ formData, setFormData, onNext, onPrevious, isEdit, setActivePage }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,

      certifications: {
        ...prev.certifications,
        [field]: value,
      },
    }));
  };

  return (
    <div className="certification-page">
      <div className="certification-container">
        {/* HEADER */}
        <div className="skill-header">
          <h2>{isEdit ? 'Edit Certifications' : 'Add Certification'}</h2>

          <p>{isEdit ? 'Update your certifications.' : 'Showcase your certifications and achievements.'}</p>
        </div>

        {/* FORM */}
        <div className="input-grid certification-grid">
          <div className="field-group certification-full">
            <label>Certification Name</label>

            <input type="text" placeholder="e.g. AWS Certified Solutions Architect" value={formData.certifications.certificateName} onChange={(event) => handleChange('certificateName', event.target.value)} />
          </div>

          <div className="field-group certification-full">
            <label>Issuing Organization</label>

            <input type="text" placeholder="e.g. Amazon Web Services (AWS)" value={formData.certifications.issuer} onChange={(event) => handleChange('issuer', event.target.value)} />
          </div>

          <div className="field-group">
            <label>Issue Date</label>

            <input type="month" value={formData.certifications.issueDate} onChange={(event) => handleChange('issueDate', event.target.value)} />
          </div>

          <div className="field-group">
            <label>
              Expiration Date <span className="optional-text">(optional)</span>
            </label>

            <input type="month" value={formData.certifications.expirationDate || ''} onChange={(event) => handleChange('expirationDate', event.target.value)} />
          </div>

          <div className="field-group certification-full">
            <label>Credential ID / Verification Link</label>

            <input type="text" placeholder="https://verify.org/id/123456789" value={formData.certifications.credentialId} onChange={(event) => handleChange('credentialId', event.target.value)} />
          </div>
        </div>

        {/* INFO */}
        <div className="certification-info">
          <span>i</span>

          <p>Adding a verified credential link allows employers to instantly confirm your certification status through the CAREVO Trust Network.</p>
        </div>

        {/* BUTTON */}
        <div className="skill-bottom">
          {isEdit ? (
            <>
              <button type="button" className="btn-secondary" onClick={() => setActivePage('skills')}>
                Previous
              </button>

              <button type="button" className="btn-primary" onClick={() => setActivePage('languages')}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn-secondary" onClick={onPrevious}>
                Previous
              </button>

              <button type="button" className="btn-primary" onClick={onNext}>
                Next Step →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CertificationForm;
