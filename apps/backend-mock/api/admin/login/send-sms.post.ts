import { eventHandler } from 'h3';
import { useResponseSuccess } from '~/utils/response';

export default eventHandler(() => {
  return useResponseSuccess({
    code: 123456,
    uid: 18888888888
  });
});
