import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
// 只保留必要的插件
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';

// 扩展dayjs插件
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(calendar);

// 设置语言
dayjs.locale('zh-cn');

export default dayjs;
