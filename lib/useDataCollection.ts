'use client';

import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export interface ConsentChoices {
  strictly_necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export interface CollectedData {
  timestamp: string;
  page_url: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  user_agent: string;
  browser_name: string;
  browser_version: string;
  os_name: string;
  os_version: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  screen_resolution: string;
  viewport_size: string;
  color_depth: string;
  timezone: string;
  language: string;
  languages: string[];
  cookies: Record<string, string>;
  localStorage_keys: string[];
  sessionStorage_keys: string[];
  connection_type?: string;
  battery_level?: number;
  battery_charging?: boolean;
  canvas_fingerprint?: string;
  webgl_fingerprint?: string;
  fonts_detected: string[];
  plugins: string[];
  do_not_track: boolean;
  session_id: string;
  user_id: string;
  is_returning_user: boolean;
  time_on_page: number;
  scroll_depth_percent: number;
  click_count: number;
  form_interactions: string[];
  consent_decision_time_ms?: number;
  consent_choices: ConsentChoices;
}

export function useDataCollection(consentChoices: ConsentChoices | null) {
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let sid = sessionStorage.getItem('session_id');
      if (!sid) {
        sid = uuidv4();
        sessionStorage.setItem('session_id', sid);
      }
      return sid;
    }
    return uuidv4();
  });

  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let uid = localStorage.getItem('uid');
      if (!uid) {
        uid = uuidv4();
        localStorage.setItem('uid', uid);
      }
      return uid;
    }
    return uuidv4();
  });

  // Use a ref to always have the latest consent choices
  const consentChoicesRef = useRef(consentChoices);
  
  // Update the ref whenever consent choices change
  useEffect(() => {
    consentChoicesRef.current = consentChoices;
  }, [consentChoices]);

  const startTimeRef = useRef(Date.now());
  const clickCountRef = useRef(0);
  const formInteractionsRef = useRef<Set<string>>(new Set());
  const maxScrollDepthRef = useRef(0);
  const consentDecisionTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Track clicks
    const handleClick = () => {
      clickCountRef.current++;
    };

    // Track scroll depth
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;
      if (depth > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = depth;
      }
    };

    // Track form interactions
    const handleFormInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const fieldName = (target as HTMLInputElement).name || (target as HTMLInputElement).id || target.tagName;
        formInteractionsRef.current.add(fieldName);
      }
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('focusin', handleFormInteraction);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('focusin', handleFormInteraction);
    };
  }, []);

  const getUTMParams = () => {
    if (typeof window === 'undefined') return { source: '', medium: '', campaign: '' };
    
    const urlParams = new URLSearchParams(window.location.search);
    return {
      source: urlParams.get('utm_source') || '',
      medium: urlParams.get('utm_medium') || '',
      campaign: urlParams.get('utm_campaign') || '',
    };
  };

  const getBrowserInfo = () => {
    if (typeof window === 'undefined') return { name: '', version: '' };
    
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || '';
    } else if (userAgent.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || '';
    } else if (userAgent.indexOf('Safari') > -1) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || '';
    } else if (userAgent.indexOf('Edge') > -1) {
      browserName = 'Edge';
      browserVersion = userAgent.match(/Edge\/(\d+)/)?.[1] || '';
    }

    return { name: browserName, version: browserVersion };
  };

  const getOSInfo = () => {
    if (typeof window === 'undefined') return { name: '', version: '' };
    
    const userAgent = navigator.userAgent;
    let osName = 'Unknown';
    let osVersion = 'Unknown';

    if (userAgent.indexOf('Win') > -1) {
      osName = 'Windows';
      const match = userAgent.match(/Windows NT (\d+\.\d+)/);
      osVersion = match ? match[1] : '';
    } else if (userAgent.indexOf('Mac') > -1) {
      osName = 'MacOS';
      const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
      osVersion = match ? match[1].replace('_', '.') : '';
    } else if (userAgent.indexOf('Linux') > -1) {
      osName = 'Linux';
    } else if (userAgent.indexOf('Android') > -1) {
      osName = 'Android';
      const match = userAgent.match(/Android (\d+\.\d+)/);
      osVersion = match ? match[1] : '';
    } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
      osName = 'iOS';
      const match = userAgent.match(/OS (\d+[._]\d+)/);
      osVersion = match ? match[1].replace('_', '.') : '';
    }

    return { name: osName, version: osVersion };
  };

  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    if (typeof window === 'undefined') return 'desktop';
    
    const userAgent = navigator.userAgent;
    const width = window.innerWidth;

    if (/tablet|ipad|playbook|silk/i.test(userAgent) || (width >= 768 && width < 1024)) {
      return 'tablet';
    }
    if (/mobile|android|iphone|ipod/i.test(userAgent) || width < 768) {
      return 'mobile';
    }
    return 'desktop';
  };

  const getCookies = (): Record<string, string> => {
    if (typeof document === 'undefined') return {};
    
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  };

  const getLocalStorageKeys = (): string[] => {
    if (typeof window === 'undefined') return [];
    return Object.keys(localStorage);
  };

  const getSessionStorageKeys = (): string[] => {
    if (typeof window === 'undefined') return [];
    return Object.keys(sessionStorage);
  };

  const getConnectionInfo = async () => {
    if (typeof navigator === 'undefined' || !(navigator as any).connection) {
      return undefined;
    }
    
    const connection = (navigator as any).connection;
    return connection.effectiveType || connection.type || undefined;
  };

  const getBatteryInfo = async () => {
    if (typeof navigator === 'undefined' || !(navigator as any).getBattery) {
      return undefined;
    }
    
    try {
      const battery = await (navigator as any).getBattery();
      return {
        level: battery.level * 100,
        charging: battery.charging,
      };
    } catch {
      return undefined;
    }
  };

  const getCanvasFingerprint = (): string => {
    if (typeof document === 'undefined') return '';
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';
      
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(100, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Browser Fingerprint 🔒', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Security Test', 4, 35);
      
      return canvas.toDataURL().slice(-50);
    } catch {
      return '';
    }
  };

  const getWebGLFingerprint = (): string => {
    if (typeof window === 'undefined') return '';
    
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return '';
      
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return '';
      
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      
      return `${vendor}-${renderer}`.slice(0, 50);
    } catch {
      return '';
    }
  };

  const getFontsDetected = (): string[] => {
    if (typeof window === 'undefined') return [];
    
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testFonts = [
      'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
      'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Helvetica',
      'Palatino', 'Garamond', 'Bookman', 'Avant Garde', 'Candara',
      'Calibri', 'Cambria', 'Consolas', 'Monaco', 'Lucida Console'
    ];
    
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    const h = document.getElementsByTagName('body')[0];
    const span = document.createElement('span');
    span.style.fontSize = testSize;
    span.innerHTML = testString;
    h.appendChild(span);
    
    const baseFontWidths = baseFonts.map(font => {
      span.style.fontFamily = font;
      return span.offsetWidth;
    });
    
    const detectedFonts: string[] = [];
    
    testFonts.forEach(font => {
      let detected = false;
      for (let i = 0; i < baseFonts.length; i++) {
        span.style.fontFamily = `'${font}', ${baseFonts[i]}`;
        if (span.offsetWidth !== baseFontWidths[i]) {
          detected = true;
          break;
        }
      }
      if (detected) {
        detectedFonts.push(font);
      }
    });
    
    h.removeChild(span);
    return detectedFonts;
  };

  const getPlugins = (): string[] => {
    if (typeof navigator === 'undefined') return [];
    
    const plugins: string[] = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
      plugins.push(navigator.plugins[i].name);
    }
    return plugins;
  };

  const getFingerprint = async (): Promise<string> => {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      return result.visitorId;
    } catch {
      return '';
    }
  };

  const collectData = async (consentDecisionTime?: number) => {
    if (typeof window === 'undefined') return null;

    const utm = getUTMParams();
    const browser = getBrowserInfo();
    const os = getOSInfo();
    const deviceType = getDeviceType();
    const connection = await getConnectionInfo();
    const battery = await getBatteryInfo();
    const fingerprint = await getFingerprint();
    
    // Use the ref to always get the latest consent choices
    const currentConsentChoices = consentChoicesRef.current || {
      strictly_necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };

    const data: CollectedData = {
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      referrer: document.referrer || '',
      utm_source: utm.source,
      utm_medium: utm.medium,
      utm_campaign: utm.campaign,
      user_agent: navigator.userAgent,
      browser_name: browser.name,
      browser_version: browser.version,
      os_name: os.name,
      os_version: os.version,
      device_type: deviceType,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      color_depth: `${window.screen.colorDepth}-bit`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      languages: Array.from(navigator.languages),
      cookies: getCookies(),
      localStorage_keys: getLocalStorageKeys(),
      sessionStorage_keys: getSessionStorageKeys(),
      connection_type: connection,
      battery_level: battery?.level,
      battery_charging: battery?.charging,
      canvas_fingerprint: getCanvasFingerprint(),
      webgl_fingerprint: getWebGLFingerprint(),
      fonts_detected: getFontsDetected(),
      plugins: getPlugins(),
      do_not_track: navigator.doNotTrack === '1',
      session_id: sessionId,
      user_id: userId,
      is_returning_user: localStorage.getItem('uid') !== null,
      time_on_page: Date.now() - startTimeRef.current,
      scroll_depth_percent: maxScrollDepthRef.current,
      click_count: clickCountRef.current,
      form_interactions: Array.from(formInteractionsRef.current),
      consent_decision_time_ms: consentDecisionTime,
      consent_choices: currentConsentChoices,
    };

    return data;
  };

  const sendData = async (data: CollectedData) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Failed to send tracking data');
      }
    } catch (error) {
      console.error('Error sending tracking data:', error);
    }
  };

  const track = async (consentDecisionTime?: number) => {
    const data = await collectData(consentDecisionTime);
    if (data) {
      await sendData(data);
    }
  };

  return {
    track,
    sessionId,
    userId,
  };
}
