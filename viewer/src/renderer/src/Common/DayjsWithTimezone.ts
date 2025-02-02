import dayjs, { ConfigType, Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = 'Asia/Tokyo';

const dayTz = (date?: ConfigType): Dayjs => {
  return dayjs(date).tz(DEFAULT_TIMEZONE).startOf('month');
};

export default dayTz;