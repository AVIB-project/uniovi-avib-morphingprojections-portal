import { RxStompService } from './rx-stomp.service';
import { FrontendRxStompConfig,  } from './rx-stomp.config';
import { IFrame } from '@stomp/rx-stomp';

export function RxStompServiceFactory() {
  const rxStompService = new RxStompService();
  
  rxStompService.stompClient.onStompError = (frame: IFrame) => {
	  console.log('Broker reported error: ' + frame.headers['message']);
		console.log('Additional details: ' + frame.body);
  }; 
    
  rxStompService.stompClient.onWebSocketError = (error: any) => {
    console.log(error);
  }

  rxStompService.configure(FrontendRxStompConfig);
    
  rxStompService.activate();
    
  return rxStompService;
}