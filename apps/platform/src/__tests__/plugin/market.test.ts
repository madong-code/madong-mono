import { describe, expect, it } from 'vitest';

import {
  canProceedWithUninstall,
  requiresUninstallConfirmation,
} from '../../views/app/plugin/market/components/standalone/impact';

describe('plugin uninstall impact', () => {
  it('requires confirmation when downstream tenants are affected', () => {
    expect(requiresUninstallConfirmation({ has_impact: true, total: 2 })).toBe(
      true,
    );
  });

  it('does not require confirmation without downstream tenants', () => {
    expect(requiresUninstallConfirmation({ has_impact: false, total: 0 })).toBe(
      false,
    );
  });

  it('blocks uninstall until impact data is loaded', () => {
    expect(
      canProceedWithUninstall({ has_impact: false, total: 0 }, false, false),
    ).toBe(false);
  });

  it('allows uninstall after required downstream impact is confirmed', () => {
    expect(
      canProceedWithUninstall({ has_impact: true, total: 2 }, true, true),
    ).toBe(true);
  });
});
