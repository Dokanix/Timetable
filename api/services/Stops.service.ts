import DelaysResponse from '../models/DelaysResponse';
import StopsResponse from '../models/StopsResponse';

const getDelays = async (id: number) => {
  const rawResponse = await fetch(
    process.env.GET_DELAYS_URL! + `?stopId=${id}`
  );

  const delaysResponse: DelaysResponse = await rawResponse.json();

  console.log(process.env.GET_DELAYS_URL! + `?stopId=${id}`);

  if (!delaysResponse) {
    throw new Error('No delays found for stop');
  }

  return delaysResponse.delays;
};

const getStops = async (date?: Date) => {
  const requestedDate = date || new Date();

  const dateKey = requestedDate.toISOString().slice(0, 10);
  const rawResponse = await fetch(process.env.GET_STOPS_URL!);
  const stopsResponse: StopsResponse = await rawResponse.json();
  const datesStops = stopsResponse[dateKey];

  if (!datesStops) {
    throw new Error('No stops found for date');
  }

  return stopsResponse[dateKey].stops.filter((stop) => stop.stopName);
};

export default {
  getStops,
  getDelays,
};
