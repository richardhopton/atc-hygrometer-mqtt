import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { bytesToNumber } from '@utils/bytesToNumber';
import { Dictionary } from '@utils/Dictionary';
import { logInfo } from '@utils/logger';
import { minutes } from '@utils/minutes';
import { BLEAdvertisement, IESPConnection } from 'ESPHome/IESPConnection';
import { buildMQTTDeviceData } from './buildMQTTDeviceData';
import { BatteryLevelSensor } from './entities/BatteryLevelSensor';
import { BatteryVoltageSensor } from './entities/BatteryVoltageSensor';
import { HumiditySensor } from './entities/HumiditySensor';
import { TemperatureSensor } from './entities/TemperatureSensor';
import { getHygrometers, Hygrometer } from './options';

const parseData = (data: Uint8Array) => {
  const temperature = bytesToNumber(data.slice(6, 8)) / 10;
  const humidity = data[8];
  const batteryLevel = data[9];
  const batteryVoltage = bytesToNumber(data.slice(10, 12)) / 1000;
  return { temperature, humidity, batteryLevel, batteryVoltage };
};

type HygrometerDevice = Hygrometer & {
  lastMessageId: number;
  temperatureSensor: TemperatureSensor;
  humiditySensor: HumiditySensor;
  batteryLevelSensor: BatteryLevelSensor;
  batteryVoltageSensor: BatteryVoltageSensor;
};

export const startDaemon = (mqtt: IMQTTConnection, esphome: IESPConnection) => {
  const hygrometerMap: Dictionary<HygrometerDevice> = {};
  for (const { mac, name } of getHygrometers()) {
    logInfo(`[Hygrometer] Registering device ${mac} (${name})`);

    const deviceData = buildMQTTDeviceData({ mac, name });
    hygrometerMap[mac] = {
      mac,
      name,
      lastMessageId: 0,
      temperatureSensor: new TemperatureSensor(mqtt, deviceData),
      humiditySensor: new HumiditySensor(mqtt, deviceData),
      batteryLevelSensor: new BatteryLevelSensor(mqtt, deviceData),
      batteryVoltageSensor: new BatteryVoltageSensor(mqtt, deviceData),
    };
  }
  const listener = ({ mac, serviceDataList }: BLEAdvertisement): void => {
    const hygrometer = hygrometerMap[mac];
    if (!hygrometer) return;

    const { legacyDataList } = serviceDataList.find((sd) => sd.uuid === '0x181A') || {};
    if (legacyDataList?.length !== 13) return;

    const messageId = legacyDataList[12];
    if (messageId === hygrometer.lastMessageId) return;

    const { name, temperatureSensor, humiditySensor, batteryLevelSensor, batteryVoltageSensor } = hygrometer;
    const { temperature, humidity, batteryLevel, batteryVoltage } = parseData(legacyDataList);
    logInfo(`[Hygrometer] Updating state for ${mac} (${name})`);
    temperatureSensor.setState(temperature);
    humiditySensor.setState(humidity);
    batteryLevelSensor.setState(batteryLevel);
    batteryVoltageSensor.setState(batteryVoltage);

    hygrometer.lastMessageId = messageId;
  };
  esphome.subscribeToBLEAdvertisements(listener);

  setInterval(async () => {
    await esphome.reconnect();
    esphome.subscribeToBLEAdvertisements(listener);
  }, minutes(60));
};
