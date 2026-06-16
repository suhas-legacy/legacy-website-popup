"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { AdminDashboard } from "../components/AdminDashboard";
import { LoginForm } from "../components/LoginForm";
import "../visitor-styles.css";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    // Check if session token exists in sessionStorage
    const token = sessionStorage.getItem("legacy_admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = (token: string, email: string) => {
    sessionStorage.setItem("legacy_admin_token", token);
    sessionStorage.setItem("legacy_admin_email", email);
    setIsAuthenticated(true);
  };

  if (checkingAuth) {
    return (
      <>
        <Navbar />
        <main className="page-main">
          <div className="page-container flex-center" style={{ minHeight: "50vh" }}>
            <div className="spinner"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="page-container" style={{ maxWidth: "1280px" }}>
          <PageBreadcrumb currentPage="Admin Dashboard" />
          {isAuthenticated ? (
            <AdminDashboard />
          ) : (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
