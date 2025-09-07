<template>
  <view class="flashcard-practice-container">
    <!-- 顶部导航栏 -->
    <view class="top-nav">
      <view class="nav-left" @click="goBack">
        <text class="fa fa-arrow-left"></text>
      </view>
      <text class="nav-title">闪卡练习</text>
      <view class="nav-right" @click="showSettings">
        <text class="fa fa-cog"></text>
      </view>
    </view>

    <!-- 主内容区域 -->
    <view class="main-content">
      <!-- 进度条 -->
      <view class="progress-container">
        <view class="progress-text">{{ currentWordIndex + 1 }} / {{ flashcardWords.length }}</view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
        </view>
      </view>

      <!-- 闪卡区域 -->
      <view class="flashcard-container">
        <view class="flashcard" :class="{ flipped: isFlipped }" @click="flipCard">
          <view class="flashcard-front">
            <text class="word-text">{{ currentWord.word }}</text>
            <text class="hint">点击翻转查看释义</text>
          </view>
          <view class="flashcard-back">
            <view class="back-content">
              <text class="pronunciation">{{ currentWord.pronunciation }}</text>
              <text class="meaning">{{ currentWord.meaning }}</text>
              <view class="category-tag" :class="currentWord.category">
                {{ currentWord.categoryName }}
              </view>
            </view>
            <text class="hint">点击返回正面</text>
          </view>
        </view>
      </view>

      <!-- 操作区域 -->
      <view class="action-area">
        <!-- 难度选择 -->
        <view class="difficulty-section">
          <text class="section-title">标记难度</text>
          <view class="difficulty-buttons">
            <button class="difficulty-btn hard" @click="markDifficulty('hard')">
              <text class="fa fa-times"></text>
              <text>困难</text>
            </button>
            <button class="difficulty-btn medium" @click="markDifficulty('medium')">
              <text class="fa fa-minus"></text>
              <text>一般</text>
            </button>
            <button class="difficulty-btn easy" @click="markDifficulty('easy')">
              <text class="fa fa-check"></text>
              <text>简单</text>
            </button>
          </view>
        </view>

        <!-- 功能按钮 -->
        <view class="function-buttons">
          <button class="function-btn listen" @click="playPronunciation">
            <text class="fa fa-volume-up"></text>
            <text>发音</text>
          </button>
          <button class="function-btn next" @click="nextWord">
            <text class="fa fa-arrow-right"></text>
            <text>下一个</text>
          </button>
        </view>
      </view>

      <!-- 统计信息 -->
      <view class="stats-container">
        <view class="stats-item">
          <text class="stats-value">{{ stats.easy }}</text>
          <text class="stats-label">简单</text>
        </view>
        <view class="stats-item">
          <text class="stats-value">{{ stats.medium }}</text>
          <text class="stats-label">一般</text>
        </view>
        <view class="stats-item">
          <text class="stats-value">{{ stats.hard }}</text>
          <text class="stats-label">困难</text>
        </view>
      </view>
    </view>

    <!-- 设置模态框 -->
    <view class="modal" v-if="showSettingsModal">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">练习设置</text>
          <text class="fa fa-times close-btn" @click="closeSettings"></text>
        </view>
        <view class="modal-body">
          <view class="setting-item">
            <text class="setting-label">词汇范围</text>
            <view class="custom-select" @click="toggleRangeDropdown">
              <text class="select-text">{{ selectedRange }}</text>
              <text class="fa fa-chevron-down select-arrow" :class="{ 'rotate': showRangeDropdown }"></text>
            </view>
            <view class="dropdown-options" v-if="showRangeDropdown">
              <view 
                class="option-item" 
                v-for="(range, index) in wordRanges" 
                :key="index"
                :class="{ 'active': range === selectedRange }"
                @click="selectRange(range)"
              >
                <text>{{ range }}</text>
              </view>
            </view>
          </view>
          <view class="setting-item switch-item">
            <text class="setting-label">自动翻转</text>
            <switch :checked="autoFlip" @change="toggleAutoFlip" />
          </view>
          <view class="setting-item switch-item">
            <text class="setting-label">自动发音</text>
            <switch :checked="autoPronounce" @change="toggleAutoPronounce" />
          </view>
        </view>
        <view class="modal-footer">
          <button class="confirm-btn" @click="closeSettings">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FlashcardPractice',
  data() {
    return {
      currentWordIndex: 0,
      isFlipped: false,
      showSettingsModal: false,
      showRangeDropdown: false,
      autoFlip: false,
      autoPronounce: true,
      selectedRange: '今日复习',
      wordRanges: ['今日复习', '个人词库', '推荐词汇', '全部词汇'],
      stats: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      flashcardWords: [
        {
          word: 'いらっしゃいませ',
          pronunciation: 'いらっしゃいませ (irasshaimase)',
          meaning: '欢迎光临',
          category: 'restaurant',
          categoryName: '餐厅用语'
        },
        {
          word: 'おすすめ',
          pronunciation: 'おすすめ (osusume)',
          meaning: '推荐',
          category: 'restaurant',
          categoryName: '餐厅用语'
        },
        {
          word: '会計',
          pronunciation: 'かいけい (kaikei)',
          meaning: '结账',
          category: 'restaurant',
          categoryName: '餐厅用语'
        },
        {
          word: 'お土産',
          pronunciation: 'おみやげ (omiyage)',
          meaning: '礼品，土特产',
          category: 'shopping',
          categoryName: '购物'
        },
        {
          word: '免税',
          pronunciation: 'めんぜい (menzei)',
          meaning: '免税',
          category: 'shopping',
          categoryName: '购物'
        }
      ]
    }
  },
  computed: {
    currentWord() {
      return this.flashcardWords[this.currentWordIndex] || {}
    },
    progressPercent() {
      if (this.flashcardWords.length === 0) return 0
      return ((this.currentWordIndex + 1) / this.flashcardWords.length) * 100
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    flipCard() {
      this.isFlipped = !this.isFlipped
    },
    markDifficulty(difficulty) {
      this.stats[difficulty]++
      uni.showToast({
        title: difficulty === 'easy' ? '标记为简单' : difficulty === 'medium' ? '标记为一般' : '标记为困难',
        icon: 'none'
      })
      this.nextWord()
    },
    nextWord() {
      if (this.currentWordIndex < this.flashcardWords.length - 1) {
        this.currentWordIndex++
        this.isFlipped = false
        
        // 自动发音
        if (this.autoPronounce) {
          setTimeout(() => {
            this.playPronunciation()
          }, 500)
        }
      } else {
        uni.showToast({
          title: '练习完成！',
          icon: 'success'
        })
      }
    },
    playPronunciation() {
      uni.showToast({
        title: `播放: ${this.currentWord.word}`,
        icon: 'none'
      })
    },
    showSettings() {
      this.showSettingsModal = true
    },
    closeSettings() {
      this.showSettingsModal = false
      this.showRangeDropdown = false
    },
    toggleRangeDropdown() {
      this.showRangeDropdown = !this.showRangeDropdown
    },
    selectRange(range) {
      this.selectedRange = range
      this.showRangeDropdown = false
      uni.showToast({
        title: `切换到: ${range}`,
        icon: 'none'
      })
    },
    toggleAutoFlip(e) {
      this.autoFlip = e.target.value
    },
    toggleAutoPronounce(e) {
      this.autoPronounce = e.target.value
    }
  }
}
</script>

<style lang="scss" scoped>
.flashcard-practice-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-top: calc(88rpx + var(--status-bar-height));
  padding-bottom: 32rpx;
  box-sizing: border-box;
}

/* 顶部导航栏 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: calc(88rpx + var(--status-bar-height));
  padding-top: var(--status-bar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
  padding: 0 32rpx;

  .nav-left,
  .nav-right {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    color: #6b7280;
    cursor: pointer;
  }

  .nav-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #1f2937;
  }
}

/* 主内容区域 */
.main-content {
  padding: 0 32rpx;
}

/* 进度条 */
.progress-container {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);

  .progress-text {
    font-size: 28rpx;
    color: #6b7280;
    text-align: center;
    margin-bottom: 16rpx;
  }

  .progress-bar {
    width: 100%;
    height: 12rpx;
    background: #e5e7eb;
    border-radius: 6rpx;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: #6366f1;
      border-radius: 6rpx;
      transition: width 0.3s ease;
    }
  }
}

/* 闪卡区域 */
.flashcard-container {
  perspective: 1000px;
  margin-bottom: 32rpx;

  .flashcard {
    width: 100%;
    aspect-ratio: 1.6/1;
    max-height: 500rpx;
    min-height: 300rpx;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s;
    cursor: pointer;
    border-radius: 24rpx;
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);

    &.flipped {
      transform: rotateY(180deg);
    }

    .flashcard-front,
    .flashcard-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40rpx;
      box-sizing: border-box;
    }

    .flashcard-front {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;

      .word-text {
        font-size: 64rpx;
        font-weight: 600;
        margin-bottom: 32rpx;
        text-align: center;
      }

      .hint {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .flashcard-back {
      background: #ffffff;
      color: #1f2937;
      transform: rotateY(180deg);
      display: flex;
      flex-direction: column;

      .back-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;

        .pronunciation {
          font-size: 32rpx;
          color: #6b7280;
          margin-bottom: 16rpx;
        }

        .meaning {
          font-size: 48rpx;
          font-weight: 600;
          margin-bottom: 32rpx;
          text-align: center;
        }

        .category-tag {
          padding: 8rpx 24rpx;
          border-radius: 24rpx;
          font-size: 24rpx;
          margin-bottom: 32rpx;

          &.restaurant {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
          }

          &.shopping {
            background: rgba(99, 102, 241, 0.1);
            color: #6366f1;
          }

          &.travel {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
          }
        }
      }

      .hint {
        font-size: 24rpx;
        color: #9ca3af;
        position: absolute;
        bottom: 24rpx;
      }
    }
  }
}

/* 操作区域 */
.action-area {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);

  .section-title {
    display: block;
    font-size: 32rpx;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 24rpx;
  }

  .difficulty-section {
    margin-bottom: 32rpx;
  }

  .difficulty-buttons {
    display: flex;
    gap: 24rpx;

    .difficulty-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24rpx;
      border-radius: 16rpx;
      font-size: 24rpx;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;

      .fa {
        font-size: 32rpx;
        margin-bottom: 8rpx;
      }

      &.hard {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;

        &:hover {
          background: rgba(239, 68, 68, 0.2);
        }
      }

      &.medium {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;

        &:hover {
          background: rgba(245, 158, 11, 0.2);
        }
      }

      &.easy {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;

        &:hover {
          background: rgba(16, 185, 129, 0.2);
        }
      }
    }
  }

  .function-buttons {
    display: flex;
    gap: 24rpx;

    .function-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24rpx;
      border-radius: 16rpx;
      font-size: 28rpx;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;

      .fa {
        font-size: 32rpx;
        margin-right: 16rpx;
      }

      &.listen {
        background: rgba(99, 102, 241, 0.1);
        color: #6366f1;

        &:hover {
          background: rgba(99, 102, 241, 0.2);
        }
      }

      &.next {
        background: #8b5cf6;
        color: white;

        &:hover {
          background: #7c3aed;
        }
      }
    }
  }
}

/* 统计信息 */
.stats-container {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);

  .stats-item {
    text-align: center;
    flex: 1;

    .stats-value {
      display: block;
      font-size: 40rpx;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8rpx;
    }

    .stats-label {
      font-size: 24rpx;
      color: #6b7280;
    }

    &:nth-child(1) .stats-value {
      color: #10b981;
    }

    &:nth-child(2) .stats-value {
      color: #f59e0b;
    }

    &:nth-child(3) .stats-value {
      color: #ef4444;
    }
  }
}



@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(16rpx) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 暗黑模式样式 */
.dark-theme .flashcard-practice-container {
  background-color: #121212;
}

.dark-theme .top-nav {
  background: #1f1f1f;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);

  .nav-left,
  .nav-right {
    color: #a0a0a0;
  }

  .nav-title {
    color: #e0e0e0;
  }
}

.dark-theme .progress-container,
.dark-theme .action-area,
.dark-theme .stats-container {
  background: #1f1f1f;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.dark-theme .progress-text {
  color: #CCCCCC;
}

.dark-theme .progress-bar {
  background: #3d3d3d;
}

.dark-theme .progress-fill {
  background: #6366f1;
}

.dark-theme .flashcard-front {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.dark-theme .flashcard-back {
  background: #1f1f1f;
  color: #e0e0e0;
}

.dark-theme .flashcard-back .hint {
  color: #808080;
}

.dark-theme .pronunciation {
  color: #a0a0a0;
}

.dark-theme .category-tag.restaurant {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.dark-theme .category-tag.shopping {
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
}

.dark-theme .category-tag.travel {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.dark-theme .section-title {
  color: #FFFFFF;
}

.dark-theme .stats-value {
  color: #FFFFFF;
}

.dark-theme .stats-label {
  color: #CCCCCC;
}

/* 设置模态框 */
.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(8rpx);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	animation: modalFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	.modal-content {
		width: 90%;
		max-width: 520rpx;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20rpx);
		border-radius: 28rpx;
		overflow: visible;
		box-shadow: 0 32rpx 80rpx rgba(0, 0, 0, 0.12), 0 0 0 1rpx rgba(255, 255, 255, 0.1);
		animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 36rpx 36rpx 28rpx;
			background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(255, 255, 255, 0.8) 100%);
			border-bottom: 1rpx solid rgba(37, 99, 235, 0.08);

			.modal-title {
				font-size: 34rpx;
				font-weight: 700;
				color: #1e293b;
				letter-spacing: -0.8rpx;
			}

			.close-btn {
				width: 44rpx;
				height: 44rpx;
				border-radius: 50%;
				background: rgba(148, 163, 184, 0.08);
				color: #64748b;
				font-size: 26rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				border: 1rpx solid rgba(148, 163, 184, 0.1);

				&:hover {
					background: rgba(239, 68, 68, 0.08);
					color: #ef4444;
					transform: scale(1.05);
					border-color: rgba(239, 68, 68, 0.2);
				}
			}
		}

		.modal-body {
			padding: 36rpx;
			background: rgba(255, 255, 255, 0.6);
			overflow: visible;

			.setting-item {
				position: relative;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 32rpx;
				padding: 28rpx;
				background: rgba(255, 255, 255, 0.7);
				border-radius: 20rpx;
				border: 1rpx solid rgba(37, 99, 235, 0.06);
				transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
				backdrop-filter: blur(10rpx);
				min-height: auto;
				overflow: visible;

				&:last-child {
					margin-bottom: 0;
				}

				&:hover {
					transform: translateY(-4rpx);
					box-shadow: 0 16rpx 40rpx rgba(37, 99, 235, 0.08);
					border-color: rgba(37, 99, 235, 0.12);
					background: rgba(255, 255, 255, 0.85);
				}

				&.switch-item {
					switch {
						transform: scale(0.8);
					}
				}

				.setting-label {
					font-size: 30rpx;
					font-weight: 600;
					color: #1e293b;
					letter-spacing: -0.5rpx;
				}

				.custom-select {
					position: relative;
					padding: 16rpx 20rpx;
					border: 2rpx solid rgba(37, 99, 235, 0.1);
					border-radius: 16rpx;
					font-size: 26rpx;
					font-weight: 500;
					color: #64748b;
					background: rgba(255, 255, 255, 0.8);
					min-width: 140rpx;
					cursor: pointer;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					backdrop-filter: blur(10rpx);
					display: flex;
					align-items: center;
					justify-content: space-between;

					&:hover {
						background: rgba(37, 99, 235, 0.04);
						border-color: rgba(37, 99, 235, 0.2);
						color: #2563eb;
						transform: translateY(-2rpx);
					}

					.select-text {
						flex: 1;
						text-align: center;
					}

					.select-arrow {
						font-size: 20rpx;
						transition: transform 0.3s ease;
						margin-left: 12rpx;

						&.rotate {
							transform: rotate(180deg);
						}
					}
				}

				.dropdown-options {
					position: absolute;
					bottom: 100%;
					left: 0;
					right: 0;
					z-index: 9999;
					margin-bottom: 8rpx;
					background: rgba(255, 255, 255, 0.95);
					border: 2rpx solid rgba(37, 99, 235, 0.1);
					border-radius: 16rpx;
					box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
					backdrop-filter: blur(20rpx);
					overflow: hidden;
					animation: dropdownSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

					.option-item {
						padding: 20rpx 24rpx;
						font-size: 26rpx;
						color: #64748b;
						cursor: pointer;
						transition: all 0.2s ease;
						border-bottom: 1rpx solid rgba(37, 99, 235, 0.05);

						&:last-child {
							border-bottom: none;
						}

						&:hover {
							background: rgba(37, 99, 235, 0.06);
							color: #2563eb;
						}

						&.active {
							background: rgba(37, 99, 235, 0.1);
							color: #2563eb;
							font-weight: 600;
						}
					}
				}
			}
		}

		.modal-footer {
			padding: 28rpx 36rpx 36rpx;
			background: linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(255, 255, 255, 0.9) 100%);
			border-top: 1rpx solid rgba(37, 99, 235, 0.08);
			text-align: center;

			.confirm-btn {
				width: 100%;
				padding: 20rpx 36rpx;
				background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
				color: white;
				border: none;
				border-radius: 16rpx;
				font-size: 30rpx;
				font-weight: 600;
				cursor: pointer;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.25);
				letter-spacing: -0.5rpx;

				&:hover {
					background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
					transform: translateY(-3rpx);
					box-shadow: 0 12rpx 32rpx rgba(37, 99, 235, 0.35);
				}

				&:active {
					transform: translateY(-1rpx);
				}
			}
		}
	}
}



/* 暗黑模式 */
.flashcard-practice-container.dark {
	background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
	color: #e2e8f0;

	.top-nav {
		background: rgba(15, 23, 42, 0.8);
		border-bottom-color: rgba(148, 163, 184, 0.1);

		.back-btn {
			color: #94a3b8;

			&:hover {
				background: rgba(148, 163, 184, 0.1);
				color: #e2e8f0;
			}
		}

		.nav-title {
			color: #e2e8f0;
		}
	}

	.main-content {
		.progress-section {
			.progress-bar {
				background: rgba(30, 41, 59, 0.6);

				.progress-fill {
					background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
				}
			}

			.progress-text {
				color: #94a3b8;
			}
		}

		.flashcard-area {
			.flashcard {
				background: rgba(30, 41, 59, 0.6);
				border-color: rgba(148, 163, 184, 0.1);

				.word-display {
					color: #e2e8f0;
				}

				.translation {
					color: #94a3b8;
				}
			}
		}

		.action-area {
			.action-btn {
				background: rgba(30, 41, 59, 0.6);
				border-color: rgba(148, 163, 184, 0.1);
				color: #94a3b8;

				&:hover {
					background: rgba(37, 99, 235, 0.1);
					border-color: rgba(37, 99, 235, 0.3);
					color: #3b82f6;
				}

				&.primary {
					background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
					color: white;

					&:hover {
						background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
					}
				}

				&.difficulty {
					&:hover {
						background: rgba(239, 68, 68, 0.1);
						border-color: rgba(239, 68, 68, 0.3);
						color: #ef4444;
					}
				}
			}
		}

		.stats-section {
			.stat-item {
				background: rgba(30, 41, 59, 0.4);
				border-color: rgba(148, 163, 184, 0.1);

				.stat-value {
					color: #3b82f6;
				}

				.stat-label {
					color: #94a3b8;
				}
			}
		}
	}

	.modal {
		background: rgba(0, 0, 0, 0.8);

		.modal-content {
			background: rgba(15, 23, 42, 0.95);
			border: 1rpx solid rgba(148, 163, 184, 0.1);

			.modal-header {
				background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(15, 23, 42, 0.9) 100%);
				border-bottom-color: rgba(148, 163, 184, 0.1);

				.modal-title {
					color: #e2e8f0;
				}

				.close-btn {
					background: rgba(148, 163, 184, 0.1);
					color: #94a3b8;
					border-color: rgba(148, 163, 184, 0.2);

					&:hover {
						background: rgba(239, 68, 68, 0.1);
						color: #ef4444;
						border-color: rgba(239, 68, 68, 0.3);
					}
				}
			}

			.modal-body {
				background: rgba(15, 23, 42, 0.6);

				.setting-item {
						background: rgba(30, 41, 59, 0.7);
						border-color: rgba(148, 163, 184, 0.1);

						&:hover {
							background: rgba(30, 41, 59, 0.9);
							border-color: rgba(37, 99, 235, 0.3);
							box-shadow: 0 16rpx 40rpx rgba(37, 99, 235, 0.1);
						}

						&.switch-item {
							switch {
								transform: scale(0.8);
							}
						}

						.setting-label {
							color: #e2e8f0;
						}

					.custom-select {
						background: rgba(30, 41, 59, 0.8);
						border-color: rgba(148, 163, 184, 0.2);
						color: #94a3b8;

						&:hover {
							background: rgba(37, 99, 235, 0.1);
							border-color: rgba(37, 99, 235, 0.4);
							color: #3b82f6;
						}
					}

					.dropdown-options {
						background: rgba(15, 23, 42, 0.95);
						border-color: rgba(148, 163, 184, 0.2);

						.option-item {
							color: #94a3b8;
							border-bottom-color: rgba(148, 163, 184, 0.1);

							&:hover {
								background: rgba(37, 99, 235, 0.1);
								color: #3b82f6;
							}

							&.active {
								background: rgba(37, 99, 235, 0.2);
								color: #3b82f6;
							}
						}
					}
				}
			}

			.modal-footer {
				background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(15, 23, 42, 0.9) 100%);
				border-top-color: rgba(148, 163, 184, 0.1);

				.confirm-btn {
					background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);

					&:hover {
						background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
					}
				}
			}
		}
	}
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10rpx) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 暗黑模式下的模态框样式 */
.dark-theme .modal {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12rpx);

  .modal-content {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(24rpx);
    box-shadow: 0 32rpx 80rpx rgba(0, 0, 0, 0.4), 0 0 0 1rpx rgba(148, 163, 184, 0.1);

    .modal-header {
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%);
      border-bottom: 1rpx solid rgba(148, 163, 184, 0.1);

      .modal-title {
        color: #f1f5f9;
      }

      .close-btn {
        background: rgba(148, 163, 184, 0.1);
        color: #94a3b8;
        border-color: rgba(148, 163, 184, 0.15);

        &:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.3);
        }
      }
    }

    .modal-body {
      background: rgba(15, 23, 42, 0.6);

      .setting-item {
        background: rgba(30, 41, 59, 0.8);
        border-color: rgba(148, 163, 184, 0.08);
		display: flex;
		align-items: center;
		justify-content: space-between;

        &:hover {
          background: rgba(30, 41, 59, 0.95);
          box-shadow: 0 16rpx 40rpx rgba(37, 99, 235, 0.15);
          border-color: rgba(37, 99, 235, 0.2);
        }

        .setting-label {
          color: #e2e8f0;
        }

        .custom-select {
          background: rgba(30, 41, 59, 0.9);
          color: #cbd5e1;
          border-color: rgba(148, 163, 184, 0.15);

          &:hover {
            background: rgba(37, 99, 235, 0.1);
            border-color: rgba(37, 99, 235, 0.3);
            color: #60a5fa;
          }

          .select-arrow {
            color: #94a3b8;
          }
        }

        .dropdown-options {
          background: rgba(15, 23, 42, 0.98);
          border-color: rgba(148, 163, 184, 0.15);
          box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.3);

          .option-item {
            color: #cbd5e1;
            border-bottom-color: rgba(148, 163, 184, 0.08);

            &:hover {
              background: rgba(37, 99, 235, 0.15);
              color: #60a5fa;
            }

            &.active {
              background: rgba(37, 99, 235, 0.2);
              color: #60a5fa;
            }
          }
        }
      }
    }

    .modal-footer {
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(15, 23, 42, 0.95) 100%);
      border-top: 1rpx solid rgba(148, 163, 184, 0.1);

      .confirm-btn {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.4);

        &:hover {
          background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
          box-shadow: 0 12rpx 32rpx rgba(37, 99, 235, 0.5);
        }
      }
    }
  }
}
</style>