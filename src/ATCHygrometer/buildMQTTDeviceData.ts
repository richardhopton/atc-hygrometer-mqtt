import { IDeviceData } from '@ha/IDeviceData';
import { Hygrometer } from './options';

export const buildMQTTDeviceData = ({ name, mac }: Hygrometer): IDeviceData => {
  return {
    deviceTopic: `atc-hygrometer/${mac}`,
    device: {
      ids: [mac],
      name: `${name} Hygrometer`,
      mf: 'XIAOMI',
      mdl: 'Mijia',
      sa: name,
    },
  };
};
