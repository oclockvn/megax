import {
  addHours as addHoursFns,
  addMinutes as addMinutesFns,
  format,
  formatISO,
  parseISO,
  isValid,
  parse,
  setHours as setHoursFns,
  setMinutes,
  setSeconds,
  addDays as addDaysFns,
  startOfDay as startOfDayFns,
  endOfDay as endOfDayFns,
  startOfYesterday,
  endOfYesterday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  startOfYear,
  endOfYear,
  addYears,
  isWeekend,
  isSameDay,
  isPast,
  isFuture,
  isAfter,
  isBefore,
  isToday,
} from "date-fns";

const startOfDay = (date: Date): Date => {
  return startOfDayFns(date);
};

const endOfDay = (date: Date): Date => {
  return endOfDayFns(date);
};

const todayAt = (hour: number, minute: number): Date => {
  return setHoursFns(setMinutes(setSeconds(new Date(), 0), minute), hour);
};

const formatDate = (date: Date, formatter: string): string => {
  return format(date, formatter);
};

const formatToServer = (date: Date, noOffset: boolean = false): string => {
  return noOffset ? `${format(date, 'yyyy-MM-dd')}T${format(date, 'hh:mm:ss')}` : formatISO(date);
};

const parseFromServer = (isoDate: string): Date => {
  return parseISO(isoDate);
};

const roundToMinutes = (date: Date, minute: number = 30): Date => {
  let min = date.getMinutes();
  if (min === 0) {
    return date;
  }

  if (min <= minute) {
    return setMinutes(date, minute);
  }

  return setSeconds(setMinutes(addHoursFns(date, 1), 0), 0);
};

const tryParse = (dateString: string, format: string): Date | null => {
  const date = parse(dateString, format, new Date());
  return isValid(date) ? date : null;
};

const parseDate = (dateString: string, format: string = "yyyy-MM-dd"): Date => {
  return parse(dateString, format, new Date());
};

const addDays = (date: Date, days: number): Date => {
  return addDaysFns(date, days);
};

const addHours = (date: Date, amount: number): Date => {
  return addHoursFns(date, amount);
};

const addMinutes = (date: Date, amount: number): Date => {
  return addMinutesFns(date, amount);
};

const setTime = (date: Date, hour: number, minute: number): Date => {
  return setSeconds(setMinutes(setHoursFns(date, hour), minute), 0);
};

const getNextWeekDay = (from: Date) => {
  let next = addDays(from, 1);
  while (isWeekend(next)) {
    next = addDays(next, 1);
  }

  return next;
};

const getWeekDays = (curr: Date) => {
  const begin = startOfWeek(curr, {
    weekStartsOn: 1, // monday
  });
  const end = endOfWeek(curr, {
    weekStartsOn: 1,
  });

  let week = [];
  let next = begin;

  while (next.getTime() < end.getTime()) {
    week.push(next);
    next = addDays(next, 1);
  }

  return week;
};

export default {
  todayAt,
  formatDate,
  roundToMinutes,
  tryParse,
  parseDate,
  parseISO,
  setTime,
  addHours,
  addDays,
  addMinutes,
  formatToServer,
  parseFromServer,
  startOfDay,
  endOfDay,
  startOfYesterday,
  endOfYesterday,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  startOfYear,
  endOfYear,
  addYears,
  isWeekend,
  getNextWeekDay,
  isSameDay,
  isPast,
  isFuture,
  isAfter,
  isBefore,
  isToday,
  getWeekDays,
};

// export function handleDates(body: any) {
//   if (body === null || body === undefined || typeof body !== "object")
//     return body;

//   for (const key of Object.keys(body)) {
//     const value = body[key];
//     if (isIsoDateString(value)) body[key] = parseISO(value);
//     else if (typeof value === "object") handleDates(value);
//   }
// }
