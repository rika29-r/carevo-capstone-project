import {
  getChecks,
  getCompletionScore,
  getProfile,
  getSkillList,
  getExperienceList,
  getEducationList,
  getProjectList,
  getCertificationList,
  getLanguageList,
  formatYear,
} from './helpers';

function MiniIcon({ name }) {
  if (name === 'bolt') return <svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z" /></svg>;
  if (name === 'check') return <svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10" /></svg>;
  if (name === 'circle') return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg>;
  if (name === 'briefcase') return <svg viewBox="0 0 24 24"><path d="M9 7V5.5C9 4.7 9.7 4 10.5 4h3C14.3 4 15 4.7 15 5.5V7"/><path d="M4 7h16v12H4V7Z"/><path d="M4 12h16"/></svg>;
  if (name === 'education') return <svg viewBox="0 0 24 24"><path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z"/><path d="M7 11v5c1.4 1.3 3 2 5 2s3.6-.7 5-2v-5"/></svg>;
  if (name === 'cert') return <svg viewBox="0 0 24 24"><path d="M12 3.5 18.5 6v5.4c0 4-2.6 7.5-6.5 8.8-3.9-1.3-6.5-4.8-6.5-8.8V6L12 3.5Z"/><path d="m9 12 2 2 4-4"/></svg>;
  if (name === 'folder') return <svg viewBox="0 0 24 24"><path d="M3.5 6.5h6l2 2h9v9.5h-17V6.5Z"/></svg>;
  if (name === 'language') return <svg viewBox="0 0 24 24"><path d="M4 5h10"/><path d="M9 5c-.3 4.6-2.1 7.9-5 10"/><path d="M6.5 9.5c1.2 2.1 3.1 4 5.5 5.5"/><path d="M14 20l4-9 4 9"/><path d="M15.5 17h5"/></svg>;
  return null;
}

function TraitBar({ left, right, value = 0, color = 'blue', note, countLabel }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="dna-row">
      <div className="dna-labels"><span>{left}</span><span>{right}</span></div>
      <div className="dna-track" aria-label={`${left} ${safeValue}%`}>
        <span className={`dna-fill dna-${color}`} style={{ width: `${safeValue}%` }} />
        <button className="dna-knob" type="button" style={{ left: `${safeValue}%` }} aria-label={`${left} ${safeValue}%`}>
          <span className="asset-tooltip">{countLabel || `${safeValue}% completed`}</span>
        </button>
      </div>
      <p>{note}</p>
    </div>
  );
}

function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) return 'Good morning';
  if (hour >= 11 && hour < 15) return 'Good afternoon';
  if (hour >= 15 && hour < 18) return 'Good evening';
  return 'Good night';
}

function Overview({ formData = {}, goPage, aiRecommendation }) {
  const checks = getChecks(formData);
  const score = getCompletionScore(formData);
  const profile = getProfile(formData);
  const skills = getSkillList(formData);
  const experiences = getExperienceList(formData);
  const educations = getEducationList(formData);
  const projects = getProjectList(formData);
  const certifications = getCertificationList(formData);
  const languages = getLanguageList(formData);

  const certScore = certifications.length ? Math.min(100, 45 + certifications.length * 15) : 0;
  const projectScore = projects.length ? Math.min(100, 35 + projects.length * 18) : 0;
  const languageScore = languages.length ? Math.min(100, 40 + languages.length * 15) : 0;
  const careerType = certifications.length && projects.length && languages.length ? 'READY PROFILE' : certifications.length ? 'CERTIFIED' : 'BUILDING';
  const aiScore = aiRecommendation?.matchScore || score;
  const topPaths = aiRecommendation?.topPathMatches?.length ? aiRecommendation.topPathMatches : [
    { name: certifications[0]?.certificateName || 'Certification Readiness', score: certScore },
    { name: projects[0]?.title || 'Project Portfolio', score: projectScore },
  ];

  return (
    <div className="overview-page pro-overview">
      <div className="overview-title-block">
        <h1>{getTimeGreeting()}, {profile.name.split(' ')[0]}!</h1>
        <p>Here's what's happening with your career trajectory today.</p>
      </div>

      <div className="overview-hero-grid">
        <div className="profile-hero-card">
          <div className="profile-avatar-wrap">
            {profile.image ? <img src={profile.image} alt="Profile" /> : <span>{profile.name.slice(0, 1)}</span>}
            <em><MiniIcon name="check" /></em>
          </div>
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.title}</p>
            <div className="profile-hero-meta">
              <span>{profile.location}</span>
              <span>{profile.bio.slice(0, 42)}</span>
            </div>
          </div>
          <button type="button" onClick={() => goPage?.('profile')}>Edit Profile</button>
        </div>

        <div className="profile-strength-card">
          <div className="strength-head"><span>PROFILE STRENGTH</span><strong>{score}%</strong></div>
          <div className="strength-bar"><span style={{ width: `${score}%` }} /></div>
          <ul>
            <li className={checks.personalInfo ? 'done' : ''}><MiniIcon name={checks.personalInfo ? 'check' : 'circle'} /> Personal info completed</li>
            <li className={checks.experience ? 'done' : ''}><MiniIcon name={checks.experience ? 'check' : 'circle'} /> Experience timeline set</li>
            <li className={checks.projects || checks.languages ? 'done' : ''}><MiniIcon name={checks.projects || checks.languages ? 'check' : 'circle'} /> Optional project/language data</li>
          </ul>
        </div>
      </div>

      <div className="overview-main-grid">
        <div className="ai-score-card">
          <div className="ai-score-head"><div><h3>AI MATCH SCORE</h3><p>Profile Synergy Rating</p></div><MiniIcon name="bolt" /></div>
          <div className="score-ring" style={{ '--score': `${aiScore * 3.6}deg` }}>
            <div><strong>{aiScore}</strong><span>%</span><small>{aiRecommendation?.level || (aiScore >= 80 ? 'ELITE PROFILE' : aiScore >= 55 ? 'GROWING PROFILE' : 'START PROFILE')}</small></div>
            <span className="score-ring-tooltip">{aiRecommendation?.recommendedCategory || `Profile completion ${score}/100`}</span>
          </div>
          <div className="path-match-list">
            <p>{aiRecommendation?.recommendedCategory ? `COCOK DI: ${aiRecommendation.recommendedCategory}` : 'TOP PATH MATCHES'}</p>
            {topPaths.slice(0, 3).map((path, index) => (
              <div key={`${path.name}-${index}`}><span>{path.name}</span><strong>{path.score}%</strong></div>
            ))}      
          </div>
        </div>

        <div className="career-dna-card">
          <div className="dna-card-head"><div><h2>Career Assets DNA</h2><p>Certification, project, and language alignment</p></div><span>{careerType}</span></div>
          <TraitBar left="CERTIFICATION" right={certifications.length ? 'VERIFIED' : 'EMPTY'} value={certScore} color="purple" countLabel={`${certifications.length} certification • ${certScore}/100`} note={certifications.length ? 'Certification data is ready to strengthen your professional credibility.' : 'Certification belum diisi. Garis tetap 0 karena data masih kosong.'} />
          <TraitBar left="PROJECT" right={projects.length ? 'AVAILABLE' : 'OPTIONAL'} value={projectScore} color="blue" countLabel={`${projects.length} project • ${projectScore}/100`} note={projects.length ? 'Project portfolio sudah terisi dan dapat ditampilkan di CV.' : 'Project bersifat optional, jadi tidak menghambat dashboard dan CV.'} />
          <TraitBar left="LANGUAGE" right={languages.length ? 'AVAILABLE' : 'OPTIONAL'} value={languageScore} color="green" countLabel={`${languages.length} language • ${languageScore}/100`} note={languages.length ? 'Language profile membantu menunjukkan kemampuan komunikasi.' : 'Language bersifat optional dan bisa dikosongkan.'} />
        </div>
      </div>

      <div className="overview-mini-grid">
        <div className="top-skills-card dash-card-lite">
          <div className="summary-head"><h3>TOP SKILLS</h3><button type="button" onClick={() => goPage?.('skill')}>View All</button></div>
          {(skills.length ? skills.slice(0, 4) : [{ name: 'Skill belum diisi', level: 'Basic' }]).map((skill, index) => (
            <div className="skill-line" key={`${skill.name}-${index}`}>
              <div><span>{skill.name}</span><small>{skill.level || 'Basic'}</small></div>
              <b><i style={{ width: `${skill.level === 'Expert' ? 92 : skill.level === 'Advanced' ? 78 : skill.level === 'Intermediate' ? 58 : 35}%` }} /></b>
            </div>
          ))}
        </div>

        <div className="overview-summary-card dash-card-lite">
          <div className="summary-head"><span><MiniIcon name="briefcase" /> EXPERIENCE OVERVIEW</span><button type="button" onClick={() => goPage?.('experience')}>View All</button></div>
          {(experiences.length ? experiences.slice(0, 2) : [{ jobTitle: 'Belum ada experience', companyName: 'Isi form Experience' }]).map((item, index) => (
            <div className="summary-item" key={index}><MiniIcon name="briefcase" /><div><strong>{item.jobTitle || 'Experience'}</strong><p>{item.companyName || '-'} • {formatYear(item.startDate)} {item.currentlyWork ? '— Present' : item.endDate ? `— ${formatYear(item.endDate)}` : ''}</p></div></div>
          ))}
        </div>

        <div className="overview-summary-card dash-card-lite">
          <div className="summary-head"><span><MiniIcon name="education" /> EDUCATION OVERVIEW</span><button type="button" onClick={() => goPage?.('education')}>View All</button></div>
          {(educations.length ? educations.slice(0, 2) : [{ degreeMajor: 'Belum ada education', institutionName: 'Isi form Education' }]).map((item, index) => (
            <div className="summary-item" key={index}><MiniIcon name="education" /><div><strong>{item.degreeMajor || 'Education'}</strong><p>{item.institutionName || '-'} • {formatYear(item.endDate)}</p></div></div>
          ))}
        </div>
      </div>

      <div className="overview-assets-grid">
        <button type="button" className="asset-display-card" onClick={() => goPage?.('certification')}><MiniIcon name="cert" /><div><span>CERTIFICATIONS</span><strong>{certifications.length}</strong><p>{certifications[0]?.certificateName || 'Belum ada sertifikasi'}</p></div></button>
        <button type="button" className="asset-display-card" onClick={() => goPage?.('project')}><MiniIcon name="folder" /><div><span>PROJECTS</span><strong>{projects.length}</strong><p>{projects[0]?.title || 'Optional, boleh dikosongkan'}</p></div></button>
        <button type="button" className="asset-display-card" onClick={() => goPage?.('language')}><MiniIcon name="language" /><div><span>LANGUAGES</span><strong>{languages.length}</strong><p>{languages[0]?.language || 'Optional, boleh dikosongkan'}</p></div></button>
      </div>

      <div className="recent-activity-card">
        <h3>RECENT ACTIVITY</h3>
        <div className="activity-row"><span className="blue"><MiniIcon name="briefcase" /></span><div><strong>Dashboard synced with form data</strong><p>Data yang sudah diisi otomatis tampil di dashboard.</p></div><small>NOW</small></div>
        <div className="activity-row"><span className="purple"><MiniIcon name="cert" /></span><div><strong>Certification status checked</strong><p>{checks.certifications ? 'Certification sudah masuk ke career assets DNA.' : 'Certification belum diisi.'}</p></div><small>TODAY</small></div>
        <div className="activity-row"><span className="green"><MiniIcon name="language" /></span><div><strong>Optional sections verified</strong><p>Project dan language tidak wajib, tetap bisa lanjut.</p></div><small>TODAY</small></div>
      </div>
    </div>
  );
}

export default Overview;
