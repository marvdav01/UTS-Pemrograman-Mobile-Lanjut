// src/utils/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Custom hook untuk menunda pembaruan nilai input (debounce)
 * Mencegah pemanggilan REST API secara berlebihan pada setiap ketikan karakter.
 *
 * @param {any} value Nilai yang ingin di-debounce
 * @param {number} delay Waktu tunda dalam milidetik (default: 450ms)
 * @returns {any} Nilai yang sudah di-debounce
 */
export const useDebounce = (value, delay = 450) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

