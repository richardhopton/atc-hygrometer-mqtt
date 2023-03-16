import { Connection } from '@2colors/esphome-native-api';
import { logError, logInfo } from '@utils/logger';
import { getProxy } from './ESPConfig';
import { ESPConnection } from './ESPConnection';
import { IESPConnection } from './IESPConnection';

export const connectToESPHome = async (): Promise<IESPConnection> => {
  logInfo('[ESPHome] Connecting...');

  const connection = new Connection(getProxy());

  return new Promise((resolve, reject) => {
    const errorHandler = (error: any) => {
      logError('[ESPHome] Connect:', error);
      reject(error);
    };
    connection.once('authorized', () => {
      logInfo('[ESPHome] Ready');
      connection.off('error', errorHandler);
      resolve(new ESPConnection(connection));
    });
    connection.once('error', errorHandler);
    connection.connect();
  });
};
