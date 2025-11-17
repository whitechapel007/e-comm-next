declare global {
  interface Window {
    PaystackPop: new () => {
      resumeTransaction(accessCode: string): void;
      newTransaction?: (config: any) => void;
    };
  }
}

export {};
