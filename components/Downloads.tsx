"use client";

import Image from "next/image";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Ticker } from "./Ticker";
import androidIcon from "@/public/android.png";
import appleIcon from "@/public/apple2.png";
import windowsIcon from "@/public/windows1.png";
import MacIcon from "@/public/mac.png";

interface PlatformLink {
  id: string;
  name: string;
  icon: typeof androidIcon | typeof MacIcon | string;
  description: string;
  downloadUrl: string;
  badge?: string;
}

const platforms: PlatformLink[] = [
  {
    id: "android",
    name: "Android",
    icon: androidIcon,
    description: "Trade on the go with our Android app. Full-featured mobile trading with real-time charts and instant execution.",
    downloadUrl: "https://play.google.com/store/apps/details?id=com.traderprogram.android&hl=en_IN",
    badge: "Google Play",
  },
  {
    id: "ios",
    name: "iOS",
    icon: appleIcon,
    description: "Download for iPhone and iPad. Seamless trading experience optimized for Apple devices.",
    downloadUrl: "https://apps.apple.com/in/app/mobiustrader-7/id1355359598",
    badge: "App Store",
  },
  {
    id: "windows",
    name: "Windows",
    icon: windowsIcon,
    description: "Powerful desktop application for Windows. Advanced charting, multiple monitors support, and fast execution.",
    downloadUrl: "/TheRiseFX-Terminal.win.exe",
    badge: "Download",
  },
  {
    id: "mac",
    name: "Mac",
    icon: MacIcon,
    description: "Download for macOS and Linux systems. AppImage format for universal compatibility.",
    downloadUrl: "/TheRiseFX-Terminal.linux.AppImage",
    badge: "Download",
  },
];

export function Downloads() {
  return (
    <div className="downloads-page">
      <Navbar />
      <Ticker />

      {/* Hero Section */}
      <section className="downloads-hero">
        <div className="hero-content">
          <span className="section-label">Download Center</span>
          <h1 className="section-title">
            Trade <span className="gold-text">Anywhere</span>
          </h1>
          <p className="section-desc">
            Access the markets from any device. Download our trading applications 
            for mobile, desktop, or trade directly from your browser.
          </p>
        </div>
      </section>

      {/* Platform Cards */}
      <section className="platforms-section">
        <div className="platforms-grid">
          {platforms.map((platform) => (
            <div key={platform.id} className="platform-card">
              <div className="platform-icon">
                {typeof platform.icon === "string" ? (
                  <span style={{ fontSize: "3rem" }}>{platform.icon}</span>
                ) : (
                  <Image 
                    src={platform.icon} 
                    alt={platform.name} 
                    width={64} 
                    height={64}
                    style={{ objectFit: "contain" }}
                  />
                )}
              </div>
              <div className="platform-badge">{platform.badge}</div>
              <h3 className="platform-name">{platform.name}</h3>
              <p className="platform-desc">{platform.description}</p>
              <a 
                href={platform.downloadUrl}
                className="platform-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                {platform.badge === "Launch" ? "Launch Platform" : `Download for ${platform.name}`}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="app-features-section">
        <h2 className="features-title">App Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <h4>Real-Time Charts</h4>
            <p>Advanced charting with multiple timeframes and indicators</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <h4>Instant Execution</h4>
            <p>Fast order execution with minimal slippage</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔔</span>
            <h4>Price Alerts</h4>
            <p>Get notified when markets reach your target levels</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <h4>Secure Trading</h4>
            <p>Bank-grade security with 2FA protection</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💰</span>
            <h4>Account Management</h4>
            <p>Deposit, withdraw, and manage your funds on the go</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🌍</span>
            <h4>Global Markets</h4>
            <p>Access forex, metals, oil, and indices worldwide</p>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="system-requirements">
        <h2>System Requirements</h2>
        <div className="requirements-grid">
          <div className="requirement-card">
            <h4>Android</h4>
            <ul>
              <li>Android 8.0 or higher</li>
              <li>2GB RAM minimum</li>
              <li>100MB free space</li>
              <li>Internet connection</li>
            </ul>
          </div>
          <div className="requirement-card">
            <h4>iOS</h4>
            <ul>
              <li>iOS 14.0 or higher</li>
              <li>iPhone, iPad, iPod Touch</li>
              <li>150MB free space</li>
              <li>Internet connection</li>
            </ul>
          </div>
          <div className="requirement-card">
            <h4>Windows</h4>
            <ul>
              <li>Windows 10 or higher</li>
              <li>4GB RAM recommended</li>
              <li>200MB free space</li>
              <li>Internet connection</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
