/**
 * KaiwaLab 主题配置
 * 统一管理应用的颜色、字体、间距等设计规范
 */

export const theme = {
  // 主色调
  colors: {
    primary: '#2563EB',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    
    // 功能色
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // 中性色
    neutral: '#64748B',
    neutralLight: '#94A3B8',
    neutralDark: '#475569',
    
    // 文字颜色
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      tertiary: '#64748B',
      inverse: '#FFFFFF',
      placeholder: '#94A3B8',
      disabled: '#CBD5E1'
    },
    
    // 背景色
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
      card: '#FFFFFF',
      overlay: 'rgba(15, 23, 42, 0.5)',
      hover: '#F1F5F9'
    },
    
    // 边框色
    border: {
      light: '#E2E8F0',
      default: '#CBD5E1',
      dark: '#94A3B8'
    }
  },
  
  // 字体
  fonts: {
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  // 间距
  spacing: {
    xs: '4px',
    sm: '8px',
    base: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px'
  },
  
  // 圆角
  borderRadius: {
    sm: '4px',
    base: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },
  
  // 阴影
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  
  // 导航栏配置
  navigation: {
    backgroundColor: '#2563EB',
    textColor: '#FFFFFF',
    titleSize: '18px'
  },
  
  // 底部标签栏配置
  tabBar: {
    backgroundColor: '#FFFFFF',
    color: '#64748B',
    selectedColor: '#2563EB',
    borderStyle: 'white'
  },
  
  // 图标配置
  icons: {
    // 底部导航图标
    tabBar: {
      home: 'fas fa-home',
      lab: 'fas fa-flask',
      library: 'fas fa-book',
      profile: 'fas fa-user'
    },
    // 功能图标
    actions: {
      back: 'fas fa-arrow-left',
      close: 'fas fa-times',
      search: 'fas fa-search',
      more: 'fas fa-ellipsis-h',
      settings: 'fas fa-cog',
      edit: 'fas fa-edit',
      delete: 'fas fa-trash',
      copy: 'fas fa-copy',
      share: 'fas fa-share-alt',
      download: 'fas fa-download'
    },
    // 媒体控制图标
    media: {
      play: 'fas fa-play',
      pause: 'fas fa-pause',
      stop: 'fas fa-stop',
      record: 'fas fa-microphone',
      volume: 'fas fa-volume-up',
      mute: 'fas fa-volume-mute'
    },
    // 状态图标
    status: {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
      loading: 'fas fa-spinner'
    },
    // 社交图标
    social: {
      wechat: 'fab fa-weixin',
      qq: 'fab fa-qq',
      weibo: 'fab fa-weibo'
    }
  }
};

// 导出常用颜色快捷方式
export const colors = theme.colors;
export const fonts = theme.fonts;
export const spacing = theme.spacing;

export default theme;