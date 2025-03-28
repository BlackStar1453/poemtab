import { Storage } from '../storage';

/**
 * 上次更新时间存储
 * 存储最后一次更新图片的时间戳
 */
export const lastUpdateTimeStorage = new Storage<number>('lastUpdateTime', 0);
