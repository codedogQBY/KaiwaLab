<template>
  <view class="navigation-bar" :style="navigationStyle">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 导航栏内容 -->
    <view class="nav-content">
      <!-- 左侧按钮 -->
      <view class="nav-left" @click="handleLeftClick">
        <view v-if="showBack" class="nav-back">
          <text :class="theme.icons.actions.back + ' nav-icon'"></text>
        </view>
        <slot name="left"></slot>
      </view>
      
      <!-- 标题区域 -->
      <view class="nav-title">
        <text class="title-text" :style="titleStyle">{{ title }}</text>
        <slot name="title"></slot>
      </view>
      
      <!-- 右侧按钮 -->
      <view class="nav-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
import { theme, darkThemeColors, lightThemeColors } from '@/common/theme.js';

export default {
  name: 'NavigationBar',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 背景色
    backgroundColor: {
      type: String,
      default: lightThemeColors.bgPrimary
    },
    // 文字颜色
    textColor: {
      type: String,
      default: lightThemeColors.textPrimary
    },
    // 暗黑模式背景色
    darkBackgroundColor: {
      type: String,
      default: '#1F1F1F'
    },
    // 暗黑模式文字颜色
    darkTextColor: {
      type: String,
      default: '#E0E0E0'
    },
    // 是否显示返回按钮
    showBack: {
      type: Boolean,
      default: false
    },
    // 是否固定在顶部
    fixed: {
      type: Boolean,
      default: true
    },
    // 是否透明
    transparent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusBarHeight: 0
    };
  },
  computed: {
    navigationStyle() {
      return {
        backgroundColor: this.transparent ? 'transparent' : this.backgroundColor,
        position: this.fixed ? 'fixed' : 'relative',
        zIndex: this.fixed ? 999 : 'auto'
      };
    },
    titleStyle() {
      return {
        color: this.textColor,
        fontSize: theme.navigation.titleSize
      };
    }
  },
  mounted() {
    this.getSystemInfo();
  },
  methods: {
    // 获取系统信息
    getSystemInfo() {
      uni.getSystemInfo({
        success: (res) => {
          this.statusBarHeight = res.statusBarHeight || 0;
        }
      });
    },
    // 左侧按钮点击事件
    handleLeftClick() {
      if (this.showBack) {
        uni.navigateBack();
      }
      this.$emit('leftClick');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.navigation-bar {
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
}

.status-bar {
  width: 100%;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 32rpx;
  position: relative;
}

.nav-left {
  display: flex;
  align-items: center;
  min-width: 120rpx;
  justify-content: flex-start;
}

.nav-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
}

/* 暗黑模式样式 */
.dark-theme .nav-back {
  background-color: rgba(224, 224, 224, 0.1);
}

.nav-icon {
  font-size: 36rpx;
  color: #FFFFFF;
}

/* 暗黑模式样式 */
.dark-theme .nav-icon {
  color: #E0E0E0;
}

.nav-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-text {
  font-size: 36rpx;
  font-weight: 600;
  max-width: 400rpx;
  text-align: center;
  /* #ifndef APP-NVUE */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* #endif */
}

/* 暗黑模式样式 */
.dark-theme .title-text {
  color: #E0E0E0;
}

.nav-right {
  display: flex;
  align-items: center;
  min-width: 120rpx;
  justify-content: flex-end;
}
</style>