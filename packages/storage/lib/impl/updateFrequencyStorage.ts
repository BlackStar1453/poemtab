import { Storage } from '../';

type UpdateFrequency = 'every_tab' | 'every_10min' | 'every_hour' | 'every_day';

/**
 * 更新频率设置
 * every_tab: 每个新标签页都更新
 * every_10min: 每10分钟更新
 * every_hour: 每小时更新
 * every_day: 每天更新
 */
export const updateFrequencyStorage = new Storage<UpdateFrequency>('updateFrequency', 'every_tab');

