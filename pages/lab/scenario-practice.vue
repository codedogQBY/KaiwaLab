<template>
	<view class="scenario-container">
		<!-- 场景背景 -->
		<view class="scenario-header" :style="{ paddingTop: (statusBarHeight + 16) + 'px' }">
			<image class="bg-image" src="/static/images/restaurant.jpg" mode="aspectFill"></image>
			<view class="bg-overlay"></view>
			
			<!-- 头部导航 -->
			<view class="header-nav">
				<view class="nav-btn" @click="goBack">
					<text class="fas fa-arrow-left"></text>
				</view>
				<view class="header-center">
					<text class="scenario-title">{{ scenarioData.title }}</text>
					<text class="scenario-progress">场景 {{ currentStep }}/{{ totalSteps }}</text>
				</view>
				<view class="nav-btn" @click="showHelp">
					<text class="fas fa-question-circle"></text>
				</view>
			</view>
			
			<!-- 进度条 -->
			<view class="progress-container">
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
				</view>
			</view>
		</view>

		<!-- 角色信息 -->
		<view class="character-info">
			<view class="character-avatar">
				<text class="fas fa-user-tie"></text>
			</view>
			<view class="character-details">
				<text class="character-name">{{ scenarioData.character.name }}</text>
				<text class="character-role">{{ scenarioData.character.description }}</text>
			</view>
			<view class="character-badge">
				<text class="badge-text">AI角色</text>
			</view>
		</view>

		<!-- 对话区域 -->
		<scroll-view class="chat-area" scroll-y="true" :scroll-top="scrollTop">
			<view class="chat-content">
				<!-- 对话消息 -->
				<ChatBubble 
					v-for="(message, index) in messages" 
					:key="index"
					:type="message.type"
					:content="message.content"
					:translation="message.translation"
					@copy="copyText"
					@speak="speakText"
				/>
				
				<!-- 选择题区域 -->
				<view v-if="showChoices" class="choices-section">
					<text class="choices-title">选择您的回应：</text>
					<view class="choices-list">
						<view 
							v-for="(choice, index) in currentChoices" 
							:key="index"
							class="choice-item"
							@click="selectChoice(choice)"
						>
							<text class="choice-japanese">{{ choice.japanese }}</text>
							<text class="choice-chinese">{{ choice.chinese }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部工具栏 -->
		<view class="bottom-toolbar">
			<view class="toolbar-content">
				<view class="input-container">
				<input class="free-input" v-model="freeInputText" placeholder="输入您的日语回复..." @confirm="submitFreeInput" confirm-type="send" />
				<view class="input-send-btn" @click="submitFreeInput" v-if="freeInputText.trim()">
					<text class="fas fa-paper-plane"></text>
				</view>
			</view>
				<view class="action-buttons">
					<view class="round-btn mic-btn" @click="startRecording">
						<text class="fas fa-microphone"></text>
					</view>
					<view class="round-btn hint-btn" @click="showHint">
						<text class="fas fa-lightbulb"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import ChatBubble from '@/components/ChatBubble/ChatBubble.vue'

export default {
	name: 'ScenarioPractice',
	components: {
		ChatBubble
	},
	data() {
		return {
			statusBarHeight: 0,
			scrollTop: 0,
			currentStep: 1,
			totalSteps: 8,
			showChoices: true,
			freeInputText: '',
			scenarioData: {
				title: '餐厅点餐',
				character: {
					name: '服务员田中',
					description: '为您介绍今日推荐菜品'
				}
			},
			messages: [
				{
					type: 'ai',
					content: 'いらっしゃいませ！今日のおすすめは新鮮な刺身と寿司です。何かご質問はありますか？',
					translation: '欢迎光临！今天推荐新鲜的生鱼片和寿司。有什么问题吗？'
				}
			],
			currentChoices: [
				{
					japanese: '刺身はどのくらいの値段ですか？',
					chinese: '生鱼片多少钱？',
					correct: true
				},
				{
					japanese: '寿司のセットはありますか？',
					chinese: '有寿司套餐吗？',
					correct: true
				},
				{
					japanese: 'メニューを見せてください。',
					chinese: '请给我看看菜单。',
					correct: true
				}
			],
			dialogueSteps: [
				{
					ai: 'いらっしゃいませ！今日のおすすめは新鮮な刺身と寿司です。何かご質問はありますか？',
					aiTranslation: '欢迎光临！今天推荐新鲜的生鱼片和寿司。有什么问题吗？',
					choices: [
						{ japanese: '刺身はどのくらいの値段ですか？', chinese: '生鱼片多少钱？', correct: true },
						{ japanese: '寿司のセットはありますか？', chinese: '有寿司套餐吗？', correct: true },
						{ japanese: 'メニューを見せてください。', chinese: '请给我看看菜单。', correct: true }
					]
				},
				{
					ai: '刺身は一人前2000円です。寿司セットは3500円になります。',
					aiTranslation: '生鱼片一人份2000日元。寿司套餐是3500日元。',
					choices: [
						{ japanese: '刺身をお願いします。', chinese: '请给我生鱼片。', correct: true },
						{ japanese: '寿司セットにします。', chinese: '我要寿司套餐。', correct: true },
						{ japanese: 'もう少し考えます。', chinese: '我再想想。', correct: false }
					]
				},
				{
					ai: 'かしこまりました。お飲み物はいかがですか？',
					aiTranslation: '好的。饮料怎么样？',
					choices: [
						{ japanese: '緑茶をお願いします。', chinese: '请给我绿茶。', correct: true },
						{ japanese: 'ビールはありますか？', chinese: '有啤酒吗？', correct: true },
						{ japanese: '水で結構です。', chinese: '水就可以了。', correct: true }
					]
				},
				{
					ai: 'はい、緑茶ですね。少々お待ちください。',
					aiTranslation: '好的，绿茶。请稍等。',
					choices: [
						{ japanese: 'ありがとうございます。', chinese: '谢谢。', correct: true },
						{ japanese: 'お忙しい中すみません。', chinese: '百忙中打扰了。', correct: true },
						{ japanese: 'よろしくお願いします。', chinese: '拜托了。', correct: true }
					]
				},
				{
					ai: 'お待たせしました。こちら刺身と緑茶です。ごゆっくりどうぞ。',
					aiTranslation: '让您久等了。这是生鱼片和绿茶。请慢用。',
					choices: [
						{ japanese: 'いただきます。', chinese: '我开动了。', correct: true },
						{ japanese: 'おいしそうですね。', chinese: '看起来很好吃。', correct: true },
						{ japanese: 'ありがとうございます。', chinese: '谢谢。', correct: true }
					]
				},
				{
					ai: 'お食事はいかがでしたか？',
					aiTranslation: '用餐怎么样？',
					choices: [
						{ japanese: 'とてもおいしかったです。', chinese: '非常好吃。', correct: true },
						{ japanese: '新鮮で美味しかったです。', chinese: '很新鲜很好吃。', correct: true },
						{ japanese: 'ごちそうさまでした。', chinese: '我吃饱了。', correct: true }
					]
				},
				{
					ai: 'ありがとうございます。お会計は2500円になります。',
					aiTranslation: '谢谢。账单是2500日元。',
					choices: [
						{ japanese: 'カードで支払えますか？', chinese: '可以用卡支付吗？', correct: true },
						{ japanese: '現金で払います。', chinese: '我用现金付。', correct: true },
						{ japanese: 'レシートをお願いします。', chinese: '请给我收据。', correct: true }
					]
				},
				{
					ai: 'はい、カードでお支払いいただけます。ありがとうございました。',
					aiTranslation: '好的，可以用卡支付。谢谢您。',
					choices: [
						{ japanese: 'ありがとうございました。', chinese: '谢谢。', correct: true },
						{ japanese: 'また来ます。', chinese: '我还会再来的。', correct: true },
						{ japanese: 'お疲れさまでした。', chinese: '辛苦了。', correct: true }
					]
				}
			]
		}
	},
	computed: {
		progressPercent() {
			return (this.currentStep / this.totalSteps) * 100
		}
	},
	onLoad(options) {
		// 从路由参数获取场景信息
		if (options.scenario) {
			this.loadScenario(options.scenario)
		}
		this.getSystemInfo()
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		showHelp() {
			uni.showModal({
				title: '场景说明',
				content: '在这个场景中，您将学习餐厅点餐的基本日语表达。请根据AI角色的话语选择合适的回应。',
				showCancel: false
			})
		},
		loadScenario(scenarioType) {
			// 根据场景类型加载不同的对话数据
			switch(scenarioType) {
				case 'convenience':
					this.scenarioData.title = '便利店购物'
					this.scenarioData.character.name = '店员佐藤'
					this.scenarioData.character.description = '为您介绍商品和价格'
					break
				case 'hotel':
					this.scenarioData.title = '酒店入住'
					this.scenarioData.character.name = '前台小姐'
					this.scenarioData.character.description = '为您办理入住手续'
					break
				default:
					// 默认餐厅场景
					break
			}
		},
		selectChoice(choice) {
			// 添加用户选择的消息
			this.messages.push({
				type: 'user',
				content: choice.japanese,
				translation: choice.chinese
			})

			// 隐藏选择题
			this.showChoices = false

			// 滚动到底部
			this.scrollToBottom()

			// 显示反馈
			if (choice.correct) {
				uni.showToast({
					title: '回答正确！',
					icon: 'success'
				})
			} else {
				uni.showToast({
					title: '再试试看',
					icon: 'none'
				})
			}

			// 进入下一步
			setTimeout(() => {
				this.nextStep()
			}, 1500)
		},
		nextStep() {
			if (this.currentStep < this.totalSteps) {
				this.currentStep++
				
				// 添加下一个AI消息
				if (this.currentStep <= this.dialogueSteps.length) {
					const step = this.dialogueSteps[this.currentStep - 1]
					this.messages.push({
						type: 'ai',
						content: step.ai,
						translation: step.aiTranslation
					})
					
					this.currentChoices = step.choices
					this.showChoices = true
					this.scrollToBottom()
				} else {
					// 场景完成
					this.completeScenario()
				}
			}
		},
		completeScenario() {
			uni.showModal({
				title: '恭喜！',
				content: '您已完成本场景练习！',
				confirmText: '查看报告',
				cancelText: '继续练习',
				success: (res) => {
					if (res.confirm) {
						// 跳转到实验报告
						uni.navigateTo({
							url: '/pages/lab/report'
						})
					} else {
						// 重新开始
						this.resetScenario()
					}
				}
			})
		},
		resetScenario() {
			this.currentStep = 1
			this.messages = [
				{
					type: 'ai',
					content: this.dialogueSteps[0].ai,
					translation: this.dialogueSteps[0].aiTranslation
				}
			]
			this.currentChoices = this.dialogueSteps[0].choices
			this.showChoices = true
			this.scrollToBottom()
		},
		speakText(text) {
			uni.showToast({
				title: '语音播放功能开发中',
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
		submitFreeInput() {
			if (!this.freeInputText.trim()) return
			
			// 添加用户自定义输入的消息
			this.messages.push({
				type: 'user',
				content: this.freeInputText.trim(),
				translation: '(自定义输入)'
			})
			
			// 清空输入框
			this.freeInputText = ''
			
			// 隐藏选择题
			this.showChoices = false
			
			// 滚动到底部
			this.scrollToBottom()
			
			// 显示反馈
			uni.showToast({
				title: '很好的尝试！',
				icon: 'success'
			})
			
			// 进入下一步
			setTimeout(() => {
				this.nextStep()
			}, 1500)
		},
		startRecording() {
			uni.showToast({
				title: '语音识别功能开发中',
				icon: 'none'
			})
		},
		showHint() {
			uni.showToast({
				title: '提示功能开发中',
				icon: 'none'
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
		this.scrollToBottom()
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.scenario-container {
	height: 100vh;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
}

/* 场景背景 */
.scenario-header {
	position: relative;
	height: 256rpx;
	overflow: hidden;
}

.bg-image {
	width: 100%;
	height: 100%;
	opacity: 0.8;
}

.bg-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.2);
}

/* 头部导航 */
.header-nav {
	position: absolute;
	top: 16rpx;
	left: 32rpx;
	right: 32rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 10;
}

.nav-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	transition: color 0.2s;
	padding: 16rpx;

	&:active {
		color: rgba(255, 255, 255, 0.7);
	}

	text {
		font-size: 32rpx;
		font-family: 'Font Awesome 6 Free';
		font-weight: 900;
	}
}

.header-center {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.scenario-title {
	font-size: 32rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 4rpx;
}

.scenario-progress {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.8);
}

/* 进度条 */
.progress-container {
	position: absolute;
	bottom: 32rpx;
	left: 32rpx;
	right: 32rpx;
	z-index: 10;
}

.progress-bar {
	width: 100%;
	height: 8rpx;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 8rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: white;
	border-radius: 8rpx;
	transition: width 0.5s ease;
}

/* 角色信息 */
.character-info {
	padding: 32rpx;
	background: #F8FAFC;
	border-bottom: 1rpx solid #E2E8F0;
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.character-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #F97316, #EA580C);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	text {
		font-size: 36rpx;
		font-family: 'Font Awesome 6 Free';
		font-weight: 900;
	}
}

.character-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.character-name {
	font-size: 32rpx;
	font-weight: 600;
	color: #1F2937;
}

.character-role {
	font-size: 24rpx;
	color: #6B7280;
}

.character-badge {
	flex-shrink: 0;
}

.badge-text {
	font-size: 24rpx;
	color: #F97316;
	background: #FFF7ED;
	padding: 8rpx 16rpx;
	border-radius: 24rpx;
	border: 1rpx solid #FDBA74;
}

/* 对话区域 */
.chat-area {
	flex: 1;
	overflow-y: auto;
}

.chat-content {
	padding: 32rpx;
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

/* 消息样式已移至ChatBubble组件 */

/* 选择题区域 */
.choices-section {
	background: #EFF6FF;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-top: 32rpx;
}

.choices-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1E40AF;
	margin-bottom: 24rpx;
	display: block;
}

.choices-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.choice-item {
	padding: 24rpx;
	background: white;
	border: 2rpx solid #DBEAFE;
	border-radius: 16rpx;
	transition: all 0.2s ease;
	cursor: pointer;

	&:active {
		background: #F0F9FF;
		border-color: #2563EB;
		transform: translateY(2rpx);
	}
}

.choice-japanese {
	font-size: 30rpx;
	color: #1F2937;
	font-weight: 500;
	display: block;
	margin-bottom: 8rpx;
}

.choice-chinese {
	font-size: 26rpx;
	color: #6B7280;
	font-style: italic;
	display: block;
}

/* 底部工具栏 */
.bottom-toolbar {
	padding: 24rpx 32rpx;
	background: white;
	border-top: 1rpx solid #E5E7EB;
}

.toolbar-content {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.input-container {
	flex: 1;
	height: 80rpx;
	position: relative;
	display: flex;
	align-items: center;
}

.free-input {
	flex: 1;
	height: 100%;
	background: #EFF6FF;
	border: none;
	border-radius: 40rpx;
	color: #374151;
	font-size: 28rpx;
	padding: 0 24rpx;
	padding-right: 60rpx;

	&::placeholder {
		color: #9CA3AF;
	}
}

.input-send-btn {
	position: absolute;
	right: 8rpx;
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background: #2563EB;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;

	&:active {
		background: #1D4ED8;
		transform: scale(0.95);
	}

	text {
		font-size: 24rpx;
		font-family: 'Font Awesome 6 Free';
		font-weight: 900;
	}
}

.action-buttons {
	display: flex;
	gap: 24rpx;
}

.round-btn {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	transition: all 0.2s;

	&:active {
		transform: scale(0.95);
	}

	text {
		font-size: 32rpx;
		font-family: 'Font Awesome 6 Free';
		font-weight: 900;
	}
}

.mic-btn {
	background: #2563EB;

	&:active {
		background: #1D4ED8;
	}
}

.hint-btn {
	background: #F97316;

	&:active {
		background: #EA580C;
	}
}
</style>