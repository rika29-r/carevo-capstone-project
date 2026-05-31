import "../form.css";

function CertificationForm({
  formData,
  setFormData,
  onNext,
  onPrevious,
  isEdit = false,
  setActivePage,
}) {
  const certifications = formData.certifications || {
    certificateName: "",
    issuer: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    description: "",
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        [field]: value,
      },
    }));
  };

  const handlePreviousClick = () => {
    if (isEdit && setActivePage) {
      setActivePage("skills");
      return;
    }

    onPrevious?.();
  };

  const handleNextClick = () => {
    if (isEdit && setActivePage) {
      setActivePage("languages");
      return;
    }

    onNext?.();
  };

  return (
    <div className="certification-wrapper">
      <div className="form-card certification-card">
        <div className="card-header certification-header-card">
          <div>
            <h2>{isEdit ? "Edit Certification" : "Certifications"}</h2>
            <p className="card-subtitle">
              Add certificates, courses, or achievements that support your CV.
            </p>
          </div>
        </div>

        <div className="card-body">
          <div className="optional-info-box certification-info-box">
            <strong>Optional section</strong>
            <p>
              Certifications are not required. If you do not have one yet, you
              can continue to the next step.
            </p>
          </div>

          <div className="input-grid certification-grid">
            <div className="field-group certification-full">
              <label>Certification Name</label>
              <input
                type="text"
                placeholder="e.g. Google Data Analytics Certificate"
                value={certifications.certificateName || ""}
                onChange={(event) =>
                  handleChange("certificateName", event.target.value)
                }
              />
            </div>

            <div className="field-group certification-full">
              <label>Issuing Organization</label>
              <input
                type="text"
                placeholder="e.g. Google, Coursera, Dicoding, AWS"
                value={certifications.issuer || ""}
                onChange={(event) => handleChange("issuer", event.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Issue Date</label>
              <input
                type="date"
                value={certifications.issueDate || ""}
                onChange={(event) =>
                  handleChange("issueDate", event.target.value)
                }
              />
            </div>

            <div className="field-group">
              <label>
                Expiration Date <span className="optional-text">(optional)</span>
              </label>
              <input
                type="date"
                value={certifications.expirationDate || ""}
                onChange={(event) =>
                  handleChange("expirationDate", event.target.value)
                }
              />
            </div>

            <div className="field-group certification-full">
              <label>Credential ID / Verification Link</label>
              <input
                type="text"
                placeholder="e.g. https://verify.example.com/credential/12345"
                value={certifications.credentialId || ""}
                onChange={(event) =>
                  handleChange("credentialId", event.target.value)
                }
              />
            </div>

            <div className="field-group certification-full">
              <label>Description</label>
              <textarea
                placeholder="Write a short description about what you learned or achieved..."
                value={certifications.description || ""}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="form-bottom-actions certification-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePreviousClick}
          >
            Previous
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={handleNextClick}
          >
            {isEdit ? "Save Changes" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CertificationForm;