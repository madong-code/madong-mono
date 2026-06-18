/**
 * 数据格式化相关工具函数
 */
import { formatDate as _formatDate } from '@vben/utils';

/**
 * 格式化日期（时区感知，自动适配用户配置时区）
 * @param time 日期值（ISO 字符串 / 时间戳 / Date）
 * @param format 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 */
export function formatDate(
  time: Date | null | number | string | undefined,
  format: string = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (time === undefined || time === null) return '';
  // 兼容秒级时间戳（10位数字），转为毫秒
  if (typeof time === 'number' && time.toString().length === 10) {
    time = time * 1000;
  }
  return _formatDate(time, format as any);
}

// 时间戳转时间
export function timestampToTime(
  timestamp: number = Date.now(),
  isMs: boolean = true,
): string {
  const date = new Date(isMs ? timestamp : timestamp * 1000);
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

// 数字格式化（千位分隔符）
export function commafy(num: number): string {
  return num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 生成随机数
export function randomNum(min: number, max?: number): number {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 移除HTML标签
export function removeHtmlTags(str: string = ''): string {
  return str.replaceAll(/<[^>]*>/g, '');
}

// 格式化 ISO 8601 日期字符串
export function formatISODate(
  isoDate: string,
  options?: Intl.DateTimeFormatOptions,
  timeZone: string = 'Asia/Shanghai',
): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    ...options,
    timeZone,
  }).format(date);
}

/**
 * 格式化时间戳
 * @param dateTime 时间戳
 * @param fmt 格式化方式，默认：yyyy-mm-dd hh:MM:ss
 */
export const timestampFormat = (
  dateTime: null | number | string = null,
  fmt = 'yyyy-mm-dd hh:MM:ss',
) => {
  if (!dateTime) dateTime = Date.now();
  if (dateTime.toString().length === 10) {
    dateTime = +dateTime * 1000;
  }

  const date = new Date(dateTime);
  let ret;
  const opt: any = {
    'y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'h+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString(), // 秒
  };
  for (const k in opt) {
    ret = new RegExp(`(${k})`).exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : padStart(opt[k], ret[1].length, '0'),
      );
    }
  }
  return fmt;
};

/**
 * 字符串补位
 */
const padStart = (str: string, maxLength: number, fillString = ' ') => {
  if (str.length >= maxLength) return str;

  const fillLength = maxLength - str.length;
  let times = Math.ceil(fillLength / fillString.length);
  while ((times >>= 1)) {
    fillString += fillString;
    if (times === 1) {
      fillString += fillString;
    }
  }
  return fillString.slice(0, fillLength) + str;
};

/**
 * 通用日期时间格式化函数
 * @param time 时间参数（时间戳、字符串时间、国际时间、Date对象）
 * @param format 格式化方式，默认：yyyy-MM-dd HH:mm:ss
 * @param timezone 时区，默认：Asia/Shanghai
 * @returns 格式化后的时间字符串
 */
export function formatDateTime(
  time: Date | number | string = Date.now(),
  format: string = 'yyyy-MM-dd HH:mm:ss',
  timezone: string = 'Asia/Shanghai',
): string {
  let date: Date;

  // 处理空值情况
  if (time === null || time === undefined || time === '') {
    return '';
  }

  // 处理不同类型的时间参数
  if (time instanceof Date) {
    date = time;
  } else if (typeof time === 'number') {
    // 处理时间戳，判断是秒还是毫秒
    date =
      time.toString().length === 10 ? new Date(time * 1000) : new Date(time);
  } else if (typeof time === 'string') {
    // 处理字符串时间
    date = new Date(time);
  } else {
    date = new Date();
  }

  // 检查日期是否有效
  if (Number.isNaN(date.getTime())) {
    return '无效时间';
  }

  // 如果使用了自定义格式
  if (format === 'intl') {
    // 使用 Intl.DateTimeFormat 进行格式化（支持时区）
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timezone,
    }).format(date);
  } else {
    let ret;
    const opt: any = {
      'y+': date.getFullYear().toString(), // 年
      'M+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'm+': date.getMinutes().toString(), // 分
      's+': date.getSeconds().toString(), // 秒
    };

    for (const k in opt) {
      ret = new RegExp(`(${k})`).exec(format);
      if (ret) {
        format = format.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : padStart(opt[k], ret[1].length, '0'),
        );
      }
    }
    return format;
  }
}
