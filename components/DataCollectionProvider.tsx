'use client';

import { useEffect, useState } from 'react';
import CookieConsentBanner, { ConsentChoices } from './CookieConsentBanner';
import { useDataCollection } from '@/lib/useDataCollection';

export default function DataCollectionProvider() {
  const [consentChoices, setConsentChoices] = useState<ConsentChoices | null>(null);
  const [hasInitialConsent, setHasInitialConsent] = useState(false);
  const { track, sessionId } = useDataCollection(consentChoices);

  useEffect(() => {
    // Check for existing consent on mount
    const storedConsent = localStorage.getItem('user_consent');
    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent) as ConsentChoices;
        setConsentChoices(parsed);
        setHasInitialConsent(true);
        
        // Track page view with existing consent
        track().catch(error => {
          console.error('Initial tracking error:', error);
        });
      } catch (error) {
        console.error('Error parsing stored consent:', error);
      }
    }
  }, []);

  const handleConsentChange = async (choices: ConsentChoices) => {
    const consentStartTime = Date.now();
    setConsentChoices(choices);
    setHasInitialConsent(true);
    
    // Track with consent decision time
    const decisionTime = Date.now() - consentStartTime;
    await track(decisionTime);
  };

  // Track on page unload to capture final metrics
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (consentChoices) {
        // Use navigator.sendBeacon for reliable sending during page unload
        const data = {
          timestamp: new Date().toISOString(),
          session_id: sessionId,
          user_id: localStorage.getItem('uid') || '',
          is_unload: true,
        };
        
        try {
          const apiUrl = process.env.API_URL || 'https://legacy-backend-151726525663.europe-west1.run.app';
          navigator.sendBeacon(`${apiUrl}/api/track`, JSON.stringify(data));
        } catch (error) {
          console.error('Beacon send failed:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [consentChoices, sessionId]);

  return (
    <>
      <CookieConsentBanner onConsentChange={handleConsentChange} />
    </>
  );
}
