import { StatCard, StatusRow, PageHeader } from './Shared';

function Overview({ formData, checks }) {
  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Ringkasan data yang sudah kamu isi dari form CAREVO."
      />

      <div className="overview-grid">
        <StatCard title="Experience" value={checks.experience ? 'Complete' : 'Empty'} />
        <StatCard title="Projects" value={checks.projects ? 'Complete' : 'Empty'} />
        <StatCard title="Languages" value={checks.languages ? 'Complete' : 'Empty'} />
        <StatCard title="Skills" value={`${formData?.experience?.skillsUsed?.length || 0} Skills`} />
      </div>

      <div className="dash-card">
        <h2>Profile Data Status</h2>
        <div className="status-list">
          <StatusRow label="Personal Info" active={checks.personalInfo} />
          <StatusRow label="Experience" active={checks.experience} />
          <StatusRow label="Education" active={checks.education} />
          <StatusRow label="Skills" active={checks.skills} />
          <StatusRow label="Projects" active={checks.projects} />
          <StatusRow label="Certifications" active={checks.certifications} />
          <StatusRow label="Languages" active={checks.languages} />
        </div>
      </div>
    </>
  );
}

export default Overview;
