import { RxStompConfig, IFrame } from '@stomp/rx-stomp';

import { environment } from '../../../environments/environment';

export const FrontendRxStompConfig: RxStompConfig = {
  // Which server?
  brokerURL: environment.URL_WS,

  // Headers
  // Typical keys: login, passcode, host
  connectHeaders: {
    login: 'guest',
    passcode: 'guest',
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds
  //heartbeatOutgoing: 0, // Typical value 0 - disabled

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 500,

  //logRawCommunication: false,
  
  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },

  correlateErrors: (error: IFrame): any => {
    console.log(error);
  }
};