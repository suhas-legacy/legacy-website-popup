"use client";

import { FormEvent, useState } from "react";
import posthog from "posthog-js";

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

const todayISO = new Date().toLocaleDateString("en-CA");

export function ContactForm() {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.phone || phoneDigits.length < 7) {
      setErrorMessage("A valid phone number is required");
      return false;
    }
    if (!formData.meetingDate) {
      setErrorMessage("Please select a meeting date");
      return false;
    }
    if (!formData.meetingTime) {
      setErrorMessage("Please select a meeting time");
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Message is required");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://legacy-backend-151726525663.europe-west1.run.app";

      const response = await fetch(`${apiUrl}/api/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: ScheduleResponse = await response.json();

      if (data.success) {
        posthog.capture("meeting_scheduled", {
          meeting_type: formData.meetingType,
          meeting_date: formData.meetingDate,
        });
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
        posthog.capture("meeting_schedule_error", {
          error_message: data.message || "Failed to schedule",
        });
        setSubmitStatus("error");
        setErrorMessage(data.message || "Failed to schedule meeting");
      }
    } catch (error) {
      posthog.capture("meeting_schedule_error", { error_message: "Network error" });
      posthog.captureException(error);
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-grid">
      <form className="contact-form" onSubmit={onSubmit}>
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
          <label htmlFor="cf-msg">Message</label>
          <textarea
            id="cf-msg"
            name="message"
            placeholder="Tell us about your trading goals..."
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
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
      <div className="contact-info">
        <img src="/contact.svg" alt="Contact" />
      </div>
    </div>
  );
}
