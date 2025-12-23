import "../styles/jobs.css";

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <span>{job.location} • {job.type}</span>
      <button>Apply</button>
    </div>
  );
}