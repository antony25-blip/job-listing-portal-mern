import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/jobs.css";

const API = process.env.REACT_APP_API_URL;

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [search, setSearch] = useState({
    keyword: "",
    location: "",
    jobType: ""
  });

  /* ================= SEARCH JOBS ================= */
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs`, {
        params: search
      });
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="jobs-page">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1>Find Your Next Opportunity</h1>
        <p>Browse through hundreds of job listings.</p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-bar" style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
          flexWrap: "wrap"
        }}>
          <input
            placeholder="Search keyword..."
            value={search.keyword}
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", width: "300px" }}
            onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          />
          <input
            placeholder="Location..."
            value={search.location}
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", width: "200px" }}
            onChange={(e) => setSearch({ ...search, location: e.target.value })}
          />
          <select
            value={search.jobType}
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", width: "150px" }}
            onChange={(e) => setSearch({ ...search, jobType: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
          <button type="submit" style={{ padding: "12px 20px", borderRadius: "8px", background: "#333", color: "#fff", border: "none", cursor: "pointer" }}>
            Search
          </button>
        </form>
      </div>

      <div className="jobs-grid">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
                {job.companyLogo && (
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                  />
                )}
                <div>
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>{job.title}</h3>
                  <p style={{ margin: 0, color: "#666", fontSize: "14px", fontWeight: "500" }}>
                    {job.companyName || "Confidential"}
                  </p>
                </div>
              </div>

              <p style={{ color: "#666", fontSize: "14px" }}>
                📍 {job.location} • 💼 {job.jobType || "Full-time"}
              </p>

              <div style={{ margin: "10px 0", color: "#6b8e6f", fontWeight: "bold" }}>
                ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
              </div>

              <p style={{ fontSize: "14px", color: "#444", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "15px" }}>
                {job.description}
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setSelectedJob(job)} className="btn-view">View</button>
                <button onClick={() => alert("Apply feature coming soon!")}>Apply Now</button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>No jobs found matching your criteria.</p>
        )}
      </div>

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setSelectedJob(null)}>&times;</button>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              {selectedJob.companyLogo && (
                <img
                  src={selectedJob.companyLogo}
                  alt="Logo"
                  style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }}
                />
              )}
              <h2 style={{ margin: "0 0 5px 0" }}>{selectedJob.title}</h2>
              <p style={{ color: "#666", margin: 0 }}>{selectedJob.companyName || "Company Name"}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px", background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
              <div>
                <strong>📍 Location:</strong> <br /> {selectedJob.location}
              </div>
              <div>
                <strong>💼 Job Type:</strong> <br /> {selectedJob.jobType}
              </div>
              <div>
                <strong>💰 Salary:</strong> <br /> ${selectedJob.salaryMin?.toLocaleString()} - ${selectedJob.salaryMax?.toLocaleString()}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ borderBottom: "2px solid #a8d5ba", display: "inline-block", paddingBottom: "3px" }}>Description</h4>
              <p style={{ lineHeight: "1.6", color: "#444" }}>{selectedJob.description}</p>
            </div>

            {selectedJob.qualifications?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ borderBottom: "2px solid #a8d5ba", display: "inline-block", paddingBottom: "3px" }}>Qualifications</h4>
                <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
                  {selectedJob.qualifications.map((q, i) => (
                    <li key={i} style={{ marginBottom: "5px", color: "#444" }}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedJob.responsibilities?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ borderBottom: "2px solid #a8d5ba", display: "inline-block", paddingBottom: "3px" }}>Responsibilities</h4>
                <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
                  {selectedJob.responsibilities.map((r, i) => (
                    <li key={i} style={{ marginBottom: "5px", color: "#444" }}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                onClick={() => alert("Apply feature coming soon!")}
                style={{ padding: "12px 30px", fontSize: "16px", borderRadius: "8px" }}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
