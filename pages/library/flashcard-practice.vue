<template>
	<view class="flashcard-practice-container">
		<!-- 标题栏 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="fa fa-arrow-left back-btn"></text>
			</view>
			<text class="header-title">闪卡练习</text>
			<view class="header-right">
				<text class="fa fa-cog settings-btn" @click="showSettings"></text>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-wrapper">
			<!-- 练习进度 -->
			<view class="progress-section">
				<view class="progress-info">
					<text class="progress-text">{{ currentWordIndex + 1 }} / {{ flashcardWords.length }}</text>
				</view>
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
				</view>
			</view>

			<!-- 闪卡区域 -->
			<view class="flashcard-area">
				<view class="flashcard" :class="{ flipped: isFlipped }" @click="flipCard">
					<view class="flashcard-front">
						<text class="word-text">{{ currentWord.word }}</text>
						<text class="hint-text">点击翻转卡片</text>
					</view>
					<view class="flashcard-back">
						<text class="pronunciation-text">{{ currentWord.pronunciation }}</text>
						<text class="meaning-text">{{ currentWord.meaning }}</text>
						<view class="category-tag" :class="currentWord.category">
							<text class="tag-text">{{ currentWord.categoryName }}</text>
						</view>
						<text class="hint-text">点击返回正面</text>
					</view>
				</view>
			</view>

			<!-- 操作按钮 -->
			<view class="action-buttons">
				<view class="button-row">
					<button class="action-btn hard-btn" @click="markDifficulty('hard')">
						<text class="fa fa-times"></text>
						<text class="btn-text">困难</text>
					</button>
					<button class="action-btn medium-btn" @click="markDifficulty('medium')">
						<text class="fa fa-minus"></text>
						<text class="btn-text">一般</text>
					</button>
					<button class="action-btn easy-btn" @click="markDifficulty('easy')">
						<text class="fa fa-check"></text>
						<text class="btn-text">简单</text>
					</button>
				</view>
				<view class="button-row">
					<button class="action-btn listen-btn" @click="playPronunciation">
						<text class="fa fa-volume-up"></text>
						<text class="btn-text">发音</text>
					</button>
					<button class="action-btn next-btn" @click="nextWord">
						<text class="fa fa-arrow-right"></text>
						<text class="btn-text">下一个</text>
					</button>
				</view>
			</view>

			<!-- 练习统计 -->
			<view class="stats-section">
				<view class="stats-grid">
					<view class="stat-item">
						<text class="stat-value">{{ stats.easy }}</text>
						<text class="stat-label">简单</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ stats.medium }}</text>
						<text class="stat-label">一般</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ stats.hard }}</text>
						<text class="stat-label">困难</text>
					</view>
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
						<picker mode="selector" :range="wordRanges" @change="onRangeChange">
							<view class="picker">
								<text>{{ selectedRange }}</text>
							</view>
						</picker>
					</view>
					<view class="setting-item">
						<text class="setting-label">卡片翻转</text>
						<switch :checked="autoFlip" @change="toggleAutoFlip" />
					</view>
					<view class="setting-item">
						<text class="setting-label">发音播放</text>
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
		},
		onRangeChange(e) {
			const selectedIndex = e.detail.value
			this.selectedRange = this.wordRanges[selectedIndex]
			uni.showToast({
				title: `切换到: ${this.selectedRange}`,
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
	background-color: #f9fafb;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	background: white;
	border-bottom: 2rpx solid #E5E7EB;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;

	.header-left,
	.header-right {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-btn,
	.settings-btn {
		color: #6B7280;
		font-size: 36rpx;
		cursor: pointer;
		transition: color 0.2s;

		&:hover {
			color: #007AFF;
		}
	}

	.header-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #1F2937;
	}
}

.content-wrapper {
	margin-top: 120rpx;
	padding: 32rpx;
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}

/* 练习进度 */
.progress-section {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

	.progress-info {
		text-align: center;
		margin-bottom: 16rpx;

		.progress-text {
			font-size: 28rpx;
			color: #6B7280;
			font-weight: 500;
		}
	}

	.progress-bar {
		width: 100%;
		height: 16rpx;
		background: #E5E7EB;
		border-radius: 8rpx;
		overflow: hidden;

		.progress-fill {
			height: 100%;
			background: #2563EB;
			border-radius: 8rpx;
			transition: width 0.3s ease;
		}
	}
}

/* 闪卡区域 */
.flashcard-area {
	perspective: 1000px;
	margin-bottom: 32rpx;

	.flashcard {
		width: 100%;
		height: 400rpx;
		position: relative;
		transform-style: preserve-3d;
		transition: transform 0.6s;
		cursor: pointer;

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
			box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
		}

		.flashcard-front {
			background: linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%);
			color: white;

			.word-text {
				font-size: 64rpx;
				font-weight: 600;
				margin-bottom: 32rpx;
				text-align: center;
			}
		}

		.flashcard-back {
			background: white;
			color: #1F2937;
			transform: rotateY(180deg);

			.pronunciation-text {
				font-size: 36rpx;
				color: #6B7280;
				margin-bottom: 16rpx;
			}

			.meaning-text {
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
					background: #FED7AA;
					color: #EA580C;
				}

				&.shopping {
					background: #DBEAFE;
					color: #2563EB;
				}

				&.travel {
					background: #D1FAE5;
					color: #059669;
				}
			}
		}

		.hint-text {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
			position: absolute;
			bottom: 24rpx;
		}

		.flashcard-back .hint-text {
			color: #9CA3AF;
		}
	}
}

/* 操作按钮 */
.action-buttons {
	margin-bottom: 32rpx;

	.button-row {
		display: flex;
		gap: 24rpx;
		margin-bottom: 24rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.action-btn {
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

			.btn-text {
				font-size: 24rpx;
			}

			&.hard-btn {
				background: #FECACA;
				color: #DC2626;

				&:hover {
					background: #FCA5A5;
				}
			}

			&.medium-btn {
				background: #FEF3C7;
				color: #D97706;

				&:hover {
					background: #FDE68A;
				}
			}

			&.easy-btn {
				background: #D1FAE5;
				color: #059669;

				&:hover {
					background: #A7F3D0;
				}
			}

			&.listen-btn {
				background: #DBEAFE;
				color: #2563EB;

				&:hover {
					background: #BFDBFE;
				}
			}

			&.next-btn {
				background: #6366F1;
				color: white;

				&:hover {
					background: #4F46E5;
				}
			}
		}
	}
}

/* 练习统计 */
.stats-section {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

	.stats-grid {
		display: flex;
		justify-content: space-between;

		.stat-item {
			text-align: center;
			flex: 1;

			.stat-value {
				display: block;
				font-size: 40rpx;
				font-weight: 600;
				color: #1F2937;
				margin-bottom: 8rpx;
			}

			.stat-label {
				font-size: 24rpx;
				color: #6B7280;
			}

			&:nth-child(1) .stat-value {
				color: #10B981;
			}

			&:nth-child(2) .stat-value {
				color: #F59E0B;
			}

			&:nth-child(3) .stat-value {
				color: #EF4444;
			}
		}
	}
}

/* 设置模态框 */
.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;

	.modal-content {
		width: 90%;
		max-width: 600rpx;
		background: white;
		border-radius: 24rpx;
		overflow: hidden;

		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx;
			border-bottom: 2rpx solid #E5E7EB;

			.modal-title {
				font-size: 36rpx;
				font-weight: 600;
				color: #1F2937;
			}

			.close-btn {
				color: #9CA3AF;
				font-size: 36rpx;
				cursor: pointer;
				transition: color 0.2s;

				&:hover {
					color: #6B7280;
				}
			}
		}

		.modal-body {
			padding: 32rpx;

			.setting-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 32rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.setting-label {
					font-size: 28rpx;
					color: #1F2937;
					font-weight: 500;
				}

				.picker {
					padding: 16rpx 24rpx;
					border: 2rpx solid #E5E7EB;
					border-radius: 16rpx;
					font-size: 28rpx;
					color: #1F2937;
					background: #F9FAFB;
				}
			}
		}

		.modal-footer {
			padding: 32rpx;
			border-top: 2rpx solid #E5E7EB;
			text-align: right;

			.confirm-btn {
				padding: 24rpx 32rpx;
				background: #007AFF;
				color: white;
				border: none;
				border-radius: 16rpx;
				font-size: 28rpx;
				font-weight: 500;
				cursor: pointer;
				transition: all 0.2s;

				&:hover {
					background: #1D4ED8;
				}
			}
		}
	}
}

/* 暗黑模式样式 */
.dark-theme .flashcard-practice-container {
	background-color: #121212;
}

.dark-theme .header {
	background: #1F1F1F;
	border-bottom: 2rpx solid #3D3D3D;

	.back-btn,
	.settings-btn {
		color: #A0A0A0;

		&:hover {
			color: #2563EB;
		}
	}

	.header-title {
		color: #E0E0E0;
	}
}

.dark-theme .progress-section,
.dark-theme .stats-section {
	background: #1F1F1F;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

.dark-theme .progress-text {
	color: #A0A0A0;
}

.dark-theme .progress-bar {
	background: #3D3D3D;
}

.dark-theme .progress-fill {
	background: #6366F1;
}

.dark-theme .flashcard-front {
	background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
}

.dark-theme .flashcard-back {
	background: #1F1F1F;
	color: #E0E0E0;
}

.dark-theme .pronunciation-text {
	color: #A0A0A0;
}

.dark-theme .category-tag.restaurant {
	background: #3D3D3D;
	color: #F97316;
}

.dark-theme .category-tag.shopping {
	background: #3D3D3D;
	color: #60A5FA;
}

.dark-theme .category-tag.travel {
	background: #3D3D3D;
	color: #34D399;
}

.dark-theme .flashcard-back .hint-text {
	color: #808080;
}

.dark-theme .stat-value {
	color: #E0E0E0;
}

.dark-theme .stat-label {
	color: #A0A0A0;
}

.dark-theme .modal-content {
	background: #1F1F1F;

	.modal-header {
		border-bottom: 2rpx solid #3D3D3D;

		.modal-title {
			color: #E0E0E0;
		}

		.close-btn {
			color: #808080;

			&:hover {
				color: #A0A0A0;
			}
		}
	}

	.setting-label {
		color: #E0E0E0;
	}

	.picker {
		border: 2rpx solid #3D3D3D;
		background: #2D2D2D;
		color: #E0E0E0;
	}

	.modal-footer {
		border-top: 2rpx solid #3D3D3D;
	}
}
</style>