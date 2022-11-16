import Stop from './Stop';

export default interface StopsResponse {
  [key: string]: {
    lastUpdate: Date;
    stops: Stop[];
  };
}
