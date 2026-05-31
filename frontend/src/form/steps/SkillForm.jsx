import { useMemo, useState } from "react";
import "../form.css";

const defaultSkills = [
  "Communication",
  "Teamwork",
  "Leadership",
  "Problem Solving",
  "Critical Thinking",
  "Time Management",
  "Public Speaking",
  "Microsoft Excel",
  "Data Analysis",
  "Project Management",
  "UI/UX Design",
  "Figma",
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "REST API",
  "PostgreSQL",
  "Python",
];

const skillName = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item.trim();
  return String(item.name || item.skillName || item.title || "").trim();
};

const uniqueStrings = (items = []) => {
  const seen = new Set();
  return items
    .map(skillName)
    .filter(Boolean)
    .filter((name) => {
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

function SkillForm({
  formData,
  setFormData,
  onNext,
  onPrevious,
  isEdit = false,
  setActivePage,
}) {
  const [customSkill, setCustomSkill] = useState("");

  const skills = formData.skills || {
    selectedSkills: [],
    skillCategory: "General",
    proficiencyLevel: "Basic",
  };

  const selectedSkillNames = useMemo(
    () => uniqueStrings(skills.selectedSkills || []),
    [skills.selectedSkills]
  );

  const updateSkills = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...(prev.skills || {}),
        [field]: value,
      },
    }));
  };

  const toggleSkill = (skill) => {
    const name = skillName(skill);
    if (!name) return;

    const exists = selectedSkillNames.some(
      (item) => item.toLowerCase() === name.toLowerCase()
    );

    const updatedSkills = exists
      ? selectedSkillNames.filter((item) => item.toLowerCase() !== name.toLowerCase())
      : [...selectedSkillNames, name];

    updateSkills("selectedSkills", updatedSkills);
  };

  const handleAddCustomSkill = () => {
    const newSkill = customSkill.trim();
    if (!newSkill) return;
    toggleSkill(newSkill);
    setCustomSkill("");
  };

  const handlePreviousClick = () => {
    if (isEdit && setActivePage) {
      setActivePage("education");
      return;
    }
    onPrevious?.();
  };

  const handleNextClick = () => {
    if (isEdit && setActivePage) {
      setActivePage("certifications");
      return;
    }
    onNext?.();
  };

  return (
    <div className="skill-wrapper">
      <div className="form-card skill-card">
        <div className="card-header skill-header-card">
          <div>
            <h2>{isEdit ? "Edit Skills" : "Skills"}</h2>
            <p className="card-subtitle">
              Add skills that represent your strengths, interests, and career direction.
            </p>
          </div>
        </div>

        <div className="card-body">
          <div className="skill-info-box">
            <strong>Required</strong>
            <p>
              Pilih minimal satu skill. CAREVO akan memakai data ini untuk rekomendasi AI dan generate CV.
            </p>
          </div>

          <div className="input-grid skill-select-grid">
            <div className="field-group">
              <label>Skill Category</label>
              <select
                value={skills.skillCategory || "General"}
                onChange={(event) => updateSkills("skillCategory", event.target.value)}
              >
                <option value="General">General</option>
                <option value="Technical">Technical</option>
                <option value="Soft Skill">Soft Skill</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Data">Data</option>
                <option value="Language">Language</option>
              </select>
            </div>

            <div className="field-group">
              <label>Proficiency Level</label>
              <select
                value={skills.proficiencyLevel || "Basic"}
                onChange={(event) => updateSkills("proficiencyLevel", event.target.value)}
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="field-group skill-full">
            <label>Select Skills</label>
            <div className="skill-option-grid">
              {defaultSkills.map((skill) => {
                const active = selectedSkillNames.some(
                  (item) => item.toLowerCase() === skill.toLowerCase()
                );
                return (
                  <button
                    type="button"
                    key={skill}
                    className={`skill-option ${active ? "active" : ""}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    <span className="skill-check">{active ? "✓" : ""}</span>
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field-group skill-full">
            <label>Add Custom Skill</label>
            <div className="skill-custom-row">
              <input
                type="text"
                placeholder="e.g. Content Writing, Cooking, Data Visualization"
                value={customSkill}
                onChange={(event) => setCustomSkill(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
              />
              <button type="button" onClick={handleAddCustomSkill}>Add</button>
            </div>
          </div>

          {selectedSkillNames.length > 0 && (
            <div className="field-group skill-full">
              <label>Selected Skills</label>
              <div className="selected-skill-list">
                {selectedSkillNames.map((skill) => (
                  <button
                    type="button"
                    className="selected-skill-chip"
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill} ×
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-bottom-actions">
          <button type="button" className="btn-secondary" onClick={handlePreviousClick}>
            Previous
          </button>
          <button type="button" className="btn-primary" onClick={handleNextClick}>
            {isEdit ? "Save Changes" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SkillForm;
