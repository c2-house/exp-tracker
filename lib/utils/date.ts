import dayjs from 'dayjs';

export const calculateDaysLeft = (expDate: string) => {
  const today = dayjs().startOf('day');
  const expiry = dayjs(expDate);
  const daysLeft = expiry.diff(today, 'day');

  return daysLeft;
};

export const getDdayString = (daysLeft: number) => {
  return daysLeft < 0 ? `D+${Math.abs(daysLeft)}` : `D-${daysLeft}`;
};
