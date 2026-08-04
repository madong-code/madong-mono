export function requiresUninstallConfirmation(impact: {
  has_impact: boolean;
  total: number;
}): boolean {
  return impact.has_impact && impact.total > 0;
}

export function canProceedWithUninstall(
  impact: { has_impact: boolean; total: number },
  confirmed: boolean,
  impactReady: boolean,
): boolean {
  return impactReady && (!requiresUninstallConfirmation(impact) || confirmed);
}
