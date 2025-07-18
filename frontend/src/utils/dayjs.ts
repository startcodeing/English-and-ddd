import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isToday from 'dayjs/plugin/isToday';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';
import isoWeek from 'dayjs/plugin/isoWeek';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import duration from 'dayjs/plugin/duration';
import minMax from 'dayjs/plugin/minMax';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import buddhistEra from 'dayjs/plugin/buddhistEra';
// isValid 是 dayjs 内置方法，不需要导入插件

// 扩展dayjs插件
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);
dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.extend(objectSupport);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(isLeapYear);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(updateLocale);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);
dayjs.extend(duration);
dayjs.extend(minMax);
dayjs.extend(dayOfYear);
dayjs.extend(weekOfYear);
dayjs.extend(buddhistEra);
// isValid 是 dayjs 内置方法，不需要扩展

// 设置默认语言为中文
dayjs.locale('zh-cn');

export default dayjs;