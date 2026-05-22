import { eventHandler } from 'h3';
import { useResponseSuccess } from '~/utils/response';

export default eventHandler(() => {
  return useResponseSuccess({
    uuid: 'demo-uuid',
    img: 'data:image/svg+xml;base64,demo-captcha-image'
  });
});
