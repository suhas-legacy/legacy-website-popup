'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Shield, BarChart3, Megaphone, User } from 'lucide-react';

export interface ConsentChoices {
  strictly_necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const defaultChoices: ConsentChoices = {
  strictly_necessary: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

interface CookieConsentBannerProps {
  onConsentChange?: (choices: ConsentChoices) => void;
}

export default function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [choices, setChoices] = useState<ConsentChoices>(defaultChoices);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already made a consent decision
    const storedConsent = localStorage.getItem('user_consent');
    if (!storedConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
        setIsAnimating(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: ConsentChoices = {
      strictly_necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    setChoices(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const allRejected: ConsentChoices = {
      strictly_necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    setChoices(allRejected);
    saveConsent(allRejected);
  };

  const handleSavePreferences = () => {
    saveConsent(choices);
  };

  const saveConsent = (consentChoices: ConsentChoices) => {
    localStorage.setItem('user_consent', JSON.stringify(consentChoices));
    
    // Set cookie with 1 year expiry
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `user_consent=${JSON.stringify(consentChoices)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    
    if (onConsentChange) {
      onConsentChange(consentChoices);
    }
    
    setIsAnimating(false);
    setTimeout(() => {
      setShowBanner(false);
      setShowPreferences(false);
    }, 300);
  };

  const toggleChoice = (key: keyof ConsentChoices) => {
    if (key === 'strictly_necessary') return; // Cannot disable strictly necessary
    setChoices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && !showPreferences && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-semibold text-lg">Cookie & Privacy Consent</h3>
                  </div>
                  <p className="text-gray-300 text-sm max-w-2xl">
                    We use cookies and collect data to enhance your experience, analyze traffic, and personalize content. 
                    Your data helps us improve our services. You can change your preferences anytime.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Manage Preferences
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowPreferences(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Cookie Preferences</h2>
                  </div>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <ConsentToggle
                    icon={<Shield className="w-5 h-5" />}
                    title="Strictly Necessary"
                    description="Essential for the website to function properly. Cannot be disabled."
                    enabled={choices.strictly_necessary}
                    onToggle={() => {}}
                    disabled
                  />
                  
                  <ConsentToggle
                    icon={<BarChart3 className="w-5 h-5" />}
                    title="Analytics"
                    description="Help us understand how visitors use our website to improve performance."
                    enabled={choices.analytics}
                    onToggle={() => toggleChoice('analytics')}
                  />
                  
                  <ConsentToggle
                    icon={<Megaphone className="w-5 h-5" />}
                    title="Marketing"
                    description="Used to track visitors across websites to display relevant advertisements."
                    enabled={choices.marketing}
                    onToggle={() => toggleChoice('marketing')}
                  />
                  
                  <ConsentToggle
                    icon={<User className="w-5 h-5" />}
                    title="Personalization"
                    description="Remember your preferences and personalize your experience."
                    enabled={choices.personalization}
                    onToggle={() => toggleChoice('personalization')}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface ConsentToggleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function ConsentToggle({ icon, title, description, enabled, onToggle, disabled }: ConsentToggleProps) {
  return (
    <div className={`p-4 rounded-xl border ${enabled ? 'border-blue-500/30 bg-blue-500/5' : 'border-gray-700 bg-gray-800/50'} transition-colors`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${enabled ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-blue-600' : 'bg-gray-600'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
