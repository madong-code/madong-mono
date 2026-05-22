import { eventHandler } from 'h3';
import { useResponseSuccess } from '~/utils/response';

export default eventHandler(() => {
  return useResponseSuccess({
    flag: true,
    key_id: 'demo-key-id',
    public_key: 'demo-public-key'
  });
});
