"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { VisitorForm, VisitorSuccess } from "./components/VisitorForm";
import "./visitor-styles.css";

export default function VisitorFormPage() {
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  const handleSuccess = (requestId: string) => {
    setSubmittedRequestId(requestId);
  };

  const handleGoBack = () => {
    setSubmittedRequestId(null);
  };

  return (
    <>
      <Navbar />
      <main className="page-main">
        <div className="page-container">
          <PageBreadcrumb currentPage="Visitor Pass" />
          
          <div className="visitor-container">
            <h1 className="page-title text-center">
              Visitor <span className="gold-text">Pass Request</span>
            </h1>
            
            {!submittedRequestId ? (
              <VisitorForm onSuccessSubmit={handleSuccess} />
            ) : (
              <VisitorSuccess 
                requestId={submittedRequestId} 
                onGoBack={handleGoBack} 
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
