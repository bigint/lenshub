import { describe, expect, test } from 'vitest';

import hasOwnedLensProfiles from './hasOwnedLensProfiles';

describe('hasOwnedLensProfiles', () => {
  test('should return true if the ID has a lens profile', async () => {
    expect(
      await hasOwnedLensProfiles(
        '0x03ba34f6ea1496fa316873cf8350a3f7ead317ef',
        '0x1c',
        false
      )
    ).toBeTruthy();
  });

  test('should return false if the ID is not has a lens profile', async () => {
    expect(
      await hasOwnedLensProfiles(
        '0x03ba34f6ea1496fa316873cf8350a3f7ead317ef',
        '0x05',
        false
      )
    ).toBeFalsy();
  });
});
