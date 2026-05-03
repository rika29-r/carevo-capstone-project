import { useMemo, useState } from "react";

function Icon({ name }) {
  if (name === "save") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M5 4h12l2 2v14H5V4Z" />
        <path d="M8 4v6h8V4" />
        <path d="M8 20v-6h8v6" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (name === "briefcase") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4c1 0 1.8.8 1.8 1.8V7" />
        <path d="M4 7h16v12H4V7Z" />
        <path d="M4 12h16" />
      </svg>
    );
  }

  if (name === "chart") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 3 5-7" />
        <path d="M17 7h2v2" />
      </svg>
    );
  }

  if (name === "edit") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
      </svg>
    );
  }

  if (name === "trash") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (name === "lightbulb") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M8 14a6 6 0 1 1 8 0c-1.3 1-1.5 2-1.5 3h-5c0-1-.2-2-1.5-3Z" />
      </svg>
    );
  }

  return null;
}

function Notice({ notice, onClose }) {
  if (!notice) return null;

  return (
    <div className="exp-notice-layer">
      <div className={`exp-notice exp-notice-${notice.type}`}>
        <div className="exp-notice-icon">
          {notice.type === "success" ? "✓" : "!"}
        </div>

        <div>
          <h3>{notice.title}</h3>
          <p>{notice.message}</p>
        </div>

        <button type="button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

const emptyExperience = {
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

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function createExperienceList(formData) {
  if (Array.isArray(formData?.experiences) && formData.experiences.length > 0) {
    return formData.experiences;
  }

  if (formData?.experience?.jobTitle || formData?.experience?.companyName) {
    return [formData.experience];
  }

  return [];
}

function Experience({ formData, setFormData }) {
  const [notice, setNotice] = useState(null);
  const [experiences, setExperiences] = useState(() =>
    createExperienceList(formData)
  );

  const [currentExperience, setCurrentExperience] = useState(() => {
    const list = createExperienceList(formData);
    return list[0] || emptyExperience;
  });

  const [editingIndex, setEditingIndex] = useState(() => {
    const list = createExperienceList(formData);
    return list.length > 0 ? 0 : null;
  });

  const isFilled = Boolean(
    currentExperience.jobTitle?.trim() &&
      currentExperience.companyName?.trim() &&
      currentExperience.location?.trim() &&
      currentExperience.startDate &&
      currentExperience.description?.trim()
  );

  const totalSkills = useMemo(() => {
    const allSkills = experiences.flatMap((item) => item.skillsUsed || []);
    return [...new Set(allSkills)];
  }, [experiences]);

  const profileCompleteness = useMemo(() => {
    const fields = [
      currentExperience.jobTitle,
      currentExperience.companyName,
      currentExperience.employmentType,
      currentExperience.location,
      currentExperience.startDate,
      currentExperience.currentlyWork ? "Present" : currentExperience.endDate,
      currentExperience.description,
    ];

    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [currentExperience]);

  const updateCurrentExperience = (field, value) => {
    setCurrentExperience((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateExperience = () => {
    if (!currentExperience.jobTitle.trim()) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Job Title wajib diisi sebelum save.",
      });
      return false;
    }

    if (!currentExperience.companyName.trim()) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Company Name wajib diisi sebelum save.",
      });
      return false;
    }

    if (!currentExperience.location.trim()) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Location wajib diisi sebelum save.",
      });
      return false;
    }

    if (!currentExperience.startDate) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Start Date wajib dipilih sebelum save.",
      });
      return false;
    }

    if (!currentExperience.currentlyWork && !currentExperience.endDate) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "End Date wajib dipilih atau centang currently work here.",
      });
      return false;
    }

    if (!currentExperience.description.trim()) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Description wajib diisi sebelum save.",
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateExperience()) return;

    let updatedExperiences = [];

    if (editingIndex === null) {
      updatedExperiences = [currentExperience, ...experiences];
      setEditingIndex(0);
    } else {
      updatedExperiences = experiences.length
        ? experiences.map((item, index) =>
            index === editingIndex ? currentExperience : item
          )
        : [currentExperience];
    }

    setExperiences(updatedExperiences);

    setFormData?.((prev) => ({
      ...prev,
      experience: currentExperience,
      experiences: updatedExperiences,
    }));

    setNotice({
      type: "success",
      title: "Changes Saved",
      message: "Experience berhasil disimpan ke dashboard dan siap dipakai untuk CV.",
    });
  };

  const handleAddNew = () => {
    setCurrentExperience(emptyExperience);
    setEditingIndex(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (index) => {
    setCurrentExperience(experiences[index]);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (index) => {
    const updatedExperiences = experiences.filter((_, itemIndex) => itemIndex !== index);

    setExperiences(updatedExperiences);

    const nextCurrent = updatedExperiences[0] || emptyExperience;
    setCurrentExperience(nextCurrent);
    setEditingIndex(updatedExperiences.length > 0 ? 0 : null);

    setFormData?.((prev) => ({
      ...prev,
      experience: nextCurrent,
      experiences: updatedExperiences,
    }));

    setNotice({
      type: "success",
      title: "Experience Deleted",
      message: "Work history berhasil dihapus.",
    });
  };

  const addSkill = () => {
    const skillInput = currentExperience.skillInput?.trim();

    if (!skillInput) return;

    updateCurrentExperience("skillsUsed", [
      ...(currentExperience.skillsUsed || []),
      skillInput,
    ]);

    updateCurrentExperience("skillInput", "");
  };

  const removeSkill = (skillIndex) => {
    updateCurrentExperience(
      "skillsUsed",
      currentExperience.skillsUsed.filter((_, index) => index !== skillIndex)
    );
  };

  return (
    <div className="experience-page">
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="experience-header">
        <div>
          <h1>Experience Information</h1>
          <p>
            Manage your work history, define your roles, and showcase your
            professional growth.
          </p>
        </div>

        <div className="experience-header-actions">
          <button type="button" className="add-work-btn" onClick={handleAddNew}>
            <Icon name="plus" />
            Add Work
          </button>

          <button type="button" className="save-work-btn" onClick={handleSave}>
            <Icon name="save" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="experience-layout">
        <div className="experience-left">
          <section className="experience-card">
            <div className="experience-card-title">
              <h2>Current Experience</h2>

              <span className={isFilled ? "active-role" : "empty-role"}>
                {isFilled ? "ACTIVE ROLE" : "DRAFT"}
              </span>
            </div>

            <div className="experience-form-grid">
              <div className="dash-field">
                <label>Job Title</label>
                <input
                  type="text"
                  value={currentExperience.jobTitle}
                  placeholder="e.g. Senior Product Designer"
                  onChange={(event) =>
                    updateCurrentExperience("jobTitle", event.target.value)
                  }
                />
              </div>

              <div className="dash-field">
                <label>Company Name</label>
                <input
                  type="text"
                  value={currentExperience.companyName}
                  placeholder="e.g. InnovateTech Solutions"
                  onChange={(event) =>
                    updateCurrentExperience("companyName", event.target.value)
                  }
                />
              </div>

              <div className="dash-field">
                <label>Employment Type</label>
                <select
                  value={currentExperience.employmentType}
                  onChange={(event) =>
                    updateCurrentExperience("employmentType", event.target.value)
                  }
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Freelance</option>
                  <option>Contract</option>
                </select>
              </div>

              <div className="dash-field">
                <label>Location</label>
                <input
                  type="text"
                  value={currentExperience.location}
                  placeholder="e.g. Jakarta, Indonesia"
                  onChange={(event) =>
                    updateCurrentExperience("location", event.target.value)
                  }
                />
              </div>

              <div className="dash-field">
                <label>Start Date</label>
                <input
                  type="date"
                  value={currentExperience.startDate}
                  onKeyDown={(event) => event.preventDefault()}
                  onClick={(event) => event.currentTarget.showPicker?.()}
                  onChange={(event) =>
                    updateCurrentExperience("startDate", event.target.value)
                  }
                />
              </div>

              <div className="dash-field">
                <label>End Date</label>

                <div className="end-date-row">
                  <input
                    type="date"
                    value={currentExperience.endDate}
                    disabled={currentExperience.currentlyWork}
                    onKeyDown={(event) => event.preventDefault()}
                    onClick={(event) => event.currentTarget.showPicker?.()}
                    onChange={(event) =>
                      updateCurrentExperience("endDate", event.target.value)
                    }
                  />

                  <label className="current-check">
                    <input
                      type="checkbox"
                      checked={currentExperience.currentlyWork}
                      onChange={(event) => {
                        updateCurrentExperience("currentlyWork", event.target.checked);

                        if (event.target.checked) {
                          updateCurrentExperience("endDate", "");
                        }
                      }}
                    />

                    I currently work here
                  </label>
                </div>
              </div>
            </div>

            <div className="dash-field">
              <label>Description</label>
              <textarea
                value={currentExperience.description}
                placeholder="Describe your responsibilities, achievements, and impact..."
                onChange={(event) =>
                  updateCurrentExperience("description", event.target.value)
                }
              />
            </div>

            <div className="dash-field">
              <label>Skills Used</label>

              <div className="skill-add-row">
                <input
                  type="text"
                  value={currentExperience.skillInput || ""}
                  placeholder="e.g. React, Figma, UI Design"
                  onChange={(event) =>
                    updateCurrentExperience("skillInput", event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                />

                <button type="button" onClick={addSkill}>
                  Add Skill
                </button>
              </div>

              <div className="experience-chips">
                {(currentExperience.skillsUsed || []).map((skill, index) => (
                  <button
                    type="button"
                    key={`${skill}-${index}`}
                    onClick={() => removeSkill(index)}
                  >
                    {skill} ×
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="experience-card work-history-card">
            <div className="experience-card-title">
              <h2>Work History</h2>

              <span>{experiences.length} Roles</span>
            </div>

            <div className="work-history-scroll">
              {experiences.length > 0 ? (
                experiences.map((item, index) => (
                  <article
                    className={`work-history-item ${
                      index === editingIndex ? "selected" : ""
                    }`}
                    key={`${item.jobTitle}-${item.companyName}-${index}`}
                  >
                    <div className="timeline-icon">
                      <Icon name="briefcase" />
                    </div>

                    <div className="work-history-content">
                      <div className="work-history-top">
                        <div>
                          <h3>{item.jobTitle}</h3>

                          <p>
                            {item.companyName} • {formatDate(item.startDate)} -{" "}
                            {item.currentlyWork ? "Present" : formatDate(item.endDate)}
                          </p>
                        </div>

                        <div className="work-actions">
                          <button type="button" onClick={() => handleEdit(index)}>
                            <Icon name="edit" />
                          </button>

                          <button type="button" onClick={() => handleDelete(index)}>
                            <Icon name="trash" />
                          </button>
                        </div>
                      </div>

                      <p className="work-description">{item.description}</p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-work">
                  <h3>Belum ada work history</h3>
                  <p>Klik Add Work, isi data, lalu Save Changes.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="experience-right">
          <section className="experience-card snapshot-card">
            <div className="side-title">
              <Icon name="chart" />
              <h2>Experience Snapshot</h2>
            </div>

            <div className="complete-row">
              <span>Profile Completeness</span>
              <strong>{profileCompleteness}%</strong>
            </div>

            <div className="complete-bar">
              <span style={{ width: `${profileCompleteness}%` }} />
            </div>

            <div className="metric-grid">
              <div>
                <span>Total Exp.</span>
                <strong>{experiences.length}</strong>
                <p>Roles</p>
              </div>

              <div>
                <span>Roles Held</span>
                <strong>{experiences.length}</strong>
                <p>Roles</p>
              </div>

              <div>
                <span>Industries</span>
                <strong>{experiences.length ? "1" : "0"}</strong>
                <p>Sectors</p>
              </div>

              <div>
                <span>Status</span>
                <strong>{currentExperience.currentlyWork ? "Active" : "Past"}</strong>
                <p>Role</p>
              </div>
            </div>
          </section>

          <section className="experience-card skills-card">
            <div className="experience-card-title">
              <h2>Skills Used</h2>
              <span>Manage Skills</span>
            </div>

            {totalSkills.length > 0 ? (
              <div className="experience-chips">
                {totalSkills.map((skill, index) => (
                  <span key={`${skill}-${index}`}>{skill}</span>
                ))}
              </div>
            ) : (
              <p className="side-muted">Belum ada skill yang ditambahkan.</p>
            )}
          </section>

          <section className="experience-card tips-card">
            <div className="side-title">
              <Icon name="lightbulb" />
              <h2>Experience Tips</h2>
            </div>

            <ul>
              <li>
                <Icon name="check" />
                Gunakan action verbs seperti “Led”, “Designed”, “Improved”.
              </li>

              <li>
                <Icon name="check" />
                Tambahkan hasil yang terukur, misalnya persen, jumlah user, atau
                impact.
              </li>

              <li>
                <Icon name="check" />
                Ceritakan kolaborasi dengan tim, client, atau stakeholder.
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Experience;