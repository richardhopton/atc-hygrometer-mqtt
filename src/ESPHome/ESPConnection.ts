import { BluetoothLEAdvertisementResponse, Connection } from '@2colors/esphome-native-api';
import { logInfo } from '@utils/logger';
import { connect } from './connect';
import { BLEAdvertisement, BLEAdvertisementListener, IESPConnection } from './IESPConnection';

export class ESPConnection implements IESPConnection {
  private subscribedToBLEAdvertisements = false;
  private bleAdvertisementListener: BLEAdvertisementListener | null = null;
  constructor(private connections: Connection[]) {
    this.bluetoothLEAdvertisementListener = this.bluetoothLEAdvertisementListener.bind(this);
  }

  async reconnect(): Promise<void> {
    logInfo('[ESPHome] Reconnecting...');
    this.connections = await Promise.all(
      this.connections.map((connection) => {
        connection.disconnect();
        connection.connected = false;
        return connect(new Connection({ host: connection.host, port: connection.port, password: connection.password }));
      })
    );
    this.subscribedToBLEAdvertisements = false;
  }

  private bluetoothLEAdvertisementListener({ address, name, ...message }: BluetoothLEAdvertisementResponse) {
    if (!this.bleAdvertisementListener) return;

    const mac = address.toString(16);
    if (!!name) name = Buffer.from(name, 'base64').toString('ascii');
    const advertisement: BLEAdvertisement = { mac, name, ...message };
    this.bleAdvertisementListener(advertisement);
  }

  subscribeToBLEAdvertisements(listener: BLEAdvertisementListener) {
    if (this.subscribedToBLEAdvertisements) return;
    this.subscribedToBLEAdvertisements = true;
    this.bleAdvertisementListener = listener;
    for (const connection of this.connections) {
      connection
        .on('message.BluetoothLEAdvertisementResponse', this.bluetoothLEAdvertisementListener)
        .subscribeBluetoothAdvertisementService();
    }
  }
}
