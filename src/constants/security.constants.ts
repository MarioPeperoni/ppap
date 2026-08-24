const SHARED_DIRECTIVES = [
  "default-src 'self'",
  "img-src 'self' file: data: blob: ppap-asset:",
  "font-src 'self' file: data:",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'",
];

export const PRODUCTION_CSP = [
  ...SHARED_DIRECTIVES,
  "script-src 'self' file:",
  "style-src 'self' file: 'unsafe-inline'",
  "connect-src 'self' file: ppap-asset:",
].join('; ');

export function buildDevelopmentCsp(devServerUrl: string): string {
  const socket = devServerUrl.replace(/^http/, 'ws');

  return [
    ...SHARED_DIRECTIVES,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${devServerUrl}`,
    "style-src 'self' 'unsafe-inline'",
    `connect-src 'self' ppap-asset: ${devServerUrl} ${socket}`,
  ].join('; ');
}
