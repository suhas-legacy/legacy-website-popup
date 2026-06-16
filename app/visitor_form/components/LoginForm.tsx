"use client";

import React, { useState } from "react";
import { Mail, Lock, ShieldAlert, ArrowRight } from "lucide-react";

interface LoginFormProps {
  onLoginSuccess: (token: string, email: string) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all credentials.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://legacy-backend-151726525663.europe-west1.run.app";
    try {
      const res = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.token, data.email);
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Check if the database server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-card-container reveal visible">
      <div className="login-card">
        {/* Lock Shield Header */}
        <div className="login-header text-center">
          <div className="login-shield-icon-container">
            <Lock size={32} className="login-shield-icon text-gold" />
          </div>
          <h2>ADMINISTRATOR <span className="gold-text">PORTAL</span></h2>
          <p>Legacy Global Bank Visitor Security Gateway. Authorized credential authentication required.</p>
        </div>

        {error && (
          <div className="form-error-banner flex gap-2 items-center">
            <span className="icon">✕</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form-fields">
          {/* Email field */}
          <div className="form-field">
            <label htmlFor="adm-email">Security Email</label>
            <div className="input-icon-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                id="adm-email"
                type="email"
                placeholder="admin@legacyglobalbank.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="form-field">
            <label htmlFor="adm-pass">Authorization Password</label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="adm-pass"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
            style={{ width: "100%", marginTop: "1.25rem" }}
          >
            {isSubmitting ? (
              <span className="flex-center gap-2">
                <span className="spinner"></span>
                Authenticating Credentials...
              </span>
            ) : (
              <span className="flex-center gap-2">
                Secure Access <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        {/* Regulatory Warnings */}
        <div className="regulatory-warning">
          <ShieldAlert size={14} className="warning-icon" />
          <span>
            Unauthorized attempts to access this dashboard are monitored, logged, and subject to federal prosecution under cyber and financial safety regulations.
          </span>
        </div>
      </div>
    </div>
  );
}
