import { formatBytes, formatDuration } from "../utils";


export const getNodeProcessInfo = (
    args: {
        requestsPerSecond: number
    }
) => {
    const {requestsPerSecond} = args;
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    no_of_requests_per_second: requestsPerSecond,
    uptime: {
      raw: uptimeSeconds,
      formatted: formatDuration(uptimeSeconds),
    },
    memory_usage: {
      raw: memoryUsage,
      formatted: {
        rss: formatBytes(memoryUsage.rss),
        heapTotal: formatBytes(memoryUsage.heapTotal),
        heapUsed: formatBytes(memoryUsage.heapUsed),
      }
    },
    cpu_usage: {
      raw: cpuUsage,
    },
    pid: process.pid,
    version: process.version,
    platform: process.platform,
    node_env: process.env.NODE_ENV || 'development',
  };
};
