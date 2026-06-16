"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import {
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Key,
  Database,
  ArrowRight
} from "lucide-react";
import "../visitor-styles.css";

function ApiMockContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const requestId = searchParams.get("id");
  const token = searchParams.get("token");
  const statusParam = searchParams.get("status");
  const errorParam = searchParams.get("error");

  // Verification states
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [jwtHeader, setJwtHeader] = useState<any>(null);
  const [jwtPayload, setJwtPayload] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [actionPerformed, setActionPerformed] = useState<string>("");
  const [rescheduledDetails, setRescheduledDetails] = useState<any>(null);
  const [requestDetails, setRequestDetails] = useState<any>(null);

  const addLog = (msg: string) => {
    setAuditLogs(prev => [...prev, msg]);
  };

  useEffect(() => {
    if (!requestId || !token) {
      setErrorDetails("Missing required parameters 'id' or 'token'. Link is invalid.");
      setLoading(false);
      return;
    }

    const decodeAndProcess = async () => {
      addLog(`[INCOMING] Intercepted link for Request ID: ${requestId}`);
      addLog(`[INCOMING] Token: ${token.substring(0, 20)}...`);

      // 1. Decode JWT Token client-side for inspector
      const parts = token.split(".");
      if (parts.length !== 3) {
        setErrorDetails("Invalid JWT format. Token must contain header, payload, and signature.");
        setSuccess(false);
        setLoading(false);
        return;
      }

      const [headerB64, payloadB64, signature] = parts;
      let payload: any = null;
      try {
        const base64UrlDecode = (str: string) => {
          let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
          while (base64.length % 4) {
            base64 += "=";
          }
          return atob(base64);
        };

        const decodedHeader = JSON.parse(base64UrlDecode(headerB64));
        const decodedPayload = JSON.parse(base64UrlDecode(payloadB64));
        setJwtHeader(decodedHeader);
        setJwtPayload(decodedPayload);
        payload = decodedPayload;

        addLog(`[DECODER] Decoded Jose Header: ${JSON.stringify(decodedHeader)}`);
        addLog(`[DECODER] Decoded Claims Payload: ${JSON.stringify(decodedPayload)}`);
      } catch (err) {
        setErrorDetails("An error occurred during cryptographic decoding. Token is corrupted.");
        setSuccess(false);
        setLoading(false);
        return;
      }

      // 2. Check if we have a redirect error or status from the backend
      if (errorParam) {
        addLog(`[SECURITY] Backend reported verification error: ${errorParam}`);
        let msg = "Security verification failed.";
        if (errorParam === "missing_params") msg = "Missing required parameters 'id' or 'token'.";
        else if (errorParam === "invalid_token") msg = "JWT Signature Verification Failed. The token has been tampered with or is invalid.";
        else if (errorParam === "already_used") msg = "Security Replay Blocked: This secure link has already been used. Tokens are single-use only.";
        else if (errorParam === "not_found") msg = "Record not found: Visitor request does not exist in database.";
        else if (errorParam === "processed") msg = "Conflict: Request has already been processed and is no longer pending.";
        else if (errorParam === "server_error") msg = "An internal server error occurred during verification.";

        setErrorDetails(msg);
        setSuccess(false);
        setLoading(false);
        return;
      }

      if (statusParam === "success") {
        addLog(`[DATABASE] Fetching updated record from bank registry...`);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://legacy-backend-151726525663.europe-west1.run.app";
        try {
          const res = await fetch(`${apiUrl}/api/visitor/request/${requestId}`);
          if (!res.ok) throw new Error("Request details not found on backend");
          const data = await res.json();
          if (data.success) {
            setRequestDetails(data.request);
            setActionPerformed(payload.action);
            setSuccess(true);
            addLog(`[DATABASE] Record loaded: ${data.request.name} (${data.request.status})`);
            addLog(`[SYSTEM] Transaction completed successfully.`);
          } else {
            setErrorDetails("Failed to fetch request status from server.");
          }
        } catch (err) {
          console.error(err);
          setErrorDetails("Failed to fetch request details from the backend API.");
        }
        setLoading(false);
        return;
      }

      // 3. No status or error parameters. This is a direct entry click in dashboard/email.
      // We should redirect to the backend to perform the actual cryptographic verification!
      const action = payload ? payload.action : "approve";
      addLog(`[SYSTEM] Direct link entry detected. Routing transaction to backend gateway...`);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://legacy-backend-151726525663.europe-west1.run.app";
      setTimeout(() => {
        window.location.href = `${apiUrl}/api/visitor/${action}?id=${requestId}&token=${token}`;
      }, 1000);
    };

    decodeAndProcess();
  }, [requestId, token, statusParam, errorParam]);

  return (
    <div className="api-mock-container">
      <div className="api-card">

        {/* Header */}
        <div className="api-header text-center">
          <h1>LEGACY SECURITY GATEWAY</h1>
          <span className="api-badge">ENDPOINT: /api/visitor/{actionPerformed || "verify"}</span>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="loader-container">
            <Loader2 size={40} className="spinner text-gold" style={{ animationDuration: "1s" }} />
            <p className="font-mono text-sm" style={{ color: "var(--gold-pale)" }}>Decrypting JWT secure signed token...</p>
          </div>
        )}

        {/* FAILURE STATE */}
        {!loading && !success && (
          <div className="reveal visible">
            <div className="flex-center" style={{ flexDirection: "column", gap: "1rem", color: "#C62828" }}>
              <ShieldCheck size={56} className="text-red-500" style={{ color: "#EF9A9A" }} />
              <h2 style={{ color: "#EF9A9A", fontSize: "1.5rem" }}>Security Verification Failed</h2>
            </div>

            <div className="jwt-panel" style={{ borderColor: "#C62828", background: "rgba(198, 40, 40, 0.05)", marginTop: "1.5rem" }}>
              <span className="font-semibold text-red-200">Error Description:</span>
              <p className="text-red-300 font-mono mt-2" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                {errorDetails}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {!loading && success && (
          <div className="reveal visible">
            <div className="flex-center" style={{ flexDirection: "column", gap: "1rem", color: "#2E7D32" }}>
              <ShieldCheck size={56} className="text-green-500" />
              <h2 style={{ color: "#A5D6A7", fontSize: "1.5rem" }}>Token Authorized</h2>
            </div>

            <div className="jwt-panel" style={{ marginTop: "1.5rem", background: "rgba(46, 125, 50, 0.04)", borderColor: "#2E7D32" }}>
              <div className="flex-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.5rem" }}>
                <span className="font-semibold" style={{ color: "#A5D6A7" }}>Transaction Executed</span>
                <span className="font-mono text-xs uppercase text-green-300" style={{ fontWeight: 600 }}>
                  {actionPerformed === "approve" ? "APPROVED" : "REJECTED"}
                </span>
              </div>

              {requestDetails && (
                <div className="font-mono text-xs mt-3" style={{ display: "flex", flexDirection: "column", gap: "0.4rem", color: "#ECEFF1" }}>
                  <div className="flex-between">
                    <span>Request ID</span>
                    <span className="font-bold text-amber-200">{requestDetails.id}</span>
                  </div>
                  <div className="flex-between">
                    <span>Visitor</span>
                    <span>{requestDetails.name}</span>
                  </div>
                  <div className="flex-between">
                    <span>Meeting Type</span>
                    <span className="capitalize">{requestDetails.meetingType}</span>
                  </div>
                  {rescheduledDetails ? (
                    <div className="mt-2" style={{ borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: "0.4rem" }}>
                      <div className="text-amber-400 text-xxs font-bold uppercase">Auto-Rescheduled Conflict</div>
                      <div className="flex-between mt-1 text-red-300 line-through">
                        <span>Original Time</span>
                        <span>{rescheduledDetails.originalTime}</span>
                      </div>
                      <div className="flex-between text-green-300">
                        <span>New Scheduled Time</span>
                        <span>{requestDetails.time}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-between">
                      <span>Scheduled Time</span>
                      <span>{requestDetails.formattedDate} at {requestDetails.time}</span>
                    </div>
                  )}
                  {requestDetails.meetingUrl && (
                    <div className="flex-between" style={{ color: "var(--gold-light)" }}>
                      <span>Google Meet Link</span>
                      <span className="text-xxs break-all">{requestDetails.meetingUrl}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cryptographic Inspector Panel (Always show when loading finishes) */}
        {!loading && (
          <div className="reveal visible" style={{ marginTop: "1.5rem" }}>
            <span className="drawer-section-title" style={{ color: "rgba(255,255,255,0.4)" }}>Cryptographic Token Payload</span>
            <div className="jwt-panel" style={{ background: "#121214", border: "1px solid #263238" }}>

              <span className="jwt-label font-mono"><Key size={12} className="inline mr-1" /> JOSE Header:</span>
              <pre className="jwt-json">
                {jwtHeader ? JSON.stringify(jwtHeader, null, 2) : "{\n  \"alg\": \"HS256\",\n  \"typ\": \"JWT\"\n}"}
              </pre>

              <span className="jwt-label font-mono"><Database size={12} className="inline mr-1" /> JWT Claims Payload:</span>
              <pre className="jwt-json">
                {jwtPayload ? JSON.stringify(jwtPayload, null, 2) : "{\n  \"id\": \"VIS-xxxx\",\n  \"action\": \"approve/reject\",\n  \"email\": \"admin@legacyglobalbank.com\"\n}"}
              </pre>
            </div>
          </div>
        )}

        {/* Transaction Logs Terminal */}
        <div className="reveal visible" style={{ marginTop: "1.5rem" }}>
          <span className="drawer-section-title" style={{ color: "rgba(255,255,255,0.4)" }}>Server Processing Log Stream</span>
          <div className="sim-console" style={{ maxHeight: "180px" }}>
            {auditLogs.map((log, index) => (
              <div key={index} className="console-line info" style={{ fontSize: "0.7rem" }}>
                {log}
              </div>
            ))}
            {loading && <div className="console-line info text-yellow-300">... Verification Pending ...</div>}
          </div>
        </div>

        {/* Footer Controls */}
        {!loading && (
          <div className="flex-center mt-6">
            <button
              onClick={() => router.push("/visitor_form/admin")}
              className="btn-gold font-mono flex-center gap-2"
              style={{ padding: "0.8rem 2rem", width: "100%" }}
            >
              Return to Admin Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ApiMockPage() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <PageBreadcrumb currentPage="API Secure Verifier" />
          <Suspense fallback={
            <div className="api-mock-container">
              <div className="api-card">
                <div className="api-header text-center">
                  <h1>LEGACY SECURITY GATEWAY</h1>
                  <span className="api-badge">ENDPOINT: /api/visitor/verify</span>
                </div>
                <div className="loader-container">
                  <Loader2 size={40} className="spinner text-gold" style={{ animationDuration: "1s" }} />
                  <p className="font-mono text-sm" style={{ color: "var(--gold-pale)" }}>Loading verifier framework...</p>
                </div>
              </div>
            </div>
          }>
            <ApiMockContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
