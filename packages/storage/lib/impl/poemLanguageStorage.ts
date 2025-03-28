import { Storage } from '../';

/**
 * 诗歌语言设置
 * chinese: 中文古诗
 * english: 英文诗歌
 */
export const poemLanguageStorage = new Storage<'chinese' | 'english'>('poemLanguage', 'chinese');