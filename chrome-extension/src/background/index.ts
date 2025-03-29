import 'webextension-polyfill';
import { getCurrentIndex, getPoem, getRandomPoemWithLanguage, getPoemByCategoryWithLanguage } from '../services/asset';

// 简化消息处理，专注于核心功能
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[后台] 收到消息:', request);
  
  const handleRequest = async () => {
    switch (request.type) {
      case 'GET_RANDOM_POEM':
        return await getRandomPoemWithLanguage();
      
      case 'GET_POEM_BY_CATEGORY':
        return await getPoemByCategoryWithLanguage(request.category);
        
      case 'GET_POEM':
        return await getPoem(request.index);
        
      case 'GET_CURRENT_INDEX':
        return await getCurrentIndex();
        
      default:
        throw new Error(`未知的请求类型: ${request.type}`);
    }
  };

  // 处理请求并返回响应
  handleRequest()
    .then(response => sendResponse({ success: true, data: response }))
    .catch(error => sendResponse({ success: false, error: error.message }));

  return true; // 保持消息通道开放
});

// 移除多余的标签页创建监听逻辑，简化扩展图标点击事件
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('new-tab/index.html')
  });
});


console.log('background loaded');
