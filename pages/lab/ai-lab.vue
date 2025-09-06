<template>
	<view class="lab-container">
		<!-- 标题栏 -->
		<view class="header" :style="{ paddingTop: (statusBarHeight + 16) + 'px' }">
			<view class="header-left">
				<view class="back-btn" @click="goBack">
					<text class="fas fa-arrow-left"></text>
				</view>
				<text class="header-title">AI实验台</text>
			</view>
			<view class="header-actions">
				<view class="action-btn" @click="showHistory">
					<text class="fas fa-history"></text>
				</view>
				<view class="action-btn" @click="showMenu">
					<text class="fas fa-ellipsis-v"></text>
				</view>
			</view>
		</view>

		<!-- 对话区域 -->
		<scroll-view class="chat-area" scroll-y="true" :scroll-top="scrollTop" scroll-with-animation>
			<view class="chat-content">
				<!-- 系统提示 -->
				<view class="system-tip">
					<text class="tip-text">在这里与AI进行自由对话实验，尝试各种日语表达</text>
				</view>
				
				<!-- 对话消息列表 -->
				<view class="message-list">
					<ChatBubble 
						v-for="(message, index) in messages" 
						:key="index"
						:type="message.type"
						:content="message.content"
						:translation="message.translation"
						@copy="copyText"
						@speak="speakText"
					/>
				</view>
			</view>
		</scroll-view>

		<!-- 输入区域 -->
		<view class="input-area">
			<view class="input-container">
				<view class="input-btn" @click="toggleInputMethod">
					<text class="fas fa-keyboard"></text>
				</view>
				<input 
					class="message-input" 
					v-model="inputText" 
					placeholder="输入日语或点击麦克风说话..."
					@confirm="sendMessage"
				/>
				<view class="voice-btn" @click="toggleVoiceInput">
					<text class="fas fa-microphone"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import ChatBubble from '@/components/ChatBubble/ChatBubble.vue'

export default {
	name: 'Lab',
	components: {
		ChatBubble
	},
	data() {
		return {
			inputText: '',
			scrollTop: 0,
			statusBarHeight: 0,
			messages: [
				{
					type: 'ai',
					content: 'こんにちは！今日はどんな話をしましょうか？',
					translation: '你好！今天我们聊什么呢？'
				},
				{
					type: 'user',
					content: '日本へ旅行に行きたいので、観光について話したいです。',
					translation: '我想去日本旅行，所以想聊聊观光的事情。'
				},
				{
					type: 'ai',
					content: 'それはいいですね！どの都市に行きたいですか？東京？京都？それとも大阪？',
					translation: '那很好呢！你想去哪个城市？东京？京都？还是大阪？'
				},
				{
					type: 'user',
					content: '京都に行きたいです。有名な観光地を教えてください。',
					translation: '我想去京都。请告诉我有名的观光地。'
				},
				{
					type: 'ai',
					content: '京都はとても美しい都市ですね。清水寺、金閣寺、伏見稲荷大社が有名です。特に清水寺は夜景がすばらしいです。',
					translation: '京都是一个非常美丽的城市呢。清水寺、金阁寺、伏见稻荷大社很有名。特别是清水寺的夜景很棒。'
				}
			]
		}
	},
	methods: {
		sendMessage() {
			if (this.inputText.trim()) {
				// 添加用户消息
				this.messages.push({
					type: 'user',
					content: this.inputText
				})
				
				// 清空输入框
				this.inputText = ''
				
				// 滚动到底部
				this.scrollToBottom()
				
				// 模拟AI回复
				setTimeout(() => {
					this.messages.push({
						type: 'ai',
						content: 'ありがとうございます。他に何か質問がありますか？',
						translation: '谢谢您。还有其他问题吗？'
					})
					this.scrollToBottom()
				}, 1000)
			}
		},
		copyText(text) {
			uni.setClipboardData({
				data: text,
				success: () => {
					uni.showToast({
						title: '已复制到剪贴板',
						icon: 'none'
					})
				}
			})
		},
		speakText(text) {
			uni.showToast({
				title: '语音播放功能开发中',
				icon: 'none'
			})
		},
		toggleInputMethod() {
			uni.showToast({
				title: '输入法切换',
				icon: 'none'
			})
		},
		toggleVoiceInput() {
			uni.showToast({
				title: '语音输入功能开发中',
				icon: 'none'
			})
		},
		showHistory() {
			uni.showToast({
				title: '历史记录',
				icon: 'none'
			})
		},
		showMenu() {
			uni.showToast({
				title: '更多选项',
				icon: 'none'
			})
		},
		goBack() {
			uni.navigateBack({
				delta: 1
			})
		},
		getSystemInfo() {
			uni.getSystemInfo({
				success: (res) => {
					this.statusBarHeight = res.statusBarHeight || 0
				}
			})
		},
		scrollToBottom() {
			this.$nextTick(() => {
				this.scrollTop = 999999
			})
		}
	},
	mounted() {
		this.getSystemInfo()
		this.scrollToBottom()
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.lab-container {
	height: 100vh;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
	position: relative;
}

/* 标题栏 */
.header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	padding: 32rpx;
	border-bottom: 1rpx solid #DBEAFE;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: white;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.back-btn {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6B7280;
	transition: color 0.2s;

	&:active {
		color: #2563EB;
	}

	text {
		font-size: 32rpx;
	}
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1F2937;
}

.header-actions {
	display: flex;
	gap: 24rpx;
}

.action-btn {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6B7280;
	transition: color 0.2s;

	&:active {
		color: #2563EB;
	}

	text {
		font-size: 32rpx;
	}
}

/* 对话区域 */
.chat-area {
	flex: 1;
	padding: 16rpx;
	padding-top: 120rpx;
	padding-bottom: 160rpx;
	overflow-y: auto;
}

.chat-content {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

.system-tip {
	width: 89.5%;
	background-color: #EFF6FF;
	border-radius: 24rpx;
	padding: 24rpx;
	margin-top: 16rpx;
	text-align: center;
}

.tip-text {
	font-size: 28rpx;
	color: #6B7280;
	font-style: italic;
}

.message-list {
	display: flex;
	flex-direction: column;
}

/* 消息样式已移至ChatBubble组件 */

/* 输入区域 */
.input-area {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	padding: 24rpx;
	border-top: 1rpx solid #DBEAFE;
	background-color: white;
}

.input-container {
	display: flex;
	align-items: center;
	background-color: #EFF6FF;
	border-radius: 48rpx;
	padding: 16rpx 24rpx;
	gap: 16rpx;
}

.input-btn {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6B7280;
	transition: color 0.2s;

	&:active {
		color: #2563EB;
	}

	text {
		font-size: 32rpx;
	}
}

.message-input {
	flex: 1;
	background-color: transparent;
	border: none;
	outline: none;
	font-size: 28rpx;
	color: #1F2937;

	&::placeholder {
		color: #9CA3AF;
	}
}

.voice-btn {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background-color: #2563EB;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	transition: background-color 0.2s;

	&:active {
		background-color: rgba(37, 99, 235, 0.9);
	}

	text {
		font-size: 32rpx;
	}
}
</style>