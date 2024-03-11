export function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K";
  }
  return num;
}

export function formatSize(num) {
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(0) + "TB";
  }
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(0) + "GB";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + "MB";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "KB";
  }
  return num;
}
