import { oxlintConfig } from '@vben/oxlint-config';

import { defineConfig } from 'oxlint';

export default defineConfig({
  ...oxlintConfig,
  ignorePatterns: [
    ...(oxlintConfig.ignorePatterns ?? []),
    // 第三方库构建产物，不可 lint
    'packages/lib/**',
  ],
});
