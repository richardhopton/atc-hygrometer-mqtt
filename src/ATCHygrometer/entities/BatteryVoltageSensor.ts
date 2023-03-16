import { IDeviceData } from '@ha/IDeviceData';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { NumberSensor } from './NumberSensor';

export class BatteryVoltageSensor extends NumberSensor {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData) {
    super(mqtt, deviceData, 'Battery-Voltage Sensor', true);
  }

  discoveryState() {
    return {
      ...super.discoveryState(),
      state_class: 'measurement',
      unit_of_measurement: 'V',
      device_class: 'voltage',
    };
  }
}
