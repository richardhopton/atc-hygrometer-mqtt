import { IDeviceData } from '@ha/IDeviceData';
import { Sensor } from '@ha/Sensor';
import { IMQTTConnection } from '@mqtt/IMQTTConnection';
import { safeId } from '@utils/safeId';

export class NumberSensor extends Sensor<number> {
  constructor(mqtt: IMQTTConnection, deviceData: IDeviceData, entityDesc: string, private isDiagnostic = false) {
    super(mqtt, deviceData, entityDesc);
  }
  discoveryState() {
    return {
      ...super.discoveryState(),
      object_id: `${safeId(this.deviceData.device.sa || this.deviceData.device.name)}_${this.entityTag}`,
      ...(this.isDiagnostic ? { entity_category: 'diagnostic' } : {}),
    };
  }
}
