import si from 'systeminformation';
import { formatBytes, formatNetworkSpeed } from '../utils';

export const getHostInfo = async () => {
  const mem = await si.mem();
  const fsSize = await si.fsSize();
  const networkStats = await si.networkStats();

  let memory_available= mem.available
  let storage_available= fsSize.reduce((acc, d) => acc + d.available, 0)
  let network_speed= networkStats[0]?.tx_sec + networkStats[0]?.rx_sec || 0
  return {
    raw: {
      memory_available,
      storage_available,
      network_speed,
    },
    formatted: {
      memory_available: formatBytes(memory_available),
      storage_available: formatBytes(storage_available),
      network_speed: formatNetworkSpeed(network_speed),
    }
  };
};
