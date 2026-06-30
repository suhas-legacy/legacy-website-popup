"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  Users, 
  UserCheck, 
  Hash, 
  FileText,
  ShieldCheck,
  Building
} from "lucide-react";
import "../visitor-styles.css";

export default function VisitorCheckinPage() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <PageBreadcrumb currentPage="Check-in Verification" />
          <div className="visitor-container">
            <CheckinComponent />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function CheckinComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const [req, setReq] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    if (!id || !token) {
      setError("Invalid pass link. Missing pass ID or authorization token.");
      setLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://legacy-backend-151726525663.europe-west1.run.app";
    fetch(`${apiUrl}/api/visitor/request/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Visitor pass could not be retrieved.");
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setReq(data.request);
        } else {
          setError(data.message || "Failed to load pass details.");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Error connecting to server. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, token]);

  const handleCheckin = () => {
    if (!id || !token) return;
    setCheckingIn(true);
    setError("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://legacy-backend-151726525663.europe-west1.run.app";
    fetch(`${apiUrl}/api/visitor/checkin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, token })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuccessMsg(data.message || "Visitor check-in successful!");
          // Refresh details
          setReq((prev: any) => prev ? { ...prev, status: "CHECKED_IN" } : null);
        } else {
          setError(data.message || "Check-in failed.");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Error checking in visitor. Please try again.");
      })
      .finally(() => {
        setCheckingIn(false);
      });
  };

  if (loading) {
    return (
      <div className="visitor-card reveal visible text-center py-12 flex-center" style={{ flexDirection: "column", gap: "1rem" }}>
        <div className="spinner"></div>
        <p className="font-mono text-muted">Verifying visitor pass credentials...</p>
      </div>
    );
  }

  if (error && !req) {
    return (
      <div className="visitor-card reveal visible text-center py-8">
        <div className="flex-center mb-4" style={{ color: "#C62828" }}>
          <AlertTriangle size={48} />
        </div>
        <h2 className="gold-text" style={{ color: "#C62828" }}>Verification Failed</h2>
        <p className="my-4" style={{ maxWidth: "450px", margin: "1rem auto" }}>{error}</p>
        <button onClick={() => router.push("/")} className="submit-btn" style={{ maxWidth: "200px", margin: "0 auto" }}>Go to Homepage</button>
      </div>
    );
  }

  const isCheckedIn = req?.status === "CHECKED_IN" || req?.status === "COMPLETED";
  const isPending = req?.status === "PENDING_APPROVAL";
  const isRejected = req?.status === "REJECTED" || req?.status === "CANCELLED";

  return (
    <div className="visitor-card reveal visible">
      <div className="success-badge-container text-center mb-6">
        {isCheckedIn ? (
          <>
            <ShieldCheck size={64} style={{ color: "#2E7D32" }} />
            <h2 className="success-h2" style={{ color: "#2E7D32", marginTop: "1rem" }}>Verified & Checked In</h2>
            <p className="success-p">This visitor pass has been successfully verified and checked in at the branch.</p>
          </>
        ) : isRejected ? (
          <>
            <AlertTriangle size={64} style={{ color: "#C62828" }} />
            <h2 className="success-h2" style={{ color: "#C62828", marginTop: "1rem" }}>Pass Invalid</h2>
            <p className="success-p">This visitor pass has been cancelled, rejected, or expired.</p>
          </>
        ) : (
          <>
            <Building size={64} style={{ color: "var(--gold)" }} />
            <h2 className="success-h2" style={{ marginTop: "1rem" }}>Pass Verified</h2>
            <p className="success-p">
              {isPending 
                ? "This visitor pass is pending approval, but can be checked in directly by the branch officer."
                : "Visitor pass is valid. Ready to check-in."}
            </p>
          </>
        )}
      </div>

      {successMsg && (
        <div className="form-error-banner" style={{ background: "rgba(46, 125, 50, 0.05)", border: "1px solid rgba(46, 125, 50, 0.2)", color: "#2E7D32", marginBottom: "1.5rem" }}>
          <span className="icon">✓</span>
          <p>{successMsg}</p>
        </div>
      )}

      {error && (
        <div className="form-error-banner" style={{ marginBottom: "1.5rem" }}>
          <span className="icon">✕</span>
          <p>{error}</p>
        </div>
      )}

      {/* Visitor Details Display */}
      <div className="request-details-box" style={{ background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="details-header" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="details-label font-mono">VISITOR PASS DETAILS</span>
          <span className="details-id font-mono" style={{ color: isCheckedIn ? "#2E7D32" : "var(--gold)" }}>{req.id}</span>
        </div>

        <div className="details-grid font-mono" style={{ marginTop: "1.5rem" }}>
          <div className="detail-item">
            <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><User size={12} /> Name</span>
            <span style={{ color: "var(--text-primary)" }}>{req.name}</span>
          </div>
          <div className="detail-item">
            <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><Mail size={12} /> Email</span>
            <span>{req.email}</span>
          </div>
          <div className="detail-item">
            <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><Phone size={12} /> Phone</span>
            <span>{req.phone}</span>
          </div>
          <div className="detail-item">
            <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><MapPin size={12} /> Preferred Branch</span>
            <span style={{ color: "var(--text-primary)" }}>{req.preferredBranch}</span>
          </div>
          <div className="detail-item">
            <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><Briefcase size={12} /> Purpose of Visit</span>
            <span style={{ color: "var(--text-primary)" }}>{req.purposeOfVisit}</span>
          </div>
          {req.referenceEmployee && (
            <div className="detail-item">
              <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><Users size={12} /> Reference Employee</span>
              <span>{req.referenceEmployee}</span>
            </div>
          )}
          {req.personToMeet && (
            <div className="detail-item">
              <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><UserCheck size={12} /> Person to Meet</span>
              <span>{req.personToMeet}</span>
            </div>
          )}
          <div className="detail-item">
            <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><Hash size={12} /> Existing Client?</span>
            <span>{req.existingClient}</span>
          </div>
          {req.existingClient === 'Yes' && req.tradingAccountId && (
            <div className="detail-item">
              <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><Hash size={12} /> Trading Account ID</span>
              <span>{req.tradingAccountId}</span>
            </div>
          )}
          <div className="detail-item">
            <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><Clock size={12} /> Pass Status</span>
            <span className={`status-badge ${req.status.toLowerCase()}`}>{req.status.replace("_", " ")}</span>
          </div>
          {req.additionalNotes && (
            <div className="detail-item" style={{ gridColumn: "span 2" }}>
              <span className="flex-center" style={{ justifyContent: "flex-start", gap: "0.4rem" }}><FileText size={12} /> Additional Notes</span>
              <span style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{req.additionalNotes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification Actions */}
      {!isCheckedIn && !isRejected && (
        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleCheckin}
            disabled={checkingIn}
            className="submit-btn"
            style={{ width: "100%", maxWidth: "400px", padding: "1rem", background: isPending ? "var(--gold)" : "#2E7D32" }}
          >
            {checkingIn ? (
              <span className="flex-center gap-2">
                <span className="spinner"></span>
                Processing Check-In...
              </span>
            ) : (
              <span className="flex-center gap-2">
                <ShieldCheck size={16} /> 
                {isPending ? "Approve & Check In Visitor" : "Confirm Visitor Check-In"}
              </span>
            )}
          </button>
        </div>
      )}

      {isCheckedIn && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p className="font-mono text-muted text-xs">
            Checked-in at: {new Date(req.confirmedAt || Date.now()).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
