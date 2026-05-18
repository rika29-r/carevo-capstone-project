import '../form.css';

function EducationForm({ formData, setFormData, onNext, onPrevious, isEdit }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,

      education: {
        ...prev.education,
        [field]: value,
      },
    }));
  };

  return (
    <div className="form-card education-card">
      <div className="card-header">
        <div>
          <h2>{isEdit ? 'Edit Education' : 'Add Education'}</h2>

          <p>{isEdit ? 'Update your education information.' : 'Fill in your education details accurately.'}</p>
        </div>
      </div>

      <div className="card-body">
        <div className="input-grid">
          <div className="field-group">
            <label>Institution Name</label>

            <input type="text" placeholder="e.g. Stanford University" value={formData.education.institutionName} onChange={(event) => handleChange('institutionName', event.target.value)} />
          </div>

          <div className="field-group">
            <label>Degree / Major</label>

            <input type="text" placeholder="e.g. B.S. in Computer Science" value={formData.education.degreeMajor} onChange={(event) => handleChange('degreeMajor', event.target.value)} />
          </div>

          <div className="field-group">
            <label>Start Date</label>

            <input type="date" value={formData.education.startDate} onChange={(event) => handleChange('startDate', event.target.value)} />
          </div>

          <div className="field-group">
            <label>End Date</label>

            <input type="date" value={formData.education.endDate} disabled={formData.education.currentlyStudy} onChange={(event) => handleChange('endDate', event.target.value)} />

            <label className="check-row education-check">
              <input
                type="checkbox"
                checked={formData.education.currentlyStudy}
                onChange={(event) => {
                  handleChange('currentlyStudy', event.target.checked);

                  if (event.target.checked) {
                    handleChange('endDate', '');
                  }
                }}
              />

              <span>I currently study here</span>
            </label>
          </div>

          <div className="field-group">
            <label>Location</label>

            <input type="text" placeholder="e.g. Depok, Indonesia" value={formData.education.location} onChange={(event) => handleChange('location', event.target.value)} />
          </div>

          <div className="field-group">
            <label>GPA / Grade</label>

            <input type="text" placeholder="e.g. 3.8 / 4.0" value={formData.education.gpa} onChange={(event) => handleChange('gpa', event.target.value)} />
          </div>

          <div className="field-group education-full">
            <label>Description / Achievements</label>

            <textarea placeholder="Mention your honors, key courses, or extracurricular activities..." value={formData.education.description} onChange={(event) => handleChange('description', event.target.value)} />
          </div>
        </div>

        <div className="form-bottom-actions">
          {isEdit ? (
            <button type="button" className="btn-primary">
              Save Changes
            </button>
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

export default EducationForm;
