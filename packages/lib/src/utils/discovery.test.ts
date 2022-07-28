import { isDiscovery } from './discovery';

describe('isDiscovery', () => {
  it('should return whether the input starts with a 0[0-7]', () => {
    // not long enough
    expect(isDiscovery('')).toEqual(false);
    expect(isDiscovery('0')).toEqual(false);

    // first character not 0
    expect(isDiscovery('10')).toEqual(false);

    // all valid
    expect(isDiscovery('00')).toEqual(true);
    expect(isDiscovery('07')).toEqual(true);
    expect(isDiscovery('04')).toEqual(true);
    expect(isDiscovery('00ffffff')).toEqual(true);
  });
});
