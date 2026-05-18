import { useState } from 'react';
import '../form.css';

function SkillForm({ formData, setFormData, onNext, onPrevious, setActivePage, isEdit }) {
  const [customSkill, setCustomSkill] = useState('');

  const [skills, setSkills] = useState(['Team Leadership', 'Public Speaking', 'Agile Methodology', 'Critical Thinking', 'Conflict Resolution', 'Mentorship']);

  const selectedSkills = formData?.skills?.selectedSkills || [];

  const toggleSkill = (skill) => {
    const updatedSkills = selectedSkills.includes(skill) ? selectedSkills.filter((item) => item !== skill) : [...selectedSkills, skill];

    setFormData((prev) => ({
      ...prev,

      skills: {
        ...prev.skills,
        selectedSkills: updatedSkills,
      },
    }));
  };

  const handleAddCustomSkill = () => {
    const newSkill = customSkill.trim();

    if (!newSkill) return;

    if (skills.includes(newSkill)) {
      setCustomSkill('');
      return;
    }

    setSkills((prev) => [...prev, newSkill]);

    setCustomSkill('');
  };

  return (
    <div className="skill-page">
      <div className="skill-container">
        {/* HEADER */}
        <div className="skill-header">
          <h2>{isEdit ? 'Edit Skills' : 'Add Skills'}</h2>

          <p>{isEdit ? 'Update your skills and expertise.' : 'Define your technical expertise and professional strengths.'}</p>
        </div>

        {/* SELECT */}
        <div className="skill-select-wrapper">
          <div className="field-group">
            <label>Select Category</label>

            <select>
              <option>Technical</option>

              <option>Soft Skill</option>

              <option>Design</option>
            </select>
          </div>

          <div className="field-group">
            <label>Proficiency Level</label>

            <select>
              <option>Beginner</option>

              <option>Intermediate</option>

              <option>Advanced</option>

              <option>Expert</option>
            </select>
          </div>
        </div>

        {/* SKILLS */}
        <div className="field-group">
          <label>Select Skills</label>

          <div className="skill-grid">
            {skills.map((skill) => (
              <label className="skill-box" key={skill}>
                <input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => toggleSkill(skill)} />

                <span>{skill}</span>
              </label>
            ))}

            {/* CUSTOM */}
            <div className="skill-custom-input-box">
              <input type="text" placeholder="Custom Skill" value={customSkill} onChange={(event) => setCustomSkill(event.target.value)} />

              <button type="button" onClick={handleAddCustomSkill}>
                +
              </button>
            </div>
          </div>
        </div>

        {/* BUTTON AREA */}
        <div className="skill-bottom">
          {isEdit ? (
            <>
              <button type="button" className="btn-secondary" onClick={() => setActivePage('education')}>
                Previous
              </button>

              <button type="button" className="btn-primary" onClick={() => setActivePage('certification')}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn-secondary" onClick={onPrevious}>
                Previous
              </button>

              <button type="button" className="btn-primary" onClick={onNext}>
                Next Step →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SkillForm;
