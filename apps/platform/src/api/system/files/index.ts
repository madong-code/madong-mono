import { requestClient } from '#/api/request';

const baseUrl = '/file';

export const FilesService = {
  /**
   * 按资源 key 批量换取可访问地址
   *
   * 公开空间返回访问域名拼接结果；私有空间（非公开读）返回带签名的临时直链。
   *
   * @param keys 资源地址集合（相对路径或本空间域名下的绝对地址）
   */
  accessUrls(keys: string[]) {
    return requestClient.post(`${baseUrl}/access-urls`, { keys }) as Promise<
      { key: string; url: string }[]
    >;
  },
};
