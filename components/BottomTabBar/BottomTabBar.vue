<template>
  <view class="bottom-tab-bar" :style="tabBarStyle">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      :class="{ 'tab-item-active': currentIndex === index }"
      @click="switchTab(item, index)"
    >
      <!-- 图标容器 -->
      <view class="tab-icon-container">
        <!-- 使用字体图标 -->
        <text
          v-if="item.iconfont"
          class="tab-icon iconfont"
          :style="{
            color: currentIndex === index ? selectedColor : color,
            fontSize: iconSize,
          }"
        >
          <text :class="item.iconfont"></text>
        </text>
        
        <!-- 使用图片图标 -->
        <image 
          v-else-if="item.iconPath"
          class="tab-icon-image"
          :src="currentIndex === index && item.selectedIconPath ? item.selectedIconPath : item.iconPath"
          mode="aspectFit"
        ></image>
        
        <!-- 红点提示 -->
        <view v-if="item.badgeDot" class="tab-badge-dot"></view>
        
        <!-- 数字提示 -->
        <view v-else-if="item.badge" class="tab-badge">
          <text class="badge-text">{{ item.badge }}</text>
        </view>
      </view>
      
      <!-- 文字 -->
      <text 
        class="tab-text"
        :style="{
          color: currentIndex === index ? selectedColor : color
        }"
      >
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script>

export default {
  name: 'BottomTabBar',
  props: {
    // 当前选中的索引
    current: {
      type: Number,
      default: 0
    },
    // 标签列表
    list: {
      type: Array,
      default: () => []
    },
    // 默认颜色
    color: {
      type: String,
      default: '#6B7280'
    },
    // 选中颜色
    selectedColor: {
      type: String,
      default: '#3B82F6'
    },
    // 背景色
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    
    // 暗黑模式背景色
    darkBackgroundColor: {
      type: String,
      default: '#1F1F1F'
    },
    
    // 图标大小
    iconSize: {
      type: String,
      default: '32rpx'
    }
  },
  data() {
    return {
      currentIndex: this.current,
      // 默认标签配置
      defaultTabList: [
        {
          text: '首页',
          iconfont: 'fa fa-home',
          pagePath: '/pages/home/home'
        },
        {
          text: '实验台',
          iconfont: 'fa fa-flask',
          pagePath: '/pages/lab/lab'
        },
        {
          text: '学习库',
          iconfont: 'fa fa-book',
          pagePath: '/pages/library/library'
        },
        {
          text: '我的',
          iconfont: 'fa fa-user',
          pagePath: '/pages/profile/profile'
        }
      ]
    };
  },
  computed: {
    tabList() {
      return this.list.length > 0 ? this.list : this.defaultTabList;
    },
    tabBarStyle() {
      return {
        backgroundColor: this.backgroundColor,
        borderTopColor: '#E5E7EB'
      };
    }
  },
  watch: {
    current(newVal) {
      this.currentIndex = newVal;
    }
  },
  methods: {
    // 切换标签
    switchTab(item, index) {
      if (this.currentIndex === index) return;
      
      this.currentIndex = index;
      this.$emit('change', { item, index });
      
      // 如果有页面路径，进行跳转
      if (item.pagePath) {
        uni.switchTab({
          url: item.pagePath,
          fail: (err) => {
            console.error('Tab切换失败:', err);
            // 如果switchTab失败，尝试使用navigateTo
            uni.navigateTo({
              url: item.pagePath
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 2rpx solid;
  z-index: 998;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
  /* #ifdef H5 */
  padding-bottom: env(safe-area-inset-bottom);
  /* #endif */
  /* #ifdef APP-PLUS */
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  /* #endif */
}

/* 暗黑模式样式 */
.dark-theme .bottom-tab-bar {
  background: rgba(31, 31, 31, 0.95);
  border-top-color: #3D3D3D;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.3);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 8rpx 0;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:active {
    transform: scale(0.95);
  }
}

.tab-item-active {
  transform: translateY(-4rpx);
  
  .tab-icon,
  .tab-icon-image {
    transform: scale(1.1);
  }
  
  .tab-text {
    font-weight: 600;
  }
}

.tab-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rpx;
}

.tab-icon {
  font-size: 44rpx;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon-image {
  width: 44rpx;
  height: 44rpx;
  transition: all 0.3s ease;
}

.tab-text {
  font-size: 20rpx;
  font-weight: 500;
  line-height: 1.2;
  transition: all 0.3s ease;
  text-align: center;
}

/* 红点提示 */
.tab-badge-dot {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: #EF4444;
  border-radius: 50%;
  border: 4rpx solid #FFFFFF;
}

/* 数字提示 */
.tab-badge {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  background: linear-gradient(135deg, #EF4444, #DC2626);
  border-radius: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #FFFFFF;
  box-shadow: 0 4rpx 8rpx rgba(239, 68, 68, 0.3);
}

.badge-text {
  color: #FFFFFF;
  font-size: 18rpx;
  font-weight: 600;
  line-height: 1;
}

/* 字体图标支持 */
.iconfont {
  font-family: 'iconfont' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 适配安全区域 */
@supports (bottom: env(safe-area-inset-bottom)) {
  .bottom-tab-bar {
    height: calc(120rpx + env(safe-area-inset-bottom));
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .bottom-tab-bar {
    background: rgba(17, 24, 39, 0.95);
    border-top-color: #374151;
  }
}

/* 暗黑模式样式 */
.dark-theme .tab-text {
  color: #E0E0E0;
}

.dark-theme .tab-item-active .tab-text {
  color: #6366F1;
}

.dark-theme .tab-icon {
  color: #E0E0E0;
}

.dark-theme .tab-item-active .tab-icon {
  color: #6366F1;
}

.dark-theme .tab-badge-dot {
  border-color: #1F1F1F;
}

.dark-theme .tab-badge {
  border-color: #1F1F1F;
}

.dark-theme .badge-text {
  color: #FFFFFF;
}
</style>