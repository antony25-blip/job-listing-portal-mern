import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/jobs.css";

const API = process.env.REACT_APP_API_URL;

export default function EmployerJobs() {
    const [jobs, setJobs] = useState([]);
    const token = localStorage.getItem("token");
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const res = await axios.get(`${API}/api/jobs/my-jobs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setJobs(res.data.jobs);
                }
            } catch (err) {
                console.error("Failed to fetch employer jobs", err);
            }
        };
        fetchMyJobs();
    }, [token]);

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await axios.delete(`${API}/api/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(jobs.filter(job => job._id !== jobId));
            alert("Job deleted successfully");
        } catch (err) {
            alert("Failed to delete job");
            console.error(err);
        }
    };

    return (
        <div className="jobs-page">
            <div style={{ marginBottom: "40px" }}>
                <h1>My Job Listings</h1>
            </div>

            <div className="jobs-grid">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job._id} className="job-card" style={{ position: "relative" }}>
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
                                    <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                                        {job.location} • {job.jobType || "Full-time"}
                                    </p>
                                </div>
                            </div>

                            <div style={{ margin: "10px 0", color: "#6b8e6f", fontWeight: "bold" }}>
                                ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                            </div>

                            <p style={{ fontSize: "14px", color: "#444", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {job.description}
                            </p>

                            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                                <button
                                    className="btn-view"
                                    onClick={() => setSelectedJob(job)}
                                >
                                    View
                                </button>
                                <Link to={`/jobs/edit/${job._id}`} className="btn-edit">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(job._id)}
                                    className="btn-delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: "center", width: "100%", gridColumn: "1 / -1" }}>You haven't posted any jobs yet.</p>
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
                    </div>
                </div>
            )}
        </div>
    );
}
