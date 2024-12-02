export const getIncrementalTime = (hours = 0, startDate = new Date()) => {
  const currentHours = startDate.getUTCHours();
  startDate.setUTCHours(currentHours + hours);
  return startDate;
};

export const timestamp = (time = 0, startDate = new Date()) => {
  return getIncrementalTime(time, startDate).toISOString();
};
