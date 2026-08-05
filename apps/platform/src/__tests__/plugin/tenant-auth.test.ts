import type { TenantPluginAuthRow } from '../../api/app/plugin/tenant-auth';

import { describe, expect, it } from 'vitest';

import {
  applyAuthorizationStatus,
  hasAuthorizationChanges,
} from '../../views/app/plugin/tenant-auth/authorization';

const createRow = (
  pluginKey: string,
  authStatus: TenantPluginAuthRow['auth_status'],
): TenantPluginAuthRow => ({
  auth_status: authStatus,
  is_installed: 0,
  plugin_key: pluginKey,
  plugin_title: pluginKey,
  version: '1.0.0',
});

describe('tenant plugin authorization', () => {
  it('applies one authorization status to the selected rows', () => {
    const rows = [createRow('demo', 'none'), createRow('shop', 'trial')];

    applyAuthorizationStatus(rows, 'authorized');

    expect(rows.map((row) => row.auth_status)).toEqual([
      'authorized',
      'authorized',
    ]);
  });

  it('detects draft authorization changes', () => {
    const rows = [createRow('demo', 'authorized')];

    expect(hasAuthorizationChanges(rows, { demo: 'authorized' })).toBe(false);
    const row = rows.at(0);
    expect(row).toBeDefined();
    if (row) row.auth_status = 'none';
    expect(hasAuthorizationChanges(rows, { demo: 'authorized' })).toBe(true);
  });
});
