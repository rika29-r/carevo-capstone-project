function DateInput({ value, onChange, disabled = false }) {
  const openPicker = (event) => {
    if (disabled) return;
    event.currentTarget.showPicker?.();
  };

  return (
    <input
      type="date"
      value={value}
      disabled={disabled}
      onClick={openPicker}
      onFocus={openPicker}
      onKeyDown={(event) => event.preventDefault()}
      onChange={onChange}
    />
  );
}

function ExperienceForm({ formData, setFormData, onNext, onPrevious }) {
  const experience = formData.experience;

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

    updateExperience("skillsUsed", [...experience.skillsUsed, skillInput]);
    updateExperience("skillInput", "");
  };

  const removeSkill = (skillIndex) => {
    updateExperience(
      "skillsUsed",
      experience.skillsUsed.filter((_, index) => index !== skillIndex)
    );
  };

  return (
    <div className="form-card experience-card">
      <div className="card-header">
        <h2>Add Current Experience</h2>
      </div>

      <div className="card-body">
        <div className="input-grid">
          <div className="field-group">
            <label>Job Title</label>
            <input
              type="text"
              placeholder="e.g. Senior UX Designer"
              value={experience.jobTitle}
              onChange={(event) =>
                updateExperience("jobTitle", event.target.value)
              }
            />
          </div>

          <div className="field-group">
            <label>Company Name</label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={experience.companyName}
              onChange={(event) =>
                updateExperience("companyName", event.target.value)
              }
            />
          </div>

          <div className="field-group">
            <label>Employment Type</label>
            <select
              value={experience.employmentType}
              onChange={(event) =>
                updateExperience("employmentType", event.target.value)
              }
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Freelance</option>
              <option>Contract</option>
            </select>
          </div>

          <div className="field-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g. Jakarta, Indonesia"
              value={experience.location}
              onChange={(event) =>
                updateExperience("location", event.target.value)
              }
            />
          </div>

          <div className="field-group">
            <label>Start Date</label>
            <DateInput
              value={experience.startDate}
              onChange={(event) =>
                updateExperience("startDate", event.target.value)
              }
            />
          </div>

          <div className="field-group">
            <label>End Date</label>
            <DateInput
              value={experience.endDate}
              disabled={experience.currentlyWork}
              onChange={(event) =>
                updateExperience("endDate", event.target.value)
              }
            />
          </div>
        </div>

        <label className="check-row">
          <input
            type="checkbox"
            checked={experience.currentlyWork}
            onChange={(event) => {
              updateExperience("currentlyWork", event.target.checked);

              if (event.target.checked) {
                updateExperience("endDate", "");
              }
            }}
          />

          <span>I currently work here</span>
        </label>

        <div className="field-group">
          <label>Description</label>
          <textarea
            placeholder="Describe your key responsibilities and achievements..."
            value={experience.description}
            onChange={(event) =>
              updateExperience("description", event.target.value)
            }
          />
        </div>

        <div className="divider" />

        <div className="skill-section">
          <label>Skills Used</label>

          <div className="inline-add-row">
            <input
              type="text"
              placeholder="e.g. Figma"
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

          <div className="chips">
            {experience.skillsUsed.map((skill, index) => (
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