const getTimeToMidnight = (date: Date) => {
  const midnight = new Date(date);
  midnight.setHours(24, 0, 0, 0);

  return midnight.getTime() - date.getTime();
};

const msToTime = (duration: number) => {
  let seconds = Math.floor(duration / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;

  return `${hours}h ${minutes}m ${seconds}s`;
};

export default {
  getTimeToMidnight,
  msToTime,
};
