import { readFileSync } from 'fs';

export type ProxyConfig = {
  host: string;
  port: number | undefined;
  password: string | undefined;
};

interface OptionsJson {
  proxies: ProxyConfig[];
}

const fileContents = readFileSync('../data/options.json');
const options: OptionsJson = JSON.parse(fileContents.toString());

export const getProxies = () => options.proxies || [];
