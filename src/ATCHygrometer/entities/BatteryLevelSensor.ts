import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { NumberSensor } from './NumberSensor';

export class BatteryLevelSensor extends NumberSensor {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData) {
    super(mqtt, deviceData, 'Battery-Level Sensor', true);
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      state_class: 'measurement',
      unit_of_measurement: '%',
      device_class: 'battery',
    };
  }
}
