import BaseService from '#/api/core/base'
import type { Link } from './types'

const baseUrl = '/web/link'

export const LinkService = {
  ...BaseService<Link>({
    baseUrl,
    allowedMethods: [],
    forbiddenMethods: [],
  }),
}
