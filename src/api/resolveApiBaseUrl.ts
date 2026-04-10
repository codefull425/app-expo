import Constants from 'expo-constants';
import { getExpoGoProjectConfig } from 'expo';
import { Platform } from 'react-native';

export const JSON_SERVER_DEFAULT_BASE_URL = 'http://localhost:3000';
export const JSON_SERVER_DEFAULT_CATALOG_PATH = '/categories';

const JSON_SERVER_PORT = 3000;

const ANDROID_EMULATOR_LOOPBACK_TO_HOST = '10.0.2.2';

function isLocalLoopbackHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '[::1]';
}

function rewriteAndroidEmulatorLoopbackBaseUrl(baseUrl: string): string {
  if (Platform.OS !== 'android') {
    return baseUrl;
  }
  try {
    const withProto = /^https?:\/\//i.test(baseUrl) ? baseUrl : `http://${baseUrl}`;
    const u = new URL(withProto);
    if (!isLocalLoopbackHost(u.hostname)) {
      return baseUrl;
    }
    const port = u.port ? `:${u.port}` : '';
    return `${u.protocol}//${ANDROID_EMULATOR_LOOPBACK_TO_HOST}${port}`;
  } catch {
    return baseUrl;
  }
}

export function normalizeApiBaseUrlToOrigin(input: string): string {
  const trimmed = input.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return trimmed;
  }
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
  try {
    const u = new URL(withProtocol);
    const port = u.port ? `:${u.port}` : '';
    return `${u.protocol}//${u.hostname}${port}`;
  } catch {
    return trimmed;
  }
}

export function normalizeCatalogPath(input: string | undefined): string {
  const fallback = JSON_SERVER_DEFAULT_CATALOG_PATH;
  let path: string;
  if (input == null || input.trim() === '') {
    path = fallback;
  } else {
    const t = input.trim();
    if (t.includes('://')) {
      try {
        const p = new URL(t).pathname;
        path = p && p !== '/' ? p : fallback;
      } catch {
        path = t.startsWith('/') ? t : `/${t}`;
      }
    } else {
      path = t.startsWith('/') ? t : `/${t}`;
    }
  }
  if (path === '/items' || path.startsWith('/items?') || path.startsWith('/items/')) {
    path = '/categories' + path.slice('/items'.length);
  }
  return path;
}

function isLikelyTunnelOrCloudHost(host: string): boolean {
  const h = host.toLowerCase();
  return (
    h.includes('exp.direct') ||
    h.includes('.expo.dev') ||
    h.endsWith('.exp.host') ||
    h.includes('ngrok') ||
    h.includes('tunnel.')
  );
}

function looksUsableDevHost(host: string): boolean {
  if (!host || host.length === 0) {
    return false;
  }
  if (host.includes('/')) {
    return false;
  }
  if (host.endsWith('.local')) {
    return true;
  }
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    return true;
  }
  if (isLikelyTunnelOrCloudHost(host)) {
    return false;
  }
  return /^[a-zA-Z0-9.-]+$/.test(host);
}

export function getDevMachineHost(): string | null {
  const go = getExpoGoProjectConfig();
  const dbg = go?.debuggerHost;
  if (dbg) {
    const host = dbg.split(':')[0]?.trim();
    if (host && looksUsableDevHost(host)) {
      if (Platform.OS === 'android' && isLocalLoopbackHost(host)) {
        return ANDROID_EMULATOR_LOOPBACK_TO_HOST;
      }
      return host;
    }
  }
  const uri = Constants.expoConfig?.hostUri;
  if (uri) {
    const host = uri.split(':')[0]?.trim();
    if (host && looksUsableDevHost(host)) {
      if (Platform.OS === 'android' && isLocalLoopbackHost(host)) {
        return ANDROID_EMULATOR_LOOPBACK_TO_HOST;
      }
      return host;
    }
  }
  return null;
}

export function resolveApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv != null && fromEnv.trim() !== '') {
    return rewriteAndroidEmulatorLoopbackBaseUrl(normalizeApiBaseUrlToOrigin(fromEnv));
  }

  if (Platform.OS === 'web') {
    return JSON_SERVER_DEFAULT_BASE_URL.replace(/\/$/, '');
  }

  if (__DEV__) {
    const host = getDevMachineHost();
    if (host) {
      return `http://${host}:${JSON_SERVER_PORT}`;
    }
    if (Platform.OS === 'android') {
      return `http://${ANDROID_EMULATOR_LOOPBACK_TO_HOST}:${JSON_SERVER_PORT}`;
    }
  }

  return rewriteAndroidEmulatorLoopbackBaseUrl(JSON_SERVER_DEFAULT_BASE_URL.replace(/\/$/, ''));
}
