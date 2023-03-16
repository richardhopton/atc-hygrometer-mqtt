export type BluetoothLEAdvertisement = {
  mac: string;
  name: string;
  rssi: number;
  serviceDataList: {
    uuid: string;
    legacyDataList: Uint8Array;
    data: string;
  }[];
  addressType: number;
};

export interface IESPConnection {
  subscribeToBLEAdvertisements(): void;
  on(event: 'BluetoothLEAdvertisement', listener: (advertisement: BluetoothLEAdvertisement) => void): this;
}
