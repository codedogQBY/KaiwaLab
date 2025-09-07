<template>
	<view class="spelling-practice-container">
		<!-- 标题栏 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="fa fa-arrow-left back-btn"></text>
			</view>
			<text class="header-title">拼写练习</text>
			<view class="header-right">
				<text class="fa fa-cog settings-btn" @click="showSettings"></text>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-wrapper">
			<!-- 练习进度 -->
			<view class="progress-section">
				<view class="progress-info">
					<text class="progress-text">{{ currentWordIndex + 1 }} / {{ spellingWords.length }}</text>
				</view>
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
				</view>
			</view>

			<!-- 拼写练习区域 -->
			<view class="spelling-area">
				<!-- 发音按钮 -->
				<view class="pronunciation-section">
					<button class="pronounce-btn" @click="playPronunciation">
						<text class="fa fa-volume-up"></text>
						<text class="btn-text">发音</text>
					</button>
				</view>

				<!-- 词汇显示 -->
				<view class="word-display">
					<text class="word-text">{{ currentWord.word }}</text>
					<text class="pronunciation-text">{{ currentWord.pronunciation }}</text>
				</view>

				<!-- 拼写输入 -->
				<view class="spelling-input-section">
					<view class="input-container">
						<input 
							class="spelling-input" 
							v-model="userInput" 
							placeholder="请输入日语词汇的拼写" 
							@confirm="checkSpelling"
							focus
						/>
					</view>
					<button class="check-btn" @click="checkSpelling">
						<text class="btn-text">检查</text>
					</button>
				</view>

				<!-- 结果反馈 -->
				<view v-if="showResult" class="result-section" :class="isCorrect ? 'correct' : 'incorrect'">
					<text :class="['fa', isCorrect ? 'fa-check-circle' : 'fa-times-circle', 'result-icon']"></text>
					<text class="result-text">{{ isCorrect ? '正确!' : '错误，请再试一次' }}</text>
					<view v-if="!isCorrect" class="correct-answer">
						<text class="answer-label">正确答案:</text>
						<text class="answer-text">{{ currentWord.word }}</text>
					</view>
				</view>
			</view>

			<!-- 操作按钮 -->
			<view class="action-buttons">
				<button class="action-btn skip-btn" @click="skipWord">
					<text class="fa fa-arrow-right"></text>
					<text class="btn-text">跳过</text>
				</button>
				<button class="action-btn next-btn" @click="nextWord" :disabled="!showResult">
					<text class="btn-text">下一题</text>
					<text class="fa fa-arrow-right"></text>
				</button>
			</view>

			<!-- 练习统计 -->
			<view class="stats-section">
				<view class="stats-grid">
					<view class="stat-item">
						<text class="stat-value">{{ stats.correct }}</text>
						<text class="stat-label">正确</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ stats.incorrect }}</text>
						<text class="stat-label">错误</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ Math.round((stats.correct / (stats.correct + stats.incorrect || 1)) * 100) }}%</text>
						<text class="stat-label">准确率</text>
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
						<text class="setting-label">显示假名提示</text>
						<switch :checked="showHint" @change="toggleHint" />
					</view>
					<view class="setting-item">
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
	name: 'SpellingPractice',
	data() {
		return {
			currentWordIndex: 0,
			userInput: '',
			showResult: false,
			isCorrect: false,
			showSettingsModal: false,
			showHint: true,
			autoPronounce: true,
			selectedRange: '今日复习',
			wordRanges: ['今日复习', '个人词库', '推荐词汇', '全部词汇'],
			stats: {
				correct: 0,
				incorrect: 0
			},
			spellingWords: [
				{
					word: 'こんにちは',
					romaji: 'konnichiwa',
					pronunciation: 'こんにちは (konnichiwa)',
					meaning: '你好',
					category: 'greeting'
				},
				{
					word: 'ありがとう',
					romaji: 'arigatou',
					pronunciation: 'ありがとう (arigatou)',
					meaning: '谢谢',
					category: 'greeting'
				},
				{
					word: 'いただきます',
					romaji: 'itadakimasu',
					pronunciation: 'いただきます (itadakimasu)',
					meaning: '我开动了',
					category: 'restaurant'
				},
				{
					word: 'おつかれさま',
					romaji: 'otsukaresama',
					pronunciation: 'おつかれさま (otsukaresama)',
					meaning: '辛苦了',
					category: 'work'
				},
				{
					word: 'すみません',
					romaji: 'sumimasen',
					pronunciation: 'すみません (sumimasen)',
					meaning: '不好意思/劳驾',
					category: 'general'
				}
			]
		}
	},
	computed: {
		currentWord() {
			return this.spellingWords[this.currentWordIndex] || {}
		},
		progressPercent() {
			if (this.spellingWords.length === 0) return 0
			return ((this.currentWordIndex + 1) / this.spellingWords.length) * 100
		}
	},
	mounted() {
		// 自动发音
		if (this.autoPronounce) {
			setTimeout(() => {
				this.playPronunciation()
			}, 500)
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		playPronunciation() {
			uni.showToast({
				title: `播放: ${this.currentWord.word}`,
				icon: 'none'
			})
		},
		checkSpelling() {
			if (!this.userInput.trim()) {
				uni.showToast({
					title: '请输入答案',
					icon: 'none'
				})
				return
			}
			
			this.showResult = true
			this.isCorrect = this.userInput.trim() === this.currentWord.word
			
			if (this.isCorrect) {
				this.stats.correct++
				uni.showToast({
					title: '正确!',
					icon: 'success'
				})
			} else {
				this.stats.incorrect++
				uni.showToast({
					title: '错误，请再试一次',
					icon: 'none'
				})
			}
		},
		nextWord() {
			if (this.currentWordIndex < this.spellingWords.length - 1) {
				this.currentWordIndex++
				this.resetWord()
				
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
		skipWord() {
			this.stats.incorrect++
			this.showResult = true
			this.isCorrect = false
			
			setTimeout(() => {
				this.nextWord()
			}, 1000)
		},
		resetWord() {
			this.userInput = ''
			this.showResult = false
			this.isCorrect = false
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
		toggleHint(e) {
			this.showHint = e.target.value
		},
		toggleAutoPronounce(e) {
			this.autoPronounce = e.target.value
		}
	}
}
</script>

<style lang="scss" scoped>
.spelling-practice-container {
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

/* 拼写练习区域 */
.spelling-area {
	background: white;
	border-radius: 24rpx;
	padding: 48rpx 32rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	text-align: center;
}

/* 发音按钮 */
.pronunciation-section {
	margin-bottom: 48rpx;

	.pronounce-btn {
		padding: 24rpx 48rpx;
		background: rgba(37, 99, 235, 0.1);
		color: #2563EB;
		border: none;
		border-radius: 16rpx;
		font-size: 28rpx;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		display: inline-flex;
		align-items: center;
		gap: 16rpx;

		&:hover {
			background: #E0E7FF;
		}

		.fa {
			font-size: 32rpx;
		}
	}
}

/* 词汇显示 */
.word-display {
	margin-bottom: 48rpx;

	.word-text {
		display: block;
		font-size: 64rpx;
		font-weight: 600;
		color: #1F2937;
		margin-bottom: 16rpx;
	}

	.pronunciation-text {
		display: block;
		font-size: 32rpx;
		color: #6B7280;
	}
}

/* 拼写输入 */
.spelling-input-section {
	margin-bottom: 48rpx;

	.input-container {
		margin-bottom: 32rpx;

		.spelling-input {
			width: 100%;
			padding: 24rpx;
			border: 2rpx solid #E5E7EB;
			border-radius: 16rpx;
			font-size: 32rpx;
			text-align: center;
			background: #F9FAFB;
			color: #1F2937;

			&:focus {
				border-color: #2563EB;
				outline: none;
			}

			&::placeholder {
				color: #9CA3AF;
			}
		}
	}

	.check-btn {
		width: 100%;
		padding: 24rpx;
		background: #2563EB;
		color: white;
		border: none;
		border-radius: 16rpx;
		font-size: 32rpx;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background: #4F46E5;
		}
	}
}

/* 结果反馈 */
.result-section {
	padding: 32rpx;
	border-radius: 16rpx;
	margin-bottom: 32rpx;

	&.correct {
		background: #D1FAE5;
		border: 2rpx solid #10B981;
	}

	&.incorrect {
		background: #FECACA;
		border: 2rpx solid #EF4444;
	}

	.result-icon {
		font-size: 48rpx;
		margin-bottom: 16rpx;

		&.fa-check-circle {
			color: #10B981;
		}

		&.fa-times-circle {
			color: #EF4444;
		}
	}

	.result-text {
		display: block;
		font-size: 32rpx;
		font-weight: 500;
		margin-bottom: 16rpx;
	}

	.correct-answer {
		.answer-label {
			font-size: 24rpx;
			color: #6B7280;
			margin-right: 8rpx;
		}

		.answer-text {
			font-size: 28rpx;
			font-weight: 500;
			color: #1F2937;
		}
	}
}

/* 操作按钮 */
.action-buttons {
	display: flex;
	gap: 24rpx;
	margin-bottom: 32rpx;

	.action-btn {
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
			margin: 0 8rpx;
			font-size: 24rpx;
		}

		&.skip-btn {
			background: #F3F4F6;
			color: #1F2937;

			&:hover:not(:disabled) {
				background: #E5E7EB;
			}
		}

		&.next-btn {
			background: #6366F1;
			color: white;

			&:hover:not(:disabled) {
				background: #4F46E5;
			}

			&:disabled {
				background: #C7D2FE;
				color: #E0E7FF;
				cursor: not-allowed;
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
				color: #EF4444;
			}

			&:nth-child(3) .stat-value {
				color: #6366F1;
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
.dark-theme .spelling-practice-container {
	background-color: #121212;
}

.dark-theme .header {
	background: #1F1F1F;
	border-bottom: 2rpx solid #3D3D3D;

	.back-btn,
	.settings-btn {
		color: #A0A0A0;

		&:hover {
			color: #6366F1;
		}
	}

	.header-title {
		color: #E0E0E0;
	}
}

.dark-theme .progress-section,
.dark-theme .spelling-area,
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

.dark-theme .word-text {
	color: #E0E0E0;
}

.dark-theme .pronunciation-text {
	color: #A0A0A0;
}

.dark-theme .spelling-input {
	background: #2D2D2D;
	border: 2rpx solid #3D3D3D;
	color: #E0E0E0;

	&:focus {
		border-color: #6366F1;
	}

	&::placeholder {
		color: #808080;
	}
}

.dark-theme .pronounce-btn {
	background: #3D3D3D;
	color: #6366F1;

	&:hover {
		background: #4D4D4D;
	}
}

.dark-theme .check-btn {
	background: #6366F1;
	color: white;

	&:hover {
		background: #4F46E5;
	}
}

.dark-theme .result-section.correct {
	background: #064E3B;
	border: 2rpx solid #10B981;
}

.dark-theme .result-section.incorrect {
	background: #7F1D1D;
	border: 2rpx solid #EF4444;
}

.dark-theme .result-text {
	color: #E0E0E0;
}

.dark-theme .answer-label {
	color: #A0A0A0;
}

.dark-theme .answer-text {
	color: #E0E0E0;
}

.dark-theme .action-btn.skip-btn {
	background: #2D2D2D;
	color: #E0E0E0;

	&:hover:not(:disabled) {
		background: #3D3D3D;
	}
}

.dark-theme .action-btn.next-btn {
	background: #6366F1;
	color: white;

	&:hover:not(:disabled) {
		background: #4F46E5;
	}

	&:disabled {
		background: #3D3D3D;
		color: #808080;
	}
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