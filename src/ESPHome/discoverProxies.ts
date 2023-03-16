import { Connection } from '@2colors/esphome-native-api';
import { logInfo } from '@utils/logger';
import { seconds } from '@utils/seconds';
import Bonjour from 'bonjour';

export const discoverProxies = async (password: string) => {
  logInfo('[ESPHome] Discovering...');
  return new Promise<Connection[]>((resolve) => {
    const proxies: Connection[] = [];

    const checkForBluetoothProxy = ({ host, port }: { host: string; port: number }) => {
      const connection = new Connection({ host, port, password }) as any;
      connection.on('message.DeviceInfoResponse', ({ bluetoothProxyVersion }: { bluetoothProxyVersion: number }) => {
        if (bluetoothProxyVersion > 0) {
          logInfo('[ESPHome] Discovered:', host);
          proxies.push(connection);
        } else {
          connection.disconnect();
        }
      });
      connection.on('authorized', () => connection.deviceInfoService());
      connection.connect();
    };

    const bonjour = Bonjour();
    const browser = bonjour.find({ type: 'esphomelib' });
    browser.on('up', checkForBluetoothProxy);
    let discoveryTimes = 0;
    const interval = setInterval(() => {
      browser.stop();
      if (discoveryTimes > 4 && proxies.length) {
        clearInterval(interval);
        logInfo(`[ESPHome] Discovered ${proxies.length} proxies after 60 seconds`);
        bonjour.destroy();
        resolve(proxies);
        return;
      }
      discoveryTimes++;
      logInfo('[ESPHome] Still discovering...', `${discoveryTimes * 10} seconds...`);
      browser.start();
    }, seconds(10));
  });
};
