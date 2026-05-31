import "../form.css";

function DateInput({ value, onChange, disabled = false }) {
  return (
    <input
      type="date"
      value={value || ""}
      disabled={disabled}
      onChange={onChange}
    />
  );
}

function ExperienceForm({ formData, setFormData, onNext, onPrevious }) {
  const experience = formData.experience || {
    jobTitle: "",
    companyName: "",
    employmentType: "Full-time",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWork: false,
    description: "",
    skillsUsed: [],
    skillInput: "",
  };

  const updateExperience = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        [field]: value,
      },
    }));
  };

  const addSkill = () => {
    const skillInput = experience.skillInput?.trim();

    if (!skillInput) return;

    updateExperience("skillsUsed", [...(experience.skillsUsed || []), skillInput]);
    updateExperience("skillInput", "");
  };

  const removeSkill = (skillIndex) => {
    updateExperience(
      "skillsUsed",
      (experience.skillsUsed || []).filter((_, index) => index !== skillIndex)
    );
  };

  return (
    <div className="form-card experience-card">
      <div className="card-header">
        <div>
          <h2>Add Current Experience</h2>
          <p className="card-subtitle">
            Add your work, internship, organization, or relevant experience.
          </p>
        </div>
      </div>

      <div className="card-body">
        <div className="input-grid">
          <div className="field-group">
            <label>Job Title</label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer"
              value={experience.jobTitle || ""}
              onChange={(event) =>
                updateExperience("jobTitle", event.target.value)
              }
            />
          </div>

          <div className="field-group">
            <label>Company Name</label>
            <input
              type="text"
              placeholder="e.g. CAREVO Team"
              value={experience.companyName || ""}
              onChange={(event) =>
                updateExperience("companyName", event.target.value)
              }
            />
          </div>

          <div className="field-group">
            <label>Employment Type</label>
            <select
              value={experience.employmentType || "Full-time"}
              onChange={(event) =>
                updateExperience("employmentType", event.target.value)
              }
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Contract">Contract</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Organization">Organization</option>
            </select>
          </div>

          <div className="field-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g. Jakarta, Indonesia"
              value={experience.location || ""}
              onChange={(event) =>
                updateExperience("location", event.target.value)
              }
            />
          </div>

          <div className="field-group">
            <label>Start Date</label>
            <DateInput
              value={experience.startDate || ""}
              onChange={(event) =>
                updateExperience("startDate", event.target.value)
              }
            />
          </div>

          <div className="field-group">
            <label>End Date</label>
            <DateInput
              value={experience.endDate || ""}
              disabled={experience.currentlyWork}
              onChange={(event) =>
                updateExperience("endDate", event.target.value)
              }
            />

            <label className="check-row current-check">
              <input
                type="checkbox"
                checked={Boolean(experience.currentlyWork)}
                onChange={(event) => {
                  updateExperience("currentlyWork", event.target.checked);

                  if (event.target.checked) {
                    updateExperience("endDate", "");
                  }
                }}
              />
              <span>I currently work here</span>
            </label>
          </div>

          <div className="field-group experience-full">
            <label>Description</label>
            <textarea
              placeholder="Describe your responsibilities, achievements, or activities..."
              value={experience.description || ""}
              onChange={(event) =>
                updateExperience("description", event.target.value)
              }
            />
          </div>
        </div>

        <div className="divider" />

        <div className="skill-section">
          <label>Skills Used</label>

          <div className="inline-add-row skill-add-row">
            <input
              type="text"
              placeholder="e.g. React, Communication, Excel"
              value={experience.skillInput || ""}
              onChange={(event) =>
                updateExperience("skillInput", event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill();
                }
              }}
            />

            <button type="button" onClick={addSkill}>
              Add
            </button>
          </div>

          <div className="chips experience-chips">
            {(experience.skillsUsed || []).map((skill, index) => (
              <button
                type="button"
                className="chip"
                key={`${skill}-${index}`}
                onClick={() => removeSkill(index)}
              >
                {skill} ×
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-bottom-actions">
        <button type="button" className="btn-secondary" onClick={onPrevious}>
          Previous
        </button>

        <button type="button" className="btn-primary" onClick={onNext}>
          Next Step
        </button>
      </div>
    </div>
  );
}

export default ExperienceForm;