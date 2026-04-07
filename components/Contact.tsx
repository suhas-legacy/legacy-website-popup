"use client";

import { FormEvent } from "react";

export function Contact() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section id="contact">
      <div className="section-label reveal">Get In Touch</div>
      <h2 className="section-title reveal">
        Start Your <span className="gold-text">Trading Journey</span>
      </h2>
      <div className="contact-grid">
        <form className="contact-form reveal" onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="cf-name">Full Name</label>
              <input
                id="cf-name"
                name="name"
                type="text"
                placeholder="Your full name"
              />
            </div>
            <div className="form-field">
              <label htmlFor="cf-email">Email</label>
              <input
                id="cf-email"
                name="email"
                type="email"
                placeholder="your@email.com"
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
              />
            </div>
            <div className="form-field">
              <label htmlFor="cf-account">Account Type</label>
              <select id="cf-account" name="account">
                <option>Standard Account</option>
                <option>Classic Account</option>
                <option>Pro Account</option>
                <option>VIP Account</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="cf-msg">Message</label>
            <textarea
              id="cf-msg"
              name="message"
              placeholder="Tell us about your trading goals..."
            />
          </div>
          <button type="submit" className="submit-btn">
            Send Message →
          </button>
        </form>
        <div className="contact-info reveal">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <div>
              <div className="info-label">Email Support</div>
              <div className="info-val">support@legacyglobalbank.com</div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">💼</div>
            <div>
              <div className="info-label">Careers</div>
              <div className="info-val">careers@legacyglobalbank.com</div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">🏛️</div>
            <div>
              <div className="info-label">Registered Office</div>
              <div className="info-val">Saint Lucia · Reg. No. 00744</div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">⚖️</div>
            <div>
              <div className="info-label">Legal / Compliance</div>
              <div className="info-val">Governed by UAE Law · Arbitration in UAE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
