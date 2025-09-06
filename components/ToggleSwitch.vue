<template>
  <view class="toggle-switch" :class="{ active: value }" @click="toggle">
    <view class="toggle-thumb"></view>
  </view>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggle() {
      if (!this.disabled) {
        this.$emit('input', !this.value);
        this.$emit('change', !this.value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.toggle-switch {
  width: 44px;
  height: 24px;
  background-color: #E5E7EB;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &.active {
    background-color: #2563EB;
  }
  
  .toggle-thumb {
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &.active .toggle-thumb {
    transform: translateX(20px);
  }
  
  &:active .toggle-thumb {
    transform: scale(1.1);
  }
  
  &.active:active .toggle-thumb {
    transform: translateX(20px) scale(1.1);
  }
}
</style>