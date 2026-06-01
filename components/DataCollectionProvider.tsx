'use client';

import { useState, useEffect } from 'react';
import CookieConsentBanner, { ConsentChoices } from './CookieConsentBanner';

export default function DataCollectionProvider() {
  const [consentChoices, setConsentChoices] = useState<ConsentChoices | null>(null);

  useEffect(() => {
    // Check for existing consent on mount
    const storedConsent = localStorage.getItem('user_consent');
    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent) as ConsentChoices;
        setConsentChoices(parsed);
      } catch (error) {
        console.error('Error parsing stored consent:', error);
      }
    }
  }, []);

  const handleConsentChange = (choices: ConsentChoices) => {
    setConsentChoices(choices);
  };

  return (
    <>
      <CookieConsentBanner onConsentChange={handleConsentChange} />
    </>
  );
}
