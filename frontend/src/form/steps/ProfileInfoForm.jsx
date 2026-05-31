import "../form.css";

function ProfileInfoForm({
  formData,
  setFormData,
  profileImage,
  setProfileImage,
  onNext,
}) {
  const personalInfo = formData.personalInfo || {
    fullName: "",
    careerInterest: "",
    location: "",
    shortBio: "",
    profileImage: "",
    profileImageName: "",
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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maksimal 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageDataUrl = reader.result;

      setProfileImage(imageDataUrl);

      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          profileImage: imageDataUrl,
          profileImageName: file.name,
        },
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-info-wrapper">
      <div className="form-card profile-card-custom">
        <div className="card-header profile-info-header">
          <div>
            <h2>Profile Information</h2>
            <p className="card-subtitle">
              Add your basic profile information and career interest.
            </p>
          </div>
        </div>

        <div className="card-body">
          <div className="profile-simple-layout">
            <div className="profile-left">
              <div className="profile-photo-wrapper">
                <img
                  src={
                    profileImage ||
                    personalInfo.profileImage ||
                    "https://i.pravatar.cc/300?img=47"
                  }
                  alt="Profile"
                  className="profile-photo"
                />

                <label htmlFor="profile-upload" className="profile-plus-btn">
                  +
                </label>
              </div>

              <input
                id="profile-upload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
                className="profile-upload-input"
              />

              <p className="profile-upload-title">Upload Portrait</p>
              <p className="profile-upload-desc">
                High quality JPG or PNG. Max 5MB.
              </p>

              {personalInfo.profileImageName && (
                <span className="profile-file-name">
                  {personalInfo.profileImageName}
                </span>
              )}
            </div>

            <div className="profile-right">
              <div className="profile-row">
                <div className="field-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Anastasia Grey"
                    value={personalInfo.fullName || ""}
                    onChange={(event) =>
                      handleChange("fullName", event.target.value)
                    }
                  />
                </div>

                <div className="field-group">
                  <label>Career Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Data Analyst, Frontend Developer, UI/UX Designer"
                    value={personalInfo.careerInterest || ""}
                    onChange={(event) =>
                      handleChange("careerInterest", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="London, United Kingdom"
                  value={personalInfo.location || ""}
                  onChange={(event) =>
                    handleChange("location", event.target.value)
                  }
                />
              </div>

              <div className="field-group">
                <label>Short Bio</label>
                <textarea
                  placeholder="Write about yourself, your interests, or career goals..."
                  value={personalInfo.shortBio || ""}
                  onChange={(event) =>
                    handleChange("shortBio", event.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-bottom-actions profile-actions">
          <span />

          <button type="button" className="btn-primary" onClick={onNext}>
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfoForm;