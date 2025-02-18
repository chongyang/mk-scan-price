'use client';

import React, { useState, useCallback } from 'react';
import QRScanner from '@/components/QRScanner';
import ResultDisplay from '@/components/ResultDisplay';

interface ScanResult {
  name_shop: string;
  out_price: number;
  quantity: number;
  sku: string;
}

interface CachedResult extends ScanResult {
  timestamp: number;
}

export default function Home() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cachedResults, setCachedResults] = useState<Record<string, CachedResult>>({});

  const extractSkuFromUrl = (url: string): string | null => {
    try {
      if (url.includes('mkhb.my/')) {
        const urlParts = url.split('mkhb.my/');
        return urlParts[1]?.trim() || null;
      }
      return url.trim();
    } catch (err) {
      console.error('Error extracting SKU:', err);
      return null;
    }
  };

  const handleScan = useCallback(async (scannedText: string) => {
    const sku = extractSkuFromUrl(scannedText);
    if (!sku) {
      setError('Invalid QR code format');
      return;
    }

    // Check if we have a cached result that's less than 5 minutes old
    const cachedResult = cachedResults[sku];
    const now = Date.now();
    if (cachedResult && now - cachedResult.timestamp < 5 * 60 * 1000) {
      setScanResult({
        name_shop: cachedResult.name_shop,
        out_price: cachedResult.out_price,
        quantity: cachedResult.quantity,
        sku: cachedResult.sku
      });
      setError(null);
      return;
    }

    try {
      const response = await fetch(`/api/check-price?sku=${encodeURIComponent(sku)}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      
      // Convert out_price from string to float
      const result = {
        ...data,
        out_price: parseFloat(data.out_price),
        sku
      };

      // Cache the result
      setCachedResults(prev => ({
        ...prev,
        [sku]: {
          ...result,
          timestamp: now
        }
      }));
      
      setScanResult(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setScanResult(null);
    }
  }, [cachedResults]);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setScanResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="max-w-screen-sm mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-center">MK Price Checker</h1>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto pt-16">
        <div className="p-4">
          <QRScanner onScan={handleScan} onError={handleError} />
        </div>

        <ResultDisplay result={scanResult} error={error} />
      </div>
    </div>
  );
} 