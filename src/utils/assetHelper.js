export const getAssetUrl = (path) => {
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
  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${baseUrl}${finalPath}`;
};
