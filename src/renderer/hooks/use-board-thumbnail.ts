import { useEffect, useState } from 'react';
import { PNG_MIME } from '@/constants/export.constants';

export function useBoardThumbnail(id: string, revision: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let dropped = false;

    void window.ppap.library.thumbnail(id).then((bytes) => {
      if (bytes === null || dropped) return;

      objectUrl = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: PNG_MIME }));
      setUrl(objectUrl);
    });

    return () => {
      dropped = true;
      setUrl(null);
      if (objectUrl !== null) URL.revokeObjectURL(objectUrl);
    };
  }, [id, revision]);

  return url;
}
