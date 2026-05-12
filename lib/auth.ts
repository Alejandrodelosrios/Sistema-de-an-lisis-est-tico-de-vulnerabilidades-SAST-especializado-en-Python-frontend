const ACCESS_TOKEN_KEY = "sast_access_token";
const REFRESH_TOKEN_KEY = "sast_refresh_token";
const COOKIE_NAME = "auth_token";

// ─── GUARDAR ─────────────────────────────────────────────────
export function saveTokens(accessToken: string, refreshToken: string): void {
   // Access token en cookie para que proxy.ts lo lea
   // max-age=900 → 15 minutos (igual que tu backend)
   document.cookie = `${COOKIE_NAME}=${accessToken}; path=/; max-age=900; SameSite=Strict`;
   // Refresh token en localStorage
   localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

// ─── LEER ────────────────────────────────────────────────────
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  return match ? match.split("=")[1] : null;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// ─── VERIFICAR ───────────────────────────────────────────────
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ─── BORRAR ──────────────────────────────────────────────────
export function clearTokens(): void {
  // Borra la cookie
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  // Borra el refresh token
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ─── DECODIFICAR TOKEN ────────────────────────────────────────
// Lee el payload del JWT sin verificar firma (eso lo hace el backend)
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// ─── VERIFICAR SI EL TOKEN EXPIRÓ ────────────────────────────
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  const expTimestamp = decoded.exp as number;
  return Date.now() >= expTimestamp * 1000;
}