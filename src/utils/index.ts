
export const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
      h ? `${h}h` : '',
      m ? `${m}m` : '',
      `${s}s`
    ].filter(Boolean).join(' ');
};
  
export const formatBytes = (bytes: number): string => {
    const gb = bytes / (1024 ** 3);
    const mb = bytes / (1024 ** 2);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    return `${mb.toFixed(2)} MB`;
};
  
export const formatNetworkSpeed = (bps: number): string => {
    const mbps = bps / (1024 * 1024);
    return `${mbps.toFixed(2)} MB/s`;
};

export default {

}