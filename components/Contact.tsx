"use client";

import { FormEvent, useState } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  meetingDate: string;
  meetingTime: string;
  meetingType: "online" | "offline";
  message: string;
}

interface ScheduleResponse {
  success: boolean;
  message: string;
  calendarLink?: string;
  meetingLink?: string;
}

// Today's date in YYYY-MM-DD (local) — used as the min for the date picker
const todayISO = new Date().toLocaleDateString("en-CA");

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    meetingDate: "",
    meetingTime: "",
    meetingType: "online",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [scheduleResult, setScheduleResult] = useState<ScheduleResponse | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage("Full name is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setErrorMessage("A valid email address is required.");
      return false;
    }
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      setErrorMessage("A valid phone number is required.");
      return false;
    }
    if (!formData.meetingDate) {
      setErrorMessage("Please select a meeting date.");
      return false;
    }
    if (!formData.meetingTime) {
      setErrorMessage("Please select a meeting time.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitStatus("idle");

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://legacy-backend-151726525663.europe-west1.run.app";

      const response = await fetch(`${apiUrl}/api/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ScheduleResponse = await response.json();

      if (data.success) {
        setScheduleResult(data);
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          meetingDate: "",
          meetingTime: "",
          meetingType: "online",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || "Failed to schedule meeting.");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact">
      <div className="section-label reveal">Get In Touch</div>
      <h2 className="section-title reveal">
        Schedule a <span className="gold-text">Meeting</span>
      </h2>
      <div className="contact-grid">
        <form className="contact-form reveal" onSubmit={onSubmit}>
          {/* ── Success ── */}
          {submitStatus === "success" && scheduleResult && (
            <div
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                padding: "14px 16px",
                borderRadius: "6px",
                marginBottom: "20px",
                border: "1px solid #c3e6cb",
                lineHeight: 1.6,
              }}
            >
              <strong>✓ {scheduleResult.message}</strong>
              {scheduleResult.meetingLink && (
                <p style={{ marginTop: 8, marginBottom: 0 }}>
                  🎥{" "}
                  <a
                    href={scheduleResult.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#155724", fontWeight: 600 }}
                  >
                    Join Google Meet
                  </a>
                </p>
              )}
              {scheduleResult.calendarLink && (
                <p style={{ marginTop: 4, marginBottom: 0 }}>
                  📅{" "}
                  <a
                    href={scheduleResult.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#155724" }}
                  >
                    View Calendar Event
                  </a>
                </p>
              )}
            </div>
          )}

          {/* ── Error ── */}
          {submitStatus === "error" && (
            <div
              style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                padding: "12px",
                borderRadius: "4px",
                marginBottom: "20px",
                border: "1px solid #f5c6cb",
              }}
            >
              ✗ {errorMessage}
            </div>
          )}

          {/* ── Name + Email ── */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="cf-name">Full Name</label>
              <input
                id="cf-name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="cf-email">Email</label>
              <input
                id="cf-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* ── Phone + Meeting Type ── */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="cf-phone">Phone</label>
              <input
                id="cf-phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="cf-meeting-type">Meeting Type</label>
              <select
                id="cf-meeting-type"
                name="meetingType"
                value={formData.meetingType}
                onChange={handleInputChange}
              >
                <option value="online">🌐 Online (Google Meet)</option>
                <option value="offline">🏦 Offline (In-Person)</option>
              </select>
            </div>
          </div>

          {/* ── Date + Time ── */}
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="cf-meeting-date">Meeting Date</label>
              <input
                id="cf-meeting-date"
                name="meetingDate"
                type="date"
                min={todayISO}
                value={formData.meetingDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="cf-meeting-time">Meeting Time</label>
              <input
                id="cf-meeting-time"
                name="meetingTime"
                type="time"
                value={formData.meetingTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* ── Message ── */}
          <div className="form-field">
            <label htmlFor="cf-msg">Message (optional)</label>
            <textarea
              id="cf-msg"
              name="message"
              placeholder="Tell us about your trading goals or what you'd like to discuss..."
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Scheduling..." : "Schedule Meeting →"}
          </button>
        </form>
      </div>
    </section>
  );
}
