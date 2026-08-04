import type {
  PluginAuthStatus,
  TenantPluginAuthRow,
} from '#/api/app/plugin/tenant-auth';

export function applyAuthorizationStatus(
  rows: TenantPluginAuthRow[],
  status: PluginAuthStatus,
) {
  rows.forEach((row) => {
    row.auth_status = status;
  });
}

export function hasAuthorizationChanges(
  rows: TenantPluginAuthRow[],
  originalStatuses: Record<string, PluginAuthStatus>,
) {
  return rows.some(
    (row) => originalStatuses[row.plugin_key] !== row.auth_status,
  );
}
