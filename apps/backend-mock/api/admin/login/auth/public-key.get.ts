import { eventHandler } from 'h3';
import { useResponseSuccess } from '~/utils/response';

export default eventHandler(() => {
  return useResponseSuccess({
    public_key: 'demo-public-key',
    key_id: 'demo-key-id'
  });
});
