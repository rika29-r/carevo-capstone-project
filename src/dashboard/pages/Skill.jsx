import { EmptyState, PageHeader } from './Shared';
function Skill({ formData }) { const skills = formData?.experience?.skillsUsed || []; return <><PageHeader title="Skills" subtitle="Skills yang berasal dari form Experience." /><div className="dash-card">{skills.length ? <div className="dash-chips">{skills.map((skill, index) => <span key={`${skill}-${index}`}>{skill}</span>)}</div> : <EmptyState title="Skill belum diisi" message="Tambahkan skills di form Experience." />}</div></>; }
export default Skill;
