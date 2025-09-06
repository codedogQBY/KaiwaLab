<template>
  <BottomTabBar 
    :current="current" 
    :list="tabList"
    @change="onTabChange"
  />
</template>

<script>
import BottomTabBar from '../BottomTabBar/BottomTabBar.vue'

export default {
  name: 'UniTabbar',
  components: {
    BottomTabBar
  },
  data() {
    return {
      current: 0,
      tabList: [
        {
          text: '首页',
          iconfont: 'icon-home',
          pagePath: '/pages/home/home'
        },
        {
          text: '实验台',
          iconfont: 'icon-experiment',
          pagePath: '/pages/lab/lab'
        },
        {
          text: '学习库',
          iconfont: 'icon-library',
          pagePath: '/pages/library/library'
        },
        {
          text: '我的',
          iconfont: 'icon-user',
          pagePath: '/pages/profile/profile'
        }
      ]
    }
  },
  created() {
    // 监听页面切换事件
    uni.$on('tabbar-change', (index) => {
      this.current = index
    })
  },
  beforeDestroy() {
    uni.$off('tabbar-change')
  },
  methods: {
    onTabChange(e) {
      const { item, index } = e
      this.current = index
      
      // 页面跳转
      if (item.pagePath) {
        uni.switchTab({
          url: item.pagePath,
          success: () => {
            // 通知其他页面更新tabbar状态
            uni.$emit('tabbar-change', index)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
/* 自定义tabbar样式 */
</style>