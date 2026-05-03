export function getAppUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  const { protocol, host } = new URL(req.url);
  return `${protocol}//${host}`;
}
