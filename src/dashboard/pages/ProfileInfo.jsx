import { EmptyState, PageHeader } from './Shared';
function ProfileInfo() { return <><PageHeader title="Profile Info" subtitle="Bagian ini dapat dikembangkan oleh anggota tim lain." /><div className="dash-card"><EmptyState title="Profile Info belum dibuat" message="Nanti data personal user akan tampil di sini." /></div></>; }
export default ProfileInfo;
