<template>
	<view class="message-item">
		<!-- AI消息 -->
		<view v-if="message.type === 'ai'" class="message ai-message">
			<view class="avatar ai-avatar">
				<text class="fas fa-robot"></text>
			</view>
			<view class="message-content">
				<view class="bubble ai-bubble">
					<text class="message-text">{{ message.content }}</text>
					<text v-if="message.translation && showTranslation" class="translation-text">{{ message.translation }}</text>
					
					<!-- 时间戳 -->
					<view class="message-meta">
						<text class="timestamp">{{ message.timestamp }}</text>
						<view v-if="message.hasAudio" class="audio-indicator">
							<text class="fas fa-volume-up"></text>
						</view>
					</view>
				</view>
				
				<view class="chat-actions" v-if="showActions">
					<view class="action-btn-small" @click="$emit('copy', message.content)">
						<text class="fas fa-copy"></text>
					</view>
					<view class="action-btn-small" @click="$emit('speak', message.content)">
						<text class="fas fa-volume-up"></text>
					</view>
					<view v-if="message.translation" class="action-btn-small" @click="toggleTranslation">
						<text class="fas" :class="showTranslation ? 'fa-eye-slash' : 'fa-eye'"></text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 用户消息 -->
		<view v-else class="message user-message">
			<view class="message-content user-content">
				<view class="bubble user-bubble">
					<text class="message-text">{{ message.content }}</text>
					<text v-if="message.translation && showTranslation" class="translation-text">{{ message.translation }}</text>
					
					<!-- 发音评分 -->
					<view v-if="showPronunciation && message.pronunciationScore !== null" class="pronunciation-score" @click="$emit('pronunciation-analyze', message)">
						<view class="score-icon">
							<text class="fas fa-microphone"></text>
						</view>
						<view class="score-info">
							<text class="score-text">{{ message.pronunciationScore }}分</text>
							<text class="score-label">发音评分</text>
						</view>
						<view class="score-badge" :class="getScoreLevel(message.pronunciationScore)">
							<text class="badge-text">{{ getScoreText(message.pronunciationScore) }}</text>
						</view>
					</view>
					
					<!-- 时间戳 -->
					<view class="message-meta user-meta">
						<view v-if="message.hasAudio" class="audio-indicator">
							<text class="fas fa-microphone"></text>
						</view>
						<text class="timestamp">{{ message.timestamp }}</text>
					</view>
				</view>
				
				<view class="chat-actions user-actions" v-if="showActions">
					<view class="action-btn-small user-action" @click="$emit('copy', message.content)">
						<text class="fas fa-copy"></text>
					</view>
					<view class="action-btn-small user-action" @click="$emit('speak', message.content)">
						<text class="fas fa-volume-up"></text>
					</view>
					<view v-if="message.translation" class="action-btn-small user-action" @click="toggleTranslation">
						<text class="fas" :class="showTranslation ? 'fa-eye-slash' : 'fa-eye'"></text>
					</view>
					<view v-if="showPronunciation && message.pronunciationScore !== null" class="action-btn-small user-action" @click="$emit('pronunciation-analyze', message)">
						<text class="fas fa-chart-line"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ChatBubble',
	props: {
		message: {
			type: Object,
			required: true,
			validator: (value) => {
				return value && typeof value === 'object' && 
					   ['ai', 'user'].includes(value.type) && 
					   typeof value.content === 'string'
			}
		},
		showActions: {
			type: Boolean,
			default: true
		},
		showPronunciation: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			showTranslation: true
		}
	},
	methods: {
		toggleTranslation() {
			this.showTranslation = !this.showTranslation
		},
		
		// 获取评分等级
		getScoreLevel(score) {
			if (score >= 90) return 'excellent'
			if (score >= 80) return 'good'
			if (score >= 70) return 'fair'
			return 'poor'
		},
		
		// 获取评分文本
		getScoreText(score) {
			if (score >= 90) return '优秀'
			if (score >= 80) return '良好'
			if (score >= 70) return '一般'
			return '需改进'
		}
	},
	emits: ['copy', 'speak', 'pronunciation-analyze']
}
</script>

<style lang="scss" scoped>
.message-item {
	display: flex;
	flex-direction: column;
}

.message {
	display: flex;
	align-items: flex-start;
	gap: 16rpx;
	margin-bottom: 32rpx;
}

.ai-message {
	justify-content: flex-start;
}

.user-message {
	justify-content: flex-end;
	padding-right: 32rpx;
}

.avatar {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.ai-avatar {
	background-color: #2563EB;
	color: white;

	text {
		font-size: 24rpx;
		font-family: 'Font Awesome 6 Free';
		font-weight: 900;
	}
}

.bubble {
	padding: 24rpx 32rpx;
	position: relative;
	border-radius: 36rpx;
}

.ai-bubble {
	background-color: #F3F4F6;
	border-radius: 36rpx 36rpx 36rpx 8rpx;
	color: #1F2937;
}

.user-bubble {
	background-color: #2563EB;
	border-radius: 36rpx 36rpx 8rpx 36rpx;
	color: white;
}

.message-text {
	font-size: 30rpx;
	line-height: 1.5;
	display: block;
	margin-bottom: 8rpx;
	font-weight: 500;
}

.translation-text {
	font-size: 26rpx;
	opacity: 0.7;
	font-style: italic;
	display: block;
	margin-bottom: 0;
}

.message-content {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	max-width: 75%;
}

.user-content {
	align-items: flex-end;
}

.chat-actions {
	display: flex;
	gap: 8rpx;
	opacity: 0.7;
	align-self: flex-start;
}

.user-actions {
	align-self: flex-end;
}

.action-btn-small {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6B7280;
	transition: all 0.2s;

	&:active {
		background-color: white;
	}

	text {
		font-size: 24rpx;
		font-family: 'Font Awesome 6 Free';
		font-weight: 900;
	}
}

.user-action {
	background-color: rgba(255, 255, 255, 0.8);
	color: #2563EB;
	border: 1rpx solid rgba(255, 255, 255, 0.9);

	&:active {
		background-color: white;
		color: #1D4ED8;
	}
}

/* 消息元信息 */
.message-meta {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-top: 12rpx;
	justify-content: flex-start;
}

.user-meta {
	justify-content: flex-end;
}

.timestamp {
	font-size: 22rpx;
	color: #9CA3AF;
	opacity: 0.8;
}

.audio-indicator {
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	background-color: #10B981;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16rpx;
}

/* 发音评分 */
.pronunciation-score {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-top: 16rpx;
	padding: 12rpx 16rpx;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 16rpx;
	transition: all 0.2s ease;
	cursor: pointer;
	
	&:active {
		background-color: rgba(255, 255, 255, 0.2);
		transform: scale(0.98);
	}
}

.score-icon {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.2);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20rpx;
}

.score-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.score-text {
	font-size: 26rpx;
	font-weight: 600;
	color: white;
}

.score-label {
	font-size: 20rpx;
	color: rgba(255, 255, 255, 0.8);
}

.score-badge {
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	font-size: 20rpx;
	font-weight: 500;
}

.badge-text {
	font-size: 20rpx;
	font-weight: 500;
}

.excellent {
	background-color: #10B981;
	color: white;
}

.good {
	background-color: #3B82F6;
	color: white;
}

.fair {
	background-color: #F59E0B;
	color: white;
}

.poor {
	background-color: #EF4444;
	color: white;
}
</style>