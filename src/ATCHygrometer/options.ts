import { readFileSync } from 'fs';

export type Hygrometer = {
  mac: string;
  name: string;
};

interface OptionsJson {
  hygrometers: Hygrometer[];
}

const fileContents = readFileSync('../data/options.json');
const options: OptionsJson = JSON.parse(fileContents.toString());

export const getHygrometers = (): Hygrometer[] =>
  options.hygrometers.map((mt) => ({
    mac: mt.mac.replace(/:/g, '').toLowerCase(),
    name: mt.name,
  }));
