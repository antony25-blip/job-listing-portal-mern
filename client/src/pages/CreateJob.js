import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css"; // Reuse auth styles for consistency

const API = process.env.REACT_APP_API_URL;

export default function CreateJob() {
    const [job, setJob] = useState({
        title: "",
        description: "",
        qualifications: "",
        responsibilities: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        jobType: "Full-time"
    });

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...job,
                qualifications: job.qualifications.split(",").map(s => s.trim()),
                responsibilities: job.responsibilities.split(",").map(s => s.trim())
            };

            await axios.post(`${API}/api/jobs`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Job posted successfully!");
            navigate("/my-jobs"); // Redirect to employer jobs list
        } catch (err) {
            alert("Failed to post job");
            console.error(err);
        }
    };

    return (
        <div className="auth-box" style={{ maxWidth: "600px" }}>
            <h2>Post a New Job</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    placeholder="Job Title"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Job Description"
                    rows="4"
                    onChange={handleChange}
                    required
                />

                <input
                    name="location"
                    placeholder="Location (e.g. Remote, NY)"
                    onChange={handleChange}
                    required
                />

                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        name="salaryMin"
                        type="number"
                        placeholder="Min Salary"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="salaryMax"
                        type="number"
                        placeholder="Max Salary"
                        onChange={handleChange}
                        required
                    />
                </div>

                <select
                    name="jobType"
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
                    placeholder="Qualifications (comma separated)"
                    rows="3"
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="responsibilities"
                    placeholder="Responsibilities (comma separated)"
                    rows="3"
                    onChange={handleChange}
                    required
                />

                <button type="submit">Post Job</button>
            </form>
        </div>
    );
}
