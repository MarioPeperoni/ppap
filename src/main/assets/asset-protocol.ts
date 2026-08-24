import { protocol } from 'electron';
import { ASSET_SCHEME } from '@/constants/image.constants';
import { sniffImageMime } from '@/core/image/image-mime';
import { assetStore } from '@/main/assets/asset.store';
import type { Bytes } from '@/types';
import { parseAssetId } from '@/validation/asset.validator';
import { parseBoardId } from '@/validation/board-id.validator';

function findAsset(url: string): Bytes | null {
  try {
    const { hostname, pathname } = new URL(url);

    return assetStore.get(parseBoardId(hostname), parseAssetId(pathname.slice(1))) ?? null;
  } catch {
    return null;
  }
}

export function registerAssetScheme(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: ASSET_SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
        stream: true,
      },
    },
  ]);
}

export function serveAssets(): void {
  protocol.handle(ASSET_SCHEME, (request) => {
    const bytes = findAsset(request.url);
    if (bytes === null) return new Response(null, { status: 404 });

    return new Response(bytes, {
      headers: {
        'Content-Type': sniffImageMime(bytes) ?? 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      },
    });
  });
}
