import { useMemo, useState } from "react";

const templateOptions = [
  {
    id: "Web App",
    label: "Web App",
    category: "Web Apps",
    hint: "Website dashboard, landing page, admin panel, atau sistem berbasis browser.",
  },
  {
    id: "Mobile App",
    label: "Mobile App",
    category: "Mobile",
    hint: "Aplikasi Android/iOS, tracking app, atau mobile-first product.",
  },
  {
    id: "ML/AI",
    label: "ML/AI",
    category: "ML/AI",
    hint: "Machine learning, AI prediction, data model, automation, atau data science.",
  },
  {
    id: "Frontend",
    label: "Frontend",
    category: "Web Apps",
    hint: "Website UI, slicing design, interactive frontend, atau React interface.",
  },
  {
    id: "Full Stack",
    label: "Full Stack",
    category: "Web Apps",
    hint: "Aplikasi lengkap dengan frontend, backend, API, dan database.",
  },
];

const emptyProject = {
  thumbnail: "",
  thumbnailName: "",
  template: "Web App",
  title: "",
  status: "In Progress",
  role: "",
  startDate: "",
  endDate: "",
  demoUrl: "",
  githubUrl: "",
  featured: true,
  techStack: [],
  techInput: "",
};

function Icon({ name }) {
  if (name === "plus") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (name === "save") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M5 4h12l2 2v14H5V4Z" />
        <path d="M8 4v6h8V4" />
        <path d="M8 20v-6h8v6" />
      </svg>
    );
  }

  if (name === "close") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
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

  if (name === "eye") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </svg>
    );
  }

  if (name === "code") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M8 8 4 12l4 4" />
        <path d="m16 8 4 4-4 4" />
      </svg>
    );
  }

  if (name === "web") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 5h16v14H4V5Z" />
        <path d="M4 9h16" />
        <path d="M8 7h.01" />
        <path d="M11 7h.01" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M8 3.5h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
        <path d="M10.5 17.5h3" />
      </svg>
    );
  }

  if (name === "ai") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 2l1.2 4.4L17.5 8l-4.3 1.6L12 14l-1.2-4.4L6.5 8l4.3-1.6L12 2Z" />
        <path d="M18 13l.9 3.1L22 17l-3.1.9L18 21l-.9-3.1L14 17l3.1-.9L18 13Z" />
      </svg>
    );
  }

  if (name === "stack") {
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

function Notice({ notice, onClose }) {
  if (!notice) return null;

  return (
    <div className="dash-popup-layer">
      <div className={`dash-popup dash-popup-${notice.type}`}>
        <div className="dash-popup-icon">
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

function templateIcon(template) {
  if (template === "Mobile App") return "phone";
  if (template === "ML/AI") return "ai";
  if (template === "Full Stack") return "stack";
  return "web";
}

function statusClass(status) {
  if (status === "Completed") return "project-status-completed";
  if (status === "In Progress") return "project-status-progress";
  if (status === "Archived") return "project-status-archived";
  if (status === "Draft") return "project-status-draft";
  return "project-status-draft";
}

function createProjectList(formData) {
  if (Array.isArray(formData?.projectsList) && formData.projectsList.length > 0) {
    return formData.projectsList;
  }

  if (formData?.projects?.title || formData?.projects?.thumbnail) {
    return [formData.projects];
  }

  return [];
}

function Project({ formData, setFormData, notify }) {
  const [notice, setNotice] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [projects, setProjects] = useState(() => createProjectList(formData));

  const [currentProject, setCurrentProject] = useState(emptyProject);
  const [editingIndex, setEditingIndex] = useState(null);

  const selectedTemplate = templateOptions.find(
    (item) => item.id === currentProject.template
  );

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All Projects") return projects;

    return projects.filter((project) => {
      const template = templateOptions.find((item) => item.id === project.template);
      return template?.category === activeFilter;
    });
  }, [projects, activeFilter]);

  const updateProject = (field, value) => {
    setCurrentProject((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    updateProject("thumbnail", URL.createObjectURL(file));
    updateProject("thumbnailName", file.name);
  };

  const addTech = () => {
    const tech = currentProject.techInput?.trim();

    if (!tech) return;

    updateProject("techStack", [...(currentProject.techStack || []), tech]);
    updateProject("techInput", "");
  };

  const removeTech = (index) => {
    updateProject(
      "techStack",
      currentProject.techStack.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const openAddForm = () => {
    setCurrentProject(emptyProject);
    setEditingIndex(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = (project) => {
    const index = projects.findIndex((item) => item === project);
    setCurrentProject(project);
    setEditingIndex(index);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentProject(emptyProject);
    setEditingIndex(null);
  };

  const validateProject = () => {
    if (!currentProject.thumbnail) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Project thumbnail wajib diupload.",
      });
      return false;
    }

    if (!currentProject.title.trim()) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Project title wajib diisi.",
      });
      return false;
    }

    if (!currentProject.role.trim()) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Team / role wajib diisi.",
      });
      return false;
    }

    if (!currentProject.startDate || !currentProject.endDate) {
      setNotice({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Start date dan end date project wajib dipilih.",
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateProject()) return;

    let updatedProjects = [];

    if (editingIndex === null) {
      updatedProjects = [currentProject, ...projects];
    } else {
      updatedProjects = projects.map((item, index) =>
        index === editingIndex ? currentProject : item
      );
    }

    setProjects(updatedProjects);

    setFormData?.((prev) => ({
      ...prev,
      projects: updatedProjects[0] || emptyProject,
      projectsList: updatedProjects,
    }));

    setNotice({
      type: "success",
      title: "Project Saved",
      message: "Project berhasil disimpan dan masuk ke list.",
    });

    notify?.("success", "Project Saved", "Project berhasil disimpan.");
    closeForm();
  };

  const handleDelete = (project) => {
    const updatedProjects = projects.filter((item) => item !== project);

    setProjects(updatedProjects);

    setFormData?.((prev) => ({
      ...prev,
      projects: updatedProjects[0] || emptyProject,
      projectsList: updatedProjects,
    }));

    notify?.("info", "Project Deleted", "Salah satu project berhasil dihapus.");
  };

  return (
    <div className="project-page">
      <Notice notice={notice} onClose={() => setNotice(null)} />

      <div className="project-header">
        <div>
          <h1>Projects Showcase</h1>
          <p>Manage and organize your technical portfolio.</p>
        </div>

        <div className="project-header-actions">
          <button type="button" className="dash-primary-btn" onClick={openAddForm}>
            <Icon name="plus" />
            Add Project
          </button>
        </div>
      </div>

      {isFormOpen && (
        <section className="dash-edit-card dashboard-form-box">
          <div className="dashboard-form-head">
            <div>
              <h2>{editingIndex === null ? "Add New Project" : "Edit Project"}</h2>
              <p>
                Isi detail project, pilih template, upload thumbnail, lalu simpan.
              </p>
            </div>

            <button type="button" className="form-close-btn" onClick={closeForm}>
              <Icon name="close" />
            </button>
          </div>

          <div className="template-picker">
            {templateOptions.map((template) => (
              <button
                key={template.id}
                type="button"
                className={currentProject.template === template.id ? "active" : ""}
                onClick={() => updateProject("template", template.id)}
              >
                <Icon name={templateIcon(template.id)} />
                {template.label}
              </button>
            ))}
          </div>

          <div className="template-hint">
            <strong>{selectedTemplate?.label}</strong>
            <p>{selectedTemplate?.hint}</p>
          </div>

          <div className="project-editor-layout">
            <div>
              <label className="project-upload">
                {currentProject.thumbnail ? (
                  <img src={currentProject.thumbnail} alt="Project thumbnail" />
                ) : (
                  <div>
                    <Icon name="plus" />
                    <span>Upload Project Thumbnail</span>
                  </div>
                )}

                <input type="file" accept="image/*" onChange={handleUpload} />
              </label>

              <small className="project-upload-note">
                {currentProject.thumbnailName ||
                  "Recommended 16:9, min 1280×720px"}
              </small>
            </div>

            <div className="project-fields">
              <div className="dash-field">
                <label>Project Title</label>
                <input
                  type="text"
                  value={currentProject.title}
                  placeholder="e.g. Logistics Dashboard Analytics"
                  onChange={(event) => updateProject("title", event.target.value)}
                />
              </div>

              <div className="dash-field">
                <label>Team / Role</label>
                <input
                  type="text"
                  value={currentProject.role}
                  placeholder="e.g. Frontend Developer"
                  onChange={(event) => updateProject("role", event.target.value)}
                />
              </div>

              <div className="project-two-col">
                <div className="dash-field">
                  <label>Status</label>
                  <select
                    value={currentProject.status}
                    onChange={(event) => updateProject("status", event.target.value)}
                  >
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Archived</option>
                    <option>Draft</option>
                  </select>
                </div>

                <div className="dash-field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={currentProject.startDate}
                    onKeyDown={(event) => event.preventDefault()}
                    onClick={(event) => event.currentTarget.showPicker?.()}
                    onChange={(event) =>
                      updateProject("startDate", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="project-two-col">
                <div className="dash-field">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={currentProject.endDate}
                    onKeyDown={(event) => event.preventDefault()}
                    onClick={(event) => event.currentTarget.showPicker?.()}
                    onChange={(event) => updateProject("endDate", event.target.value)}
                  />
                </div>

                <div className="dash-field">
                  <label>Demo URL</label>
                  <input
                    type="url"
                    value={currentProject.demoUrl}
                    placeholder="https://demo..."
                    onChange={(event) => updateProject("demoUrl", event.target.value)}
                  />
                </div>
              </div>

              <div className="dash-field">
                <label>Github Repository</label>
                <input
                  type="url"
                  value={currentProject.githubUrl}
                  placeholder="https://github..."
                  onChange={(event) => updateProject("githubUrl", event.target.value)}
                />
              </div>

              <div className="dash-field">
                <label>Tech Stack</label>

                <div className="project-tech-row">
                  <input
                    type="text"
                    value={currentProject.techInput || ""}
                    placeholder="e.g. React"
                    onChange={(event) =>
                      updateProject("techInput", event.target.value)
                    }
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

                <div className="project-chip-list">
                  {(currentProject.techStack || []).map((tech, index) => (
                    <button
                      type="button"
                      key={`${tech}-${index}`}
                      onClick={() => removeTech(index)}
                    >
                      {tech} ×
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-form-actions">
            <button type="button" className="dash-outline-btn" onClick={closeForm}>
              Cancel
            </button>

            <button type="button" className="dash-primary-btn" onClick={handleSave}>
              <Icon name="save" />
              Save Changes
            </button>
          </div>
        </section>
      )}

      <div className="project-filter-card">
        {["All Projects", "Web Apps", "Mobile", "ML/AI"].map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? "active" : ""}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="project-card-grid">
          {filteredProjects.map((project, index) => (
            <article className="project-display-card" key={`${project.title}-${index}`}>
              <div className="project-image">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt={project.title} />
                ) : (
                  <div className="project-image-empty">No Image</div>
                )}

                <span className={`project-status-badge ${statusClass(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <div className="project-body">
                <p>{project.template}</p>
                <h2>{project.title}</h2>
                <small>{project.role}</small>

                <div className="dash-chips">
                  {project.techStack?.length ? (
                    project.techStack.map((tech, techIndex) => (
                      <span key={`${tech}-${techIndex}`}>{tech}</span>
                    ))
                  ) : (
                    <span>No Tech Stack</span>
                  )}
                </div>

                <div className="project-card-actions">
                  <button type="button" onClick={() => openEditForm(project)}>
                    <Icon name="edit" />
                    Edit
                  </button>

                  <button type="button" onClick={() => handleDelete(project)}>
                    <Icon name="trash" />
                    Delete
                  </button>
                </div>

                <div className="project-links">
                  <a href={project.demoUrl || "#"}>
                    <Icon name="eye" />
                    Demo
                  </a>

                  <a href={project.githubUrl || "#"}>
                    <Icon name="code" />
                    GitHub
                  </a>
                </div>
              </div>
            </article>
          ))}

          <article className="add-project-card" onClick={openAddForm}>
            <div>+</div>
            <h2>Add New Project</h2>
            <p>Showcase your work and skills by adding your projects.</p>
          </article>
        </div>
      ) : (
        <div className="dash-edit-card">
          <div className="empty-state">
            <h3>Belum ada project</h3>
            <p>Klik Add Project untuk menambahkan project baru.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Project;