import '../form.css';

function SkillForm({ onNext, onPrevious }) {
  const skills = ['Team Leadership', 'Public Speaking', 'Agile Methodology', 'Critical Thinking', 'Conflict Resolution', 'Mentorship'];

  return (
    <div className="skill-page">
      <div className="skill-container">
        <div className="skill-header">
          <h2>Add Skills</h2>
          <p>Define your technical expertise and professional strengths.</p>
        </div>

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

        <div className="field-group">
          <label>Select Skills</label>

          <div className="skill-grid">
            {skills.map((skill) => (
              <label className="skill-box" key={skill}>
                <input type="checkbox" />
                <span>{skill}</span>
              </label>
            ))}

            <button type="button" className="skill-custom-btn">
              + Custom Skill
            </button>
          </div>
        </div>

        <button type="button" className="skill-add-btn">
          Add to Profile
        </button>

        <div className="skill-bottom">
          <button type="button" className="btn-secondary" onClick={onPrevious}>
            Previous
          </button>

          <button type="button" className="btn-primary" onClick={onNext}>
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
}

export default SkillForm;
