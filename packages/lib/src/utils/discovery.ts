export const isDiscovery = (s: string) => {
  return s.match(/^0[0-7]/) !== null;
};
