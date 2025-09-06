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
import { theme } from '@/common/theme.js';

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
      default: theme.navigation.backgroundColor
    },
    // 文字颜色
    textColor: {
      type: String,
      default: theme.navigation.textColor
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
  height: 44px;
  padding: 0 16px;
  position: relative;
}

.nav-left {
  display: flex;
  align-items: center;
  min-width: 60px;
  justify-content: flex-start;
}

.nav-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-icon {
  font-size: 18px;
  color: #FFFFFF;
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
  font-size: 18px;
  font-weight: 600;
  max-width: 200px;
  text-align: center;
  /* #ifndef APP-NVUE */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* #endif */
}

.nav-right {
  display: flex;
  align-items: center;
  min-width: 60px;
  justify-content: flex-end;
}
</style>