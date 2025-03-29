import { poemLanguageStorage } from '@extension/storage';
/**
 * 类型定义
 */
export interface AssetData {
  title: string;
  content: string;
  author: string;
  dynasty?: string;
  translation?: string;
  source?: string;
  link?: string;
  language?: 'chinese' | 'english';
}

type CacheType = 'all' | 'images' | 'metadata';

/**
 * 常量配置
 */
const DB_CONFIG = {
  name: 'gac_extension_db',
  version: 1,
  stores: {
    images: 'images',
    metadata: 'metadata',
  },
} as const;

const API_CONFIG = {
  jsonUrl: 'https://www.gstatic.com/culturalinstitute/tabext/imax_2_2.json',
  baseUrl: 'https://artsandculture.google.com/',
  imageSize: '=s1920-rw',
  metadataExpiry: 5 * 60 * 1000,
  preloadCount: 10,
} as const;

const MEMORY_CACHE_SIZE = 5;

const STORAGE_KEYS = {
  cacheTimestamp: 'json_cache_timestamp',
  currentIndex: 'current_image_index',
} as const;

/**
 * 数据库操作
 */
let dbInstance: IDBDatabase | null = null;

async function getDatabase(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.images)) {
        db.createObjectStore(DB_CONFIG.stores.images);
      }
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.metadata)) {
        db.createObjectStore(DB_CONFIG.stores.metadata);
      }
    };
  });
}

async function dbRead<T>(storeName: string, key: string): Promise<T | null> {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function dbWrite(storeName: string, key: string, value: any): Promise<void> {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value, key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function dbClear(storeName: string): Promise<void> {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}


/**
 * 核心功能函数
 */


// 内存缓存相关
const memoryCache: Map<string, string> = new Map();




// 获取/设置当前索引
export async function getCurrentIndex(): Promise<number> {
  const index = await dbRead<string>(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex);
  return index ? parseInt(index) : 0;
}

// 修改 clearCache 函数，同时清除内存缓存
export async function clearCache(type: CacheType = 'all'): Promise<void> {
  if (type === 'all' || type === 'images') {
    await dbClear(DB_CONFIG.stores.images);
    memoryCache.clear(); // 清除内存缓存
  }
  if (type === 'all' || type === 'metadata') {
    await dbClear(DB_CONFIG.stores.metadata);
  }
}

// 获取当前片
export async function getCurrentImage(): Promise<AssetData> {
  const currentIndex = await dbRead<string>(DB_CONFIG.stores.metadata, STORAGE_KEYS.currentIndex);
  const index = currentIndex ? parseInt(currentIndex) : 0;
  return getImage(index);
}

// 导出测试用配置
export const TEST_ONLY = {
  DB_CONFIG,
  API_CONFIG,
  STORAGE_KEYS,
};

const SAMPLE_POEMS: AssetData[] = [
  {
    title: "静夜思",
    content: "床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。",
    author: "李白",
    dynasty: "唐",
    translation: "夜深人静的时候，看见月光洒在窗前的地上，好像地上结了一层白霜。抬头仰望那明亮的月亮，低头不禁想起远方的家乡。",
    source: "全唐诗",
    link: "https://so.gushiwen.cn/shiwenv_45c396367f59.aspx"
  },
  {
    title: "登鹳雀楼",
    content: "白日依山尽，\n黄河入海流。\n欲穷千里目，\n更上一层楼。",
    author: "王之涣",
    dynasty: "唐",
    translation: "夕阳依傍着山脉慢慢地沉没，黄河朝着东海滚滚地奔流。如果想要看到千里之外的风光，那就要再登上一层楼。",
    source: "全唐诗",
    link: "https://so.gushiwen.cn/shiwenv_c90ff9ea5a71.aspx"
  },
  {
    title: "春晓",
    content: "春眠不觉晓，\n处处闻啼鸟。\n夜来风雨声，\n花落知多少。",
    author: "孟浩然",
    dynasty: "唐",
    translation: "春天里睡得正香，不知不觉天已破晓。四处都能听到鸟儿在歌唱。夜里刮风下雨的声音很响，不知道有多少花儿被风雨打落。",
    source: "全唐诗",
    link: "https://so.gushiwen.cn/shiwenv_5744c8530a77.aspx"
  },
  {
    title: "相思",
    content: "红豆生南国，\n春来发几枝？\n愿君多采撷，\n此物最相思。",
    author: "王维",
    dynasty: "唐",
    translation: "红豆生长在南方，春天来临时长出多少枝？希望你多采摘一些，因为这是最能表达相思之情的东西。",
    source: "全唐诗",
    link: "https://so.gushiwen.cn/shiwenv_6d23f9ea661b.aspx"
  },
  {
    title: "望庐山瀑布",
    content: "日照香炉生紫烟，\n遥看瀑布挂前川。\n飞流直下三千尺，\n疑是银河落九天。",
    author: "李白",
    dynasty: "唐",
    translation: "阳光照射着香炉峰，峰顶升起紫色的烟云。远远望去，庐山的瀑布挂在山前的溪流上。瀑布飞流直泻三千尺，好像是银河从九天之上倾泻而下。",
    source: "全唐诗",
    link: "https://so.gushiwen.cn/shiwenv_4c6721b21a9f.aspx"
  }
]


/**
 * 今日诗词 API 配置与相关函数
 */
const POEM_API_CONFIG = {
  baseUrl: 'https://v1.jinrishici.com',
  defaultCategory: 'all',
  format: 'json',
  timeout: 5000,  // 5秒超时
} as const;

/**
 * PoetryDB API 配置
 */
const POETRYDB_API_CONFIG = {
  baseUrl: 'https://poetrydb.org',
  endpoints: {
    random: '/random/1',
    author: '/author',
    title: '/title',
    lineCount: '/linecount'
  },
  // 预选的著名诗人
  featuredAuthors: [
    'William Shakespeare',
    'Emily Dickinson',
    'Robert Frost',
    'Walt Whitman',
    'Edgar Allan Poe',
    'William Wordsworth',
    'John Keats',
    'Percy Bysshe Shelley',
    'Maya Angelou',
    'Sylvia Plath'
  ]
} as const;

// 从 API 获取随机诗词 - 修复网络请求
export async function getRandomPoem(): Promise<AssetData> {
  console.log('[诗词服务] 开始获取随机诗词');
  
  try {
    // 使用代理URL避免CORS问题，或直接使用正确的API地址
    const url = `https://v1.jinrishici.com/all.json`;
    console.log(`[诗词服务] 请求URL: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), POEM_API_CONFIG.timeout);
    
    const response = await fetch(url, { 
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': chrome.runtime.getURL(''),
        'Referer': 'https://v1.jinrishici.com/'
      },
      credentials: 'omit',
      mode: 'cors'
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[诗词服务] API响应数据:', data);
    
    // 转换为我们的数据格式 - 根据实际返回格式调整
    const poem: AssetData = {
      title: data.origin || '无题',
      content: data.content,
      author: data.author || '佚名',
      dynasty: '',  // API没有返回朝代
      source: '今日诗词 API',
      link: `https://www.jinrishici.com/`,
      language: 'chinese'
    };
    
    console.log(`[诗词服务] 成功获取到诗词: ${poem.content}`);
    return poem;
  } catch (error) {
    console.error('[诗词服务] API 请求失败:', error);
    throw new Error(`无法获取诗词数据: ${error.message}`);
  }
}

// 按分类获取诗词
export async function getPoemByCategory(category: string): Promise<AssetData> {
  console.log(`[诗词服务] 获取分类诗词: ${category}`);
  
  try {
    const url = `${POEM_API_CONFIG.baseUrl}/${category}.${POEM_API_CONFIG.format}`;
    console.log(`[诗词服务] 请求URL: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 转换为我们的数据格式
    const poem: AssetData = {
      title: data.origin ? data.origin : '无题',
      content: data.content,
      author: data.author || '佚名',
      dynasty: data.dynasty || '',
      source: '今日诗词 API',
      link: `https://www.jinrishici.com/`,
      language: 'chinese'
    };
    
    return poem;
  } catch (error) {
    console.error(`[诗词服务] 获取分类 ${category} 失败:`, error);
    throw new Error(`无法获取分类诗词数据: ${error.message}`);
  }
}

// 获取指定索引的诗词函数
export async function getPoem(index: number): Promise<AssetData> {
  console.log(`[诗词服务] 获取指定索引诗词: ${index}`);
  
  // 如果索引为 -1，返回随机诗词
  if (index === -1) {
    return getRandomPoem();
  }
  
  // 如果索引有效，返回本地样本中的诗词
  if (index >= 0 && index < SAMPLE_POEMS.length) {
    return SAMPLE_POEMS[index];
  }
  
  // 索引无效，抛出错误
  console.warn(`[诗词服务] 无效的索引: ${index}`);
  throw new Error(`无效的诗词索引: ${index}`);
}

/**
 * 从PoetryDB获取随机英文诗歌
 */
async function fetchEnglishPoem(): Promise<AssetData> {
  console.log('[诗词服务] 获取英文诗歌');
  
  try {
    // 尝试从PoetryDB获取随机诗歌
    const url = `${POETRYDB_API_CONFIG.baseUrl}${POETRYDB_API_CONFIG.endpoints.random}`;
    console.log(`[诗词服务] 请求英文诗歌URL: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`PoetryDB API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('无效的PoetryDB响应数据');
    }
    
    const poem = data[0];
    
    // 将PoetryDB的响应格式转换为我们的数据格式
    const formattedPoem: AssetData = {
      title: poem.title || 'Untitled',
      content: Array.isArray(poem.lines) ? poem.lines.join('\n') : poem.lines,
      author: poem.author || 'Unknown',
      source: 'PoetryDB',
      link: `https://poetrydb.org/title/${encodeURIComponent(poem.title)}`,
      language: 'english'
    };
    
    console.log('[诗词服务] 成功获取英文诗歌:', formattedPoem.title);
    return formattedPoem;
  } catch (error) {
    console.error('[诗词服务] 获取英文诗歌失败:', error);
    throw new Error(`无法获取英文诗歌数据: ${error.message}`);
  }
}

/**
 * 获取特定作者的英文诗歌
 */
async function fetchPoemByAuthor(author: string): Promise<AssetData> {
  try {
    const encodedAuthor = encodeURIComponent(author);
    const url = `${POETRYDB_API_CONFIG.baseUrl}${POETRYDB_API_CONFIG.endpoints.author}/${encodedAuthor}/title,author,lines`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    const poems = await response.json();
    if (!Array.isArray(poems) || poems.length === 0) {
      throw new Error(`未找到${author}的诗歌`);
    }
    
    // 随机选择一首该作者的诗
    const randomIndex = Math.floor(Math.random() * poems.length);
    const poem = poems[randomIndex];
    
    return {
      title: poem.title,
      content: Array.isArray(poem.lines) ? poem.lines.join('\n') : poem.lines,
      author: poem.author,
      source: 'PoetryDB',
      link: `https://poetrydb.org/author/${encodedAuthor}/title,author,lines`,
      language: 'english'
    };
  } catch (error) {
    console.error(`[诗词服务] 获取${author}的诗歌失败:`, error);
    throw new Error(`无法获取${author}的诗歌数据: ${error.message}`);
  }
}

/**
 * 获取指定行数的英文诗歌
 */
async function fetchPoemByLineCount(lineCount: number): Promise<AssetData> {
  try {
    const url = `${POETRYDB_API_CONFIG.baseUrl}${POETRYDB_API_CONFIG.endpoints.lineCount}/${lineCount}/title,author,lines`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    const poems = await response.json();
    if (!Array.isArray(poems) || poems.length === 0) {
      throw new Error(`未找到${lineCount}行的诗歌`);
    }
    
    // 随机选择一首
    const randomIndex = Math.floor(Math.random() * poems.length);
    const poem = poems[randomIndex];
    
    return {
      title: poem.title,
      content: Array.isArray(poem.lines) ? poem.lines.join('\n') : poem.lines,
      author: poem.author,
      source: 'PoetryDB',
      link: `https://poetrydb.org/linecount/${lineCount}`,
      language: 'english'
    };
  } catch (error) {
    console.error(`[诗词服务] 获取${lineCount}行的诗歌失败:`, error);
    throw new Error(`无法获取${lineCount}行的诗歌数据: ${error.message}`);
  }
}


// 修改 getRandomPoem 函数支持多语言
export async function getRandomPoemWithLanguage(): Promise<AssetData> {
  // 获取用户的语言偏好
  const languagePref = await poemLanguageStorage.get();
  
  console.log(`[诗词服务] 获取随机诗词，语言: ${languagePref}`);
  
  if (languagePref === 'english') {
    return fetchEnglishPoem();
  } else {
    // 使用现有的中文诗词获取逻辑
    console.log('[诗词服务] 获取中文诗词');
    try {
      // 原有的中文诗词获取逻辑
      const url = `https://v1.jinrishici.com/all.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      
      const poem: AssetData = {
        title: data.origin || '无题',
        content: data.content,
        author: data.author || '佚名',
        dynasty: '',
        source: '今日诗词 API',
        link: `https://www.jinrishici.com/`,
        language: 'chinese'
      };
      
      return poem;
    } catch (error) {
      console.error('[诗词服务] 获取中文诗词失败:', error);
      throw new Error(`无法获取中文诗词数据: ${error.message}`);
    }
  }
}

// 修改 getPoemByCategory 函数支持多语言
export async function getPoemByCategoryWithLanguage(category: string): Promise<AssetData> {
  const languagePref = await poemLanguageStorage.get();
  
  console.log(`[诗词服务] 获取分类诗词: ${category}, 语言: ${languagePref}`);
  
  if (languagePref === 'english') {
    // 对英文诗歌，分类处理方式不同
    if (category.startsWith('author/')) {
      // 如果是作者分类
      const author = category.replace('author/', '');
      return fetchPoemByAuthor(author);
    } else if (category.startsWith('linecount/')) {
      // 如果是行数分类
      const lineCount = parseInt(category.replace('linecount/', ''));
      return fetchPoemByLineCount(lineCount);
    } else if (category === 'random' || category === 'all') {
      // 随机诗歌
      return fetchEnglishPoem();
    } else {
      // 默认返回随机诗歌
      return fetchEnglishPoem();
    }
  } else {
    // 使用原有的中文诗词分类逻辑
    try {
      const url = `${POEM_API_CONFIG.baseUrl}/${category}.${POEM_API_CONFIG.format}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      
      const poem: AssetData = {
        title: data.origin || '无题',
        content: data.content,
        author: data.author || '佚名',
        dynasty: data.dynasty || '',
        source: '今日诗词 API',
        link: `https://www.jinrishici.com/`,
        language: 'chinese'
      };
      
      return poem;
    } catch (error) {
      console.error('[诗词服务] 获取中文分类诗词失败:', error);
      throw new Error(`无法获取中文分类诗词数据: ${error.message}`);
    }
  }
}