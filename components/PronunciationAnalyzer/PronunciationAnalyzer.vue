<template>
	<view class="pronunciation-analyzer">
		<!-- 总体评分卡片 -->
		<view class="score-card">
			<view class="score-header">
				<text class="score-title">发音评分</text>
				<view class="score-badge" :class="getScoreLevel(overallScore)">
					<text class="score-text">{{ overallScore }}</text>
				</view>
			</view>
			
			<!-- 评分进度条 -->
			<view class="score-progress">
				<view class="progress-track">
					<view 
						class="progress-fill" 
						:style="{ width: overallScore + '%', backgroundColor: getScoreColor(overallScore) }"
					></view>
				</view>
				<view class="progress-labels">
					<text class="label">0</text>
					<text class="label">50</text>
					<text class="label">100</text>
				</view>
			</view>
			
			<!-- 评分等级说明 -->
			<view class="score-description">
				<text class="description-text">{{ getScoreDescription(overallScore) }}</text>
			</view>
		</view>
		
		<!-- 详细分析 -->
		<view class="analysis-section" v-if="analysisData">
			<view class="section-header">
				<text class="section-title">详细分析</text>
			</view>
			
			<!-- 分项评分 -->
			<view class="metrics-grid">
				<view class="metric-item" v-for="metric in metrics" :key="metric.key">
					<view class="metric-header">
						<text class="metric-name">{{ metric.name }}</text>
						<text class="metric-score" :style="{ color: getScoreColor(metric.score) }">{{ metric.score }}</text>
					</view>
					<view class="metric-bar">
						<view 
							class="metric-fill" 
							:style="{ width: metric.score + '%', backgroundColor: getScoreColor(metric.score) }"
						></view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 错误分析 -->
		<view class="errors-section" v-if="errors && errors.length > 0">
			<view class="section-header">
				<text class="section-title">发音问题</text>
				<view class="error-count">
					<text class="count-text">{{ errors.length }}个问题</text>
				</view>
			</view>
			
			<view class="errors-list">
				<view class="error-item" v-for="(error, index) in errors" :key="index">
					<view class="error-icon">
						<text class="fas fa-exclamation-triangle"></text>
					</view>
					<view class="error-content">
						<view class="error-header">
							<text class="error-phoneme">{{ error.phoneme }}</text>
							<text class="error-type">{{ error.type }}</text>
						</view>
						<text class="error-description">{{ error.description }}</text>
						<text class="error-suggestion">建议：{{ error.suggestion }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 改进建议 -->
		<view class="suggestions-section" v-if="suggestions && suggestions.length > 0">
			<view class="section-header">
				<text class="section-title">改进建议</text>
			</view>
			
			<view class="suggestions-list">
				<view class="suggestion-item" v-for="(suggestion, index) in suggestions" :key="index">
					<view class="suggestion-icon">
						<text class="fas fa-lightbulb"></text>
					</view>
					<view class="suggestion-content">
						<text class="suggestion-title">{{ suggestion.title }}</text>
						<text class="suggestion-description">{{ suggestion.description }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 操作按钮 -->
		<view class="actions-section">
			<view class="action-btn primary" @click="playOriginal">
				<text class="fas fa-play"></text>
				<text class="btn-text">播放原音</text>
			</view>
			<view class="action-btn secondary" @click="playRecording">
				<text class="fas fa-microphone"></text>
				<text class="btn-text">播放录音</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PronunciationAnalyzer',
	props: {
		// 总体评分 (0-100)
		overallScore: {
			type: Number,
			default: 0
		},
		// 分析数据
		analysisData: {
			type: Object,
			default: null
		},
		// 错误列表
		errors: {
			type: Array,
			default: () => []
		},
		// 改进建议
		suggestions: {
			type: Array,
			default: () => []
		},
		// 录音文件路径
		recordingPath: {
			type: String,
			default: ''
		},
		// 原音文件路径
		originalPath: {
			type: String,
			default: ''
		}
	},
	computed: {
		// 分项指标
		metrics() {
			if (!this.analysisData) return []
			
			return [
				{
					key: 'accuracy',
					name: '准确度',
					score: this.analysisData.accuracy || 0
				},
				{
					key: 'fluency',
					name: '流畅度',
					score: this.analysisData.fluency || 0
				},
				{
					key: 'intonation',
					name: '语调',
					score: this.analysisData.intonation || 0
				},
				{
					key: 'rhythm',
					name: '节奏',
					score: this.analysisData.rhythm || 0
				}
			]
		}
	},
	methods: {
		// 获取评分等级
		getScoreLevel(score) {
			if (score >= 90) return 'excellent'
			if (score >= 80) return 'good'
			if (score >= 70) return 'fair'
			if (score >= 60) return 'poor'
			return 'very-poor'
		},
		
		// 获取评分颜色
		getScoreColor(score) {
			if (score >= 90) return '#10B981'
			if (score >= 80) return '#3B82F6'
			if (score >= 70) return '#F59E0B'
			if (score >= 60) return '#F97316'
			return '#EF4444'
		},
		
		// 获取评分描述
		getScoreDescription(score) {
			if (score >= 90) return '发音非常标准，几乎没有错误'
			if (score >= 80) return '发音良好，有少量可改进之处'
			if (score >= 70) return '发音基本正确，需要进一步练习'
			if (score >= 60) return '发音有明显问题，建议多加练习'
			return '发音需要大幅改进，建议从基础开始'
		},
		
		// 播放原音
		playOriginal() {
			if (this.originalPath) {
				this.$emit('play-original', this.originalPath)
			} else {
				uni.showToast({
					title: '原音文件不存在',
					icon: 'none'
				})
			}
		},
		
		// 播放录音
		playRecording() {
			if (this.recordingPath) {
				this.$emit('play-recording', this.recordingPath)
			} else {
				uni.showToast({
					title: '录音文件不存在',
					icon: 'none'
				})
			}
		},
		
	},
	emits: ['play-original', 'play-recording', 'retry-recording']
}
</script>

<style lang="scss" scoped>
.pronunciation-analyzer {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
	padding: 32rpx;
}

/* 评分卡片 */
.score-card {
	background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
	border-radius: 24rpx;
	padding: 32rpx;
	color: white;
}

.score-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.score-title {
	font-size: 32rpx;
	font-weight: 600;
}

.score-badge {
	padding: 12rpx 24rpx;
	border-radius: 20rpx;
	background-color: rgba(255, 255, 255, 0.2);
	
	&.excellent {
		background-color: rgba(16, 185, 129, 0.2);
	}
	
	&.good {
		background-color: rgba(37, 99, 235, 0.2);
	}
	
	&.fair {
		background-color: rgba(249, 115, 22, 0.2);
	}
	
	&.poor {
		background-color: rgba(249, 115, 22, 0.3);
	}
	
	&.very-poor {
		background-color: rgba(220, 38, 38, 0.2);
	}
}

.score-text {
	font-size: 36rpx;
	font-weight: bold;
}

.score-progress {
	margin-bottom: 16rpx;
}

.progress-track {
	height: 12rpx;
	background-color: rgba(255, 255, 255, 0.3);
	border-radius: 6rpx;
	overflow: hidden;
	margin-bottom: 8rpx;
}

.progress-fill {
	height: 100%;
	border-radius: 6rpx;
	transition: width 0.8s ease;
}

.progress-labels {
	display: flex;
	justify-content: space-between;
}

.label {
	font-size: 24rpx;
	opacity: 0.8;
}

.score-description {
	text-align: center;
}

.description-text {
	font-size: 28rpx;
	opacity: 0.9;
	line-height: 1.4;
}

/* 分析部分 */
.analysis-section {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 32rpx;
	border: 1rpx solid #E5E7EB;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1F2937;
}

.metrics-grid {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.metric-item {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.metric-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.metric-name {
	font-size: 28rpx;
	color: #6B7280;
}

.metric-score {
	font-size: 28rpx;
	font-weight: 600;
}

.metric-bar {
	height: 8rpx;
	background-color: #F3F4F6;
	border-radius: 4rpx;
	overflow: hidden;
}

.metric-fill {
	height: 100%;
	border-radius: 4rpx;
	transition: width 0.6s ease;
}

/* 错误部分 */
.errors-section {
	background-color: #FFF7ED;
	border-radius: 20rpx;
	padding: 32rpx;
	border: 1rpx solid #FED7AA;
}

.error-count {
	padding: 8rpx 16rpx;
	background-color: #FFEDD5;
	border-radius: 12rpx;
}

.count-text {
	font-size: 24rpx;
	color: #F97316;
	font-weight: 500;
}

.errors-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.error-item {
	display: flex;
	gap: 16rpx;
	padding: 20rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	border: 1rpx solid #FED7AA;
}

.error-icon {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #F97316;
	font-size: 24rpx;
}

.error-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.error-header {
	display: flex;
	gap: 16rpx;
	align-items: center;
}

.error-phoneme {
	font-size: 28rpx;
	font-weight: 600;
	color: #F97316;
}

.error-type {
	font-size: 24rpx;
	color: #6B7280;
	padding: 4rpx 12rpx;
	background-color: #F3F4F6;
	border-radius: 8rpx;
}

.error-description {
	font-size: 26rpx;
	color: #374151;
	line-height: 1.4;
}

.error-suggestion {
	font-size: 26rpx;
	color: #10B981;
	line-height: 1.4;
}

/* 建议部分 */
.suggestions-section {
	background-color: #ECFDF5;
	border-radius: 20rpx;
	padding: 32rpx;
	border: 1rpx solid #A7F3D0;
}

.suggestions-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.suggestion-item {
	display: flex;
	gap: 16rpx;
	padding: 20rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	border: 1rpx solid #A7F3D0;
}

.suggestion-icon {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #10B981;
	font-size: 24rpx;
}

.suggestion-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.suggestion-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #10B981;
}

.suggestion-description {
	font-size: 26rpx;
	color: #374151;
	line-height: 1.4;
}

/* 操作按钮 */
.actions-section {
	display: flex;
	gap: 16rpx;
	flex-wrap: wrap;
}

.action-btn {
	flex: 1;
	min-width: 200rpx;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	border-radius: 16rpx;
	transition: all 0.2s ease;
	
	&.primary {
		background-color: #2563EB;
		color: white;
		
		&:active {
			background-color: #1D4ED8;
		}
	}
	
	&.secondary {
		background-color: #F3F4F6;
		color: #374151;
		border: 1rpx solid #D1D5DB;
		
		&:active {
			background-color: #E5E7EB;
		}
	}
}

.btn-text {
	font-size: 28rpx;
	font-weight: 500;
}
</style>