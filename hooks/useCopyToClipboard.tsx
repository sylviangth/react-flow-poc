import { useState } from 'react';

export default function useCopyToClipboard (): { isSuccessful: boolean, copyToClipboard: (value: string) => void } {
  const [isSuccessful, setIsSuccessful] = useState(false);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setIsSuccessful(true);
        setTimeout(() => {
          setIsSuccessful(false);
        }, 2000); 
      })
      .catch(() => {
        setIsSuccessful(false);
      });
  };

  return {
    isSuccessful, 
    copyToClipboard
  };
};