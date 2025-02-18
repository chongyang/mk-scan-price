declare module 'html5-qrcode' {
  export class Html5QrcodeScanner {
    constructor(
      elementId: string,
      config: {
        qrbox?: {
          width: number;
          height: number;
        };
        fps?: number;
      },
      verbose: boolean
    );
    render(
      onScanSuccess: (decodedText: string, decodedResult?: any) => void,
      onScanError?: (error: string) => void
    ): void;
    clear(): Promise<void>;
    pause(): void;
    resume(): void;
  }
} 