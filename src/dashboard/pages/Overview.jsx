import './overview.css';

function Overview({ formData }) {
  return (
    <div className="overview-page">
      {/* HEADER */}
      <div className="overview-header">
        <p className="overview-label">Dashboard Information</p>

        <h1>
          Good evening,
          {formData?.personalInfo?.fullName || ' Alex Sterling'}!
        </h1>

        <p className="overview-subtitle">Here’s what’s happening with your career trajectory today.</p>
      </div>

      {/* TOP SECTION */}
      <div className="overview-top-grid">
        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="profile-card-left">
            <img src="https://i.pravatar.cc/300?img=47" alt="Profile" className="profile-avatar" />

            <div>
              <h3>{formData?.personalInfo?.fullName || 'Alex Sterling'}</h3>

              <p>{formData?.personalInfo?.professionalTitle || 'Senior Product Designer @ Meta'}</p>

              <span>{formData?.personalInfo?.location || 'San Francisco, CA'}</span>
            </div>
          </div>

          <button className="edit-profile-btn">Edit Profile</button>
        </div>

        {/* PROFILE STRENGTH */}
        <div className="strength-card">
          <div className="strength-top">
            <h3>PROFILE STRENGTH</h3>

            <div className="strength-percent">85%</div>
          </div>

          <div className="strength-bar">
            <div className="strength-fill"></div>
          </div>

          <div className="strength-list">
            <p>✔ Verified contact info</p>
            <p>✔ Experience timeline set</p>
            <p>○ Add portfolio link (+15%)</p>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="overview-middle-grid">
        {/* AI MATCH SCORE */}
        <div className="match-card">
          <p className="match-label">AI Match Score</p>

          <div className="match-circle">
            <span>92%</span>
          </div>

          <div className="match-career">
            <p>Recommended Career</p>

            <h3>Data Analyst</h3>
          </div>

          <div className="career-tags">
            <span>Analytical</span>
            <span>SQL</span>
            <span>Problem Solving</span>
          </div>
        </div>

        {/* CAREER DNA */}
        <div className="dna-card">
          <h3>Career DNA</h3>

          <p className="dna-subtitle">Psychometric personality alignment</p>

          <div className="dna-group">
            <div className="dna-row">
              <span>Structured</span>
              <span>Adaptive</span>
            </div>

            <div className="dna-line">
              <div className="dna-dot" style={{ left: '70%' }}></div>
            </div>
          </div>

          <div className="dna-group">
            <div className="dna-row">
              <span>Specialist</span>
              <span>Generalist</span>
            </div>

            <div className="dna-line">
              <div className="dna-dot" style={{ left: '88%' }}></div>
            </div>
          </div>

          <div className="dna-group">
            <div className="dna-row">
              <span>Introvert</span>
              <span>Extrovert</span>
            </div>

            <div className="dna-line">
              <div className="dna-dot" style={{ left: '65%' }}></div>
            </div>
          </div>

          <div className="dna-group">
            <div className="dna-row">
              <span>Analytical</span>
              <span>Creative</span>
            </div>

            <div className="dna-line">
              <div className="dna-dot dna-green" style={{ left: '42%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="overview-bottom-grid">
        {/* TOP SKILLS */}
        <div className="skills-card">
          <h3>Top Skills</h3>

          <div className="skill-item">
            <div className="skill-item-top">
              <span>Python</span>
              <span>Expert</span>
            </div>

            <div className="skill-bar">
              <div className="skill-fill" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div className="skill-item">
            <div className="skill-item-top">
              <span>SQL</span>
              <span>Advanced</span>
            </div>

            <div className="skill-bar">
              <div className="skill-fill" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="skill-item">
            <div className="skill-item-top">
              <span>Data Visualization</span>
              <span>Expert</span>
            </div>

            <div className="skill-bar">
              <div className="skill-fill" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="experience-card">
          <h3>Experience Overview</h3>

          <div className="overview-mini-card">
            <h4>Senior Product Designer</h4>

            <p>Meta • 2021 — Present</p>
          </div>

          <div className="overview-mini-card">
            <h4>UX Lead</h4>

            <p>Spotify • 2018 — 2021</p>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="education-card">
          <h3>Education Overview</h3>

          <div className="overview-mini-card">
            <h4>MFA in Design Technology</h4>

            <p>Parsons School of Design</p>
          </div>

          <div className="overview-mini-card">
            <h4>BS in Computer Science</h4>

            <p>Stanford University</p>
          </div>
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="activity-card">
        <h3>Recent Activity</h3>

        <div className="activity-item">
          <p>Updated experience at TechVision Global</p>
          <span>2H AGO</span>
        </div>

        <div className="activity-item">
          <p>Added “Advanced Prototyping” skill</p>
          <span>YESTERDAY</span>
        </div>

        <div className="activity-item">
          <p>Exported CV to “Modern Minimalist” PDF</p>
          <span>3 DAYS AGO</span>
        </div>
      </div>
    </div>
  );
}

export default Overview;
