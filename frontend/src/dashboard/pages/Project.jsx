import { useState } from "react";

const emptyProject = {
  thumbnail: "",
  thumbnailName: "",
  title: "",
  status: "In Progress",
  role: "",
  startDate: "",
  endDate: "",
  demoUrl: "",
  referenceUrl: "",
  description: "",
  featured: true,
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

  if (name === "link") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2" />
        <path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.2-1.2" />
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

  if (name === "image") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 5h16v14H4V5Z" />
        <path d="m4 16 5-5 4 4 2-2 5 5" />
        <path d="M14.5 9.5h.01" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4 8h16" />
        <path d="M5 5h14v16H5V5Z" />
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

function statusClass(status) {
  if (status === "Completed") return "project-status-completed";
  if (status === "In Progress") return "project-status-progress";
  if (status === "Archived") return "project-status-archived";
  if (status === "Draft") return "project-status-draft";
  return "project-status-draft";
}

function statusLabel(status) {
  if (status === "In Progress") return "Active";
  return status || "Draft";
}

function normalizeProject(project = {}) {
  return {
    thumbnail: project.thumbnail || "",
    thumbnailName: project.thumbnailName || "",
    title: project.title || "",
    status: project.status || "In Progress",
    role: project.role || "",
    startDate: project.startDate || "",
    endDate: project.endDate || "",
    demoUrl: project.demoUrl || "",
    referenceUrl: project.referenceUrl || project.githubUrl || "",
    description: project.description || "",
    featured: Boolean(project.featured),
  };
}

function createProjectList(formData) {
  if (Array.isArray(formData?.projectsList) && formData.projectsList.length > 0) {
    return formData.projectsList.map((project) => normalizeProject(project));
  }

  const project = normalizeProject(formData?.projects);

  const hasProject =
    project.thumbnail ||
    project.title?.trim() ||
    project.role?.trim() ||
    project.startDate ||
    project.endDate ||
    project.demoUrl?.trim() ||
    project.referenceUrl?.trim() ||
    project.description?.trim();

  if (hasProject) return [project];

  return [];
}

function Project({ formData, setFormData, notify }) {
  const [notice, setNotice] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [projects, setProjects] = useState(() => createProjectList(formData));
  const [currentProject, setCurrentProject] = useState(emptyProject);
  const [editingIndex, setEditingIndex] = useState(null);

  const filteredProjects =
    activeFilter === "All Projects"
      ? projects
      : projects.filter((project) => project.status === activeFilter);

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

  const openAddForm = () => {
    setCurrentProject(emptyProject);
    setEditingIndex(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = (project) => {
    const index = projects.findIndex((item) => item === project);

    setCurrentProject(normalizeProject(project));
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

    return true;
  };

  const handleSave = () => {
    if (!validateProject()) return;

    const savedProject = normalizeProject(currentProject);
    let updatedProjects = [];

    if (editingIndex === null) {
      updatedProjects = [savedProject, ...projects];
    } else {
      updatedProjects = projects.map((item, index) =>
        index === editingIndex ? savedProject : item
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
          <p>
            Manage and organize your general portfolio. Bagian ini bisa dipakai
            untuk project kerja, organisasi, event, bisnis, desain, penelitian,
            administrasi, pendidikan, pelayanan, dan portofolio umum lainnya.
          </p>
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
                Isi detail project secara general. Tidak ada kategori ML/AI,
                Web App, Mobile App, Frontend, Full Stack, atau Tech Stack.
              </p>
            </div>

            <button type="button" className="form-close-btn" onClick={closeForm}>
              <Icon name="close" />
            </button>
          </div>

          <div className="project-general-note">
            <div className="project-general-note-icon">
              <Icon name="briefcase" />
            </div>

            <div>
              <strong>General Project</strong>
              <p>
                Cocok untuk semua kalangan kerja dan semua jenis pengalaman.
                Cukup isi judul, peran, status, tanggal, deskripsi, dan link
                pendukung bila ada.
              </p>
            </div>
          </div>

          <div className="project-editor-layout project-general-editor-layout">
            <div>
              <label className="project-upload">
                {currentProject.thumbnail ? (
                  <img src={currentProject.thumbnail} alt="Project thumbnail" />
                ) : (
                  <div>
                    <Icon name="image" />
                    <span>Upload Project Thumbnail</span>
                  </div>
                )}

                <input type="file" accept="image/*" onChange={handleUpload} />
              </label>

              <small className="project-upload-note">
                {currentProject.thumbnailName ||
                  "Optional. Recommended 16:9, min 1280×720px"}
              </small>
            </div>

            <div className="project-fields">
              <div className="dash-field">
                <label>Project Title</label>
                <input
                  type="text"
                  value={currentProject.title}
                  placeholder="e.g. Event Campaign, Company Profile, Portfolio Project"
                  onChange={(event) => updateProject("title", event.target.value)}
                />
              </div>

              <div className="dash-field">
                <label>Team / Role</label>
                <input
                  type="text"
                  value={currentProject.role}
                  placeholder="e.g. Project Leader, Member, Designer, Writer"
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
                  <label>Project URL</label>
                  <input
                    type="url"
                    value={currentProject.demoUrl}
                    placeholder="https://project-link..."
                    onChange={(event) => updateProject("demoUrl", event.target.value)}
                  />
                </div>
              </div>

              <div className="dash-field">
                <label>Reference / Document URL</label>
                <input
                  type="url"
                  value={currentProject.referenceUrl}
                  placeholder="https://drive.google.com/..."
                  onChange={(event) =>
                    updateProject("referenceUrl", event.target.value)
                  }
                />
              </div>

              <div className="dash-field">
                <label>Description</label>
                <textarea
                  value={currentProject.description}
                  placeholder="Ceritakan tujuan project, tugas kamu, proses yang dilakukan, dan hasil yang dicapai."
                  onChange={(event) =>
                    updateProject("description", event.target.value)
                  }
                />
              </div>

              <label className="project-featured-check">
                <div>
                  <strong>Featured Project</strong>
                  <span>Pin this project to the top of your profile.</span>
                </div>

                <input
                  type="checkbox"
                  checked={Boolean(currentProject.featured)}
                  onChange={(event) =>
                    updateProject("featured", event.target.checked)
                  }
                />
              </label>
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
        {["All Projects", "In Progress", "Completed", "Archived", "Draft"].map(
          (filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? "active" : ""}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "In Progress" ? "Active" : filter}
            </button>
          )
        )}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="project-card-grid">
          {filteredProjects.map((project, index) => (
            <article className="project-display-card" key={`${project.title}-${index}`}>
              <div className="project-image">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt={project.title || "Project"} />
                ) : (
                  <div className="project-image-empty">
                    <Icon name="image" />
                    <span>No Image</span>
                  </div>
                )}

                <span className={`project-status-badge ${statusClass(project.status)}`}>
                  {statusLabel(project.status)}
                </span>
              </div>

              <div className="project-body">
                <p>General Project</p>
                <h2>{project.title || "Untitled Project"}</h2>
                <small>{project.role || "No role added"}</small>

                {project.description && (
                  <div className="project-description">
                    {project.description}
                  </div>
                )}

                <div className="project-meta-row">
                  <span>
                    <Icon name="calendar" />
                    {project.startDate || "No start"} - {project.endDate || "No end"}
                  </span>
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
                  <a
                    href={project.demoUrl || "#"}
                    onClick={(event) => {
                      if (!project.demoUrl) event.preventDefault();
                    }}
                  >
                    <Icon name="eye" />
                    Project
                  </a>

                  <a
                    href={project.referenceUrl || "#"}
                    onClick={(event) => {
                      if (!project.referenceUrl) event.preventDefault();
                    }}
                  >
                    <Icon name="link" />
                    Reference
                  </a>
                </div>
              </div>
            </article>
          ))}

          <article className="add-project-card" onClick={openAddForm}>
            <div>+</div>
            <h2>Add New Project</h2>
            <p>Showcase your work by adding your project.</p>
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