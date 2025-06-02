import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

/**
 * 窗口尺寸Hook
 * @returns 窗口尺寸信息
 */
export const useWindowSize = (): WindowSize => {
  // 初始化状态
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    // 确保代码在浏览器环境中运行
    if (typeof window === 'undefined') {
      return;
    }

    // 处理窗口尺寸变化的函数
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // 添加事件监听
    window.addEventListener('resize', handleResize);
    
    // 初始调用一次以确保初始值正确
    handleResize();

    // 清理事件监听
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};

/**
 * 检查是否为移动设备
 * @param width 窗口宽度
 * @returns 是否为移动设备
 */
export const isMobile = (width: number): boolean => {
  return width < 768; // 通常768px是平板/移动设备的分界点
};

/**
 * 检查是否为平板设备
 * @param width 窗口宽度
 * @returns 是否为平板设备
 */
export const isTablet = (width: number): boolean => {
  return width >= 768 && width < 1024;
};

/**
 * 检查是否为桌面设备
 * @param width 窗口宽度
 * @returns 是否为桌面设备
 */
export const isDesktop = (width: number): boolean => {
  return width >= 1024;
};