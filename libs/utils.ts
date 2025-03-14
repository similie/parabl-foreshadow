import { DateTime } from "luxon";

export const extractSimpleTimeFromDate = (datetime: Date) => {
  const date = DateTime.fromJSDate(datetime);
  return date.toLocaleString(DateTime.DATETIME_SHORT);
};

export const extractLongTimeFromDate = (datetime: Date) => {
  const date = DateTime.fromJSDate(new Date(datetime));
  return date.toLocaleString(DateTime.DATETIME_MED);
};

export const extractMedTimeFromDate = (timestamp: string) => {
  const date = DateTime.fromISO(timestamp, { setZone: true });
  return date.toLocaleString(DateTime.DATETIME_MED);
};

export const extractDayTimestamp = (timestamp: string): string => {
  const date = DateTime.fromISO(timestamp, { setZone: true });
  return date.toLocaleString(DateTime.DATETIME_HUGE).split(",")[0];
};

export const extractTimeFromTimestamp = (timestamp: string): string => {
  const date = DateTime.fromISO(timestamp, { setZone: true });
  return date.toLocaleString(DateTime.TIME_SIMPLE);
};

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

export const getLocalTimezoneOffsetMS = () => {
  // Create a DateTime object in the local timezone
  const localDateTime = DateTime.local();
  // Get the offset in minutes
  const offsetInMinutes = localDateTime.offset;
  // Convert minutes to milliseconds
  return offsetInMinutes * 60 * 1000;
};

export const convertUtcToLocal = (utcTimestampMS: number) => {
  // Validate Timestamp
  if (typeof utcTimestampMS !== "number" || isNaN(utcTimestampMS)) {
    throw new Error("Invalid timestamp provided.");
  }

  // Create DateTime object in UTC
  const dtUtc = DateTime.fromMillis(
    utcTimestampMS + getLocalTimezoneOffsetMS(),
    { zone: "utc" },
  );
  if (!dtUtc.isValid) {
    throw new Error(
      "Failed to convert to local DateTime object: " + dtUtc.invalidExplanation,
    );
  }

  // Convert to local time zone using toLocal()
  const dtLocal = dtUtc.toLocal();

  if (!dtLocal.isValid) {
    throw new Error(
      "Failed to convert to local DateTime object: " +
        dtLocal.invalidExplanation,
    );
  }
  // Format the local date and time
  return dtLocal.toJSDate();
};
