import { requestClient } from '#/api/request';

const baseUrl = '/devtools/terminal';

export const TerminalService = {
  getConfig() {
    return requestClient.get(`${baseUrl}/config`);
  },

  getCommands() {
    return requestClient.get(`${baseUrl}/commands`);
  },

  command(
    commandKey: string,
    uuid: string,
    extend: string,
    _eventHandlers?: any,
  ) {
    return requestClient.post(baseUrl, {
      command: commandKey,
      uuid,
      extend,
      server: 'crmd',
    });
  },

  updateConfig(data: Partial<any>) {
    return requestClient.post(`${baseUrl}/config`, data);
  },
};
