/* ─── toNum ───
   Converts whatever you pass in into a real Number.
   – Strips % and commas.
   – Treats '', null, undefined, or the word “Missing” as 0 (or custom fallback).
------------------------------------------------------------------ */
export const toNum = (value, fallback = 0) => {
    if (value === '' || value === null || value === undefined || value === 'Missing') {
      return fallback;
    }
    const n = parseFloat(String(value).replace('%', '').replace(/,/g, ''));
    return Number.isFinite(n) ? n : fallback;
  };
  