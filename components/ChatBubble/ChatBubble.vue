<template>
	<view class="message-item">
		<!-- AI消息 -->
		<view v-if="type === 'ai'" class="message ai-message">
			<view class="avatar ai-avatar">
				<text class="fas fa-robot"></text>
			</view>
			<view class="message-content">
				<view class="bubble ai-bubble">
					<text class="message-text">{{ content }}</text>
					<text v-if="translation && showTranslation" class="translation-text">{{ translation }}</text>
				</view>
				<view class="chat-actions" v-if="showActions">
					<view class="action-btn-small" @click="$emit('copy', content)">
						<text class="fas fa-copy"></text>
					</view>
					<view class="action-btn-small" @click="$emit('speak', content)">
						<text class="fas fa-volume-up"></text>
					</view>
					<view v-if="translation" class="action-btn-small" @click="toggleTranslation">
						<text class="fas" :class="showTranslation ? 'fa-eye-slash' : 'fa-eye'"></text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 用户消息 -->
		<view v-else class="message user-message">
			<view class="message-content user-content">
				<view class="bubble user-bubble">
					<text class="message-text">{{ content }}</text>
					<text v-if="translation && showTranslation" class="translation-text">{{ translation }}</text>
				</view>
				<view class="chat-actions user-actions" v-if="showActions">
					<view class="action-btn-small user-action" @click="$emit('copy', content)">
						<text class="fas fa-copy"></text>
					</view>
					<view class="action-btn-small user-action" @click="$emit('speak', content)">
						<text class="fas fa-volume-up"></text>
					</view>
					<view v-if="translation" class="action-btn-small user-action" @click="toggleTranslation">
						<text class="fas" :class="showTranslation ? 'fa-eye-slash' : 'fa-eye'"></text>
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
		type: {
			type: String,
			required: true,
			validator: (value) => ['ai', 'user'].includes(value)
		},
		content: {
			type: String,
			required: true
		},
		translation: {
			type: String,
			default: ''
		},
		showActions: {
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
		}
	},
	emits: ['copy', 'speak']
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
</style>