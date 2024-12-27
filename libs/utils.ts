export const getIncrementalTime = (hours = 0, startDate = new Date()) => {
  const currentHours = startDate.getUTCHours();
  startDate.setUTCHours(currentHours + hours);
  return startDate;
};

export const timestamp = (time = 0, startDate = new Date()) => {
  return getIncrementalTime(time, startDate).toISOString();
};

export const generateRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const debounceCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) => {
  let timer: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer); // Clear the previous timer if it exists
    }
    timer = setTimeout(() => {
      callback(...args); // Invoke the callback after the delay
      timer = null; // Reset the timer
    }, delay);
  };
};
