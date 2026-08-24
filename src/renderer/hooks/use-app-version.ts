import { useEffect, useState } from 'react';

export function useAppVersion(): string {
  const [version, setVersion] = useState('');

  useEffect(() => {
    let dropped = false;

    void window.ppap.app.version().then((value) => {
      if (!dropped) setVersion(value);
    });

    return () => {
      dropped = true;
    };
  }, []);

  return version;
}
