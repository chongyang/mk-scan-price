'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (sku: string) => void;
  onError: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const extractSkuFromUrl = (url: string): string | null => {
    try {
      // Handle both URL and direct SKU formats
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

  const handleScanSuccess = useCallback((decodedText: string, decodedResult: any) => {
    const sku = extractSkuFromUrl(decodedText);
    
    if (!sku) {
      onError('Invalid QR code format');
      return;
    }

    onScan(sku);
  }, [onScan, onError]);

  const handleScanError = useCallback((errorMessage: string) => {
    console.warn(`QR Error: ${errorMessage}`);
    onError(errorMessage);
  }, [onError]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Clean up any existing scanner
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }

    const config = {
      fps: 10,
      qrbox: { width: 300, height: 300 },
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
      aspectRatio: 1.0
    };

    // Create new scanner instance
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      config,
      /* verbose= */ false
    );

    // Render the scanner
    scannerRef.current.render(handleScanSuccess, handleScanError);

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [handleScanSuccess, handleScanError]);

  return (
    <div id="reader" className="w-full max-w-[350px] aspect-square mx-auto"></div>
  );
};

export default QRScanner; 