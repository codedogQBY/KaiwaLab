<template>
	<view class="lab-container">
		<!-- 实验室装饰背景 -->
		<view class="lab-decoration">
			<!-- 试管装饰 -->
			<view class="test-tube test-tube-1">
				<view class="test-tube-fill" style="height: 65%; background: linear-gradient(to top, #2563EB, #3B82F6);"></view>
				<view class="test-tube-bubble bubble-1"></view>
				<view class="test-tube-bubble bubble-2"></view>
			</view>
			<view class="test-tube test-tube-2">
				<view class="test-tube-fill" style="height: 45%; background: linear-gradient(to top, #10B981, #34D399);"></view>
				<view class="test-tube-bubble bubble-1"></view>
			</view>
			<view class="test-tube test-tube-3">
				<view class="test-tube-fill" style="height: 80%; background: linear-gradient(to top, #F59E0B, #FBBF24);"></view>
				<view class="test-tube-bubble bubble-1"></view>
				<view class="test-tube-bubble bubble-2"></view>
				<view class="test-tube-bubble bubble-3"></view>
			</view>
			
			<!-- 烧瓶装饰 -->
			<view class="flask flask-1">
				<view class="flask-neck"></view>
				<view class="flask-body">
					<view class="flask-liquid" style="height: 40%; background: linear-gradient(to top, #8B5CF6, #A78BFA);"></view>
					<view class="flask-bubble bubble-1"></view>
					<view class="flask-bubble bubble-2"></view>
				</view>
			</view>
			
			<!-- 分子结构装饰 -->
			<view class="molecule molecule-1">
				<view class="atom atom-1"></view>
				<view class="atom atom-2"></view>
				<view class="atom atom-3"></view>
				<view class="bond bond-1"></view>
				<view class="bond bond-2"></view>
			</view>
		</view>
		
		<!-- 状态栏占位 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		
		<!-- 标题栏 -->
		<view class="header">
			<view class="header-left">
				<view @click="goBack">
					<text class="fas fa-arrow-left"></text>
				</view>
				<text class="header-title">AI实验台</text>
			</view>
			<view class="header-right">
				<view class="settings-btn" @click="toggleSettings">
					<text class="fas fa-cog"></text>
				</view>
				<view class="history-btn" @click="showHistory">
					<text class="fas fa-history"></text>
				</view>
			</view>
		</view>
		
		<!-- 设置抽屉 -->
		<uni-drawer ref="settingsDrawer" mode="right" :width="750" :mask="true" :maskClick="true" class="settings-drawer">
			<view class="drawer-content">
				<view class="drawer-header">
					<text class="drawer-title">会话设置</text>
					<view class="drawer-close" @click="closeSettings">
						<text class="fas fa-times"></text>
					</view>
				</view>
				<view class="drawer-body">
					<RolePlayController 
						:initialRole="currentRole"
						:initialScenario="currentScenario"
						:initialMode="currentMode"
						@role-change="onRoleChange"
						@mode-change="onModeChange"
						@setting-change="onSettingChange"
						@scenario-change="onScenarioChange"
					/>
				</view>
			</view>
		</uni-drawer>
		
		<!-- 对话区域 -->
		<scroll-view 
			class="chat-area" 
			scroll-y="true" 
			:scroll-top="scrollTop"
			scroll-with-animation="true"
		>
			<!-- 系统提示 -->
			<view class="system-prompt">
				<view class="prompt-icon">
					<text class="fas fa-robot"></text>
				</view>
				<text class="prompt-text">{{ getSystemPrompt() }}</text>
			</view>
			
			<!-- 对话消息 -->
			<view class="messages">
				<ChatBubble 
					v-for="(message, index) in messages" 
					:key="index"
					:message="message"
					@copy="copyText"
					@speak="speakText"
					@pronunciation-analyze="showPronunciationAnalysis"
				/>
			</view>
		</scroll-view>
		
		<!-- 发音分析面板 -->
		<view class="pronunciation-panel" v-if="showPronunciationPanel" @click="closePronunciationPanel">
			<view class="panel-content" @click.stop>
				<view class="panel-header">
					<text class="panel-title">发音分析</text>
					<view class="close-btn" @click="closePronunciationPanel">
						<text class="fas fa-times"></text>
					</view>
				</view>
				<PronunciationAnalyzer 
					:analysisData="currentAnalysis"
					@close="closePronunciationPanel"
					@retry="retryPronunciation"
					@play-original="playOriginalAudio"
					@play-recording="playRecordingAudio"
				/>
			</view>
		</view>
		
		<!-- 输入区域 -->
		<view class="input-area">
			<!-- 语音录制组件 -->
			<view class="voice-recorder" v-if="showVoiceRecorder">
				<PronunciationRecorder 
					@recording-complete="onRecordingComplete"
					@recording-cancel="onRecordingCancel"
					@back="exitVoiceInput"
					:targetText="currentTargetText"
				/>
			</view>
			
			<!-- 文本输入 -->
			<view class="input-container" v-else>
				<textarea 
					v-model="inputText" 
					class="input-field" 
					:placeholder="getInputPlaceholder()"
					auto-height
					:maxlength="500"
					@input="onInput"
				/>
				<view class="input-actions">
					<view class="voice-btn" @click="startVoiceInput">
						<text class="fas fa-microphone"></text>
					</view>
					<view class="send-btn" :class="{ 'active': inputText.trim() }" @click="sendMessage">
						<text class="fas fa-paper-plane"></text>
					</view>
				</view>
			</view>
			
			<!-- 快速操作栏 -->
			<view class="quick-actions" v-if="currentMode === 'practice'">
				<view class="action-btn" @click="requestPronunciationHelp">
					<text class="fas fa-question-circle"></text>
					<text class="action-text">发音帮助</text>
				</view>
				<view class="action-btn" @click="repeatLastSentence">
					<text class="fas fa-redo"></text>
					<text class="action-text">重复练习</text>
				</view>
				<view class="action-btn" @click="showPronunciationTips">
					<text class="fas fa-lightbulb"></text>
					<text class="action-text">发音技巧</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import ChatBubble from '@/components/ChatBubble/ChatBubble.vue'
import PronunciationRecorder from '@/components/PronunciationRecorder/PronunciationRecorder.vue'
import PronunciationAnalyzer from '@/components/PronunciationAnalyzer/PronunciationAnalyzer.vue'
import RolePlayController from '@/components/RolePlayController/RolePlayController.vue'

export default {
	name: 'AILab',
	components: {
		ChatBubble,
		PronunciationRecorder,
		PronunciationAnalyzer,
		RolePlayController
	},
	data() {
		return {
			inputText: '',
			scrollTop: 0,
			statusBarHeight: 0,
			
			// 界面控制
			showVoiceRecorder: false,
			showPronunciationPanel: false,
			
			// 角色扮演状态
			currentRole: 'user',
			currentMode: 'free', // free, guided, practice
			currentScenario: 'restaurant',
			
			// 语音相关
			currentTargetText: '',
			currentAnalysis: null,
			
			// 设置
			settings: {
				autoPlay: true,
				realTimeScore: true,
				voiceCorrection: true
			},
			
			messages: [
				{
					id: 1,
					type: 'ai',
					content: 'こんにちは！日本語の練習を始めましょう。',
					translation: '你好！让我们开始日语练习吧。',
					timestamp: new Date().toLocaleTimeString(),
					pronunciationScore: null,
					hasAudio: true
				},
				{
					id: 2,
					type: 'user',
					content: 'こんにちは！よろしくお願いします。',
					translation: '你好！请多关照。',
					timestamp: new Date().toLocaleTimeString(),
					pronunciationScore: 85,
					hasAudio: false
				}
			]
		}
	},
	methods: {
		// 系统提示文本
		getSystemPrompt() {
			switch (this.currentMode) {
				case 'practice':
					return '发音练习模式：我会帮你纠正发音，提供详细的语音反馈'
				case 'guided':
					return '引导对话模式：我会引导你进行结构化的日语对话练习'
				default:
					return '自由对话模式：与AI进行自然的日语对话，提升语言能力'
			}
		},
		
		// 输入框占位符
		getInputPlaceholder() {
			switch (this.currentMode) {
				case 'practice':
					return '输入日语进行发音练习...'
				case 'guided':
					return '根据提示回答问题...'
				default:
					return '输入你想说的话...'
			}
		},
		
		// 发送消息
		sendMessage() {
			if (this.inputText.trim()) {
				// 添加用户消息
				const userMessage = {
					id: Date.now(),
					type: 'user',
					content: this.inputText,
					timestamp: new Date().toLocaleTimeString(),
					pronunciationScore: null,
					hasAudio: false
				}
				this.messages.push(userMessage)
				
				// 清空输入框
				this.inputText = ''
				
				// 滚动到底部
				this.scrollToBottom()
				
				// 模拟AI回复
				this.simulateAIResponse(userMessage)
			}
		},
		
		// 模拟AI回复
		simulateAIResponse(userMessage) {
			setTimeout(() => {
				const aiMessage = {
					id: Date.now(),
					type: 'ai',
					content: 'ありがとうございます。他に何か質問がありますか？',
					translation: '谢谢您。还有其他问题吗？',
					timestamp: new Date().toLocaleTimeString(),
					pronunciationScore: null,
					hasAudio: true
				}
				this.messages.push(aiMessage)
				this.scrollToBottom()
			}, 1000)
		},
		
		// 输入事件
		onInput(e) {
			this.inputText = e.detail.value
		},
		
		// 开始语音输入
		startVoiceInput() {
			this.showVoiceRecorder = true
		},
		
		// 退出语音输入
		exitVoiceInput() {
			this.showVoiceRecorder = false
		},
		
		// 录音完成
		onRecordingComplete(result) {
			this.showVoiceRecorder = false
			
			// 添加用户语音消息
			const userMessage = {
				id: Date.now(),
				type: 'user',
				content: result.text,
				translation: result.translation,
				timestamp: new Date().toLocaleTimeString(),
				pronunciationScore: result.score,
				hasAudio: true,
				audioData: result.audioData
			}
			this.messages.push(userMessage)
			this.scrollToBottom()
			
			// 如果是练习模式，显示发音分析
			if (this.currentMode === 'practice' && result.analysis) {
				this.currentAnalysis = result.analysis
				this.showPronunciationPanel = true
			}
			
			// 模拟AI回复
			this.simulateAIResponse(userMessage)
		},
		
		// 取消录音
		onRecordingCancel() {
			this.showVoiceRecorder = false
		},
		
		// 显示发音分析
		showPronunciationAnalysis(message) {
			if (message.pronunciationScore !== null) {
				// 模拟分析数据
				this.currentAnalysis = {
					text: message.content,
					score: message.pronunciationScore,
					details: [
						{ phoneme: 'こ', score: 90, feedback: '发音准确' },
						{ phoneme: 'ん', score: 75, feedback: '鼻音可以更明显' },
						{ phoneme: 'に', score: 85, feedback: '音调略高' }
					]
				}
				this.showPronunciationPanel = true
			}
		},
		
		// 关闭发音分析面板
		closePronunciationPanel() {
			this.showPronunciationPanel = false
			this.currentAnalysis = null
		},
		
		// 重试发音
		retryPronunciation() {
			if (this.currentAnalysis) {
				this.currentTargetText = this.currentAnalysis.text
				this.closePronunciationPanel()
				this.startVoiceInput()
			}
		},
		
		// 播放原始音频
		playOriginalAudio() {
			uni.showToast({
				title: '播放原始音频',
				icon: 'none'
			})
		},
		
		// 播放录音音频
		playRecordingAudio() {
			uni.showToast({
				title: '播放录音音频',
				icon: 'none'
			})
		},
		
		// 角色变更
		onRoleChange(role) {
			this.currentRole = role
			uni.showToast({
				title: `切换到${role}角色`,
				icon: 'none'
			})
		},
		
		// 模式变更
		onModeChange(mode) {
			this.currentMode = mode
			uni.showToast({
				title: `切换到${mode}模式`,
				icon: 'none'
			})
		},
		
		// 场景变更
		onScenarioChange(scenario) {
			this.currentScenario = scenario
			uni.showToast({
				title: `切换到${scenario}场景`,
				icon: 'none'
			})
		},
		
		// 设置变更
		onSettingChange(setting) {
			this.settings = { ...this.settings, ...setting }
		},
		
		// 切换设置面板
		toggleSettings() {
			this.$refs.settingsDrawer.open()
		},
		
		// 关闭设置抽屉
		closeSettings() {
			this.$refs.settingsDrawer.close()
		},
		
		// 请求发音帮助
		requestPronunciationHelp() {
			uni.showToast({
				title: '发音帮助功能',
				icon: 'none'
			})
		},
		
		// 重复上一句
		repeatLastSentence() {
			const lastAIMessage = [...this.messages].reverse().find(m => m.type === 'ai')
			if (lastAIMessage) {
				this.speakText(lastAIMessage.content)
			}
		},
		
		// 显示发音技巧
		showPronunciationTips() {
			uni.showToast({
				title: '发音技巧面板',
				icon: 'none'
			})
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
		showHistory() {
			uni.showToast({
				title: '历史记录',
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
	min-height: 100vh;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 2;
}

/* 状态栏占位 */
.status-bar {
	background-color: #FFFFFF;
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
	box-sizing: border-box;
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

.header-right {
	display: flex;
	gap: 24rpx;
}

.settings-btn,
.history-btn {
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

/* 抽屉样式 */
.settings-drawer {
	z-index: 99999 !important;
}

.drawer-content {
	height: 100vh;
	width: 100vw;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
	position: fixed;
	top: 0;
	right: 0;
	z-index: 9999;
}

.drawer-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	border-bottom: 1rpx solid #E5E7EB;
	background-color: #F9FAFB;
	flex-shrink: 0;
}

.drawer-body {
	flex: 1;
	overflow-y: auto;
	padding: 0;
}

.drawer-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #1F2937;
}

.drawer-close {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background-color: #F3F4F6;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6B7280;
	transition: all 0.2s;
	
	&:active {
		background-color: #E5E7EB;
		transform: scale(0.95);
	}
	
	text {
		font-size: 28rpx;
	}
}

/* 对话区域 */
.chat-area {
	flex: 1;
	padding: 120rpx 32rpx 160rpx 32rpx;
	min-height: calc(100vh - 280rpx);
	box-sizing: border-box;
	width: 100%;
}

.system-prompt {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 24rpx;
	margin: 32rpx 0;
	background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
	border-radius: 20rpx;
}

.prompt-icon {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.2);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.prompt-text {
	flex: 1;
	color: #FFFFFF;
	font-size: 28rpx;
	line-height: 1.6;
}

.messages {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	padding-bottom: 32rpx;
}

/* 发音分析面板 */
.pronunciation-panel {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.panel-content {
	width: 90%;
	max-width: 600rpx;
	max-height: 80vh;
	background-color: white;
	border-radius: 24rpx;
	overflow: hidden;
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	border-bottom: 1rpx solid #E5E7EB;
	background-color: #F9FAFB;
}

.panel-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1F2937;
}

.close-btn {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background-color: #F3F4F6;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6B7280;
	transition: background-color 0.2s;

	&:active {
		background-color: #E5E7EB;
	}

	text {
		font-size: 24rpx;
	}
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
	box-sizing: border-box;
}

/* 语音录制组件 */
.voice-recorder {
	margin-bottom: 24rpx;
}



.input-container {
	display: flex;
	align-items: flex-start; /* 改为顶部对齐 */
	background-color: #F9FAFB;
	border-radius: 24rpx;
	padding: 16rpx;
	gap: 16rpx;
	border: 1rpx solid #E5E7EB;
}

.input-field {
	flex: 1;
	max-height: 248rpx; /* 5行高度: 28*1.6*5 + 24rpx padding = 224+24 */
	background-color: transparent;
	border: none;
	outline: none;
	font-size: 28rpx;
	color: #1F2937;
	line-height: 1.6;
	resize: none;
	padding: 12rpx 0;
	vertical-align: top;
	box-sizing: border-box;
	overflow-y: auto; /* 超出时显示滚动条 */
	word-wrap: break-word; /* 强制换行 */
	word-break: break-all; /* 防止长单词超出 */

	&::placeholder {
		color: #9CA3AF;
	}
}

.input-actions {
	display: flex;
	gap: 12rpx;
	align-items: flex-start; /* 改为顶部对齐 */
	padding-top: 8rpx; /* 添加顶部间距与textarea对齐 */
}

.voice-btn {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background-color: #F97316;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	transition: background-color 0.2s;

	&:active {
		background-color: #EA580C;
	}

	text {
		font-size: 28rpx;
	}
}

.send-btn {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background-color: #F3F4F6;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #9CA3AF;
	transition: all 0.2s;

	&.active {
		background-color: #2563EB;
		color: white;
	}

	&:active {
		transform: scale(0.95);
	}
}

/* 实验室装饰样式 */
.lab-decoration {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 1;
	opacity: 0.15;
}

/* 试管样式 */
.test-tube {
	position: absolute;
	width: 20rpx;
	height: 120rpx;
	border: 2rpx solid #E5E7EB;
	border-radius: 0 0 10rpx 10rpx;
	background: rgba(255, 255, 255, 0.8);
	overflow: hidden;
}

.test-tube-1 {
	top: 100rpx;
	right: 50rpx;
	animation: float 3s ease-in-out infinite;
}

.test-tube-2 {
	top: 300rpx;
	left: 30rpx;
	animation: float 4s ease-in-out infinite 1s;
}

.test-tube-3 {
	bottom: 200rpx;
	right: 80rpx;
	animation: float 3.5s ease-in-out infinite 0.5s;
}

.test-tube-fill {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	border-radius: 0 0 8rpx 8rpx;
	transition: height 0.3s ease;
}

.test-tube-bubble {
	position: absolute;
	width: 4rpx;
	height: 4rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.6);
	animation: bubble 2s ease-in-out infinite;
}

.test-tube-bubble.bubble-1 {
	left: 6rpx;
	bottom: 20rpx;
	animation-delay: 0s;
}

.test-tube-bubble.bubble-2 {
	left: 10rpx;
	bottom: 40rpx;
	animation-delay: 0.5s;
}

.test-tube-bubble.bubble-3 {
	left: 8rpx;
	bottom: 60rpx;
	animation-delay: 1s;
}

/* 烧瓶样式 */
.flask {
	position: absolute;
	width: 60rpx;
	height: 80rpx;
}

.flask-1 {
	top: 200rpx;
	left: 100rpx;
	animation: float 4s ease-in-out infinite 2s;
}

.flask-neck {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 12rpx;
	height: 20rpx;
	border: 2rpx solid #E5E7EB;
	border-bottom: none;
	background: rgba(255, 255, 255, 0.8);
}

.flask-body {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 60rpx;
	height: 60rpx;
	border: 2rpx solid #E5E7EB;
	border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
	background: rgba(255, 255, 255, 0.8);
	overflow: hidden;
}

.flask-liquid {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
	transition: height 0.3s ease;
}

.flask-bubble {
	position: absolute;
	width: 6rpx;
	height: 6rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.6);
	animation: bubble 2.5s ease-in-out infinite;
}

.flask-bubble.bubble-1 {
	left: 20rpx;
	bottom: 15rpx;
	animation-delay: 0.3s;
}

.flask-bubble.bubble-2 {
	left: 35rpx;
	bottom: 25rpx;
	animation-delay: 1.2s;
}

/* 分子结构样式 */
.molecule {
	position: absolute;
	width: 80rpx;
	height: 80rpx;
}

.molecule-1 {
	bottom: 300rpx;
	left: 50rpx;
	animation: rotate 10s linear infinite;
}

.atom {
	position: absolute;
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	border: 2rpx solid #E5E7EB;
	background: rgba(255, 255, 255, 0.8);
}

.atom-1 {
	top: 10rpx;
	left: 32rpx;
	background: #EF4444;
}

.atom-2 {
	bottom: 10rpx;
	left: 10rpx;
	background: #3B82F6;
}

.atom-3 {
	bottom: 10rpx;
	right: 10rpx;
	background: #10B981;
}

.bond {
	position: absolute;
	width: 2rpx;
	height: 30rpx;
	background: #E5E7EB;
	transform-origin: center;
}

.bond-1 {
	top: 25rpx;
	left: 39rpx;
	transform: rotate(45deg);
}

.bond-2 {
	top: 25rpx;
	right: 39rpx;
	transform: rotate(-45deg);
}

/* 动画效果 */
@keyframes float {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10rpx);
	}
}

@keyframes bubble {
	0% {
		opacity: 0;
		transform: translateY(0) scale(0.5);
	}
	50% {
		opacity: 1;
		transform: translateY(-20rpx) scale(1);
	}
	100% {
		opacity: 0;
		transform: translateY(-40rpx) scale(0.5);
	}
}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

/* 快速操作栏 */
.quick-actions {
	display: flex;
	justify-content: space-around;
	margin-top: 16rpx;
	padding: 16rpx 0;
	border-top: 1rpx solid #F3F4F6;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	padding: 12rpx;
	border-radius: 16rpx;
	transition: background-color 0.2s;

	&:active {
		background-color: #F3F4F6;
	}

	text:first-child {
		font-size: 32rpx;
		color: #6B7280;
	}
}

.action-text {
	font-size: 24rpx;
	color: #9CA3AF;
}
</style>