import baseConfig from '@vben/commitlint-config';

// 包名到短名的映射关系，同时支持完整包名和短名
const scopeAliases = {
  '@madong/admin': 'admin',
  '@madong/platform': 'platform',
  '@madong/install': 'install',
};

// 在已有 scope 基础上追加短名
const shortScopes = Object.values(scopeAliases);
const originalRule = baseConfig.rules['function-rules/scope-enum'];
const originalValidator = originalRule[2];

const patchedConfig = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    'function-rules/scope-enum': [
      2,
      'always',
      (parsed) => {
        // 先把短名映射回完整包名，再用原始校验器
        const mappedScope = shortScopes.includes(parsed.scope)
          ? Object.entries(scopeAliases).find(
              ([, alias]) => alias === parsed.scope,
            )?.[0]
          : parsed.scope;
        return originalValidator({ ...parsed, scope: mappedScope });
      },
    ],
  },
};

export default patchedConfig;
