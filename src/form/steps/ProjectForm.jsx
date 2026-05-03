function DateInput({ value, onChange }) {
  const openPicker = (event) => {
    event.currentTarget.showPicker?.();
  };

  return (
    <input
      type="date"
      value={value}
      onClick={openPicker}
      onFocus={openPicker}
      onKeyDown={(event) => event.preventDefault()}
      onChange={onChange}
    />
  );
}

function TemplateIcon({ type }) {
  if (type === "Web App") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 5h16v14H4V5Z" />
        <path d="M4 9h16" />
        <path d="M8 7h.01" />
        <path d="M11 7h.01" />
      </svg>
    );
  }

  if (type === "Mobile App") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M8 3.5h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
        <path d="M10.5 17.5h3" />
      </svg>
    );
  }

  if (type === "ML/AI") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 2l1.2 4.4L17.5 8l-4.3 1.6L12 14l-1.2-4.4L6.5 8l4.3-1.6L12 2Z" />
        <path d="M5 14l.8 2.6L8.5 17l-2.7.4L5 20l-.8-2.6L1.5 17l2.7-.4L5 14Z" />
        <path d="M18 13l.9 3.1L22 17l-3.1.9L18 21l-.9-3.1L14 17l3.1-.9L18 13Z" />
      </svg>
    );
  }

  if (type === "Frontend") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M8 8 4 12l4 4" />
        <path d="m16 8 4 4-4 4" />
        <path d="m14 5-4 14" />
      </svg>
    );
  }

  if (type === "Full Stack") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 3 4 7l8 4 8-4-8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 17 8 4 8-4" />
      </svg>
    );
  }

  return null;
}

function ProjectForm({ formData, setFormData, onNext, onPrevious }) {
  const projects = formData.projects;

  const updateProject = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        [field]: value,
      },
    }));
  };

  const addTech = () => {
    const techInput = projects.techInput?.trim();

    if (!techInput) return;

    updateProject("techStack", [...projects.techStack, techInput]);
    updateProject("techInput", "");
  };

  const removeTech = (techIndex) => {
    updateProject(
      "techStack",
      projects.techStack.filter((_, index) => index !== techIndex)
    );
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    updateProject("thumbnail", imageUrl);
    updateProject("thumbnailName", file.name);
  };

  const templates = ["Web App", "Mobile App", "ML/AI", "Frontend", "Full Stack"];

  const statusOptions = [
    { value: "In Progress", label: "Active" },
    { value: "Completed", label: "Completed" },
    { value: "Archived", label: "Archived" },
    { value: "Draft", label: "Draft" },
  ];

  const activeStatusLabel =
    statusOptions.find((item) => item.value === projects.status)?.label ||
    "Active";

  return (
    <div className="form-grid project-layout">
      <aside className="left-panel">
        <div className="mini-card">
          <h3>Media & Links</h3>

          <label className="thumbnail-box upload-box">
            {projects.thumbnail ? (
              <img src={projects.thumbnail} alt="Project thumbnail" />
            ) : (
              <div className="thumbnail-placeholder">
                <span>+</span>
                <p>Upload Project Thumbnail</p>
              </div>
            )}

            <input type="file" accept="image/*" onChange={handleUpload} />
          </label>

          <small>
            {projects.thumbnailName
              ? projects.thumbnailName
              : "Recommended: 16:9, min 1280×720px"}
          </small>

          <div className="status-tags">
            {statusOptions.map((status) => (
              <span
                key={status.value}
                className={projects.status === status.value ? "active" : ""}
              >
                {status.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mini-card">
          <h3>Tech Stack</h3>

          <div className="inline-add-row">
            <input
              type="text"
              placeholder="e.g. React"
              value={projects.techInput || ""}
              onChange={(event) => updateProject("techInput", event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTech();
                }
              }}
            />

            <button type="button" onClick={addTech}>
              Add
            </button>
          </div>

          <div className="chips">
            {projects.techStack.map((tech, index) => (
              <button
                type="button"
                className="chip"
                key={`${tech}-${index}`}
                onClick={() => removeTech(index)}
              >
                {tech} ×
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="form-card">
        <div className="card-header">
          <h2>Add New Project</h2>
        </div>

        <div className="card-body">
          <div className="field-group">
            <label>Choose Project Template</label>

            <div className="template-grid">
              {templates.map((template) => (
                <button
                  key={template}
                  type="button"
                  className={`template-btn ${
                    projects.template === template ? "active" : ""
                  }`}
                  onClick={() => updateProject("template", template)}
                >
                  <span className="template-icon">
                    <TemplateIcon type={template} />
                  </span>

                  <span className="template-label">{template}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label>Project Title</label>
            <input
              type="text"
              value={projects.title}
              onChange={(event) => updateProject("title", event.target.value)}
            />
          </div>

          <div className="input-grid">
            <div className="field-group">
              <label>Status</label>
              <select
                value={projects.status}
                onChange={(event) => updateProject("status", event.target.value)}
              >
                <option>In Progress</option>
                <option>Completed</option>
                <option>Archived</option>
                <option>Draft</option>
              </select>

              <small className="field-note">
                Status badge aktif: {activeStatusLabel}
              </small>
            </div>

            <div className="field-group">
              <label>Team / Role</label>
              <input
                type="text"
                placeholder="Lead Product Designer"
                value={projects.role}
                onChange={(event) => updateProject("role", event.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Start Date</label>
              <DateInput
                value={projects.startDate}
                onChange={(event) =>
                  updateProject("startDate", event.target.value)
                }
              />
            </div>

            <div className="field-group">
              <label>End Date</label>
              <DateInput
                value={projects.endDate}
                onChange={(event) =>
                  updateProject("endDate", event.target.value)
                }
              />
            </div>
          </div>

          <div className="divider" />

          <h3 className="section-title">External Presence</h3>

          <div className="input-grid">
            <div className="field-group">
              <label>Demo URL</label>
              <input
                type="url"
                placeholder="https://demo..."
                value={projects.demoUrl}
                onChange={(event) => updateProject("demoUrl", event.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Github Repository</label>
              <input
                type="url"
                placeholder="https://github..."
                value={projects.githubUrl}
                onChange={(event) =>
                  updateProject("githubUrl", event.target.value)
                }
              />
            </div>
          </div>

          <label className="featured-box">
            <div>
              <strong>Featured Project</strong>
              <span>Pin to top of your profile.</span>
            </div>

            <input
              type="checkbox"
              checked={projects.featured}
              onChange={(event) =>
                updateProject("featured", event.target.checked)
              }
            />
          </label>
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
    </div>
  );
}

export default ProjectForm;