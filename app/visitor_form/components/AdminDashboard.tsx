"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Video, 
  MapPin, 
  Check, 
  X, 
  Clock, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  RotateCcw,
  Eye,
  Settings,
  ChevronDown,
  ChevronUp,
  Inbox
} from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Backend tokens will be consumed directly from request objects.

export function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Selected request for details drawer
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  // Ref so the polling interval always reads the latest value without a stale closure
  const selectedRequestRef = useRef<any | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");

  // Keep the ref in sync with the state on every render
  useEffect(() => {
    selectedRequestRef.current = selectedRequest;
  });

  // Simulated Console Logging (Google Calendar Sync logs)
  const [consoleLogs, setConsoleLogs] = useState<any[]>([]);
  const [showConsole, setShowConsole] = useState(false);

  // Email Sandbox State
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [mailboxCollapsed, setMailboxCollapsed] = useState(true);

  // Fetch Requests from backend
  const fetchRequests = () => {
    fetch(`${apiUrl}/api/visitor/requests`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRequests(data.requests);
          syncEmails(data.requests);
          // Use the ref — always reflects the current value, even inside a stale interval closure
          const current = selectedRequestRef.current;
          if (current) {
            const fresh = data.requests.find((r: any) => r.id === current.id);
            if (fresh) setSelectedRequest(fresh);
          }
        }
      })
      .catch(err => console.error("Error fetching requests:", err));
  };

  useEffect(() => {
    fetchRequests();
    // Poll the backend API to reflect changes made in other pages/tabs.
    // NOTE: selectedRequest is intentionally NOT in the dep array — the interval
    // must NOT restart each time the drawer opens/closes (that caused the re-open race).
    const interval = setInterval(fetchRequests, 1500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync Emails: Creates Admin Notification emails for any PENDING requests
  const syncEmails = (currentRequests: any[]) => {
    let emailList: any[] = [];
    
    // Check if we already have emails saved in local storage (mock mailbox UI)
    const storedEmails = localStorage.getItem("legacy_visitor_emails");
    if (storedEmails) {
      emailList = JSON.parse(storedEmails);
    }

    // Generate Admin alert emails for PENDING requests that don't have one yet
    currentRequests.forEach(req => {
      if (req.status === "PENDING_APPROVAL") {
        const emailExists = emailList.some(e => e.requestId === req.id && e.type === "admin_alert");
        if (!emailExists) {
          const approveToken = req.approveToken;
          const rejectToken = req.rejectToken;
          
          const newEmail = {
            id: `EML-${Math.floor(Math.random() * 10000)}`,
            requestId: req.id,
            type: "admin_alert",
            sender: "System Notification",
            time: req.createdAt,
            subject: `New Visitor Meeting Request [${req.id}]`,
            body: `Name:\n${req.name}\n\nPhone:\n${req.phone}\n\nEmail:\n${req.email}\n\nMeeting Type:\n${req.meetingType === 'online' ? 'Online' : 'Offline'}\n\nRequested Date:\n${req.formattedDate}\n\nRequested Time:\n${req.time}\n\nRequest ID:\n${req.id}`,
            approveUrl: `${apiUrl}/api/visitor/approve?id=${req.id}&token=${approveToken}`,
            rejectUrl: `${apiUrl}/api/visitor/reject?id=${req.id}&token=${rejectToken}`,
            unread: true
          };
          emailList.unshift(newEmail); // Add to top
        }
      }
    });

    localStorage.setItem("legacy_visitor_emails", JSON.stringify(emailList));
    setEmails(emailList);
  };

  // Helper: Append logs to simulated console
  const logToConsole = (text: string, type: "info" | "success" | "warning" | "error" | "system" = "info") => {
    setConsoleLogs(prev => [...prev, { text, type, time: new Date().toLocaleTimeString() }]);
  };  // Direct Action: Approve
  const handleApprove = (req: any) => {
    setShowConsole(true);
    setConsoleLogs([]); // Clear
    logToConsole(`[SYSTEM] Starting approval workflow for request ${req.id}`, "system");

    const token = req.approveToken;
    logToConsole(`[SYSTEM] Secure JWT token signed: ${token.substring(0, 20)}...`, "info");
    logToConsole(`[SYSTEM] Submitting to backend verifier callback gateway...`, "info");

    fetch(`${apiUrl}/api/visitor/approve?id=${req.id}&token=${token}&ajax=true`)
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
        logToConsole(`[SYSTEM] verifier callback completed. Database synchronized.`, "success");
        fetchRequests();
      })
      .catch(err => {
        console.error(err);
        logToConsole(`[SYSTEM] Backend verifier gateway error: ${err.message}`, "error");
      });
  };

  // Direct Action: Reject
  const handleReject = (req: any) => {
    const token = req.rejectToken;
    fetch(`${apiUrl}/api/visitor/reject?id=${req.id}&token=${token}&ajax=true`)
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
        logToConsole(`[DATABASE] Request ${req.id} set to REJECTED. Visitor notified.`, "error");
        fetchRequests();
      })
      .catch(err => {
        console.error(err);
        logToConsole(`[DATABASE] Rejection action failed: ${err.message}`, "error");
      });
  };
  // Reschedule Form trigger
  const handleOpenReschedule = (req: any) => {
    setSelectedRequest(req);
    setRescheduleDate(req.date || "");
    setRescheduleTime(req.time === "N/A" ? "" : req.time);
    setShowRescheduleModal(true);
  };

  const handleSaveReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return;

    const parsedDate = new Date(rescheduleDate);
    const formattedDate = parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    fetch(`${apiUrl}/api/visitor/reschedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedRequest.id,
        date: rescheduleDate,
        time: rescheduleTime,
        formattedDate
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setShowConsole(true);
        setConsoleLogs([]);
        logToConsole(`[DATABASE] Request ${selectedRequest.id} manually rescheduled to ${formattedDate} at ${rescheduleTime}.`, "success");
        logToConsole(`[EMAIL] Rescheduling notification dispatched to visitor.`, "info");
        fetchRequests();
      }
    })
    .catch(err => console.error("Reschedule error:", err));

    setShowRescheduleModal(false);
  };

  const handleCancelMeeting = (req: any) => {
    fetch(`${apiUrl}/api/visitor/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: req.id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        logToConsole(`[DATABASE] Request ${req.id} updated to CANCELLED. Calendar event removed.`, "error");
        fetchRequests();
      }
    })
    .catch(err => console.error("Cancel error:", err));
  };

  const handleCompleteMeeting = (req: any) => {
    fetch(`${apiUrl}/api/visitor/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: req.id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        logToConsole(`[DATABASE] Meeting ${req.id} marked as COMPLETED. Record archived.`, "success");
        fetchRequests();
      }
    })
    .catch(err => console.error("Complete error:", err));
  };

  // Stats calculation
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === "PENDING_APPROVAL").length;
  const confirmedCount = requests.filter(r => r.status === "CONFIRMED" || r.status === "APPROVED").length;
  const rescheduleCount = requests.filter(r => r.status === "WAITING_RESCHEDULE").length;

  // Filter requests list
  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesType = typeFilter === "ALL" || r.meetingType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="admin-container">
      {/* Page Header */}
      <div className="admin-header">
        <div className="admin-title-area">
          <h1>Visitor requests <span className="gold-text">dashboard</span></h1>
          <p>Control bank visitations, manage security JWT credentials, check room conflicts, and verify scheduler logs.</p>
        </div>
        <div className="flex-center gap-4">
          <a href="/visitor_form" className="btn-outline font-mono" style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}>
            Open Booking Form
          </a>
          <button 
            onClick={() => {
              sessionStorage.removeItem("legacy_admin_token");
              sessionStorage.removeItem("legacy_admin_email");
              window.location.reload();
            }} 
            className="btn-outline font-mono"
            style={{ padding: "0.5rem 1rem", fontSize: "0.75rem", borderColor: "rgba(198, 40, 40, 0.4)", color: "#C62828" }}
          >
            Logout
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem("legacy_visitor_emails");
              // Clear emails list locally
              setEmails([]);
              fetchRequests();
            }} 
            className="action-btn text-red-500" 
            title="Clear Mock Inbox"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box"><CalendarIcon size={20} /></div>
          <div className="stat-meta">
            <span className="stat-label">Total Submissions</span>
            <span className="stat-value">{totalCount}</span>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon-box"><AlertCircle size={20} /></div>
          <div className="stat-meta">
            <span className="stat-label">Pending Approval</span>
            <span className="stat-value">{pendingCount}</span>
          </div>
        </div>

        <div className="stat-card confirmed">
          <div className="stat-icon-box"><Check size={20} /></div>
          <div className="stat-meta">
            <span className="stat-label">Confirmed / Approved</span>
            <span className="stat-value">{confirmedCount}</span>
          </div>
        </div>

        <div className="stat-card reschedule">
          <div className="stat-icon-box"><Clock size={20} /></div>
          <div className="stat-meta">
            <span className="stat-label">Reschedule Needed</span>
            <span className="stat-value">{rescheduleCount}</span>
          </div>
        </div>
      </div>

      {/* Console Display */}
      {/* {showConsole && (
        <div className="drawer-section" style={{ marginBottom: "1.5rem" }}>
          <div className="flex-between" style={{ marginBottom: "0.5rem" }}>
            <span className="drawer-section-title" style={{ border: "none", margin: 0 }}>Google Calendar Sync Logger</span>
            <button onClick={() => setShowConsole(false)} className="drawer-close" style={{ fontSize: "0.75rem" }}>Clear Console</button>
          </div>
          <div className="sim-console">
            {consoleLogs.length === 0 ? (
              <div className="console-line system">Waiting for calendar events...</div>
            ) : (
              consoleLogs.map((log, i) => (
                <div key={i} className={`console-line ${log.type}`}>
                  <span style={{ opacity: 0.5 }}>[{log.time}]</span> {log.text}
                </div>
              ))
            )}
          </div>
        </div>
      )} */}

      {/* Filters Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Request ID, visitor name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved (Offline)</option>
            <option value="CONFIRMED">Confirmed (Online)</option>
            <option value="WAITING_RESCHEDULE">Waiting Reschedule</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Meeting Types</option>
            <option value="online">Online Meetings</option>
            <option value="offline">Offline Meetings</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Visitor Details</th>
              <th>Meeting Type</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Created At</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted font-mono" style={{ fontSize: "0.85rem" }}>
                  No requests found matching current criteria.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <button onClick={() => setSelectedRequest(req)} className="req-id-link font-mono" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      {req.id}
                    </button>
                  </td>
                  <td>
                    <div className="req-name-email">
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{req.name}</span>
                      <span className="req-email font-mono">{req.email}</span>
                      <span className="req-email font-mono">{req.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className="req-type-badge font-mono">
                      {req.meetingType === "online" ? (
                        <>
                          <Video size={12} className="text-blue-500" /> Online
                        </>
                      ) : (
                        <>
                          <MapPin size={12} className="text-amber-600" /> Offline
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="req-name-email font-mono" style={{ fontSize: "0.75rem" }}>
                      <span className="font-semibold">{req.formattedDate}</span>
                      <span className="text-muted flex-center gap-2" style={{ justifyContent: "flex-start" }}>
                        <Clock size={10} /> {req.time}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${req.status.toLowerCase()}`}>
                      {req.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="font-mono text-muted" style={{ fontSize: "0.7rem" }}>
                    {new Date(req.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td>
                    <div className="actions-cell" style={{ justifyContent: "flex-end" }}>
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="action-btn view"
                        title="View Full Details"
                      >
                        <Eye size={14} />
                      </button>
                      
                      {req.status === "PENDING_APPROVAL" && (
                        <>
                          <button
                            onClick={() => handleApprove(req)}
                            className="action-btn approve-icon"
                            title="Approve Request"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleReject(req)}
                            className="action-btn reject-icon"
                            title="Reject Request"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Side Drawer */}
      <div className={`drawer-overlay ${selectedRequest ? "active" : ""}`} onClick={() => setSelectedRequest(null)}>
        <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
          {selectedRequest && (
            <>
              <div className="drawer-header">
                <span className="drawer-title font-mono">{selectedRequest.id} Detail</span>
                <button onClick={() => setSelectedRequest(null)} className="drawer-close">
                  <X size={20} />
                </button>
              </div>

              {/* Status Section */}
              <div className="drawer-section">
                <span className="drawer-section-title font-mono">Current Status</span>
                <div className="flex-between">
                  <span className={`status-badge ${selectedRequest.status.toLowerCase()}`} style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                    {selectedRequest.status.replace("_", " ")}
                  </span>
                  <span className="font-mono text-muted text-xs">
                    Submitted: {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Visitor Details */}
              <div className="drawer-section">
                <span className="drawer-section-title font-mono">Visitor Information</span>
                <div className="details-grid">
                  <div className="detail-item">
                    <span>Name</span>
                    <span>{selectedRequest.name}</span>
                  </div>
                  <div className="detail-item">
                    <span>Email Address</span>
                    <span className="font-mono">{selectedRequest.email}</span>
                  </div>
                  <div className="detail-item">
                    <span>Phone Number</span>
                    <span className="font-mono">{selectedRequest.phone}</span>
                  </div>
                </div>
              </div>

              {/* Slot Details */}
              <div className="drawer-section">
                <span className="drawer-section-title font-mono">Meeting Schedule</span>
                <div className="details-grid">
                  <div className="detail-item">
                    <span>Type</span>
                    <span className="capitalize">{selectedRequest.meetingType}</span>
                  </div>
                  <div className="detail-item">
                    <span>Date</span>
                    <span>{selectedRequest.formattedDate}</span>
                  </div>
                  <div className="detail-item">
                    <span>Time Slot</span>
                    <span>{selectedRequest.time}</span>
                  </div>
                  {selectedRequest.meetingUrl && (
                    <div className="detail-item">
                      <span>Google Meet</span>
                      <a href={selectedRequest.meetingUrl} target="_blank" rel="noreferrer" className="gold-text font-mono underline break-all text-xs" style={{ maxWidth: "250px" }}>
                        {selectedRequest.meetingUrl}
                      </a>
                    </div>
                  )}
                  {selectedRequest.calendarEventId && (
                    <>
                      <div className="detail-item">
                        <span>Event ID</span>
                        <span className="font-mono text-xs">{selectedRequest.calendarEventId}</span>
                      </div>
                      <div className="detail-item">
                        <span>Calendar ID</span>
                        <span className="font-mono text-xs">{selectedRequest.calendarId}</span>
                      </div>
                      <div className="detail-item">
                        <span>Confirmed At</span>
                        <span className="font-mono text-xs">
                          {new Date(selectedRequest.confirmedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span>Approved By</span>
                        <span className="font-mono text-xs">{selectedRequest.approvedBy}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons inside drawer */}
              <div className="drawer-section">
                <span className="drawer-section-title font-mono">Administrative Actions</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {selectedRequest.status === "PENDING_APPROVAL" && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => { handleApprove(selectedRequest); }}
                        className="btn-gold font-mono flex-center gap-2"
                        style={{ flex: 1, padding: "0.6rem" }}
                      >
                        <Check size={14} /> Approve Pass
                      </button>
                      <button
                        onClick={() => { handleReject(selectedRequest); }}
                        className="btn-outline font-mono flex-center gap-2"
                        style={{ flex: 1, padding: "0.6rem", border: "1px solid #C62828", color: "#C62828" }}
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  )}

                  {selectedRequest.status !== "COMPLETED" && selectedRequest.status !== "CANCELLED" && selectedRequest.status !== "REJECTED" && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleOpenReschedule(selectedRequest)}
                        className="btn-outline font-mono flex-center gap-2"
                        style={{ flex: 1, padding: "0.6rem" }}
                      >
                        <Clock size={14} /> Reschedule Slot
                      </button>
                      <button
                        onClick={() => handleCompleteMeeting(selectedRequest)}
                        className="btn-outline font-mono flex-center gap-2"
                        style={{ flex: 1, padding: "0.6rem", border: "1px solid #2E7D32", color: "#2E7D32" }}
                      >
                        <Check size={14} /> Mark Completed
                      </button>
                    </div>
                  )}

                  {selectedRequest.status !== "CANCELLED" && selectedRequest.status !== "REJECTED" && (
                    <button
                      onClick={() => handleCancelMeeting(selectedRequest)}
                      className="btn-outline font-mono flex-center gap-2"
                      style={{ width: "100%", padding: "0.6rem", border: "1px solid #C62828", color: "#C62828" }}
                    >
                      <X size={14} /> Cancel Meeting Event
                    </button>
                  )}
                </div>
              </div>

              {/* History Timeline */}
              <div className="drawer-section">
                <span className="drawer-section-title font-mono">Audit Log History</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {selectedRequest.history?.map((hist: any, i: number) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.15rem", borderLeft: "2px solid var(--gold)", paddingLeft: "0.6rem" }}>
                      <span className="font-mono text-xs font-bold" style={{ color: "var(--gold-dark)" }}>{hist.status}</span>
                      <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                        {new Date(hist.timestamp).toLocaleString()}
                      </span>
                      {hist.note && <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{hist.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Manual Reschedule Modal */}
      {showRescheduleModal && selectedRequest && (
        <div className="popup-overlay active" style={{ zIndex: 1100 }}>
          <div className="popup-modal text-left" style={{ maxWidth: "450px" }}>
            <button onClick={() => setShowRescheduleModal(false)} className="popup-close"><X size={20} /></button>
            <h3 className="gold-text font-mono" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Manually Reschedule {selectedRequest.id}
            </h3>
            
            <div className="visitor-form-fields">
              <div className="form-field">
                <label>Select Date (Fridays Only)</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="filter-select"
                  style={{ width: "100%", height: "45px" }}
                />
              </div>

              <div className="form-field">
                <label>Select Time Slot (10 AM - 5 PM)</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="filter-select"
                  style={{ width: "100%", height: "45px" }}
                >
                  <option value="">Choose slot...</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="1:30 PM">1:30 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="2:30 PM">2:30 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="3:30 PM">3:30 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="4:30 PM">4:30 PM</option>
                </select>
              </div>

              <button onClick={handleSaveReschedule} className="btn-gold font-mono w-full" style={{ padding: "0.8rem", marginTop: "1rem" }}>
                Confirm Reschedule Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Mock Email Inbox */}
      <div className={`mailbox-drawer ${mailboxCollapsed ? "collapsed" : ""}`}>
        <div className="mailbox-header" onClick={() => setMailboxCollapsed(!mailboxCollapsed)}>
          <div className="flex-center gap-2">
            <Inbox size={16} />
            <h3>Notification Mailbox ({emails.filter(e => e.unread).length} Unread)</h3>
          </div>
          {mailboxCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        <div className="mailbox-content">
          {!selectedEmail ? (
            <div className="mailbox-list">
              {emails.length === 0 ? (
                <div className="text-center py-8 text-muted font-mono" style={{ fontSize: "0.75rem" }}>
                  No mail in inbox.
                </div>
              ) : (
                emails.map(email => (
                  <button
                    key={email.id}
                    onClick={() => {
                      setSelectedEmail(email);
                      // Mark as read
                      const updated = emails.map(e => e.id === email.id ? { ...e, unread: false } : e);
                      localStorage.setItem("legacy_visitor_emails", JSON.stringify(updated));
                      setEmails(updated);
                    }}
                    className={`email-item ${email.unread ? "unread-bg" : ""} ${selectedEmail?.id === email.id ? "selected" : ""}`}
                    style={{ border: "none", width: "100%" }}
                  >
                    <div className="email-meta">
                      <span className="email-sender font-mono">{email.sender}</span>
                      <span className="email-time font-mono" style={{ fontSize: "0.6rem" }}>
                        {new Date(email.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="email-subject">{email.subject}</div>
                    <div className="email-preview font-mono">{email.body.substring(0, 50)}...</div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="email-viewer">
              <div className="viewer-header">
                <button onClick={() => setSelectedEmail(null)} className="viewer-back">
                  ← Back to Inbox
                </button>
                <div className="viewer-subject">{selectedEmail.subject}</div>
                <div className="flex-between font-mono" style={{ fontSize: "0.65rem", marginTop: "0.25rem", color: "var(--text-muted)" }}>
                  <span>From: {selectedEmail.sender}</span>
                  <span>{new Date(selectedEmail.time).toLocaleString()}</span>
                </div>
              </div>
              <div className="viewer-body font-mono">
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                  {selectedEmail.body}
                </pre>

                {/* Secure Action Buttons with JWT link for Admin alerts */}
                {selectedEmail.type === "admin_alert" && (
                  <div className="email-button-container">
                    <a 
                      href={selectedEmail.approveUrl} 
                      className="email-act-btn approve"
                      title="Approves this request via secure signed token link"
                    >
                      Secure Approve
                    </a>
                    <a 
                      href={selectedEmail.rejectUrl} 
                      className="email-act-btn reject"
                      title="Rejects this request via secure signed token link"
                    >
                      Secure Reject
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
