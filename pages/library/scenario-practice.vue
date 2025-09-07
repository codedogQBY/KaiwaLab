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
						<view class="custom-select" @click="toggleDifficultyDropdown">
							<text class="select-text">{{ selectedDifficulty }}</text>
							<text class="fa fa-chevron-down select-arrow" :class="{ 'rotate': showDifficultyDropdown }"></text>
						</view>
						<view class="dropdown-options" v-if="showDifficultyDropdown">
							<view 
								class="option-item" 
								v-for="(level, index) in difficultyLevels" 
								:key="index"
								:class="{ 'active': level === selectedDifficulty }"
								@click="selectDifficulty(level)"
							>
								<text>{{ level }}</text>
							</view>
						</view>
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
			showDifficultyDropdown: false,
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
			this.showDifficultyDropdown = false
		},
		toggleTranslation(e) {
			this.showTranslation = e.target.value
		},
		toggleAutoPlay(e) {
			this.autoPlay = e.target.value
		},
		toggleDifficultyDropdown() {
			this.showDifficultyDropdown = !this.showDifficultyDropdown
		},
		selectDifficulty(level) {
			this.selectedDifficulty = level
			this.showDifficultyDropdown = false
			uni.showToast({
				title: `难度设置为: ${level}`,
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
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(8rpx);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	animation: modalFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	.modal-content {
		width: 90%;
		max-width: 520rpx;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20rpx);
		border-radius: 28rpx;
		overflow: visible;
		box-shadow: 0 32rpx 80rpx rgba(0, 0, 0, 0.12), 0 0 0 1rpx rgba(255, 255, 255, 0.1);
		animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 36rpx 36rpx 28rpx;
			background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(255, 255, 255, 0.8) 100%);
			border-bottom: 1rpx solid rgba(37, 99, 235, 0.08);

			.modal-title {
				font-size: 34rpx;
				font-weight: 700;
				color: #1e293b;
				letter-spacing: -0.8rpx;
			}

			.close-btn {
				width: 44rpx;
				height: 44rpx;
				border-radius: 50%;
				background: rgba(148, 163, 184, 0.08);
				color: #64748b;
				font-size: 26rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				border: 1rpx solid rgba(148, 163, 184, 0.1);

				&:hover {
					background: rgba(239, 68, 68, 0.08);
					color: #ef4444;
					transform: scale(1.05);
					border-color: rgba(239, 68, 68, 0.2);
				}
			}
		}

		.modal-body {
			padding: 36rpx;
			background: rgba(255, 255, 255, 0.6);
			overflow: visible;

			.setting-item {
				position: relative;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 32rpx;
				padding: 28rpx;
				background: rgba(255, 255, 255, 0.7);
				border-radius: 20rpx;
				border: 1rpx solid rgba(37, 99, 235, 0.06);
				transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
				backdrop-filter: blur(10rpx);
				min-height: auto;
				overflow: visible;

				&:last-child {
					margin-bottom: 0;
				}

				&:hover {
					transform: translateY(-4rpx);
					box-shadow: 0 16rpx 40rpx rgba(37, 99, 235, 0.08);
					border-color: rgba(37, 99, 235, 0.12);
					background: rgba(255, 255, 255, 0.85);
				}

				.setting-label {
					font-size: 30rpx;
					font-weight: 600;
					color: #1e293b;
					letter-spacing: -0.5rpx;
				}

				.custom-select {
					position: relative;
					padding: 16rpx 20rpx;
					border: 2rpx solid rgba(37, 99, 235, 0.1);
					border-radius: 16rpx;
					font-size: 26rpx;
					font-weight: 500;
					color: #64748b;
					background: rgba(255, 255, 255, 0.8);
					min-width: 140rpx;
					cursor: pointer;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					backdrop-filter: blur(10rpx);
					display: flex;
					align-items: center;
					justify-content: space-between;

					&:hover {
						background: rgba(37, 99, 235, 0.04);
						border-color: rgba(37, 99, 235, 0.2);
						color: #2563eb;
						transform: translateY(-2rpx);
					}

					.select-text {
						flex: 1;
						text-align: center;
					}

					.select-arrow {
						font-size: 20rpx;
						transition: transform 0.3s ease;
						margin-left: 12rpx;

						&.rotate {
							transform: rotate(180deg);
						}
					}
				}

				.dropdown-options {
					position: absolute;
					bottom: 100%;
					left: 0;
					right: 0;
					z-index: 9999;
					margin-bottom: 8rpx;
					background: rgba(255, 255, 255, 0.95);
					border: 2rpx solid rgba(37, 99, 235, 0.1);
					border-radius: 16rpx;
					box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
					backdrop-filter: blur(20rpx);
					overflow: hidden;
					animation: dropdownSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

					.option-item {
						padding: 20rpx 24rpx;
						font-size: 26rpx;
						color: #64748b;
						cursor: pointer;
						transition: all 0.2s ease;
						border-bottom: 1rpx solid rgba(37, 99, 235, 0.05);

						&:last-child {
							border-bottom: none;
						}

						&:hover {
							background: rgba(37, 99, 235, 0.06);
							color: #2563eb;
						}

						&.active {
							background: rgba(37, 99, 235, 0.1);
							color: #2563eb;
							font-weight: 600;
						}
					}
				}
			}
		}

		.modal-footer {
			padding: 28rpx 36rpx 36rpx;
			background: linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(255, 255, 255, 0.9) 100%);
			border-top: 1rpx solid rgba(37, 99, 235, 0.08);
			text-align: center;

			.confirm-btn {
				width: 100%;
				padding: 20rpx 36rpx;
				background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
				color: white;
				border: none;
				border-radius: 16rpx;
				font-size: 30rpx;
				font-weight: 600;
				cursor: pointer;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.25);
				letter-spacing: -0.5rpx;

				&:hover {
					background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
					transform: translateY(-3rpx);
					box-shadow: 0 12rpx 32rpx rgba(37, 99, 235, 0.35);
				}

				&:active {
					transform: translateY(-1rpx);
				}
			}
		}
	}
}

@keyframes modalFadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes modalSlideIn {
	from {
		opacity: 0;
		transform: scale(0.9) translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
}

@keyframes dropdownSlideIn {
	from {
		opacity: 0;
		transform: translateY(-10rpx) scale(0.95);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

/* 暗黑模式下的模态框样式 */
.dark-theme .modal {
	background: rgba(0, 0, 0, 0.8);
	backdrop-filter: blur(12rpx);

	.modal-content {
		background: rgba(15, 23, 42, 0.95);
		backdrop-filter: blur(24rpx);
		box-shadow: 0 32rpx 80rpx rgba(0, 0, 0, 0.4), 0 0 0 1rpx rgba(148, 163, 184, 0.1);

		.modal-header {
			background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%);
			border-bottom: 1rpx solid rgba(148, 163, 184, 0.1);

			.modal-title {
				color: #f1f5f9;
			}

			.close-btn {
				background: rgba(148, 163, 184, 0.1);
				color: #94a3b8;
				border-color: rgba(148, 163, 184, 0.15);

				&:hover {
					background: rgba(239, 68, 68, 0.15);
					color: #f87171;
					border-color: rgba(239, 68, 68, 0.3);
				}
			}
		}

		.modal-body {
			background: rgba(15, 23, 42, 0.6);

			.setting-item {
				background: rgba(30, 41, 59, 0.8);
				border-color: rgba(148, 163, 184, 0.08);

				&:hover {
					background: rgba(30, 41, 59, 0.95);
					box-shadow: 0 16rpx 40rpx rgba(37, 99, 235, 0.15);
					border-color: rgba(37, 99, 235, 0.2);
				}

				.setting-label {
					color: #e2e8f0;
				}

				.custom-select {
					background: rgba(30, 41, 59, 0.9);
					color: #cbd5e1;
					border-color: rgba(148, 163, 184, 0.15);

					&:hover {
						background: rgba(37, 99, 235, 0.1);
						border-color: rgba(37, 99, 235, 0.3);
						color: #60a5fa;
					}

					.select-arrow {
						color: #94a3b8;
					}
				}

				.dropdown-options {
					bottom: 100%;
					margin-bottom: 8rpx;
					z-index: 9999;
					background: rgba(15, 23, 42, 0.98);
					border-color: rgba(148, 163, 184, 0.15);
					box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.3);

					.option-item {
						color: #cbd5e1;
						border-bottom-color: rgba(148, 163, 184, 0.08);

						&:hover {
							background: rgba(37, 99, 235, 0.15);
							color: #60a5fa;
						}

						&.active {
							background: rgba(37, 99, 235, 0.2);
							color: #60a5fa;
						}
					}
				}
			}
		}

		.modal-footer {
			background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(15, 23, 42, 0.95) 100%);
			border-top: 1rpx solid rgba(148, 163, 184, 0.1);

			.confirm-btn {
				background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
				box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.4);

				&:hover {
					background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
					box-shadow: 0 12rpx 32rpx rgba(37, 99, 235, 0.5);
				}
			}
		}
	}
}

/* 暗黑模式样式 */
body.dark-theme .library-scenario-container {
	background-color: #121212;
}

body.dark-theme .header {
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

body.dark-theme .scenario-selection .section-title,
body.dark-theme .scenario-practice .scenario-details .scenario-name,
body.dark-theme .choices-area .choices-title,
body.dark-theme .result-section .result-text {
	color: #E0E0E0;
}

body.dark-theme .scenario-selection .scenario-card,
body.dark-theme .scenario-practice .scenario-info,
body.dark-theme .scenario-practice .dialogue-area,
body.dark-theme .scenario-practice .choices-area,
body.dark-theme .stats-section {
	background: #1F1F1F;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

body.dark-theme .scenario-selection .scenario-card .scenario-name {
	color: #FFFFFF;
}

body.dark-theme .scenario-selection .scenario-card .scenario-desc,
body.dark-theme .scenario-practice .scenario-details .scenario-progress,
body.dark-theme .choices-area .choice-item .choice-text {
	color: #FFFFFF;
}

body.dark-theme .choices-area .choice-item .choice-translation {
	color: #A0A0A0;
}

body.dark-theme .choices-area .choice-item {
	border: 2rpx solid #3D3D3D;

	&:hover {
		background: #2D2D2D;
		border-color: #6366F1;
	}
}

body.dark-theme .scenario-practice .dialogue-area .message.ai-message .message-bubble {
	background: #3D3D3D;
	border: 2rpx solid #4D4D4D;
}

body.dark-theme .scenario-practice .dialogue-area .message .message-bubble .message-text {
	color: #E0E0E0;
}

body.dark-theme .scenario-practice .dialogue-area .message .message-bubble .message-translation {
	color: #A0A0A0;
}

body.dark-theme .stats-section .stat-value {
	color: #E0E0E0;
}

body.dark-theme .stats-section .stat-label {
	color: #A0A0A0;
}

body.dark-theme .modal-content {
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

body.dark-theme .result-section.correct {
	background: #064E3B;
	border: 2rpx solid #10B981;
}

body.dark-theme .result-section.incorrect {
	background: #7F1D1D;
	border: 2rpx solid #EF4444;
}
</style>