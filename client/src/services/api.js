import { SAMPLE_PROGRAMS, INITIAL_SUBMISSIONS } from '../data/samplePrograms';
import { extractProfileFromText, rankProgramsForBeneficiary } from '../utils/aiMatcher';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Robust API Client with automatic graceful local fallback
 */
export async function getPrograms() {
  try {
    const res = await fetch(`${API_BASE}/programs`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    // server unreachable, use local data
  }
  return SAMPLE_PROGRAMS;
}

export async function matchBeneficiaryNeeds(prompt, programs) {
  try {
    const res = await fetch(`${API_BASE}/extract-and-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // fallback to client-side engine
  }

  const profile = extractProfileFromText(prompt);
  const ranked = rankProgramsForBeneficiary(profile, programs || SAMPLE_PROGRAMS);
  return {
    extractedProfile: profile,
    rankedResults: ranked,
    topRecommendation: ranked[0] || null
  };
}

export async function getApplications(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/applications?${query}`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    // fallback to local storage
  }

  const saved = localStorage.getItem('sahayak_applications');
  if (saved) {
    try {
      let list = JSON.parse(saved);
      if (params.status && params.status !== 'All') {
        list = list.filter(a => a.status === params.status);
      }
      return list;
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_SUBMISSIONS;
}

export async function submitApplication(appData) {
  try {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // server fallback
  }

  // Save to local storage
  const saved = localStorage.getItem('sahayak_applications');
  const list = saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  const updated = [appData, ...list];
  localStorage.setItem('sahayak_applications', JSON.stringify(updated));
  return appData;
}

export async function updateAppStatus(id, status, staffNotes = '') {
  try {
    const res = await fetch(`${API_BASE}/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, staffNotes }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // local fallback
  }

  const saved = localStorage.getItem('sahayak_applications');
  const list = saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  const updated = list.map(a => a.id === id ? { ...a, status, staffNotes } : a);
  localStorage.setItem('sahayak_applications', JSON.stringify(updated));
  return { id, status, staffNotes };
}

export async function createProgram(programData) {
  try {
    const res = await fetch(`${API_BASE}/programs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(programData),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // local fallback
  }
  return programData;
}
