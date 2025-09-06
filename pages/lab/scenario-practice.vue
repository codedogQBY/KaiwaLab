<template>
	<view class="scenario-container">
		<!-- 状态栏占位 -->
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		

		
		<!-- 场景背景头部 -->
		<view class="scenario-header">
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



		<!-- 对话区域 -->
		<scroll-view class="chat-area" scroll-y="true" :scroll-top="scrollTop">
			<view class="chat-content">
				<!-- 对话消息 -->
				<ChatBubble 
					v-for="(message, index) in messages" 
					:key="index"
					:message="message"
					:showPronunciation="false"
					@copy="copyText"
					@speak="speakText"
				/>
				
				<!-- 选择题区域 -->
				<view v-if="showChoices" class="choices-section">
					<view class="choices-header">
						<text class="choices-icon fas fa-comments"></text>
						<text class="choices-title">选择您的回应</text>
					</view>
					<view class="choices-list">
						<view 
							v-for="(choice, index) in currentChoices" 
							:key="index"
							class="choice-item"
							@click="selectChoice(choice)"
						>
							<view class="choice-number">{{ index + 1 }}</view>
							<view class="choice-content">
								<text class="choice-japanese">{{ choice.japanese }}</text>
								<text class="choice-chinese">{{ choice.chinese }}</text>
							</view>
							<view class="choice-indicator">
								<text class="fas fa-chevron-right"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部工具栏 -->
		<view class="bottom-toolbar">
			<!-- 自由输入模式 -->
			<view v-if="inputMode === 'free'" class="free-input-section">
				<view class="input-container">
					<textarea 
						v-model="freeInputText" 
						class="free-input" 
						placeholder="输入您的日语回复..." 
						@confirm="submitFreeInput" 
						auto-height
						:maxlength="200"
					/>
				</view>
				<view class="input-actions">
					<view class="mode-switch" @click="switchInputMode">
						<text class="fas fa-list"></text>
						<text class="switch-text">选择模式</text>
					</view>
					<view class="input-right-actions">
						<view class="action-btn" @click="startRecording">
							<text class="fas fa-microphone"></text>
						</view>
						<view class="send-btn" :class="{ 'active': freeInputText.trim() }" @click="submitFreeInput">
							<text class="fas fa-paper-plane"></text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 选择模式工具栏 -->
			<view v-else class="choice-toolbar">
				<view class="toolbar-actions">
					<view class="tool-btn" @click="showHint">
						<text class="fas fa-lightbulb"></text>
						<text class="tool-text">提示</text>
					</view>
					<view class="tool-btn" @click="repeatQuestion">
						<text class="fas fa-redo"></text>
						<text class="tool-text">重听</text>
					</view>
					<view class="tool-btn" @click="skipStep">
						<text class="fas fa-forward"></text>
						<text class="tool-text">跳过</text>
					</view>
					<view class="mode-switch" @click="switchInputMode">
						<text class="fas fa-keyboard"></text>
						<text class="switch-text">自由输入</text>
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
			inputMode: 'choice',
			messages: [
			{
				type: 'ai',
				content: 'いらっしゃいませ！今日のおすすめは新鮮な刺身と寿司です。何かご質問はありますか？',
				translation: '欢迎光临！今天推荐新鲜的生鱼片和寿司。有什么问题吗？',
				timestamp: new Date().toLocaleTimeString()
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
			return Math.round((this.currentStep / this.totalSteps) * 100)
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
		},
		switchInputMode() {
			this.inputMode = this.inputMode === 'choice' ? 'free' : 'choice'
		},
		repeatQuestion() {
			uni.showToast({
				title: '重听功能开发中',
				icon: 'none'
			})
		},
		skipStep() {
			uni.showModal({
				title: '确认跳过',
				content: '确定要跳过当前步骤吗？',
				success: (res) => {
					if (res.confirm) {
						this.nextStep()
					}
				}
			})
		},
		nextStep() {
			if (this.currentStep < this.totalSteps) {
				this.currentStep++
				// 模拟下一步对话
				const nextDialogs = [
					{
						type: 'ai',
						content: 'かしこまりました。お席にご案内いたします。',
						translation: '好的，我来为您带路。',
						timestamp: new Date().toLocaleTimeString()
					},
					{
						type: 'ai',
						content: 'お飲み物はいかがですか？',
						translation: '请问要点什么饮料吗？',
						timestamp: new Date().toLocaleTimeString()
					}
				]
				
				if (this.currentStep <= nextDialogs.length) {
					this.messages.push(nextDialogs[this.currentStep - 2])
					this.updateChoices()
					this.scrollToBottom()
				}
			} else {
				uni.showToast({
					title: '练习完成！',
					icon: 'success'
				})
			}
		},
		updateChoices() {
			// 根据当前步骤更新选择项
			const choicesByStep = {
				2: [
					{ japanese: 'お水をお願いします。', chinese: '请给我水。' },
					{ japanese: 'ビールをお願いします。', chinese: '请给我啤酒。' },
					{ japanese: 'お茶をお願いします。', chinese: '请给我茶。' }
				],
				3: [
					{ japanese: 'メニューを見せてください。', chinese: '请给我看菜单。' },
					{ japanese: 'おすすめは何ですか？', chinese: '有什么推荐的吗？' },
					{ japanese: '少し考えます。', chinese: '我想一下。' }
				]
			}
			
			this.currentChoices = choicesByStep[this.currentStep] || []
			this.showChoices = this.currentChoices.length > 0
		},
		goBack() {
			uni.navigateBack()
		},
		showHelp() {
			uni.showModal({
				title: '使用帮助',
				content: '在场景练习中，您可以选择预设回复或切换到自由输入模式。点击提示按钮获取帮助，点击重听按钮重复播放对话。',
				showCancel: false
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
	background: linear-gradient(135deg, #F97316, #DC2626);
}

.bg-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0.8;
	z-index: 1;
}

.bg-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.2);
	z-index: 2;
}



	/* 头部导航 */
	.header-nav {
		position: absolute;
		top: 32rpx;
		left: 32rpx;
		right: 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 10;
	}

	.nav-btn {
		width: 64rpx;
		height: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.nav-btn text {
		color: white;
		font-size: 32rpx;
	}

	.nav-btn:hover {
		transform: scale(1.1);
		opacity: 0.8;
	}

	.header-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4rpx;
	}

	.scenario-title {
		font-size: 36rpx;
		font-weight: bold;
		color: white;
	}

	.scenario-progress {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	/* 进度条 */
	.progress-container {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 8rpx;
		z-index: 10;
	}

	.progress-bar {
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.3);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #2563EB;
		transition: width 0.3s ease;
	}





/* 对话区域 */
.chat-area {
	flex: 1;
	overflow-y: auto;
	padding-bottom: env(safe-area-inset-bottom);
}

.chat-content {
	padding: 32rpx;
	padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

/* 消息样式已移至ChatBubble组件 */

/* 选择题区域 */
.choices-section {
	padding: 32rpx 24rpx;
	background: white;
	margin: 20rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid #F1F5F9;
}

.choices-header {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
	gap: 12rpx;
}

.choices-icon {
	font-size: 28rpx;
	color: #F97316;
}

.choices-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #1E293B;
}

.choices-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.choice-item {
	padding: 24rpx;
	background: #F8FAFC;
	border-radius: 16rpx;
	border: 2rpx solid #E2E8F0;
	transition: all 0.3s ease;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 16rpx;
	position: relative;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 0;
		background: linear-gradient(90deg, rgba(249, 115, 22, 0.1), transparent);
		transition: width 0.3s ease;
	}

	&:hover {
		background: #FFF7ED;
		border-color: #F97316;
		transform: translateY(-2rpx);
		box-shadow: 0 4rpx 12rpx rgba(249, 115, 22, 0.15);
	}

	&:hover::before {
		width: 100%;
	}

	&:active {
		transform: translateY(0);
	}
}

.choice-number {
	width: 48rpx;
	height: 48rpx;
	background: #F97316;
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	font-weight: 600;
	flex-shrink: 0;
	z-index: 1;
}

.choice-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	z-index: 1;
}

.choice-japanese {
	font-size: 32rpx;
	font-weight: 500;
	color: #1E293B;
	line-height: 1.4;
}

.choice-chinese {
	font-size: 26rpx;
	color: #64748B;
	line-height: 1.3;
}

.choice-indicator {
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #94A3B8;
	font-size: 20rpx;
	transition: all 0.3s ease;
	z-index: 1;
}

.choice-item:hover .choice-indicator {
	color: #F97316;
	transform: translateX(4rpx);
}

/* 底部工具栏 */
.bottom-toolbar {
	position: sticky;
	bottom: 0;
	left: 0;
	right: 0;
	background: white;
	padding: 16rpx 20rpx;
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
	border-top: 1rpx solid #E2E8F0;
	z-index: 1000;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.03);
	min-height: auto;
}

/* 自由输入模式 */
.free-input-section {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.input-container {
	position: relative;
	background: #F8FAFC;
	border-radius: 16rpx;
	border: 2rpx solid #E2E8F0;
	padding: 12rpx;
	transition: all 0.3s ease;
}

.input-container:focus-within {
	border-color: #2563EB;
	box-shadow: 0 0 0 3rpx rgba(37, 99, 235, 0.1);
}

.free-input {
	width: 100%;
	min-height: 60rpx;
	max-height: 160rpx;
	padding: 0;
	border: none;
	background: transparent;
	font-size: 28rpx;
	color: #1E293B;
	line-height: 1.4;
	resize: none;
}

.input-actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8rpx;
	margin-top: 8rpx;
	padding-top: 8rpx;
	border-top: 1rpx solid #E2E8F0;
}

.input-actions .mode-switch {
	flex-shrink: 0;
}

.input-right-actions {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.action-btn {
	width: 56rpx;
	height: 56rpx;
	background: #F1F5F9;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	border: 2rpx solid transparent;
}

.action-btn:hover {
	background: #E2E8F0;
	transform: scale(1.05);
}

.action-btn:active {
	transform: scale(0.95);
}

.action-btn text {
	color: #64748B;
	font-size: 28rpx;
}

.send-btn {
	width: 56rpx;
	height: 56rpx;
	background: #E2E8F0;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	border: 2rpx solid transparent;
}

.send-btn.active {
	background: #2563EB;
	box-shadow: 0 3rpx 8rpx rgba(37, 99, 235, 0.3);
}

.send-btn text {
	color: #94A3B8;
	font-size: 28rpx;
	transition: color 0.3s ease;
}

.send-btn.active text {
	color: white;
}

.send-btn:hover {
	transform: scale(1.05);
}

.send-btn:active {
	transform: scale(0.95);
}

/* 选择模式工具栏 */
.choice-toolbar {
	display: flex;
	justify-content: center;
}

.toolbar-actions {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.tool-btn {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 6rpx;
	padding: 10rpx 16rpx;
	border-radius: 12rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	min-width: auto;
}

.tool-btn:hover {
	background: #F1F5F9;
	transform: translateY(-2rpx);
}

.tool-btn:active {
	transform: translateY(0);
}

.tool-btn text:first-child {
	font-size: 28rpx;
	color: #2563EB;
}

.tool-text {
	font-size: 20rpx;
	color: #64748B;
	font-weight: 500;
}

/* 模式切换按钮 */
.mode-switch {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 10rpx 16rpx;
	background: #F1F5F9;
	border-radius: 20rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	border: 2rpx solid transparent;
}

.mode-switch:hover {
	background: #E2E8F0;
	border-color: #CBD5E1;
}

.mode-switch text:first-child {
	font-size: 22rpx;
	color: #2563EB;
}

.switch-text {
	font-size: 22rpx;
	color: #64748B;
	font-weight: 500;
}
</style>