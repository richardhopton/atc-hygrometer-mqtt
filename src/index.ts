import { connectToMQTT } from '@mqtt/connectToMQTT';
import { logError, logWarn } from '@utils/logger';
import { startDaemon } from 'ATCHygrometer/startDaemon';
import { connectToESPHome } from 'ESPHome/connectToESPHome';

const processExit = (exitCode?: number) => {
  if (exitCode && exitCode > 0) {
    logError(`Exit code: ${exitCode}`);
  }
  process.exit();
};

process.on('exit', () => {
  logWarn('Shutting down atc-hygrometer-mqtt...');
  processExit(0);
});
process.on('SIGINT', () => processExit(0));
process.on('SIGTERM', () => processExit(0));
process.on('uncaughtException', (err) => {
  logError(err);
  processExit(2);
});

const start = async (): Promise<void> => {
  const mqtt = await connectToMQTT();
  const esphome = await connectToESPHome();
  startDaemon(mqtt, esphome);
};
void start();
