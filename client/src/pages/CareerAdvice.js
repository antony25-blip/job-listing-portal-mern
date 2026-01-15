import { useState } from "react";
import "../styles/career.css";
import "../styles/jobs.css"; // Reuse modal styles

export default function CareerAdvice() {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const guides = {
    resume: {
      title: "Resume Guide 2026",
      content: (
        <>
          <h4>1. Keep it Concise</h4>
          <p>Aim for a one-page resume unless you have 10+ years of experience. Recruiters spend less than 1 minute scanning a resume.</p>

          <h4>2. Tailor for ATS</h4>
          <p>Use keywords from the job description. Applicant Tracking Systems (ATS) scan for these matches before a human sees your resume.</p>

          <h4>3. Focus on Achievements</h4>
          <p>Don't just list duties. Quantify your impact. <br /><em>Bad:</em> "Managed sales." <br /><em>Good:</em> "Increased regional sales by 30% in Q3."</p>

          <h4>4. Action Verbs</h4>
          <p>Start bullet points with strong verbs like "Spearheaded," "Optimized," "Developed," rather than "Responsible for."</p>
        </>
      )
    },
    linkedin: {
      title: "LinkedIn Optimization",
      content: (
        <>
          <h4>1. Professional Headshot</h4>
          <p>Profiles with professional photos get 14x more views. Ensure good lighting and a friendly expression.</p>

          <h4>2. Value-Driven Headline</h4>
          <p>Don't just use your job title. Describe your value. <br /><em>Example:</em> "Software Engineer | Building Scalable Web Apps | React & Node.js"</p>

          <h4>3. Engagement is Key</h4>
          <p>Comment on industry posts. Publishing your own content establishes you as a thought leader in your field.</p>

          <h4>4. The "About" Section</h4>
          <p>Write a compelling summary. It's your elevator pitch. Focus on your passion, key skills, and what drives you.</p>
        </>
      )
    },
    salary: {
      title: "Salary Negotiation Tips",
      content: (
        <>
          <h4>1. Research Market Value</h4>
          <p>Use tools like Glassdoor and Payscale to know the range for your role and location. Knowledge is power.</p>

          <h4>2. Wait for the Offer</h4>
          <p>Don't discuss salary numbers too early. Negotiate after they have decided they want to hire you.</p>

          <h4>3. Total Compensation</h4>
          <p>Look beyond the base salary. Consider bonuses, equity, remote work benefits, and health insurance.</p>

          <h4>4. Use Data, Not Emotion</h4>
          <p>Justify your request with your skills, experience, and market data, not your personal financial needs.</p>
        </>
      )
    }
  };

  const interviewQuestions = [
    {
      question: "Tell me about yourself.",
      answer: "Keep your answer professional and brief. Focus on your career history, key achievements, and why you're interested in this role. Structure it as: Present (current role), Past (experience), and Future (goals)."
    },
    {
      question: "What are your greatest strengths?",
      answer: "Choose strengths that are relevant to the job. providing examples. Common ones include problem-solving, adaptability, and teamwork. 'I pride myself on my ability to solve complex problems efficiently...'"
    },
    {
      question: "Why do you want to work here?",
      answer: "Show you've done your research. Mention specific projects, company culture, or reputation. 'I've followed your company's work in AI ethics and I'm impressed by how this company will help growing together. I believe my skills and experience increases with company growth.'"
    }
  ];

  return (
    <div className="career-container">
      <div className="career-header">
        <h1>Career Growth Center</h1>
        <p>Expert tips and resources to help you land your dream job and advance your career.</p>
      </div>

      <div className="resources-grid">
        {/* RESUME CARD */}
        <div className="resource-card">
          <div className="card-icon">📄</div>
          <h3>Resume Guide</h3>
          <p>
            Your resume is your first impression. Learn how to craft a compelling resume that catches a recruiter's eye.
          </p>
          <button className="btn-learn-more" onClick={() => setSelectedGuide(guides.resume)}>
            Read Guide →
          </button>
        </div>

        {/* LINKEDIN CARD */}
        <div className="resource-card">
          <div className="card-icon">🔗</div>
          <h3>LinkedIn Optimization</h3>
          <p>
            70% of jobs are not published publicly. Optimize your LinkedIn profile to appear in recruiter searches.
          </p>
          <button className="btn-learn-more" onClick={() => setSelectedGuide(guides.linkedin)}>
            Optimize Now →
          </button>
        </div>

        {/* NEGOTIATION CARD */}
        <div className="resource-card">
          <div className="card-icon">💰</div>
          <h3>Salary Negotiation</h3>
          <p>
            Don't leave money on the table. Join the top 20% of earners by mastering the art of negotiation.
          </p>
          <button className="btn-learn-more" onClick={() => setSelectedGuide(guides.salary)}>
            Get Tips →
          </button>
        </div>
      </div>

      <div className="interview-section">
        <h2 className="section-title">Ace Your Interview</h2>
        <div className="accordion">
          {interviewQuestions.map((item, index) => (
            <div key={index} className="accordion-item">
              <div
                className="accordion-header"
                onClick={() => toggleAccordion(index)}
              >
                {item.question}
                <span>{activeAccordion === index ? "−" : "+"}</span>
              </div>
              {activeAccordion === index && (
                <div className="accordion-content">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h2 style={{ marginBottom: "30px", fontSize: "2rem" }}>Trending Skills in 2026</h2>
        <div className="trending-skills">
          <span className="skill-tag">🤖 Generative AI</span>
          <span className="skill-tag">📊 Data Analysis</span>
          <span className="skill-tag">🚀 Project Management</span>
          <span className="skill-tag">📢 Digital Marketing</span>
          <span className="skill-tag">� Business Analysis</span>
          <span className="skill-tag">🌍 Environmental Sustainability</span>
          <span className="skill-tag">💬 Communication</span>
          <span className="skill-tag">🧠 Emotional Intelligence</span>
          <span className="skill-tag">🔐 Cybersecurity</span>
        </div>
      </div>

      {/* Modal for Guides */}
      {selectedGuide && (
        <div className="modal-overlay" onClick={() => setSelectedGuide(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setSelectedGuide(null)}>&times;</button>
            <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>{selectedGuide.title}</h2>
            <div style={{ lineHeight: "1.6", color: "#555" }}>
              {selectedGuide.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
