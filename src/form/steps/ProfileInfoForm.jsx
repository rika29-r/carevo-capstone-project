import '../form.css';

function ProfileInfoForm({ formData, setFormData, onNext }) {
  const personalInfo = formData?.personalInfo || {};

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,

      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  return (
    <div className="form-card profile-card-custom">
      <div className="card-body">
        <div className="profile-simple-layout">
          <div className="profile-left">
            <div className="profile-photo-wrapper">
              <img src={personalInfo.profileImage || 'https://i.pravatar.cc/300?img=47'} alt="Profile" className="profile-photo" />

              <label htmlFor="profile-upload" className="profile-plus-btn">
                +
              </label>
            </div>

            <input id="profile-upload" type="file" accept="image/png, image/jpeg" onChange={handleImageChange} className="profile-upload-input" />

            <p className="profile-upload-title">Upload Portrait</p>

            <p className="profile-upload-desc">
              High quality JPG or PNG.
              <br />
              Max 5MB.
            </p>
          </div>

          <div className="profile-right">
            <div className="profile-row">
              <div className="field-group">
                <label>Full Name</label>

                <input type="text" placeholder="Anastasia Grey" value={personalInfo.fullName || ''} onChange={(event) => handleChange('fullName', event.target.value)} />
              </div>

              <div className="field-group">
                <label>Professional Title</label>

                <input type="text" placeholder="Data Scientist" value={personalInfo.professionalTitle || ''} onChange={(event) => handleChange('professionalTitle', event.target.value)} />
              </div>
            </div>

            <div className="field-group">
              <label>Location</label>

              <input type="text" placeholder="London, United Kingdom" value={personalInfo.location || ''} onChange={(event) => handleChange('location', event.target.value)} />
            </div>

            <div className="field-group">
              <label>Short Bio</label>

              <textarea placeholder="Write about yourself..." value={personalInfo.shortBio || ''} onChange={(event) => handleChange('shortBio', event.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-bottom-actions">
          <button type="button" className="btn-primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfoForm;
