<template>
	<view class="library-container">
		<!-- 固定顶部栏 -->
		<view class="fixed-header">
			<!-- 标题栏 -->
			<view class="header">
				<view class="header-left">
				</view>
				<text class="header-title">学习库</text>
				<view class="header-right" @click="goToLearningPlan">
					<text class="fa fa-calendar-alt calendar-btn"></text>
				</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-wrapper">
			<!-- 数据概览 -->
			<view class="stats-section">
				<view class="stats-grid">
					<view class="stat-item">
						<text class="stat-value">{{ totalWords }}</text>
						<text class="stat-label">总词汇</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ todayLearning }}</text>
						<text class="stat-label">今日学习</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ todayReview }}</text>
						<text class="stat-label">待复习</text>
					</view>
				</view>

				<!-- 学习进度 -->
				<view class="progress-container">
					<view class="progress-header">
						<text class="progress-title">学习进度</text>
						<text class="progress-percent">{{ Math.round(learningProgress) }}%</text>
					</view>
					<view class="progress-bar">
						<view class="progress-fill" :style="{ width: learningProgress + '%' }"></view>
					</view>
					<view class="report-link" @click="goToLearningReport">
						<text class="report-text">查看详细报告</text>
						<text class="fa fa-chevron-right report-arrow"></text>
					</view>
				</view>
			</view>

			<!-- 功能模块 -->
			<view class="modules-section">
				<!-- 智能推荐 -->
				<view class="module-card" @click="goToRecommended">
					<view class="module-header">
						<view class="module-icon recommended">
							<text class="fa fa-star"></text>
						</view>
						<view class="module-info">
							<text class="module-title">智能推荐</text>
							<text class="module-desc">根据你的学习情况推荐词汇</text>
						</view>
					</view>
					<text class="fa fa-chevron-right module-arrow"></text>
				</view>

				<!-- 场景联动 -->
				<view class="module-card" @click="goToScenarios">
					<view class="module-header">
						<view class="module-icon scenarios">
							<text class="fa fa-flask"></text>
						</view>
						<view class="module-info">
							<text class="module-title">场景联动</text>
							<text class="module-desc">查看场景相关词汇</text>
						</view>
					</view>
					<text class="fa fa-chevron-right module-arrow"></text>
				</view>

				<!-- 个人词库 -->
				<view class="module-card" @click="goToPersonal">
					<view class="module-header">
						<view class="module-icon personal">
							<text class="fa fa-book"></text>
						</view>
						<view class="module-info">
							<text class="module-title">个人词库</text>
							<text class="module-desc">管理自定义词汇</text>
						</view>
					</view>
					<text class="fa fa-chevron-right module-arrow"></text>
				</view>

				<!-- 复习计划 -->
				<view class="module-card" @click="goToReviewPlan">
					<view class="module-header">
						<view class="module-icon review">
							<text class="fa fa-tasks"></text>
						</view>
						<view class="module-info">
							<text class="module-title">复习计划</text>
							<text class="module-desc">今日待复习词汇</text>
						</view>
					</view>
					<view class="module-badge" v-if="todayReview > 0">{{ todayReview }}</view>
					<text class="fa fa-chevron-right module-arrow"></text>
				</view>
			</view>

			<!-- 快速练习 -->
			<view class="section-title">
				<text>快速练习</text>
			</view>

			<view class="practice-section">
				<view class="practice-grid">
					<view class="practice-card" @click="startFlashcard">
						<view class="practice-icon">
							<text class="fa fa-copy"></text>
						</view>
						<text class="practice-label">闪卡练习</text>
					</view>

					<view class="practice-card" @click="startListening">
						<view class="practice-icon">
							<text class="fa fa-headphones"></text>
						</view>
						<text class="practice-label">听力练习</text>
					</view>

					<view class="practice-card" @click="startSpelling">
						<view class="practice-icon">
							<text class="fa fa-keyboard"></text>
						</view>
						<text class="practice-label">拼写练习</text>
					</view>

					<view class="practice-card" @click="startScenario">
						<view class="practice-icon">
							<text class="fa fa-comment"></text>
						</view>
						<text class="practice-label">情景模拟</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 自定义底部导航栏 -->
		<BottomTabBar :current="2" @change="switchTab" />
	</view>
</template>

<script>
import BottomTabBar from '@/components/BottomTabBar/BottomTabBar.vue'

export default {
	name: 'Library',
	components: {
		BottomTabBar
	},
	data() {
		return {
			totalWords: 128,
			todayLearning: 12,
			todayReview: 8,
			learningProgress: 65
		}
	},
	methods: {

		goToLearningPlan() {
			uni.showToast({
				title: '前往学习计划',
				icon: 'none'
			})
		},
		goToRecommended() {
			uni.navigateTo({
				url: '/pages/library/recommended-words'
			})
		},
		goToScenarios() {
			uni.navigateTo({
				url: '/pages/lab/scenarios'
			})
		},
		goToPersonal() {
			uni.navigateTo({
				url: '/pages/library/personal-library'
			})
		},
		goToReviewPlan() {
			uni.navigateTo({
				url: '/pages/library/review-plan'
			})
		},
		startFlashcard() {
			uni.navigateTo({
				url: '/pages/library/flashcard-practice'
			})
		},
		startListening() {
			uni.navigateTo({
				url: '/pages/library/listening-practice'
			})
		},
		startSpelling() {
			uni.navigateTo({
				url: '/pages/library/spelling-practice'
			})
		},
		startScenario() {
			uni.navigateTo({
				url: '/pages/library/scenario-practice'
			})
		},
		goToLearningReport() {
			uni.navigateTo({
				url: '/pages/library/learning-report'
			})
		},
		// 处理底部导航栏切换
		switchTab(index) {
			const tabPages = [
				'/pages/home/home',
				'/pages/lab/lab',
				'/pages/library/library',
				'/pages/profile/profile'
			]
			if (index !== 2) { // 当前页面是library(index=2)，只有点击其他tab才跳转
				uni.switchTab({
					url: tabPages[index]
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.library-container {
	min-height: 100vh;
	background-color: #ffffff;
	position: relative;
}

/* 固定顶部栏 */
.fixed-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	background: white;
	border-bottom: 2rpx solid #E5E7EB;
}

/* 内容区域 */
.content-wrapper {
	margin-top: 120rpx;
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
	overflow-y: auto;
}

/* 标题栏 */
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	background: white;

	.header-left,
	.header-right {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-btn,
	.calendar-btn {
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

/* 数据概览 */
.stats-section {
	padding: 32rpx;
	background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
	margin-bottom: 32rpx;

	.stats-grid {
		display: flex;
		justify-content: space-between;
		margin-bottom: 32rpx;

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
		}
	}

	.progress-container {
		.progress-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16rpx;

			.progress-title {
				font-size: 28rpx;
				color: #1F2937;
				font-weight: 500;
			}

			.progress-percent {
				font-size: 24rpx;
				color: #6B7280;
			}
		}

		.progress-bar {
			width: 100%;
			height: 16rpx;
			background: rgba(255, 255, 255, 0.5);
			border-radius: 8rpx;
			overflow: hidden;

			.progress-fill {
				height: 100%;
				background: #2563EB;
				border-radius: 8rpx;
				transition: width 0.3s ease;
			}
		}

		.report-link {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 24rpx;
			cursor: pointer;

			.report-text {
				font-size: 24rpx;
				color: #2563EB;
				margin-right: 8rpx;
			}

			.report-arrow {
				font-size: 20rpx;
				color: #2563EB;
			}
		}
	}
}

/* 功能模块 */
.modules-section {
	padding: 0 32rpx 32rpx;
}

.module-card {
	background: white;
	border: 2rpx solid #E5E7EB;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	transition: all 0.2s;
	cursor: pointer;

	&:hover {
		box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
		transform: translateY(-2rpx);
	}

	.module-header {
		display: flex;
		align-items: center;
		flex: 1;

		.module-icon {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 24rpx;

			&.recommended {
				background: rgba(245, 158, 11, 0.1);
				color: #F59E0B;
			}

			&.scenarios {
				background: rgba(37, 99, 235, 0.1);
				color: #2563EB;
			}

			&.personal {
				background: rgba(16, 185, 129, 0.1);
				color: #10B981;
			}

			&.review {
				background: rgba(139, 92, 246, 0.1);
				color: #8B5CF6;
			}

			.fa {
				font-size: 32rpx;
			}
		}

		.module-info {
			.module-title {
				display: block;
				font-size: 32rpx;
				font-weight: 500;
				color: #1F2937;
				margin-bottom: 8rpx;
			}

			.module-desc {
				display: block;
				font-size: 24rpx;
				color: #6B7280;
			}
		}
	}

	.module-badge {
		background: #EF4444;
		color: white;
		font-size: 24rpx;
		font-weight: 500;
		padding: 4rpx 16rpx;
		border-radius: 24rpx;
		margin-right: 24rpx;
	}

	.module-arrow {
		color: #9CA3AF;
		font-size: 28rpx;
	}
}

/* 快速练习 */
.section-title {
	padding: 0 32rpx 24rpx;
	font-size: 32rpx;
	font-weight: 500;
	color: #1F2937;
}

.practice-section {
	padding: 0 32rpx 32rpx;
}

.practice-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}

.practice-card {
	background: white;
	border: 2rpx solid #E5E7EB;
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
	transition: all 0.2s;
	cursor: pointer;

	&:hover {
		box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
		transform: translateY(-2rpx);
	}

	.practice-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: rgba(37, 99, 235, 0.1);
		color: #2563EB;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 24rpx;

		.fa {
			font-size: 32rpx;
		}
	}

	.practice-label {
		font-size: 28rpx;
		color: #1F2937;
		font-weight: 500;
	}
}

/* 暗黑模式样式 */
.dark-theme .library-container {
	background-color: #121212;
}

.dark-theme .fixed-header {
	background: #1F1F1F;
	border-bottom: 2rpx solid #3D3D3D;
}

.dark-theme .header {
	background: #1F1F1F;

	.back-btn,
	.calendar-btn {
		color: #A0A0A0;

		&:hover {
			color: #2563EB;
		}
	}

	.header-title {
		color: #E0E0E0;
	}
}

.dark-theme .stats-section {
	background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
}

.dark-theme .stat-value {
	color: #E0E0E0;
}

.dark-theme .stat-label {
	color: #A0A0A0;
}

.dark-theme .progress-title {
	color: #E0E0E0;
}

.dark-theme .progress-percent {
	color: #A0A0A0;
}

.dark-theme .progress-bar {
	background: rgba(255, 255, 255, 0.1);
}

.dark-theme .progress-fill {
	background: #6366F1;
}

.dark-theme .module-card {
	background: #1F1F1F;
	border: 2rpx solid #3D3D3D;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);

	&:hover {
		box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.3);
	}

	.module-title {
		color: #E0E0E0;
	}

	.module-desc {
		color: #A0A0A0;
	}

	.module-arrow {
		color: #808080;
	}
}

.dark-theme .practice-card {
	background: #1F1F1F;
	border: 2rpx solid #3D3D3D;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);

	&:hover {
		box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.3);
	}

	.practice-label {
		color: #E0E0E0;
	}

	.practice-icon {
		background: rgba(37, 99, 235, 0.1);
		color: #2563EB;
	}
}

.dark-theme .section-title {
	color: #E0E0E0;
}

.dark-theme .report-link .report-text,
.dark-theme .report-link .report-arrow {
	color: #2563EB;
}
</style>