// 暗黑模式基础色板定义
export const darkThemeColors = {
  // 品牌色保持不变
  primary: '#6366F1',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  secondary: '#8B5CF6',
  accent: '#06B6D4',
  neutral: '#64748B',
  
  // 背景色
  bgPrimary: '#121212',
  bgSecondary: '#1E1E1E',
  bgTertiary: '#2D2D2D',
  bgCard: '#1F1F1F',
  bgOverlay: 'rgba(15, 23, 42, 0.8)',
  
  // 文字颜色
  textPrimary: '#E0E0E0',
  textSecondary: '#A0A0A0',
  textTertiary: '#808080',
  textInverse: '#121212',
  textPlaceholder: '#666666',
  textDisabled: '#444444',
  
  // 边框颜色
  border: '#3D3D3D',
  
  // 状态栏颜色
  statusBarStyle: 'light'
};

// 明亮模式基础色板（保持原有颜色）
export const lightThemeColors = {
  primary: '#6366F1',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  secondary: '#8B5CF6',
  accent: '#06B6D4',
  neutral: '#64748B',
  
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F8FAFC',
  bgTertiary: '#F1F5F9',
  bgCard: '#FFFFFF',
  bgOverlay: 'rgba(15, 23, 42, 0.5)',
  
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  textPlaceholder: '#808080',
  textDisabled: '#C0C0C0',
  
  border: '#E5E5E5',
  
  statusBarStyle: 'dark'
};

// 主题对象
export const theme = {
  // 导航栏主题
  navigation: {
    backgroundColor: '#FFFFFF',
    textColor: '#333333',
    titleSize: '36rpx'
  }
};

export default {
  darkThemeColors,
  lightThemeColors,
  theme
};