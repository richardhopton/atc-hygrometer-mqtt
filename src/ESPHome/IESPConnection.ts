export type BLEAdvertisement = {
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

export type BLEAdvertisementListener = (advertisement: BLEAdvertisement) => void;

export interface IESPConnection {
  reconnect(): Promise<void>;
  subscribeToBLEAdvertisements(listener: BLEAdvertisementListener): void;
}
