import BaseService from '#/api/core/base'
import type { PostRow } from './types'

const baseUrl = '/system/post'

export const PostService = {
  ...BaseService<PostRow>({ baseUrl }),
  getList: BaseService<PostRow>({ baseUrl }).list,
}
