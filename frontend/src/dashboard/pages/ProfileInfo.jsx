import { useEffect, useState } from 'react';
import { getProfile, getExperienceList, getEducationList, getProjectList, getSkillList, getCompletionScore } from './helpers';

function Icon({ name }) {
  if (name === 'user') return <svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>;
  if (name === 'briefcase') return <svg viewBox="0 0 24 24"><path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4c1 0 1.8.8 1.8 1.8V7"/><path d="M4 7h16v12H4V7Z"/></svg>;
  if (name === 'education') return <svg viewBox="0 0 24 24"><path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z"/><path d="M7 11v5c1.3 1.4 3 2 5 2s3.7-.6 5-2v-5"/></svg>;
  if (name === 'folder') return <svg viewBox="0 0 24 24"><path d="M3.5 6.5h6l2 2h9v9.5h-17V6.5Z"/></svg>;
  if (name === 'mail') return <svg viewBox="0 0 24 24"><path d="M4 6h16v12H4V6Z"/><path d="m4 7 8 6 8-6"/></svg>;
  if (name === 'pin') return <svg viewBox="0 0 24 24"><path d="M12 21s7-5.4 7-12a7 7 0 0 0-14 0c0 6.6 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>;
  if (name === 'star') return <svg viewBox="0 0 24 24"><path d="M12 3 14.2 8.4 20 9l-4.4 3.7 1.3 5.7L12 15.3 7.1 18.4l1.3-5.7L4 9l5.8-.6L12 3Z"/></svg>;
  if (name === 'check') return <svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10"/></svg>;
  if (name === 'save') return <svg viewBox="0 0 24 24"><path d="M5 4h12l2 2v14H5V4Z"/><path d="M8 4v6h8V4"/><path d="M8 20v-6h8v6"/></svg>;
  return null;
}

function ProfileInput({ label, icon, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="profile-edit-field">
      <span>{label}</span>
      <div>
        <Icon name={icon} />
        <input type={type} value={value || ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      </div>
    </label>
  );
}

function ProfileInfo({ formData = {}, setFormData, notify }) {
  const personalInfo = formData.personalInfo || {};
  const [draft, setDraft] = useState(personalInfo);
  const profile = getProfile({ ...formData, personalInfo: draft });
  const score = getCompletionScore({ ...formData, personalInfo: draft });
  const expCount = getExperienceList(formData).length;
  const eduCount = getEducationList(formData).length;
  const projectCount = getProjectList(formData).length;
  const skills = getSkillList(formData);

  useEffect(() => {
    setDraft(formData.personalInfo || {});
  }, [formData.personalInfo]);

  const update = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      update('profileImage', reader.result);
      update('profileImageName', file.name);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    const requiredTitle = (draft.professionalTitle || draft.careerInterest || '').trim();

    if (!String(draft.fullName || '').trim()) {
      notify?.('error', 'Data Belum Lengkap', 'Full Name wajib diisi.');
      return;
    }

    if (!requiredTitle) {
      notify?.('error', 'Data Belum Lengkap', 'Headline atau Career Interest wajib diisi.');
      return;
    }

    if (!String(draft.location || '').trim()) {
      notify?.('error', 'Data Belum Lengkap', 'Location wajib diisi.');
      return;
    }

    if (!String(draft.shortBio || '').trim()) {
      notify?.('error', 'Data Belum Lengkap', 'About Me / Short Bio wajib diisi.');
      return;
    }

    const nextProfile = {
      ...draft,
      careerInterest: draft.careerInterest || requiredTitle,
      professionalTitle: draft.professionalTitle || requiredTitle,
    };

    setFormData?.((prev) => ({ ...prev, personalInfo: nextProfile }));
    notify?.('success', 'Profile Updated', 'Personal information berhasil disimpan.');
  };

  return (
    <div className="profile-display-page">
      <div className="display-header">
        <div><h1>Personal Information</h1><p>Update your personal details and contact information.</p></div>
        <button type="button" onClick={saveProfile}><Icon name="save" /> Save Changes</button>
      </div>

      <div className="profile-detail-card">
        <h2><Icon name="user" /> Profile Details</h2>
        <div className="profile-detail-grid">
          <div className="profile-photo-block">
            <label className="profile-big-photo profile-edit-photo">
              {draft.profileImage ? <img src={draft.profileImage} alt="Profile" /> : profile.name.slice(0,1)}
              <input type="file" accept="image/png,image/jpeg,image/gif" onChange={handleImageChange} />
            </label>
            <small>{draft.profileImageName || 'JPG, PNG OR GIF. MAX 2MB.'}</small>
          </div>
          <div className="profile-info-grid">
            <ProfileInput label="FULL NAME" icon="user" value={draft.fullName || ''} placeholder="CAREVO User" onChange={(value) => update('fullName', value)} />
            <ProfileInput label="HEADLINE" icon="briefcase" value={draft.professionalTitle || draft.careerInterest || ''} placeholder="Career Explorer" onChange={(value) => update('careerInterest', value)} />
            <ProfileInput label="LOCATION" icon="pin" value={draft.location || ''} placeholder="Jakarta, Indonesia" onChange={(value) => update('location', value)} />
            <ProfileInput label="EMAIL" icon="mail" value={draft.email || ''} placeholder="email@example.com" type="email" onChange={(value) => update('email', value)} />
          </div>
        </div>
      </div>

      <div className="profile-two-grid">
        <div className="profile-box"><h2><Icon name="user" /> About Me</h2><textarea className="profile-bio-edit" value={draft.shortBio || ''} placeholder="Lengkapi bio singkat agar profil terlihat lebih profesional." onChange={(event) => update('shortBio', event.target.value)} /></div>
        <div className="profile-box"><h2><Icon name="mail" /> Contact Information</h2><p>{draft.location || 'Location not set'}</p><p>{draft.email || 'Email belum diisi'}</p><p>{draft.phone || 'Nomor HP belum diisi'}</p></div>
      </div>

      <div className="profile-bottom-grid">
        <div className="profile-box"><h2><Icon name="star" /> Personal Stats</h2><div className="personal-stat-grid"><div><Icon name="briefcase"/><strong>{expCount}</strong><span>Experience</span></div><div><Icon name="education"/><strong>{eduCount}</strong><span>Education</span></div><div><Icon name="star"/><strong>{skills.length}</strong><span>Skills</span></div><div><Icon name="folder"/><strong>{projectCount}</strong><span>Projects</span></div></div></div>
        <div className="profile-box strength-profile-box"><h2>Profile Strength</h2><div className="small-ring" style={{ '--score': `${score * 3.6}deg` }}><strong>{score}%</strong><span>{score >= 80 ? 'STRONG' : 'GROWING'}</span><em className="score-ring-tooltip">Profile strength {score}/100</em></div><ul><li><Icon name="check"/> Complete profile info</li><li><Icon name="check"/> Add experience</li><li><Icon name="check"/> Add education and skills</li></ul></div>
      </div>

      <div className="profile-box"><h2><Icon name="star" /> Skills & Expertise</h2><div className="profile-chip-wrap">{skills.length ? skills.map((skill, i) => <span key={i}>{skill.name}</span>) : <span>Belum ada skill</span>}</div></div>
    </div>
  );
}

export default ProfileInfo;
