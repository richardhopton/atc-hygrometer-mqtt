import { readFileSync } from 'fs';

interface OptionsJson {
  proxy_address: string;
  proxy_port: number | null;
  proxy_password: string | null;
}

const fileContents = readFileSync('../data/options.json');
const options: OptionsJson = JSON.parse(fileContents.toString());

export const getProxy = () => ({
  host: options.proxy_address,
  port: options.proxy_port || 6053,
  password: options.proxy_password || '',
});
