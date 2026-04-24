"use client";

import { FormEvent, useState } from "react";
import ContactSvg from "./contact.svg";

interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  priority: string;
  connect: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    priority: "medium",
    connect: "Sales Support",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
      const apiUrl = process.env.API_URL || "https://legacy-backend-151726525663.europe-west1.run.app";
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          city: "",
          priority: "medium",
          connect: "Sales Support",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-grid">
      <form className="contact-form" onSubmit={onSubmit}>
        {submitStatus === "success" && (
          <div
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "20px",
              border: "1px solid #c3e6cb",
            }}
          >
            ✓ Your message has been sent successfully! We'll get back to you soon.
          </div>
        )}

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
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cf-phone">Phone</label>
            <input
              id="cf-phone"
              name="phone"
              type="tel"
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="cf-priority">Priority</label>
            <select
              id="cf-priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cf-city">City</label>
            <input
              id="cf-city"
              name="city"
              type="text"
              placeholder="Your city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="cf-connect">Connect</label>
            <select
              id="cf-connect"
              name="connect"
              value={formData.connect}
              onChange={handleInputChange}
            >
              <option>Sales Support</option>
              <option>Technical Support</option>
            </select>
          </div>
        </div>
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
          {isSubmitting ? "Sending..." : "Send Message →"}
        </button>
      </form>
      <div className="contact-info">
        <img src="/contact.svg" alt="Contact" />
      </div>
    </div>
  );
}
