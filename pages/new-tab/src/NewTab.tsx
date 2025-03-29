import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { meta } from '@extension/shared';

/**
 * 艺术品数据接口定义
 */
export interface AssetData {
  title: string;           // 诗歌标题
  content: string;         // 诗歌内容
  author: string;          // 作者
  dynasty?: string;        // 朝代
  translation?: string;    // 翻译/注释
  background_image?: string; // 可选的背景图片
  data_url?: string;       // 背景图片的数据URL（如果有）
  source?: string;         // 诗歌来源
  link?: string;           // 相关链接
  language: string;         // 语言
}

// 加载动画
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const PageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  box-sizing: border-box;
`;

const ArtworkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 1080px) {
    padding: 20px 0;
  }
`;




const NavigationArea = styled.div<{ direction: 'left' | 'right' }>`
  position: fixed;
  top: 0;
  ${props => props.direction}: 0;
  width: 7%;
  min-width: 55px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  z-index: 10;

  &:hover {
    opacity: 1;
    background: linear-gradient(
      ${props => (props.direction === 'left' ? 'to right' : 'to left')},
      rgba(0, 0, 0, 0.15),
      transparent
    );
  }
`;

const NavigationButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  user-select: none;
  pointer-events: none;

  &:hover {
    background: white;
  }

  span {
    pointer-events: none;
  }
`;


const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #000;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 50px auto;
`;

const LoadingContainer = styled.div<{ width: number; height: number }>`
  width: 100%;
  aspect-ratio: ${props => props.width / props.height};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  color: #000;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


// 提取 Navigation 组件
const Navigation: React.FC<{
  direction: 'left' | 'right';
  onClick: () => void;
}> = ({ direction, onClick }) => (
  <NavigationArea direction={direction} onClick={onClick}>
    <NavigationButton>
      <span>{direction === 'left' ? '←' : '→'}</span>
    </NavigationButton>
  </NavigationArea>
);

// 诗歌内容容器
const PoemContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
`;

// 根据语言动态设置标题样式
const PoemTitle = styled.h1<{ isClickable: boolean }>`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  ${props => props.isClickable && `
    cursor: pointer;
    position: relative;
    display: inline-block;
    
    &:hover {
      color: #007bff;
      text-decoration: underline;
      
      &::after {
        content: "点击查看全文和注释";
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: #666;
        white-space: nowrap;
        background: rgba(255, 255, 255, 0.9);
        padding: 3px 8px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
    }
  `}
`;

const PoemContent = styled.div`
  font-size: 18px;
  line-height: 1.8;
  white-space: pre-line;
  margin-bottom: 20px;
  color: #444;
`;

const PoemAuthor = styled.div`
  font-size: 16px;
  font-style: italic;
  color: #666;
  margin-bottom: 15px;
`;

const PoemTranslation = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #777;
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
  text-align: left;
`;

// 修改 ArtworkDisplay 组件为 PoemDisplay 组件
const PoemDisplay: React.FC<{
  loading: boolean;
  poem: AssetData | null;
  error: string | null;
}> = ({ loading, poem, error }) => {
  if (loading) {
    return (
      <LoadingContainer width={600} height={400}>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer width={600} height={400}>
        <ErrorMessage>{error}</ErrorMessage>
      </LoadingContainer>
    );
  }

  if (!poem) return null;
  
  // 判断是否为中文诗词
  const isChinesePoem = poem.language === 'chinese';
  
  // 构建古诗文网的搜索链接
  const handleTitleClick = () => {
    if (!poem || !isChinesePoem) return;
    
    // 获取标题首字
    const firstChar = poem.title.charAt(0);
    
    // 构建URL
    const searchUrl = `https://www.gushiwen.cn/search.aspx?value=${encodeURIComponent(poem.title)}+${encodeURIComponent(poem.author)}&valuej=${encodeURIComponent(firstChar)}`;
    
    // 打开新窗口
    window.open(searchUrl, '_blank');
  };

  return (
    <PoemContainer>
      <PoemTitle 
        isClickable={isChinesePoem} 
        onClick={isChinesePoem ? handleTitleClick : undefined}
      >
        {poem.title}
      </PoemTitle>
      <PoemAuthor>{poem.author} {poem.dynasty ? `· ${poem.dynasty}` : ''}</PoemAuthor>
      <PoemContent>{poem.content}</PoemContent>
      {poem.translation && <PoemTranslation>{poem.translation}</PoemTranslation>}
    </PoemContainer>
  );
};


const NewTab: React.FC = () => {
  const [poem, setPoem] = useState<AssetData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);




  // 加载随机诗词
  const loadRandomPoem = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      
      const response = await chrome.runtime.sendMessage({ type: 'GET_RANDOM_POEM' });
      
      
      if (!response.success) {
        throw new Error(response.error || '获取诗词失败');
      }
      
      setPoem(response.data);
    } catch (error) {
      console.error('加载诗词失败:', error);
      setError(error instanceof Error ? 
        error.message : 
        '获取诗词失败，请检查网络连接后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadRandomPoem();
  }, []);



  const handleNext = async () => {
    if (currentIndex === null) return;
    try {
      setLoading(true);
      setError(null);
      
      const nextIndex = (currentIndex + 1) % meta.length;
      
      // 请求诗词数据
      const response = await chrome.runtime.sendMessage({
        type: 'GET_RANDOM_POEM',
      });
      
      if (!response.success) throw new Error(response.error || '获取下一首诗词失败');
      
      setPoem(response.data);
      setCurrentIndex(nextIndex);
      
      // 更新当前索引
      await chrome.runtime.sendMessage({
        type: 'SET_CURRENT_INDEX',
        index: nextIndex,
      });
    } catch (error) {
      console.error('加载下一首诗词失败:', error);
      setError(error instanceof Error ? 
        error.message : 
        '获取下一首诗词失败，请检查网络连接后重试');
    } finally {
      setLoading(false);
    }
  };

  // 添加键盘事件处理函数
  const handleKeyDown = (event: KeyboardEvent) => {
    if (loading) return; // 如果正在加载，不响应键盘事件

    switch (event.key) {
      case 'ArrowRight':
        handleNext();
        break;
    }
  };

  // 添加键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // 清理函数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loading]); // 依赖 loading 状态

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 获取当前索引的函数
  const getCurrentIndex = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_CURRENT_INDEX' });
      if (response.success) {
        setCurrentIndex(response.data);
      }
    } catch (error) {
      console.error('Failed to get current index:', error);
    }
  };

  // 初始化时获取当前索引
  useEffect(() => {
    getCurrentIndex();
  }, []);

  return (
    <PageContainer style={{ 
      backgroundImage: poem?.data_url ? `url(${poem.data_url})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>

      <ArtworkContainer>
        <PoemDisplay 
          loading={loading} 
          error={error}
          poem={poem} 
        />
        
      </ArtworkContainer>

      <Navigation direction="right" onClick={handleNext} />

    </PageContainer>
  );
};

export default NewTab;
