"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Video,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader,
  Briefcase,
  Users,
  UserCheck,
  Hash,
  FileText
} from "lucide-react";

interface SlotStatus {
  booked: number;
  capacity: number;
  full: boolean;
}

interface DateAvailability {
  slots: Record<string, SlotStatus>;
  dateFull: boolean;
}

interface SlotsData {
  capacity: number;
  timeSlots: string[];
  dates: Record<string, DateAvailability>;
}

interface VisitorFormProps {
  onSuccessSubmit: (requestId: string) => void;
}

export function VisitorForm({ onSuccessSubmit }: VisitorFormProps) {
  // Form input states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [meetingType, setMeetingType] = useState<"online" | "offline">("online");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // New visitor questions states
  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [referenceEmployee, setReferenceEmployee] = useState("");
  const [preferredBranch, setPreferredBranch] = useState("Bengaluru");
  const [personToMeet, setPersonToMeet] = useState("");
  const [existingClient, setExistingClient] = useState("");
  const [tradingAccountId, setTradingAccountId] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Slot availability state
  const [slotsData, setSlotsData] = useState<SlotsData | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(true);

  // Custom Calendar state — starts on the current month
  const [viewDate, setViewDate] = useState(() => { const d = new Date(); d.setDate(1); return d; });

  // Allowed slots (10:00 AM to 5:00 PM)
  const timeSlots = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM"
  ];

  // Fetch slot availability on mount (and when meeting type changes to online)
  useEffect(() => {
    if (meetingType !== "online") return;
    setSlotsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://legacy-backend-151726525663.europe-west1.run.app";
    fetch(`${apiUrl}/api/visitor/slots`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSlotsData(data);
        }
      })
      .catch(err => {
        console.error("Failed to load slot availability:", err);
      })
      .finally(() => {
        setSlotsLoading(false);
      });
  }, [meetingType]);

  // Helper: get date string YYYY-MM-DD from a Date object (local time, no UTC shift)
  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Helper: Is a specific slot full for the selected date?
  const isSlotFull = (slot: string): boolean => {
    if (!slotsData || !selectedDate) return false;
    const dateStr = toDateStr(selectedDate);
    const dateInfo = slotsData.dates[dateStr];
    if (!dateInfo) return false;
    return dateInfo.slots[slot]?.full === true;
  };

  // Helper: Is a day fully booked (all slots full)?
  const isDayFull = (day: number): boolean => {
    if (!slotsData) return false;
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = toDateStr(d);
    return slotsData.dates[dateStr]?.dateFull === true;
  };

  // Helper: Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper: Get day of week for 1st of month
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setViewDate(prev => {
      const year = prev.getMonth() === 0 ? prev.getFullYear() - 1 : prev.getFullYear();
      const month = prev.getMonth() === 0 ? 11 : prev.getMonth() - 1;
      return new Date(year, month, 1);
    });
  };

  const handleNextMonth = () => {
    setViewDate(prev => {
      const year = prev.getMonth() === 11 ? prev.getFullYear() + 1 : prev.getFullYear();
      const month = prev.getMonth() === 11 ? 0 : prev.getMonth() + 1;
      return new Date(year, month, 1);
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (isDayFull(day)) return; // skip fully booked days
    setSelectedDate(clickedDate);
    setSelectedTime("");  // reset time selection when date changes
    setError("");
  };

  const validateForm = () => {
    if (!name.trim()) return "Full name is required.";
    if (!phone.trim()) return "Phone number is required.";

    const phoneRegex = /^[+]?[0-9\s-]{8,15}$/;
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number (e.g. +91 99999 99999).";

    if (!email.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";

    if (!purposeOfVisit) return "Purpose of visit is required.";
    if (!preferredBranch) return "Preferred branch is required.";
    if (!existingClient) return "Please select if you are an existing client.";
    if (existingClient === "Yes" && !tradingAccountId.trim()) return "Trading Account ID is required.";

    if (meetingType === "online") {
      if (!selectedDate) return "Please select a meeting date.";
      if (!selectedTime) return "Please select a meeting time slot.";
      if (isSlotFull(selectedTime)) return "The selected time slot is fully booked. Please choose another slot.";
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://legacy-backend-151726525663.europe-west1.run.app";
    fetch(`${apiUrl}/api/visitor/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        meetingType,
        date: meetingType === "online" && selectedDate ? toDateStr(selectedDate) : "",
        formattedDate: meetingType === "online" && selectedDate
          ? selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          })
          : "N/A",
        time: meetingType === "online" ? selectedTime : "N/A",
        purposeOfVisit,
        referenceEmployee,
        preferredBranch,
        personToMeet,
        existingClient,
        tradingAccountId: existingClient === "Yes" ? tradingAccountId : "",
        additionalNotes
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onSuccessSubmit(data.requestId);
        } else {
          setError(data.message || "Failed to submit request. Please try again.");
        }
      })
      .catch(err => {
        console.error("Submit error:", err);
        setError("Network error connecting to backend. Please check if the backend server is running.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Calendar render helpers
  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDayIndex = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const calendarCells = [];

  // Empty cells for alignment
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="calendar-day empty" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const isSelected = selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewDate.getMonth() &&
      selectedDate.getFullYear() === viewDate.getFullYear();

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const isPast = currentDate < today;
    const isFull = !isPast && isDayFull(day);

    let className = "calendar-day";
    if (!isPast && !isFull) className += " is-available";
    if (isPast) className += " is-past-disabled";
    if (isFull) className += " is-fully-booked";
    if (isSelected) className += " is-selected";

    calendarCells.push(
      <button
        key={`day-${day}`}
        type="button"
        className={className}
        disabled={isPast || isFull}
        onClick={() => handleDateClick(day)}
        title={isFull ? "Fully booked — no slots available" : undefined}
      >
        <span>{day}</span>
        {isFull && <span className="full-dot">✕</span>}
      </button>
    );
  }

  return (
    <div className="visitor-card reveal visible">
      <div className="visitor-card-header">
        <h2>Schedule a <span className="gold-text">Meeting</span></h2>
        <p>Book a slot with our global banking specialists. Choose any available date for an online video sync or offline branch visit.</p>
      </div>

      {error && (
        <div className="form-error-banner">
          <span className="icon">✕</span>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="visitor-form-fields">
        {/* Row 1: Name and Phone */}
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="vis-name">Full Name</label>
            <div className="input-icon-wrapper">
              <User size={16} className="input-icon" />
              <input
                id="vis-name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="vis-phone">Phone Number</label>
            <div className="input-icon-wrapper">
              <Phone size={16} className="input-icon" />
              <input
                id="vis-phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Row 2: Email */}
        <div className="form-field">
          <label htmlFor="vis-email">Email Address</label>
          <div className="input-icon-wrapper">
            <Mail size={16} className="input-icon" />
            <input
              id="vis-email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Row 3: Meeting Type Cards */}
        <div className="form-field">
          <label>Meeting Type</label>
          <div className="meeting-type-grid">
            <button
              type="button"
              className={`meeting-type-card ${meetingType === "online" ? "active" : ""}`}
              onClick={() => setMeetingType("online")}
            >
              <Video size={24} className="type-icon" />
              <div className="type-meta">
                <span className="type-title">Online Meeting</span>
                <span className="type-desc">Google Meet call with Google Calendar link. 30 Mins.</span>
              </div>
              <div className="radio-circle"></div>
            </button>

            <button
              type="button"
              className={`meeting-type-card ${meetingType === "offline" ? "active" : ""}`}
              onClick={() => setMeetingType("offline")}
            >
              <MapPin size={24} className="type-icon" />
              <div className="type-meta">
                <span className="type-title">Offline Meeting</span>
                <span className="type-desc">In-branch consultation. Requires entry verification.</span>
              </div>
              <div className="radio-circle"></div>
            </button>
          </div>
        </div>

        {/* Purpose of Visit & Reference Employee Row */}
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="vis-purpose">Purpose of Visit *</label>
            <div className="input-icon-wrapper">
              <Briefcase size={16} className="input-icon" />
              <select
                id="vis-purpose"
                value={purposeOfVisit}
                onChange={(e) => {
                  setPurposeOfVisit(e.target.value);
                  setError("");
                }}
                required
                style={{ width: "100%" }}
              >
                <option value="">Select Purpose...</option>
                <option value="Open Trading Account">Open Trading Account</option>
                <option value="Existing Client Support">Existing Client Support</option>
                <option value="Deposit / Withdrawal">Deposit / Withdrawal</option>
                <option value="KYC Verification">KYC Verification</option>
                <option value="Partner / IB Meeting">Partner / IB Meeting</option>
                <option value="Platform Demo">Platform Demo</option>
                <option value="Account Discussion">Account Discussion</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="vis-reference">Reference Employee Name (Optional)</label>
            <div className="input-icon-wrapper">
              <Users size={16} className="input-icon" />
              <input
                id="vis-reference"
                type="text"
                placeholder="e.g. Shiva Prasad"
                value={referenceEmployee}
                onChange={(e) => setReferenceEmployee(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Preferred Branch & Person to Meet Row */}
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="vis-branch">Preferred Branch *</label>
            <div className="input-icon-wrapper">
              <MapPin size={16} className="input-icon" />
              <select
                id="vis-branch"
                value={preferredBranch}
                onChange={(e) => {
                  setPreferredBranch(e.target.value);
                  setError("");
                }}
                required
                style={{ width: "100%" }}
              >
                <option value="Bengaluru">Bengaluru</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="vis-meet-person">Person You Wish to Meet (Optional)</label>
            <div className="input-icon-wrapper">
              <UserCheck size={16} className="input-icon" />
              <input
                id="vis-meet-person"
                type="text"
                placeholder="e.g. Yogesh A"
                value={personToMeet}
                onChange={(e) => setPersonToMeet(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Existing Client & Trading Account Row */}
        <div className="form-row">
          <div className="form-field">
            <label style={{ marginBottom: "0.5rem" }}>Are You an Existing Client? *</label>
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem", height: "42px", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--text-primary)", fontSize: "0.9rem" }}>
                <input
                  type="radio"
                  name="existingClient"
                  value="Yes"
                  checked={existingClient === "Yes"}
                  onChange={() => {
                    setExistingClient("Yes");
                    setError("");
                  }}
                  required
                />
                Yes
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--text-primary)", fontSize: "0.9rem" }}>
                <input
                  type="radio"
                  name="existingClient"
                  value="No"
                  checked={existingClient === "No"}
                  onChange={() => {
                    setExistingClient("No");
                    setTradingAccountId("");
                    setError("");
                  }}
                  required
                />
                No
              </label>
            </div>
          </div>
          
          <div className="form-field" style={{ visibility: existingClient === "Yes" ? "visible" : "hidden" }}>
            <label htmlFor="vis-account-id">Trading Account ID *</label>
            <div className="input-icon-wrapper">
              <Hash size={16} className="input-icon" />
              <input
                id="vis-account-id"
                type="text"
                placeholder="e.g. TR-98765"
                value={tradingAccountId}
                onChange={(e) => setTradingAccountId(e.target.value)}
                required={existingClient === "Yes"}
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="form-field">
          <label htmlFor="vis-notes">Additional Notes</label>
          <div className="input-icon-wrapper" style={{ alignItems: "flex-start" }}>
            <FileText size={16} className="input-icon" style={{ top: "1rem" }} />
            <textarea
              id="vis-notes"
              placeholder="e.g. Any specific queries or requirements..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.75rem",
                borderRadius: "6px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-silver)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
                outline: "none",
                fontFamily: "inherit",
                resize: "vertical"
              }}
            />
          </div>
        </div>

        {/* Custom Calendar */}
        {meetingType === "online" && (
          <div className="form-field">
            <label className="flex-between">
              <span>Select Date</span>
              {selectedDate && (
                <span className="selected-preview font-mono">
                  {selectedDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              )}
            </label>

            <div className="custom-calendar-container">
              <div className="calendar-header">
                <button type="button" onClick={handlePrevMonth} className="calendar-nav-btn">
                  <ChevronLeft size={16} />
                </button>
                <span className="calendar-month-year">
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button type="button" onClick={handleNextMonth} className="calendar-nav-btn">
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="calendar-grid">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                  <div key={d} className="calendar-day-header">{d}</div>
                ))}
                {calendarCells}
              </div>
              <div className="calendar-legend">
                <span className="legend-item"><span className="legend-dot active"></span> Available</span>
                <span className="legend-item"><span className="legend-dot fully-booked"></span> Fully Booked</span>
                <span className="legend-item"><span className="legend-dot disabled"></span> Past</span>
              </div>
            </div>
          </div>
        )}

        {/* Time Slots Selection */}
        {meetingType === "online" && (
          <div className="form-field">
            <label className="flex-between">
              <span>Select Time <span className="gold-text">(10 AM - 5 PM)</span></span>
              {selectedTime && !isSlotFull(selectedTime) && <span className="selected-preview font-mono">{selectedTime}</span>}
            </label>

            {slotsLoading ? (
              <div className="slots-loading">
                <Loader size={16} className="spinner-icon" />
                <span>Checking availability...</span>
              </div>
            ) : !selectedDate ? (
              <div className="slots-hint">
                <CalendarIcon size={14} />
                <span>Select a date above to see available time slots</span>
              </div>
            ) : (
              <div className="input-icon-wrapper">
                <Clock size={16} className="input-icon" />
                <select
                  value={selectedTime}
                  onChange={(e) => {
                    setSelectedTime(e.target.value);
                    setError("");
                  }}
                  required
                  style={{ width: "100%" }}
                >
                  <option value="">Choose a time slot...</option>
                  {timeSlots.map(slot => {
                    const full = isSlotFull(slot);
                    return (
                      <option key={slot} value={slot} disabled={full}>
                        {slot} {full ? " (Fully Booked)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Submit Request Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {isSubmitting ? (
            <span className="flex-center gap-2">
              <span className="spinner"></span>
              Processing Secure Booking...
            </span>
          ) : (
            <span className="flex-center gap-2">
              Submit Request <ArrowRight size={16} />
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

interface VisitorSuccessProps {
  requestId: string;
  onGoBack: () => void;
}

export function VisitorSuccess({ requestId, onGoBack }: VisitorSuccessProps) {
  const [req, setReq] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://legacy-backend-151726525663.europe-west1.run.app";
    fetch(`${apiUrl}/api/visitor/request/${requestId}`)
      .then(res => {
        if (!res.ok) throw new Error("Request details not found on backend");
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setReq(data.request);
        } else {
          setError("Failed to fetch request status.");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Unable to connect to the server.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [requestId]);

  if (loading) {
    return (
      <div className="visitor-card reveal visible text-center py-12 flex-center" style={{ flexDirection: "column", gap: "1rem" }}>
        <div className="spinner"></div>
        <p className="font-mono text-muted">Retrieving pass status from bank registry...</p>
      </div>
    );
  }

  if (error || !req) {
    return (
      <div className="visitor-card reveal visible text-center py-8">
        <h2 className="gold-text">Request Not Found</h2>
        <p className="my-4">{error || "Something went wrong fetching the status of your request."}</p>
        <button onClick={onGoBack} className="submit-btn">Go Back</button>
      </div>
    );
  }

  return (
    <div className="visitor-card reveal visible">
      <div className="success-badge-container">
        <CheckCircle size={64} className="success-badge-icon" />
        <h2 className="success-h2">Request <span className="gold-text">Submitted</span></h2>
        <p className="success-p">Your request has been successfully registered. The admin team is verifying availability.</p>
      </div>

      <div className="request-details-box">
        <div className="details-header">
          <span className="details-label font-mono">REQUEST ID</span>
          <span className="details-id font-mono">{req.id}</span>
        </div>
        <div className="details-grid font-mono">
          <div className="detail-item">
            <span>Name</span>
            <span>{req.name}</span>
          </div>
          <div className="detail-item">
            <span>Email</span>
            <span>{req.email}</span>
          </div>
          <div className="detail-item">
            <span>Phone</span>
            <span>{req.phone}</span>
          </div>
          <div className="detail-item">
            <span>Meeting Type</span>
            <span className="capitalize">{req.meetingType}</span>
          </div>
          <div className="detail-item">
            <span>Purpose of Visit</span>
            <span>{req.purposeOfVisit}</span>
          </div>
          <div className="detail-item">
            <span>Preferred Branch</span>
            <span>{req.preferredBranch}</span>
          </div>
          {req.referenceEmployee && (
            <div className="detail-item">
              <span>Reference Employee</span>
              <span>{req.referenceEmployee}</span>
            </div>
          )}
          {req.personToMeet && (
            <div className="detail-item">
              <span>Person to Meet</span>
              <span>{req.personToMeet}</span>
            </div>
          )}
          <div className="detail-item">
            <span>Existing Client?</span>
            <span>{req.existingClient}</span>
          </div>
          {req.existingClient === 'Yes' && req.tradingAccountId && (
            <div className="detail-item">
              <span>Trading Account ID</span>
              <span>{req.tradingAccountId}</span>
            </div>
          )}
          {req.meetingType === "online" && (
            <>
              <div className="detail-item">
                <span>Requested Date</span>
                <span>{req.formattedDate}</span>
              </div>
              <div className="detail-item">
                <span>Requested Time</span>
                <span>{req.time}</span>
              </div>
            </>
          )}
          <div className="detail-item">
            <span>Status</span>
            <span className={`status-badge ${req.status.toLowerCase()}`}>{req.status.replace("_", " ")}</span>
          </div>
          {req.additionalNotes && (
            <div className="detail-item" style={{ gridColumn: "span 2" }}>
              <span>Additional Notes</span>
              <span style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{req.additionalNotes}</span>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Section for Offline (Visitor Pass) */}
      {req.meetingType === "offline" && (
        <div className="qr-code-container text-center my-6 p-6" style={{ background: "rgba(255, 255, 255, 0.02)", borderRadius: "8px", border: "1px dashed var(--border-silver)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginTop: "1.5rem" }}>
          <span className="font-mono text-xs font-bold" style={{ color: "var(--gold)", letterSpacing: "1px" }}>SECURE ENTRY PASS QR CODE</span>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(origin + "/visitor_form/checkin?id=" + req.id + "&token=" + req.checkinToken)}`} 
            alt="Secure Visitor Pass QR Code" 
            style={{ width: "180px", height: "180px", borderRadius: "8px", border: "4px solid white" }}
          />
          <p className="text-xs text-muted" style={{ maxWidth: "420px", margin: "0 auto", lineHeight: "1.5", color: "var(--text-secondary)" }}>
            Please present this QR code to the bank security or receptionist at the <strong>{req.preferredBranch || 'Bengaluru'}</strong> branch upon arrival.
          </p>
        </div>
      )}

      {/* Visual Workflow Timeline */}
      <div className="workflow-timeline">
        <h4 className="timeline-title font-mono">NEXT STEPS IN WORKFLOW</h4>

        <div className="timeline-items">
          <div className="timeline-step done">
            <div className="step-marker">1</div>
            <div className="step-content">
              <h5>Request Submitted</h5>
              <p>Meeting stored in database with PENDING_APPROVAL status.</p>
            </div>
          </div>

          <div className="timeline-step current">
            <div className="step-marker">2</div>
            <div className="step-content">
              <h5>Admin Notification</h5>
              <p>An email with secure tokens is sent to the Admin Team for verification.</p>
            </div>
          </div>

          <div className="timeline-step pending">
            <div className="step-marker">3</div>
            <div className="step-content">
              <h5>Calendar Verification</h5>
              <p>For Online: Calendar availability is checked. Google Meet links generated. For Offline: Direct approval is finalized.</p>
            </div>
          </div>

          <div className="timeline-step pending">
            <div className="step-marker">4</div>
            <div className="step-content">
              <h5>Confirmation Send</h5>
              <p>A confirmation email containing calendar invites is dispatched to your inbox.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-center gap-4 mt-6">
        <button onClick={onGoBack} className="btn-outline" style={{ flex: 1 }}>
          Book Another
        </button>
        {/* <a href="/visitor_form/admin" className="btn-gold font-mono" style={{ flex: 1, textAlign: "center", display: "inline-block", padding: "0.9rem" }}>
          Go to Dashboard
        </a> */}
      </div>
    </div>
  );
}
