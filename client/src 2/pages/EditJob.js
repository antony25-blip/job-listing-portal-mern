import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/auth.css";

const API = process.env.REACT_APP_API_URL;

export default function EditJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [job, setJob] = useState({
        title: "",
        description: "",
        qualifications: "",
        responsibilities: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        jobType: ""
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                // Fetch specific job (assuming we have an endpoint or fetch all and filter)
                // Ideally backend should have GET /api/jobs/:id. 
                // For now, let's use the public list and filter, or assume GET /api/jobs works for all.
                // Wait, backend has PUT /:jobId but GET is / (all) or /my-jobs
                // Let's use /my-jobs and find the one.
                const res = await axios.get(`${API}/api/jobs/my-jobs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const foundJob = res.data.jobs.find(j => j._id === jobId);

                if (foundJob) {
                    setJob({
                        ...foundJob,
                        salaryMin: foundJob.salaryMin,
                        salaryMax: foundJob.salaryMax,
                        jobType: foundJob.jobType || "Full-time",
                        qualifications: foundJob.qualifications.join(", "),
                        responsibilities: foundJob.responsibilities.join(", ")
                    });
                }
            } catch (err) {
                console.error("Failed to fetch job", err);
            }
        };
        fetchJob();
    }, [jobId, token]);

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: job.title,
                description: job.description,
                location: job.location,
                jobType: job.jobType,

                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                qualifications: typeof job.qualifications === 'string' ? job.qualifications.split(",").map(s => s.trim()) : job.qualifications,
                responsibilities: typeof job.responsibilities === 'string' ? job.responsibilities.split(",").map(s => s.trim()) : job.responsibilities
            };

            await axios.put(`${API}/api/jobs/${jobId}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Job updated successfully!");
            navigate("/profile/employer"); // Go back to profile
        } catch (err) {
            alert("Failed to update job");
            console.error(err);
        }
    };

    return (
        <div className="auth-box" style={{ maxWidth: "600px" }}>
            <h2>Edit Job</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    value={job.title}
                    placeholder="Job Title"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    value={job.description}
                    placeholder="Job Description"
                    rows="4"
                    onChange={handleChange}
                    required
                />

                <input
                    name="location"
                    value={job.location}
                    placeholder="Location"
                    onChange={handleChange}
                    required
                />

                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        name="salaryMin"
                        value={job.salaryMin}
                        type="number"
                        placeholder="Min Salary"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="salaryMax"
                        value={job.salaryMax}
                        type="number"
                        placeholder="Max Salary"
                        onChange={handleChange}
                        required
                    />
                </div>

                <select
                    name="jobType"
                    value={job.jobType}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        margin: "10px 0",
                        borderRadius: "5px",
                        border: "1px solid #ccc"
                    }}
                >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                </select>

                <textarea
                    name="qualifications"
                    value={job.qualifications}
                    placeholder="Qualifications (comma separated)"
                    rows="3"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="responsibilities"
                    value={job.responsibilities}
                    placeholder="Responsibilities (comma separated)"
                    rows="3"
                    onChange={handleChange}
                    required
                />

                <button type="submit">Update Job</button>
            </form>
        </div>
    );
}
