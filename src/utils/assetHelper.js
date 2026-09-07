export const CLOUDFLARE_CDN = 'https://noor-store.yulgun353.workers.dev';

export const getAssetUrl = (path, forceCloudflare = false) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  let finalPath = path.startsWith('/') ? path.slice(1) : path;
  if (!finalPath.includes('/') && !finalPath.includes('.')) {
    finalPath = `images/${finalPath}.jpg`;
  } else if (finalPath.startsWith('images/') && !finalPath.includes('.')) {
    finalPath = `${finalPath}.jpg`;
  }

  if (forceCloudflare) {
    return `${CLOUDFLARE_CDN}/${finalPath}`;
  }

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${baseUrl}${finalPath}`;
};

export const getCloudflareAssetUrl = (path) => getAssetUrl(path, true);

