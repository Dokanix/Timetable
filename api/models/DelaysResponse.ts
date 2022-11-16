import Delay from './Delay';

export default interface DelaysResponse {
  lastUpdate: Date;
  delays: Delay[];
}
