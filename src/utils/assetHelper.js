export const CLOUDFLARE_CDN = 'https://noor-store.yulgun353.workers.dev';
export const ASSET_VERSION = 'v1.0.0';

export const getAssetUrl = (path, forceCloudflare = false) => {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (path.endsWith('.apk')) return path;
    if (path.includes('noor-store.yulgun353.workers.dev') && !path.includes('?')) {
      return `${path}?v=${ASSET_VERSION}`;
    }
    return path;
  }
  let finalPath = path.startsWith('/') ? path.slice(1) : path;
  if (!finalPath.includes('/') && !finalPath.includes('.')) {
    finalPath = `images/${finalPath}.jpg`;
  } else if (finalPath.startsWith('images/') && !finalPath.includes('.')) {
    finalPath = `${finalPath}.jpg`;
  }

  // Ensure clean APK URL for Android installer compatibility
  if (finalPath.endsWith('.apk')) {
    return 'https://github.com/Shafaq-Teach/NoorStore_apk/releases/download/v1.0.0/app-debug.apk';
  }

  const separator = finalPath.includes('?') ? '&' : '?';
  const versionedPath = `${finalPath}${separator}v=${ASSET_VERSION}`;

  if (forceCloudflare) {
    return `${CLOUDFLARE_CDN}/${versionedPath}`;
  }

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${baseUrl}${versionedPath}`;
};

export const getCloudflareAssetUrl = (path) => getAssetUrl(path, true);



