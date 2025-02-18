'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';

interface QRScannerProps {
  onScan: (sku: string) => void;
  onError: (error: string) => void;
}

const QRScanner = ({ onScan, onError }: QRScannerProps) => {
  const scannerRef = useRef<any>(null);
  const lastScannedText = useRef<string | null>(null);

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

  const onScanSuccess = useCallback((decodedText: string) => {
    // Immediately return if this is the same QR code as last time
    if (decodedText === lastScannedText.current) {
      return;
    }

    // Update the last scanned text
    lastScannedText.current = decodedText;

    // Now process the new scan
    const sku = extractSkuFromUrl(decodedText);
    if (!sku) {
      onError('Invalid QR code format');
      return;
    }

    onScan(sku);
  }, [onScan, onError]);

  const onScanError = useCallback((errorMessage: string) => {
    // Only log critical errors, ignore common scan errors
    if (!errorMessage.includes('NotFound')) {
      console.warn(`QR Error: ${errorMessage}`);
    }
  }, []);

  const cleanupScanner = useCallback(async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
      // Clean up any existing video elements
      const videoElements = document.getElementsByTagName('video');
      Array.from(videoElements).forEach(video => {
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
        video.remove();
      });
      // Clear the reader div
      const readerElement = document.getElementById('reader');
      if (readerElement) {
        readerElement.innerHTML = '';
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initScanner = async () => {
      try {
        // Dynamically import Html5QrcodeScanner
        const { Html5QrcodeScanner } = await import('html5-qrcode');
        
        if (!mounted) return;

        // Clean up existing scanner
        await cleanupScanner();

        const config = {
          fps: 5,
          qrbox: { width: 300, height: 300 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          aspectRatio: 1.0,
          formatsToSupport: ['QR_CODE'],
          videoConstraints: {
            facingMode: "environment"
          }
        };

        scannerRef.current = new Html5QrcodeScanner("reader", config, false);
        await scannerRef.current.render(onScanSuccess, onScanError);
      } catch (error) {
        console.error('Error initializing scanner:', error);
      }
    };

    // Initialize scanner
    initScanner();

    // Cleanup function
    return () => {
      mounted = false;
      cleanupScanner();
    };
  }, [onScanSuccess, onScanError, cleanupScanner]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <div id="reader" className="w-full h-[350px] max-w-[350px] overflow-hidden" />
    </div>
  );
};

// Export as a client-side only component
export default dynamic(() => Promise.resolve(QRScanner), {
  ssr: false
}); 