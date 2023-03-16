import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { NumberSensor } from './NumberSensor';

export class HumiditySensor extends NumberSensor {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData) {
    super(mqtt, deviceData, 'Humidity Sensor');
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      state_class: 'measurement',
      unit_of_measurement: '%',
      device_class: 'humidity',
    };
  }
}
