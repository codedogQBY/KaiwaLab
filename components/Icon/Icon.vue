<template>
  <text 
    :class="iconClass"
    :style="iconStyle"
    @click="handleClick"
  ></text>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    // 图标名称（FontAwesome类名）
    name: {
      type: String,
      required: true
    },
    // 图标类型：fas(实心), far(空心), fab(品牌), fal(轻量), fad(双色调)
    type: {
      type: String,
      default: 'fas'
    },
    // 图标大小
    size: {
      type: [String, Number],
      default: '16px'
    },
    // 图标颜色
    color: {
      type: String,
      default: '#333333'
    },
    // 暗黑模式下的图标颜色
    darkColor: {
      type: String,
      default: '#E0E0E0'
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconClass() {
      return `${this.type} fa-${this.name}`;
    },
    iconStyle() {
      const size = typeof this.size === 'number' ? `${this.size}px` : this.size;
      return {
        fontSize: size,
        color: this.color,
        cursor: this.clickable ? 'pointer' : 'default',
        transition: 'color 0.3s ease'
      };
    }
  },
  methods: {
    handleClick(event) {
      if (this.clickable) {
        this.$emit('click', event);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/* FontAwesome 图标基础样式 */
.fas, .far, .fab, .fal, .fad {
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}

/* 悬停效果 */
.fas:hover, .far:hover, .fab:hover, .fal:hover, .fad:hover {
  opacity: 0.8;
}

/* 暗黑模式样式 */
.dark-theme .fas, .dark-theme .far, .dark-theme .fab, .dark-theme .fal, .dark-theme .fad {
  color: #E0E0E0;
}
</style>