import '../../form/form.css';

function PersonalInfo({ formData, setFormData }) {
  const personalInfo = formData?.personalInfo || {};

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,

      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,

        personalInfo: {
          ...prev.personalInfo,
          profileImage: imageUrl,
        },
      }));
    }
  };

  return (
    <div className="form-card profile-card-custom">
      <div className="card-header">
        <div>
          <h2>Edit Personal Info</h2>

          <p>Update your personal information.</p>
        </div>
      </div>

      <div className="card-body">
        <div className="profile-simple-layout">
          {/* LEFT */}
          <div className="profile-left">
            <div className="profile-photo-wrapper">
              <div className="profile-placeholder">👤</div>

              <label htmlFor="profile-upload" className="profile-plus-btn">
                +
              </label>
            </div>

            <input id="profile-upload" type="file" accept="image/png, image/jpeg" onChange={handleImageChange} className="profile-upload-input" />

            <p className="profile-upload-title">Upload Portrait</p>
          </div>

          {/* RIGHT */}
          <div className="profile-right">
            <div className="profile-row">
              <div className="field-group">
                <label>Full Name</label>

                <input type="text" value={personalInfo.fullName || ''} onChange={(event) => handleChange('fullName', event.target.value)} />
              </div>

              <div className="field-group">
                <label>Professional Title</label>

                <input type="text" value={personalInfo.professionalTitle || ''} onChange={(event) => handleChange('professionalTitle', event.target.value)} />
              </div>
            </div>

            <div className="field-group">
              <label>Location</label>

              <input type="text" value={personalInfo.location || ''} onChange={(event) => handleChange('location', event.target.value)} />
            </div>

            <div className="field-group">
              <label>Short Bio</label>

              <textarea value={personalInfo.shortBio || ''} onChange={(event) => handleChange('shortBio', event.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-bottom-actions">
          <button type="button" className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
