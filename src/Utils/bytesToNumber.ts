export const bytesToNumber = (bytes: Uint8Array): number => {
  let number = 0;
  for (const byte of bytes) {
    number = (number << 8) + byte;
  }
  return number;
};
