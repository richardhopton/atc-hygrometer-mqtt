import { Connection } from '@2colors/esphome-native-api';
import { logError, logInfo } from '@utils/logger';
import { discoverProxies } from './discoverProxies';
import { getProxies, ProxyConfig } from './ESPConfig';
import { ESPConnection } from './ESPConnection';
import { IESPConnection } from './IESPConnection';

export const connect = (connection: Connection) => {
  return new Promise<Connection>((resolve, reject) => {
    const errorHandler = (error: any) => {
      logError('[ESPHome] Connecting:', error);
      reject(error);
    };
    connection.once('authorized', () => {
      logInfo('[ESPHome] Connected:', connection.host);
      connection.off('error', errorHandler);
      resolve(connection);
    });
    connection.once('error', errorHandler);
    connection.connect();
  });
};

export const connectToESPHome = async (): Promise<IESPConnection> => {
  logInfo('[ESPHome] Connecting...');

  const proxies = getProxies();
  const useDiscovery = proxies.length === 1 && proxies[0].host === '<discover>';
  const connections = useDiscovery
    ? await discoverProxies(proxies[0].password || '')
    : await Promise.all(
        proxies.map(async (config: ProxyConfig) => {
          const connection = new Connection(config);
          return await connect(connection);
        })
      );
  return new ESPConnection(connections);
};
