export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface RouteRow {
  name: string;
  method: Uppercase<HttpMethod>;
  path: string;
  title?: string;
  type?: number;
  code?: string;
}
