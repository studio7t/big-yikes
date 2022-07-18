import { Bin } from './bin';
import { blockTypes } from '../test/data';

const counts = { '1x1': 4, '1x2': 2 };

describe('bin', () => {
  let bin: Bin<typeof blockTypes>;

  beforeEach(() => {
    bin = new Bin(blockTypes, { ...counts });
  });

  it('should construct a bin from a record of BlockTypes and a count of each', () => {
    expect(bin.blockTypes).toEqual(blockTypes);
    expect(bin.counts).toEqual(counts);
  });

  it('should update counts when a block is added or removed', () => {
    bin.remove('1x1');
    expect(bin.counts['1x1']).toEqual(counts['1x1'] - 1);
    expect(bin.counts['1x2']).toEqual(counts['1x2']);

    bin.add('1x1');
    expect(bin.counts['1x1']).toEqual(counts['1x1']);
  });
});
