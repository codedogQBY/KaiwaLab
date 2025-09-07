<template>
	<view class="pronunciation-recorder">
		<!-- 返回按钮 -->
		<view class="back-btn" @click="handleBack">
			<text class="fas fa-times"></text>
		</view>
		
		<!-- 录音控制区域 -->
		<view class="recorder-container">
			<!-- 录音按钮 -->
			<view 
				class="record-btn" 
				:class="{ 'recording': isRecording, 'analyzing': isAnalyzing }"
				@touchstart="startRecord"
				@touchend="stopRecord"
			>
				<view class="record-icon">
					<text v-if="!isRecording && !isAnalyzing" class="fas fa-microphone"></text>
					<text v-else-if="isRecording" class="fas fa-stop"></text>
					<text v-else class="fas fa-spinner fa-spin"></text>
				</view>
				<view class="record-ripple" v-if="isRecording"></view>
			</view>
			
			<!-- 录音状态提示 -->
			<view class="record-status">
				<text v-if="!isRecording && !isAnalyzing" class="status-text">长按录音</text>
				<text v-else-if="isRecording" class="status-text recording">正在录音...</text>
				<text v-else class="status-text analyzing">分析中...</text>
			</view>
			
			<!-- 音量指示器 -->
			<view class="volume-indicator" v-if="isRecording">
				<view class="volume-bars">
					<view 
						v-for="(bar, index) in volumeBars" 
						:key="index"
						class="volume-bar"
						:class="{ 'active': bar <= currentVolume }"
					></view>
				</view>
			</view>
		</view>
		
		<!-- 录音时长显示 -->
		<view class="record-duration" v-if="isRecording || recordDuration > 0">
			<text class="duration-text">{{ formatDuration(recordDuration) }}</text>
		</view>
		
		<!-- 录音波形显示 -->
		<view class="waveform-container" v-if="showWaveform && audioData.length > 0">
			<canvas 
				class="waveform-canvas" 
				canvas-id="waveformCanvas"
				:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
			></canvas>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PronunciationRecorder',
	props: {
		// 是否显示波形
		showWaveform: {
			type: Boolean,
			default: true
		},
		// 最大录音时长（秒）
		maxDuration: {
			type: Number,
			default: 60
		},
		// 目标文本（用于对比）
		targetText: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			isRecording: false,
			isAnalyzing: false,
			recordDuration: 0,
			currentVolume: 0,
			volumeBars: [1, 2, 3, 4, 5, 6, 7, 8],
			audioData: [],
			canvasWidth: 300,
			canvasHeight: 60,
			recordTimer: null,
			volumeTimer: null,
			recorderManager: null
		}
	},
	mounted() {
		this.initRecorder()
	},
	beforeDestroy() {
		this.cleanup()
	},
	methods: {
		// 处理返回按钮点击
		handleBack() {
			this.$emit('back')
		},
		
		// 初始化录音管理器
		initRecorder() {
			this.recorderManager = uni.getRecorderManager()
			
			this.recorderManager.onStart(() => {
				console.log('录音开始')
			})
			
			this.recorderManager.onStop((res) => {
				console.log('录音结束', res)
				this.handleRecordComplete(res)
			})
			
			this.recorderManager.onError((err) => {
				console.error('录音错误', err)
				this.handleRecordError(err)
			})
		},
		
		// 开始录音
		startRecord() {
			if (this.isRecording || this.isAnalyzing) return
			
			this.isRecording = true
			this.recordDuration = 0
			this.audioData = []
			
			// 开始录音
			this.recorderManager.start({
				duration: this.maxDuration * 1000,
				sampleRate: 16000,
				numberOfChannels: 1,
				encodeBitRate: 96000,
				format: 'mp3'
			})
			
			// 开始计时
			this.startTimer()
			
			// 开始音量监测
			this.startVolumeMonitor()
			
			// 触发录音开始事件
			this.$emit('record-start')
		},
		
		// 停止录音
		stopRecord() {
			if (!this.isRecording) return
			
			this.isRecording = false
			this.isAnalyzing = true
			
			// 停止录音
			this.recorderManager.stop()
			
			// 停止计时和音量监测
			this.stopTimer()
			this.stopVolumeMonitor()
		},
		
		// 处理录音完成
		handleRecordComplete(res) {
			this.isAnalyzing = false
			
			// 触发录音完成事件
			this.$emit('record-complete', {
				filePath: res.tempFilePath,
				duration: this.recordDuration,
				targetText: this.targetText
			})
			
			// 重置状态
			this.resetState()
		},
		
		// 处理录音错误
		handleRecordError(err) {
			this.isRecording = false
			this.isAnalyzing = false
			
			uni.showToast({
				title: '录音失败',
				icon: 'none'
			})
			
			this.$emit('record-error', err)
			this.resetState()
		},
		
		// 开始计时
		startTimer() {
			this.recordTimer = setInterval(() => {
				this.recordDuration++
				if (this.recordDuration >= this.maxDuration) {
					this.stopRecord()
				}
			}, 1000)
		},
		
		// 停止计时
		stopTimer() {
			if (this.recordTimer) {
				clearInterval(this.recordTimer)
				this.recordTimer = null
			}
		},
		
		// 开始音量监测
		startVolumeMonitor() {
			this.volumeTimer = setInterval(() => {
				// 模拟音量变化
				this.currentVolume = Math.floor(Math.random() * 8) + 1
			}, 100)
		},
		
		// 停止音量监测
		stopVolumeMonitor() {
			if (this.volumeTimer) {
				clearInterval(this.volumeTimer)
				this.volumeTimer = null
			}
			this.currentVolume = 0
		},
		
		// 格式化时长
		formatDuration(seconds) {
			const mins = Math.floor(seconds / 60)
			const secs = seconds % 60
			return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
		},
		
		// 重置状态
		resetState() {
			this.recordDuration = 0
			this.currentVolume = 0
			this.audioData = []
		},
		
		// 清理资源
		cleanup() {
			this.stopTimer()
			this.stopVolumeMonitor()
		}
	},
	emits: ['record-start', 'record-complete', 'record-error']
}
</script>

<style lang="scss" scoped>
.pronunciation-recorder {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24rpx;
	padding: 32rpx;
	position: relative;
}

.back-btn {
	position: absolute;
	top: 24rpx;
	right: 24rpx;
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background-color: #F3F4F6;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6B7280;
	transition: background-color 0.2s;
	z-index: 10;
	
	&:active {
		background-color: #E5E7EB;
	}
	
	text {
		font-size: 24rpx;
	}
}

/* 暗黑模式样式 */
.dark-theme .back-btn {
	background-color: #2D2D2D;
	color: #A0A0A0;
	
	&:active {
		background-color: #3D3D3D;
	}
}

.recorder-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.record-btn {
	position: relative;
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #2563EB, #3B82F6);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.3);
	
	&.recording {
		background: linear-gradient(135deg, #EF4444, #F87171);
		box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.4);
		transform: scale(1.1);
	}
	
	&.analyzing {
		background: linear-gradient(135deg, #F59E0B, #FBBF24);
		box-shadow: 0 8rpx 24rpx rgba(245, 158, 11, 0.4);
	}
}

.record-icon {
	color: white;
	font-size: 48rpx;
}

.record-ripple {
	position: absolute;
	top: -20rpx;
	left: -20rpx;
	right: -20rpx;
	bottom: -20rpx;
	border: 4rpx solid rgba(239, 68, 68, 0.3);
	border-radius: 50%;
	animation: ripple 1.5s infinite;
}

@keyframes ripple {
	0% {
		transform: scale(0.8);
		opacity: 1;
	}
	100% {
		transform: scale(1.4);
		opacity: 0;
	}
}

.record-status {
	text-align: center;
}

.status-text {
	font-size: 28rpx;
	color: #6B7280;
	
	&.recording {
		color: #EF4444;
		font-weight: 500;
	}
	
	&.analyzing {
		color: #F59E0B;
		font-weight: 500;
	}
}

/* 暗黑模式样式 */
.dark-theme .status-text {
	color: #A0A0A0;
}

.volume-indicator {
	margin-top: 16rpx;
}

.volume-bars {
	display: flex;
	gap: 8rpx;
	align-items: flex-end;
	height: 60rpx;
}

.volume-bar {
	width: 6rpx;
	height: 20rpx;
	background-color: #E5E7EB;
	border-radius: 3rpx;
	transition: all 0.1s ease;
	
	&:nth-child(2n) {
		height: 30rpx;
	}
	
	&:nth-child(3n) {
		height: 40rpx;
	}
	
	&:nth-child(4n) {
		height: 50rpx;
	}
	
	&.active {
		background: linear-gradient(to top, #059669, #10B981);
	}
}

/* 暗黑模式样式 */
.dark-theme .volume-bar {
	background-color: #2D2D2D;
}

.record-duration {
	padding: 12rpx 24rpx;
	background-color: #F3F4F6;
	border-radius: 20rpx;
}

/* 暗黑模式样式 */
.dark-theme .record-duration {
	background-color: #2D2D2D;
}

.duration-text {
	font-size: 28rpx;
	color: #374151;
	font-weight: 500;
	font-family: 'Courier New', monospace;
}

/* 暗黑模式样式 */
.dark-theme .duration-text {
	color: #E0E0E0;
}

.waveform-container {
	width: 100%;
	max-width: 600rpx;
	height: 120rpx;
	background-color: #F9FAFB;
	border-radius: 16rpx;
	padding: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 暗黑模式样式 */
.dark-theme .waveform-container {
	background-color: #1F1F1F;
}

.waveform-canvas {
	width: 100%;
	height: 100%;
}
</style>