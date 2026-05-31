import "../form.css";

function DateInput({ value, onChange }) {
  return <input type="date" value={value || ""} onChange={onChange} />;
}

function Icon({ name }) {
  if (name === "upload") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
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

  if (name === "link") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2" />
        <path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.2-1.2" />
      </svg>
    );
  }

  if (name === "note") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M6 3h9l3 3v15H6V3Z" />
        <path d="M15 3v4h4" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    );
  }

  return null;
}

function ProjectForm({ formData, setFormData, onNext, onPrevious }) {
  const projects = formData.projects || {
    thumbnail: "",
    thumbnailName: "",
    title: "",
    status: "In Progress",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
    demoUrl: "",
    githubUrl: "",
    featured: false,
  };

  const updateProject = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      projects: {
        ...prev.projects,
        [field]: value,
      },
    }));
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar project maksimal 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      updateProject("thumbnail", reader.result);
      updateProject("thumbnailName", file.name);
    };

    reader.readAsDataURL(file);
  };

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
    <div className="form-grid project-layout general-project-layout">
      <aside className="left-panel">
        <div className="mini-card">
          <h3>Media & Links</h3>

          <label className="thumbnail-box upload-box">
            {projects.thumbnail ? (
              <img src={projects.thumbnail} alt="Project thumbnail" />
            ) : (
              <div className="thumbnail-placeholder">
                <span>
                  <Icon name="upload" />
                </span>
                <p>Upload Project Thumbnail</p>
              </div>
            )}

            <input type="file" accept="image/*" onChange={handleUpload} />
          </label>

          <small>
            {projects.thumbnailName
              ? projects.thumbnailName
              : "Optional. Recommended: 16:9, min 1280×720px"}
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

        <div className="mini-card project-helper-card">
          <div className="helper-icon">
            <Icon name="briefcase" />
          </div>

          <h3>General Project</h3>
          <p>
            Project ini tidak wajib diisi. Bagian ini bisa dipakai untuk semua
            bidang kerja, seperti organisasi, event, bisnis, desain, penelitian,
            pendidikan, dan portofolio umum lainnya.
          </p>
        </div>
      </aside>

      <div className="form-card">
        <div className="card-header">
          <div>
            <h2>Add New Project</h2>
            <p className="card-subtitle">
              Add portfolio, organization, event, research, or general project.
            </p>
          </div>
        </div>

        <div className="card-body">
          <div className="optional-info-box">
            <strong>Optional Section</strong>
            <p>
              Bagian project tidak wajib diisi. Kamu tetap bisa klik Next Step
              walaupun semua field kosong.
            </p>
          </div>

          <div className="field-group">
            <label>Project Title</label>
            <input
              type="text"
              placeholder="e.g. Event Campaign, Company Profile, Portfolio Project"
              value={projects.title || ""}
              onChange={(event) => updateProject("title", event.target.value)}
            />
            <small className="field-note">Optional. Boleh dikosongkan.</small>
          </div>

          <div className="input-grid">
            <div className="field-group">
              <label>Status</label>

              <select
                value={projects.status || "In Progress"}
                onChange={(event) => updateProject("status", event.target.value)}
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
                <option value="Draft">Draft</option>
              </select>

              <small className="field-note">
                Status badge aktif: {activeStatusLabel}
              </small>
            </div>

            <div className="field-group">
              <label>Team / Role</label>
              <input
                type="text"
                placeholder="e.g. Project Leader, Member, Designer, Writer"
                value={projects.role || ""}
                onChange={(event) => updateProject("role", event.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Start Date</label>
              <DateInput
                value={projects.startDate || ""}
                onChange={(event) =>
                  updateProject("startDate", event.target.value)
                }
              />
            </div>

            <div className="field-group">
              <label>End Date</label>
              <DateInput
                value={projects.endDate || ""}
                onChange={(event) =>
                  updateProject("endDate", event.target.value)
                }
              />
            </div>
          </div>

          <div className="field-group">
            <label>Project Description</label>
            <textarea
              placeholder="Ceritakan tujuan project, tugas kamu, proses yang dilakukan, dan hasil yang dicapai."
              value={projects.description || ""}
              onChange={(event) =>
                updateProject("description", event.target.value)
              }
            />
          </div>

          <div className="divider" />

          <h3 className="section-title">External Presence</h3>

          <div className="input-grid">
            <div className="field-group">
              <label>Project URL</label>

              <div className="input-with-icon">
                <Icon name="link" />
                <input
                  type="url"
                  placeholder="https://project-link..."
                  value={projects.demoUrl || ""}
                  onChange={(event) =>
                    updateProject("demoUrl", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="field-group">
              <label>Reference / Document URL</label>

              <div className="input-with-icon">
                <Icon name="note" />
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={projects.githubUrl || ""}
                  onChange={(event) =>
                    updateProject("githubUrl", event.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <label className="featured-box">
            <div>
              <strong>Featured Project</strong>
              <span>Pin this project to the top of your profile.</span>
            </div>

            <input
              type="checkbox"
              checked={Boolean(projects.featured)}
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