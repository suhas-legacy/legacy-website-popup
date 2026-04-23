"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "./Footer";
import { Ticker } from "./Ticker";
import { Navbar } from "./Navbar";
import { PANEL_URL, PANEL_URL_REGISTER } from "@/lib/constants";

const jobOpenings = [
  {
    id: "fx-sales",
    title: "FX Sales Executive",
    department: "Sales",
    location: "Dubai, UAE",
    type: "Full-time",
    description:
      "Drive revenue growth by acquiring new clients and maintaining relationships with existing traders. Deep understanding of forex markets required.",
    requirements: [
      "3+ years experience in FX sales",
      "Strong network in trading community",
      "Excellent communication skills",
      "Multilingual preferred (Arabic/English)",
    ],
  },
  {
    id: "relationship-manager",
    title: "VIP Relationship Manager",
    department: "Client Services",
    location: "Dubai, UAE",
    type: "Full-time",
    description:
      "Manage our high-value client portfolio, providing personalized service and trading support to VIP account holders.",
    requirements: [
      "5+ years in client relationship management",
      "FX/CFD product knowledge essential",
      "Proven track record with HNW clients",
      "Professional certification (CISI/CFA preferred)",
    ],
  },
  {
    id: "compliance-officer",
    title: "Compliance Officer",
    department: "Compliance",
    location: "Dubai, UAE",
    type: "Full-time",
    description:
      "Ensure adherence to regulatory requirements and internal policies. Monitor trading activities and maintain compliance frameworks.",
    requirements: [
      "Bachelor's degree in Law/Finance",
      "4+ years compliance experience in forex/brokerage",
      "Knowledge of DFSA/SCA regulations",
      "Strong analytical and reporting skills",
    ],
  },
  {
    id: "dealer",
    title: "FX Dealer",
    department: "Trading",
    location: "Dubai, UAE",
    type: "Full-time",
    description:
      "Execute client orders, monitor market conditions, and manage risk exposure. Provide liquidity and pricing to clients.",
    requirements: [
      "3+ years dealing room experience",
      "Proficient in MT4/MT5 platforms",
      "Strong mathematical and analytical skills",
      "Ability to work under pressure",
    ],
  },
  {
    id: "marketing-manager",
    title: "Digital Marketing Manager",
    department: "Marketing",
    location: "Dubai, UAE / Remote",
    type: "Full-time",
    description:
      "Lead digital marketing campaigns across multiple channels. Drive client acquisition through data-driven strategies.",
    requirements: [
      "5+ years digital marketing experience",
      "Fintech/Forex industry background preferred",
      "Expertise in SEO, SEM, and social media",
      "Strong analytics and reporting capabilities",
    ],
  },
  {
    id: "customer-support",
    title: "Customer Support Specialist",
    department: "Support",
    location: "Dubai, UAE",
    type: "Full-time",
    description:
      "Provide exceptional support to traders via chat, email, and phone. Resolve technical and account-related queries efficiently.",
    requirements: [
      "2+ years customer support experience",
      "Knowledge of trading platforms",
      "Excellent problem-solving skills",
      "Available for shift work (24/5 coverage)",
    ],
  },
];

const benefits = [
  {
    icon: "💰",
    title: "Competitive Salary",
    description: "Attractive base salary with performance-based bonuses",
  },
  {
    icon: "🏥",
    title: "Health Insurance",
    description: "Comprehensive medical coverage for you and your family",
  },
  {
    icon: "📈",
    title: "Career Growth",
    description: "Clear progression paths and professional development",
  },
  {
    icon: "🌴",
    title: "Work-Life Balance",
    description: "Generous leave policy and flexible working options",
  },
  {
    icon: "🏢",
    title: "Modern Office",
    description: "State-of-the-art facilities in Dubai's financial district",
  },
  {
    icon: "🎓",
    title: "Training & Development",
    description: "Continuous learning opportunities and certifications",
  },
];

const values = [
  {
    title: "Integrity",
    description: "We operate with transparency and ethical standards",
  },
  {
    title: "Innovation",
    description: "We embrace technology and continuous improvement",
  },
  {
    title: "Excellence",
    description: "We strive for the highest standards in everything",
  },
  {
    title: "Collaboration",
    description: "We believe in teamwork and shared success",
  },
];

export function Career() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<typeof jobOpenings[0] | null>(null);

  const filteredJobs =
    filter === "all"
      ? jobOpenings
      : jobOpenings.filter((job) => job.department.toLowerCase() === filter);

  const departments = ["all", ...new Set(jobOpenings.map((job) => job.department.toLowerCase()))];

  const openApplication = (job: typeof jobOpenings[0]) => {
    setApplyingJob(job);
    setIsApplicationModalOpen(true);
  };

  const closeApplication = () => {
    setIsApplicationModalOpen(false);
    setApplyingJob(null);
  };

  return (
    <div className="career-page">
      <Navbar />
      <Ticker />

      {/* Hero Section */}
      <section className="career-hero">
        <div className="hero-content">
          <span className="section-label">Join Our Team</span>
          <h1 className="section-title">
            Build Your <span className="gold-text">Career</span> With Us
          </h1>
          <p className="section-desc">
            Join Legacy Global Bank and be part of a dynamic team shaping the
            future of global trading. We offer competitive compensation,
            professional growth, and an inspiring work environment.
          </p>
          <div className="hero-cta">
            <a href="#openings" className="btn-gold">
              View Open Positions
            </a>
            <a href="mailto:careers@legacyglobalbank.com" className="btn-outline">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="career-stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Team Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15+</span>
            <span className="stat-label">Nationalities</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/5</span>
            <span className="stat-label">Global Coverage</span>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="career-vision-mission">
        <div className="vm-container">
          <div className="vm-card vision">
            {/* <div className="vm-icon">🎯</div> */}
            <h3>Our Vision</h3>
            <p>To become the world's most trusted and innovative trading platform, empowering millions of traders to achieve financial freedom through cutting-edge technology and exceptional service.</p>
          </div>
          <div className="vm-card mission">
            {/* <div className="vm-icon">🚀</div> */}
            <h3>Our Mission</h3>
            <p>To democratize access to global financial markets by providing secure, transparent, and user-friendly trading solutions while maintaining the highest standards of integrity and client satisfaction.</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="career-values">
        <div className="section-header">
          <h2>Our Values</h2>
          <p>The principles that guide everything we do</p>
        </div>
        <div className="values-grid">
          {values.map((value, idx) => (
            <div key={idx} className="value-card">
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="career-benefits">
        <div className="section-header">
          <h2>Why Work With Us</h2>
          <p>We take care of our team with comprehensive benefits</p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="benefit-card">
              <span className="benefit-icon">{benefit.icon}</span>
              <h4>{benefit.title}</h4>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="openings" className="job-openings">
        <div className="section-header">
          <h2>Open Positions</h2>
          <p>Find your perfect role and join our growing team</p>
        </div>

        {/* Filter Tabs */}
        <div className="job-filters">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`filter-btn ${filter === dept ? "active" : ""}`}
              onClick={() => setFilter(dept)}
            >
              {dept.charAt(0).toUpperCase() + dept.slice(1)}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`job-card ${selectedJob === job.id ? "expanded" : ""}`}
              onClick={() =>
                setSelectedJob(selectedJob === job.id ? null : job.id)
              }
            >
              <div className="job-header">
                <div className="job-meta">
                  <span className="job-dept">{job.department}</span>
                  <span className="job-type">{job.type}</span>
                </div>
                <h3 className="job-title">{job.title}</h3>
                <div className="job-location">
                  <span>📍</span> {job.location}
                </div>
              </div>

              <div className="job-content">
                <p className="job-description">{job.description}</p>

                {selectedJob === job.id && (
                  <div className="job-details">
                    <h4>Requirements:</h4>
                    <ul>
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                    <button
                      className="apply-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openApplication(job);
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                )}
              </div>

              <div className="job-footer">
                <span className="expand-hint">
                  {selectedJob === job.id ? "Click to collapse" : "Click to view details"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="no-jobs">
            <p>No positions available in this department.</p>
            <button className="btn-outline" onClick={() => setFilter("all")}>
              View All Positions
            </button>
          </div>
        )}
      </section>

      {/* Application Modal */}
      {isApplicationModalOpen && applyingJob && (
        <div className="modal-overlay" onClick={closeApplication}>
          <div className="modal-content application-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeApplication}>
              ×
            </button>
            <h3>Apply for {applyingJob.title}</h3>
            <p className="modal-subtitle">
              {applyingJob.department} · {applyingJob.location}
            </p>

            <form
              className="application-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for your application! Our HR team will contact you soon.");
                closeApplication();
              }}
            >
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" required placeholder="Enter your full name" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" required placeholder="+971 XX XXX XXXX" />
                </div>
              </div>

              <div className="form-group">
                <label>LinkedIn Profile</label>
                <input type="url" placeholder="https://linkedin.com/in/yourprofile" />
              </div>

              <div className="form-group">
                <label>Years of Experience *</label>
                <select required>
                  <option value="">Select experience level</option>
                  <option value="0-2">0-2 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cover Letter / Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div className="form-group">
                <label>Resume/CV *</label>
                <div className="file-upload">
                  <input type="file" accept=".pdf,.doc,.docx" required />
                  <small>Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="career-cta">
        <div className="cta-content">
          <h2>Don't See the Right Role?</h2>
          <p>
            We're always looking for talented individuals. Send us your CV and
            we'll keep you in mind for future opportunities.
          </p>
          <a
            href="mailto:careers@legacyglobalbank.com?subject=General Application"
            className="btn-gold"
          >
            Send General Application
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
