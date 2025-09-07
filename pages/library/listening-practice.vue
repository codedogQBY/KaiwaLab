<template>
	<view class="listening-practice-container">
		<!-- 标题栏 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="fa fa-arrow-left back-btn"></text>
			</view>
			<text class="header-title">听力练习</text>
			<view class="header-right">
				<text class="fa fa-cog settings-btn" @click="showSettings"></text>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-wrapper">
			<!-- 练习进度 -->
			<view class="progress-section">
				<view class="progress-info">
					<text class="progress-text">{{ currentQuestionIndex + 1 }} / {{ listeningQuestions.length }}</text>
				</view>
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
				</view>
			</view>

			<!-- 听力练习区域 -->
			<view class="listening-area">
				<!-- 音频播放器 -->
				<view class="audio-player">
					<view class="audio-controls">
						<text class="fa fa-step-backward control-btn" @click="previousQuestion"></text>
						<text 
							:class="['fa', isPlaying ? 'fa-pause' : 'fa-play', 'play-btn']" 
							@click="togglePlay"
						></text>
						<text class="fa fa-step-forward control-btn" @click="nextQuestion"></text>
					</view>
					<view class="audio-timeline">
						<view class="timeline-bar" @click="seekAudio">
							<view class="timeline-progress" :style="{ width: audioProgress + '%' }"></view>
						</view>
						<view class="audio-time">
							<text class="time-text">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</text>
						</view>
					</view>
				</view>

				<!-- 问题区域 -->
				<view class="question-section">
					<view class="question-text">{{ currentQuestion.question }}</view>
					
					<!-- 选项区域 -->
					<view class="options-section">
						<view 
							v-for="(option, index) in currentQuestion.options" 
							:key="index"
							:class="['option-item', { selected: selectedOption === index, correct: showResult && index === currentQuestion.correctAnswer, incorrect: showResult && selectedOption === index && index !== currentQuestion.correctAnswer }]"
							@click="selectOption(index)"
						>
							<view class="option-label">{{ String.fromCharCode(65 + index) }}</view>
							<text class="option-text">{{ option }}</text>
							<text 
								v-if="showResult && index === currentQuestion.correctAnswer" 
								class="fa fa-check result-icon correct"
							></text>
							<text 
								v-if="showResult && selectedOption === index && index !== currentQuestion.correctAnswer" 
								class="fa fa-times result-icon incorrect"
							></text>
						</view>
					</view>
				</view>
			</view>

			<!-- 操作按钮 -->
			<view class="action-buttons">
				<button 
					class="action-btn submit-btn" 
					@click="submitAnswer" 
					:disabled="selectedOption === null || showResult"
				>
					<text class="btn-text">{{ showResult ? '已提交' : '提交答案' }}</text>
				</button>
				<button class="action-btn next-btn" @click="nextQuestion" :disabled="!showResult && currentQuestionIndex === listeningQuestions.length - 1">
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
						<text class="setting-label">播放速度</text>
						<slider 
							min="0.5" 
							max="2" 
							step="0.1" 
							:value="playbackRate" 
							@change="changePlaybackRate"
							activeColor="#6366F1"
						/>
						<text class="setting-value">{{ playbackRate }}x</text>
					</view>
					<view class="setting-item">
						<text class="setting-label">重复播放</text>
						<switch :checked="repeatPlay" @change="toggleRepeatPlay" />
					</view>
					<view class="setting-item">
						<text class="setting-label">自动播放下一题</text>
						<switch :checked="autoNext" @change="toggleAutoNext" />
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
	name: 'ListeningPractice',
	data() {
		return {
			currentQuestionIndex: 0,
			selectedOption: null,
			showResult: false,
			showSettingsModal: false,
			isPlaying: false,
			currentTime: 0,
			duration: 100,
			audioProgress: 0,
			playbackRate: 1.0,
			repeatPlay: false,
			autoNext: true,
			stats: {
				correct: 0,
				incorrect: 0
			},
			listeningQuestions: [
				{
					audio: 'audio1.mp3',
					question: '请听对话，选择正确的回答：',
					options: [
						'はい、そうですね。',
						'いいえ、そうではありません。',
						'わかりません。',
						'どうしてですか？'
					],
					correctAnswer: 0
				},
				{
					audio: 'audio2.mp3',
					question: '这段对话发生在什么地方？',
					options: [
						'レストラン',
						'スーパー',
						'駅',
						'病院'
					],
					correctAnswer: 2
				},
				{
					audio: 'audio3.mp3',
					question: '男の人は何時に会社に行きますか？',
					options: [
						'8時',
						'8時半',
						'9時',
						'9時半'
					],
					correctAnswer: 1
				},
				{
					audio: 'audio4.mp3',
					question: '女の人は何を買いましたか？',
					options: [
						'本',
						'服',
						'食べ物',
						'飲み物'
					],
					correctAnswer: 3
				},
				{
					audio: 'audio5.mp3',
					question: 'この会話で女の人はどうして遅れましたか？',
					options: [
						'電車が遅れたから',
						'寝坊したから',
						'道に迷ったから',
						'体調が悪かったから'
					],
					correctAnswer: 0
				}
			]
		}
	},
	computed: {
		currentQuestion() {
			return this.listeningQuestions[this.currentQuestionIndex] || {}
		},
		progressPercent() {
			if (this.listeningQuestions.length === 0) return 0
			return ((this.currentQuestionIndex + 1) / this.listeningQuestions.length) * 100
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		togglePlay() {
			this.isPlaying = !this.isPlaying
			uni.showToast({
				title: this.isPlaying ? '播放中...' : '已暂停',
				icon: 'none'
			})
		},
		selectOption(index) {
			if (this.showResult) return
			this.selectedOption = index
		},
		submitAnswer() {
			if (this.selectedOption === null) return
			
			this.showResult = true
			if (this.selectedOption === this.currentQuestion.correctAnswer) {
				this.stats.correct++
				uni.showToast({
					title: '回答正确！',
					icon: 'success'
				})
			} else {
				this.stats.incorrect++
				uni.showToast({
					title: '回答错误',
					icon: 'none'
				})
			}
			
			// 自动播放下一题
			if (this.autoNext) {
				setTimeout(() => {
					this.nextQuestion()
				}, 1500)
			}
		},
		nextQuestion() {
			if (this.currentQuestionIndex < this.listeningQuestions.length - 1) {
				this.currentQuestionIndex++
				this.resetQuestion()
			} else {
				uni.showToast({
					title: '练习完成！',
					icon: 'success'
				})
			}
		},
		previousQuestion() {
			if (this.currentQuestionIndex > 0) {
				this.currentQuestionIndex--
				this.resetQuestion()
			}
		},
		resetQuestion() {
			this.selectedOption = null
			this.showResult = false
			this.isPlaying = false
			this.currentTime = 0
			this.audioProgress = 0
		},
		showSettings() {
			this.showSettingsModal = true
		},
		closeSettings() {
			this.showSettingsModal = false
		},
		changePlaybackRate(e) {
			this.playbackRate = e.detail.value
			uni.showToast({
				title: `播放速度: ${this.playbackRate}x`,
				icon: 'none'
			})
		},
		toggleRepeatPlay(e) {
			this.repeatPlay = e.target.value
		},
		toggleAutoNext(e) {
			this.autoNext = e.target.value
		},
		seekAudio(e) {
			// 模拟音频跳转
			const width = e.currentTarget.offsetWidth
			const offsetX = e.detail.x - e.currentTarget.getBoundingClientRect().left
			this.audioProgress = (offsetX / width) * 100
			this.currentTime = (this.audioProgress / 100) * this.duration
		},
		formatTime(seconds) {
			const mins = Math.floor(seconds / 60)
			const secs = Math.floor(seconds % 60)
			return `${mins}:${secs < 10 ? '0' : ''}${secs}`
		}
	}
}
</script>

<style lang="scss" scoped>
.listening-practice-container {
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

/* 听力练习区域 */
.listening-area {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

/* 音频播放器 */
.audio-player {
	margin-bottom: 48rpx;

	.audio-controls {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 48rpx;
		margin-bottom: 32rpx;

		.control-btn,
		.play-btn {
			font-size: 48rpx;
			color: #6B7280;
			cursor: pointer;
			transition: color 0.2s;

			&:hover {
				color: #2563EB;
			}
		}

		.play-btn {
			width: 96rpx;
			height: 96rpx;
			border-radius: 50%;
			background: rgba(37, 99, 235, 0.1);
			color: #2563EB;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 40rpx;

			&:hover {
				background: rgba(37, 99, 235, 0.2);
			}
		}
	}

	.audio-timeline {
		.timeline-bar {
			width: 100%;
			height: 8rpx;
			background: #E5E7EB;
			border-radius: 4rpx;
			margin-bottom: 16rpx;
			cursor: pointer;
			position: relative;

			.timeline-progress {
				height: 100%;
				background: #2563EB;
				border-radius: 4rpx;
				width: 0%;
			}
		}

		.audio-time {
			text-align: right;

			.time-text {
				font-size: 24rpx;
				color: #6B7280;
			}
		}
	}
}

/* 问题区域 */
.question-section {
	.question-text {
		font-size: 32rpx;
		font-weight: 500;
		color: #1F2937;
		margin-bottom: 32rpx;
		line-height: 1.5;
	}
}

/* 选项区域 */
.options-section {
	.option-item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		margin-bottom: 24rpx;
		border-radius: 16rpx;
		background: #F9FAFB;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;

		&:last-child {
			margin-bottom: 0;
		}

		&:hover {
			background: #F3F4F6;
		}

		&.selected {
			background: #EEF2FF;
			border: 2rpx solid #6366F1;
		}

		&.correct {
			background: #D1FAE5;
			border: 2rpx solid #10B981;
		}

		&.incorrect {
			background: #FECACA;
			border: 2rpx solid #EF4444;
		}

		.option-label {
			width: 48rpx;
			height: 48rpx;
			border-radius: 50%;
			background: #E5E7EB;
			color: #6B7280;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 500;
			margin-right: 24rpx;
			flex-shrink: 0;
		}

		.option-text {
			flex: 1;
			font-size: 28rpx;
			color: #1F2937;
			line-height: 1.4;
		}

		.result-icon {
			font-size: 32rpx;
			margin-left: 24rpx;
			flex-shrink: 0;

			&.correct {
				color: #10B981;
			}

			&.incorrect {
				color: #EF4444;
			}
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

		&.submit-btn {
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

		&.next-btn {
			background: #F3F4F6;
			color: #1F2937;

			&:hover:not(:disabled) {
				background: #E5E7EB;
			}

			&:disabled {
				background: #F9FAFB;
				color: #9CA3AF;
				cursor: not-allowed;
			}
		}

		.fa {
			margin-left: 8rpx;
			font-size: 24rpx;
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
				margin-bottom: 32rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.setting-label {
					font-size: 28rpx;
					color: #1F2937;
					font-weight: 500;
					margin-bottom: 16rpx;
					display: block;
				}

				.setting-value {
					font-size: 28rpx;
					color: #6B7280;
					margin-top: 16rpx;
					display: block;
					text-align: center;
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
.dark-theme .listening-practice-container {
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
.dark-theme .listening-area,
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

.dark-theme .question-text {
	color: #E0E0E0;
}

.dark-theme .option-item {
	background: #2D2D2D;

	&:hover {
		background: #3D3D3D;
	}

	&.selected {
		background: #3D3D3D;
		border: 2rpx solid #6366F1;
	}

	&.correct {
		background: #064E3B;
		border: 2rpx solid #10B981;
	}

	&.incorrect {
		background: #7F1D1D;
		border: 2rpx solid #EF4444;
	}

	.option-label {
		background: #3D3D3D;
		color: #A0A0A0;
	}

	.option-text {
		color: #E0E0E0;
	}
}

.dark-theme .play-btn {
	background: #3D3D3D;
	color: #6366F1;

	&:hover {
		background: #4D4D4D;
	}
}

.dark-theme .control-btn {
	color: #A0A0A0;

	&:hover {
		color: #2563EB;
	}
}

.dark-theme .timeline-bar {
	background: #3D3D3D;
}

.dark-theme .timeline-progress {
	background: #6366F1;
}

.dark-theme .time-text {
	color: #A0A0A0;
}

.dark-theme .action-btn.submit-btn {
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

.dark-theme .action-btn.next-btn {
	background: #2D2D2D;
	color: #E0E0E0;

	&:hover:not(:disabled) {
		background: #3D3D3D;
	}

	&:disabled {
		background: #1F1F1F;
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

	.setting-value {
		color: #A0A0A0;
	}

	.modal-footer {
		border-top: 2rpx solid #3D3D3D;
	}
}
</style>