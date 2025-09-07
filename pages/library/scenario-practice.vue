<template>
	<view class="library-scenario-container">
		<!-- 标题栏 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="fa fa-arrow-left back-btn"></text>
			</view>
			<text class="header-title">情景模拟</text>
			<view class="header-right">
				<text class="fa fa-cog settings-btn" @click="showSettings"></text>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-wrapper">
			<!-- 场景选择 -->
			<view class="scenario-selection" v-if="!scenarioStarted">
				<view class="section-title">
					<text>选择练习场景</text>
				</view>
				
				<view class="scenario-grid">
					<view 
						v-for="(scenario, index) in scenarios" 
						:key="index"
						class="scenario-card"
						@click="startScenario(scenario)"
					>
						<view class="scenario-icon" :class="scenario.iconClass">
							<text :class="['fa', scenario.icon]"></text>
						</view>
						<text class="scenario-name">{{ scenario.name }}</text>
						<text class="scenario-desc">{{ scenario.description }}</text>
					</view>
				</view>
			</view>

			<!-- 场景练习 -->
			<view class="scenario-practice" v-else>
				<!-- 场景信息 -->
				<view class="scenario-info">
					<view class="scenario-header">
						<view class="scenario-icon" :class="currentScenario.iconClass">
							<text :class="['fa', currentScenario.icon]"></text>
						</view>
						<view class="scenario-details">
							<text class="scenario-name">{{ currentScenario.name }}</text>
							<text class="scenario-progress">{{ currentStep }} / {{ totalSteps }} 步骤</text>
						</view>
					</view>
				</view>

				<!-- 对话区域 -->
				<scroll-view class="dialogue-area" scroll-y="true" :scroll-top="scrollTop">
					<view class="dialogue-content">
						<!-- AI消息 -->
						<view class="message ai-message" v-for="(message, index) in aiMessages" :key="'ai-'+index">
							<view class="message-bubble">
								<text class="message-text">{{ message.text }}</text>
								<text class="message-translation">{{ message.translation }}</text>
							</view>
						</view>
						
						<!-- 用户选择 -->
						<view class="message user-message" v-if="showUserChoices">
							<view class="message-bubble user-bubble">
								<text class="message-text">{{ selectedChoice }}</text>
							</view>
						</view>
					</view>
				</scroll-view>

				<!-- 选择区域 -->
				<view class="choices-area" v-if="showChoices">
					<view class="choices-title">选择合适的回应：</view>
					<view 
						v-for="(choice, index) in currentChoices" 
						:key="index"
						class="choice-item"
						@click="selectChoice(choice)"
					>
						<text class="choice-text">{{ choice.text }}</text>
						<text class="choice-translation">{{ choice.translation }}</text>
					</view>
				</view>

				<!-- 结果反馈 -->
				<view v-if="showResult" class="result-section" :class="isCorrect ? 'correct' : 'incorrect'">
					<text :class="['fa', isCorrect ? 'fa-check-circle' : 'fa-times-circle', 'result-icon']"></text>
					<text class="result-text">{{ isCorrect ? '回答正确!' : '回答错误，请再试一次' }}</text>
				</view>

				<!-- 操作按钮 -->
				<view class="action-buttons">
					<button class="action-btn retry-btn" @click="retryStep" v-if="!isCorrect && showResult">
						<text class="fa fa-redo"></text>
						<text class="btn-text">重试</text>
					</button>
					<button class="action-btn next-btn" @click="nextStep" :disabled="!showResult || !isCorrect">
						<text class="btn-text">{{ currentStep < totalSteps ? '下一题' : '完成' }}</text>
						<text class="fa fa-arrow-right" v-if="currentStep < totalSteps"></text>
					</button>
				</view>
			</view>

			<!-- 练习统计 -->
			<view class="stats-section" v-if="scenarioStarted">
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
						<text class="setting-label">显示翻译</text>
						<switch :checked="showTranslation" @change="toggleTranslation" />
					</view>
					<view class="setting-item">
						<text class="setting-label">自动播放</text>
						<switch :checked="autoPlay" @change="toggleAutoPlay" />
					</view>
					<view class="setting-item">
						<text class="setting-label">难度等级</text>
						<picker mode="selector" :range="difficultyLevels" @change="onDifficultyChange">
							<view class="picker">
								<text>{{ selectedDifficulty }}</text>
							</view>
						</picker>
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
	name: 'LibraryScenarioPractice',
	data() {
		return {
			scenarioStarted: false,
			currentScenario: {},
			currentStep: 1,
			totalSteps: 5,
			scrollTop: 0,
			showChoices: true,
			showUserChoices: false,
			showResult: false,
			isCorrect: false,
			selectedChoice: '',
			showSettingsModal: false,
			showTranslation: true,
			autoPlay: true,
			selectedDifficulty: '中级',
			difficultyLevels: ['初级', '中级', '高级'],
			stats: {
				correct: 0,
				incorrect: 0
			},
			scenarios: [
				{
					id: 'restaurant',
					name: '餐厅点餐',
					description: '学习在餐厅点餐的基本表达',
					icon: 'fa-utensils',
					iconClass: 'restaurant'
				},
				{
					id: 'shopping',
					name: '购物',
					description: '学习购物时的常用表达',
					icon: 'fa-shopping-cart',
					iconClass: 'shopping'
				},
				{
					id: 'transport',
					name: '交通问路',
					description: '学习问路和交通相关表达',
					icon: 'fa-subway',
					iconClass: 'transport'
				},
				{
					id: 'hotel',
					name: '酒店入住',
					description: '学习酒店入住相关表达',
					icon: 'fa-hotel',
					iconClass: 'hotel'
				}
			],
			scenarioData: {
				restaurant: {
					steps: [
						{
							ai: {
								text: 'いらっしゃいませ！何かご注文されますか？',
								translation: '欢迎光临！您要点什么吗？'
							},
							choices: [
								{
									text: 'メニューを見せてください。',
									translation: '请给我看看菜单。',
									correct: true
								},
								{
									text: 'おすすめは何ですか？',
									translation: '有什么推荐的吗？',
									correct: true
								},
								{
									text: 'お水をください。',
									translation: '请给我一杯水。',
									correct: false
								}
							]
						},
						{
							ai: {
								text: 'こちらがメニューです。おすすめは今日の刺身と牛丼です。',
								translation: '这是菜单。推荐今天的生鱼片和牛丼。'
							},
							choices: [
								{
									text: '刺身をお願いします。',
									translation: '请给我生鱼片。',
									correct: true
								},
								{
									text: '牛丼にします。',
									translation: '我要牛丼。',
									correct: true
								},
								{
									text: 'どちらも美味しそうですね。',
									translation: '看起来都很好吃呢。',
									correct: false
								}
							]
						},
						{
							ai: {
								text: 'かしこまりました。飲み物はいかがですか？',
								translation: '好的。饮料怎么样？'
							},
							choices: [
								{
									text: '緑茶をお願いします。',
									translation: '请给我绿茶。',
									correct: true
								},
								{
									text: 'コーラでいいです。',
									translation: '可乐就可以了。',
									correct: true
								},
								{
									text: 'ありがとうございます。',
									translation: '谢谢。',
									correct: false
								}
							]
						},
						{
							ai: {
								text: '少々お待ちください。お待たせしました。',
								translation: '请稍等。让您久等了。'
							},
							choices: [
								{
									text: 'いただきます。',
									translation: '我开动了。',
									correct: true
								},
								{
									text: 'おいしそうですね。',
									translation: '看起来很好吃。',
									correct: true
								},
								{
									text: '早くしてください。',
									translation: '请快点。',
									correct: false
								}
							]
						},
						{
							ai: {
								text: 'お会計は2500円になります。どうぞ。',
								translation: '账单是2500日元。请付钱。'
							},
							choices: [
								{
									text: 'カードで払えますか？',
									translation: '可以用卡支付吗？',
									correct: true
								},
								{
									text: '現金で払います。',
									translation: '我用现金支付。',
									correct: true
								},
								{
									text: 'レシートはいりません。',
									translation: '不需要收据。',
									correct: false
								}
							]
						}
					]
				}
			},
			aiMessages: [
				{
					text: 'いらっしゃいませ！何かご注文されますか？',
					translation: '欢迎光临！您要点什么吗？'
				}
			],
			currentChoices: [
				{
					text: 'メニューを見せてください。',
					translation: '请给我看看菜单。'
				},
				{
					text: 'おすすめは何ですか？',
					translation: '有什么推荐的吗？'
				},
				{
					text: 'お水をください。',
					translation: '请给我一杯水。'
				}
			]
		}
	},
	methods: {
		goBack() {
			if (this.scenarioStarted) {
				this.scenarioStarted = false
				this.resetScenario()
			} else {
				uni.navigateBack()
			}
		},
		showSettings() {
			this.showSettingsModal = true
		},
		closeSettings() {
			this.showSettingsModal = false
		},
		toggleTranslation(e) {
			this.showTranslation = e.target.value
		},
		toggleAutoPlay(e) {
			this.autoPlay = e.target.value
		},
		onDifficultyChange(e) {
			const selectedIndex = e.detail.value
			this.selectedDifficulty = this.difficultyLevels[selectedIndex]
			uni.showToast({
				title: `难度设置为: ${this.selectedDifficulty}`,
				icon: 'none'
			})
		},
		startScenario(scenario) {
			this.scenarioStarted = true
			this.currentScenario = scenario
			this.loadScenarioData(scenario.id)
		},
		loadScenarioData(scenarioId) {
			if (this.scenarioData[scenarioId]) {
				const stepData = this.scenarioData[scenarioId].steps[0]
				this.aiMessages = [stepData.ai]
				this.currentChoices = stepData.choices
				this.currentStep = 1
				this.totalSteps = this.scenarioData[scenarioId].steps.length
			}
		},
		selectChoice(choice) {
			this.selectedChoice = choice.text
			this.showUserChoices = true
			this.showChoices = false
			this.showResult = true
			this.isCorrect = choice.correct
			
			if (choice.correct) {
				this.stats.correct++
				uni.showToast({
					title: '回答正确!',
					icon: 'success'
				})
			} else {
				this.stats.incorrect++
				uni.showToast({
					title: '回答错误',
					icon: 'none'
				})
			}
		},
		nextStep() {
			if (this.currentStep < this.totalSteps) {
				this.currentStep++
				this.loadStepData()
			} else {
				uni.showToast({
					title: '场景练习完成！',
					icon: 'success'
				})
				// 重置场景
				this.scenarioStarted = false
				this.resetScenario()
			}
		},
		loadStepData() {
			const scenarioId = this.currentScenario.id
			if (this.scenarioData[scenarioId] && this.scenarioData[scenarioId].steps[this.currentStep - 1]) {
				const stepData = this.scenarioData[scenarioId].steps[this.currentStep - 1]
				this.aiMessages.push(stepData.ai)
				this.currentChoices = stepData.choices
				this.showUserChoices = false
				this.showChoices = true
				this.showResult = false
				this.selectedChoice = ''
				
				// 滚动到底部
				this.$nextTick(() => {
					this.scrollTop = 999999
				})
			}
		},
		retryStep() {
			this.showChoices = true
			this.showUserChoices = false
			this.showResult = false
			this.selectedChoice = ''
		},
		resetScenario() {
			this.currentStep = 1
			this.showChoices = true
			this.showUserChoices = false
			this.showResult = false
			this.selectedChoice = ''
			this.aiMessages = [
				{
					text: 'いらっしゃいませ！何かご注文されますか？',
					translation: '欢迎光临！您要点什么吗？'
				}
			]
			this.currentChoices = [
				{
					text: 'メニューを見せてください。',
					translation: '请给我看看菜单。'
				},
				{
					text: 'おすすめは何ですか？',
					translation: '有什么推荐的吗？'
				},
				{
					text: 'お水をください。',
					translation: '请给我一杯水。'
				}
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.library-scenario-container {
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

/* 场景选择 */
.scenario-selection {
	.section-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #1F2937;
		margin-bottom: 32rpx;
	}

	.scenario-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24rpx;
	}

	.scenario-card {
		background: white;
		border-radius: 24rpx;
		padding: 32rpx;
		text-align: center;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
		cursor: pointer;

		&:hover {
			box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
			transform: translateY(-2rpx);
		}

		.scenario-icon {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto 24rpx;
			font-size: 32rpx;

			&.restaurant {
				background: rgba(245, 158, 11, 0.1);
				color: #F59E0B;
			}

			&.shopping {
				background: rgba(16, 185, 129, 0.1);
				color: #10B981;
			}

			&.transport {
				background: rgba(59, 130, 246, 0.1);
				color: #3B82F6;
			}

			&.hotel {
				background: rgba(139, 92, 246, 0.1);
				color: #8B5CF6;
			}
		}

		.scenario-name {
			display: block;
			font-size: 28rpx;
			font-weight: 500;
			color: #1F2937;
			margin-bottom: 8rpx;
		}

		.scenario-desc {
			display: block;
			font-size: 24rpx;
			color: #6B7280;
		}
	}
}

/* 场景练习 */
.scenario-practice {
	.scenario-info {
		background: white;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

		.scenario-header {
			display: flex;
			align-items: center;

			.scenario-icon {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 24rpx;
				font-size: 32rpx;

				&.restaurant {
					background: rgba(245, 158, 11, 0.1);
					color: #F59E0B;
				}

				&.shopping {
					background: rgba(16, 185, 129, 0.1);
					color: #10B981;
				}

				&.transport {
					background: rgba(59, 130, 246, 0.1);
					color: #3B82F6;
				}

				&.hotel {
					background: rgba(139, 92, 246, 0.1);
					color: #8B5CF6;
				}
			}

			.scenario-details {
				.scenario-name {
					display: block;
					font-size: 32rpx;
					font-weight: 500;
					color: #1F2937;
					margin-bottom: 8rpx;
				}

				.scenario-progress {
					display: block;
					font-size: 24rpx;
					color: #6B7280;
				}
			}
		}
	}

	.dialogue-area {
		background: white;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 32rpx;
		height: 400rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

		.dialogue-content {
			.message {
				margin-bottom: 32rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.message-bubble {
					max-width: 80%;
					padding: 24rpx;
					border-radius: 16rpx;

					.message-text {
						display: block;
						font-size: 28rpx;
						color: #1F2937;
						margin-bottom: 8rpx;
						line-height: 1.4;
					}

					.message-translation {
						display: block;
						font-size: 24rpx;
						color: #6B7280;
						line-height: 1.4;
					}
				}

				&.ai-message {
					.message-bubble {
						background: #EEF2FF;
						border: 2rpx solid #C7D2FE;
						margin-right: auto;
					}
				}

				&.user-message {
					text-align: right;

					.message-bubble {
						background: #2563EB;
						color: white;
						margin-left: auto;

						.message-text {
							color: white;
						}
					}
				}
			}
		}
	}

	.choices-area {
		background: white;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 32rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

		.choices-title {
			font-size: 28rpx;
			font-weight: 500;
			color: #1F2937;
			margin-bottom: 24rpx;
		}

		.choice-item {
			padding: 24rpx;
			border: 2rpx solid #E5E7EB;
			border-radius: 16rpx;
			margin-bottom: 16rpx;
			cursor: pointer;
			transition: all 0.2s;

			&:last-child {
				margin-bottom: 0;
			}

			&:hover {
				border-color: #2563EB;
				background: #EEF2FF;
			}

			.choice-text {
				display: block;
				font-size: 28rpx;
				color: #1F2937;
				margin-bottom: 8rpx;
			}

			.choice-translation {
				display: block;
				font-size: 24rpx;
				color: #6B7280;
			}
		}
	}

	.result-section {
		padding: 32rpx;
		border-radius: 16rpx;
		margin-bottom: 32rpx;
		text-align: center;

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
		}
	}

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

			&.retry-btn {
				background: #F3F4F6;
				color: #1F2937;

				&:hover:not(:disabled) {
					background: #E5E7EB;
				}
			}

			&.next-btn {
				background: #2563EB;
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
				color: #2563EB;
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
.dark-theme .library-scenario-container {
	background-color: #121212;
}

.dark-theme .header {
	background: #1F1F1F;
	border-bottom: 2rpx solid #3D3D3D;

	.back-btn,
	.settings-btn {
		color: #A0A0A0;

		&:hover {
			color: #2563EB;
		}
	}

	.header-title {
		color: #E0E0E0;
	}
}

.dark-theme .scenario-selection .section-title,
.dark-theme .scenario-practice .scenario-details .scenario-name,
.dark-theme .choices-area .choices-title,
.dark-theme .result-section .result-text {
	color: #E0E0E0;
}

.dark-theme .scenario-selection .scenario-card,
.dark-theme .scenario-practice .scenario-info,
.dark-theme .scenario-practice .dialogue-area,
.dark-theme .scenario-practice .choices-area,
.dark-theme .stats-section {
	background: #1F1F1F;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

.dark-theme .scenario-selection .scenario-card .scenario-desc,
.dark-theme .scenario-practice .scenario-details .scenario-progress,
.dark-theme .choices-area .choice-item .choice-translation {
	color: #A0A0A0;
}

.dark-theme .choices-area .choice-item {
	border: 2rpx solid #3D3D3D;

	&:hover {
		border-color: #2563EB;
		background: #3D3D3D;
	}
}

.dark-theme .scenario-practice .dialogue-area .message.ai-message .message-bubble {
	background: #3D3D3D;
	border: 2rpx solid #4D4D4D;
}

.dark-theme .scenario-practice .dialogue-area .message .message-bubble .message-text {
	color: #E0E0E0;
}

.dark-theme .scenario-practice .dialogue-area .message .message-bubble .message-translation {
	color: #A0A0A0;
}

.dark-theme .stats-section .stat-value {
	color: #E0E0E0;
}

.dark-theme .stats-section .stat-label {
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

.dark-theme .result-section.correct {
	background: #064E3B;
	border: 2rpx solid #10B981;
}

.dark-theme .result-section.incorrect {
	background: #7F1D1D;
	border: 2rpx solid #EF4444;
}
</style>