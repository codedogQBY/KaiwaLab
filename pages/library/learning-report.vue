<template>
	<view class="learning-report-container">
		<!-- 标题栏 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="fa fa-arrow-left back-btn"></text>
			</view>
			<text class="header-title">学习报告</text>
			<view class="header-right">
				<text class="fa fa-download download-btn" @click="downloadReport"></text>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-wrapper">
			<!-- 报告概览 -->
			<view class="report-overview">
				<view class="overview-card">
					<view class="overview-header">
						<text class="period-text">{{ reportPeriod }}</text>
						<text class="date-text">{{ reportDate }}</text>
					</view>
					<view class="stats-grid">
						<view class="stat-item">
							<text class="stat-value">{{ totalLearned }}</text>
							<text class="stat-label">学习词汇</text>
						</view>
						<view class="stat-item">
							<text class="stat-value">{{ totalReviewed }}</text>
							<text class="stat-label">复习词汇</text>
						</view>
						<view class="stat-item">
							<text class="stat-value">{{ accuracyRate }}%</text>
							<text class="stat-label">正确率</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 掌握情况 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">词汇掌握情况</text>
				</view>
				<view class="mastery-chart">
					<view class="chart-container">
						<view class="chart-bar" v-for="(level, index) in masteryLevels" :key="index">
							<view class="bar-label">{{ level.name }}</view>
							<view class="bar-container">
								<view class="bar-fill" :class="level.class" :style="{ width: level.percentage + '%' }"></view>
								<text class="bar-value">{{ level.count }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 进步趋势 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">学习趋势</text>
					<view class="time-filter">
						<text 
							v-for="(period, index) in timePeriods" 
							:key="index"
							:class="['period-item', { active: selectedPeriod === period.value }]"
							@click="selectPeriod(period.value)"
						>
							{{ period.label }}
						</text>
					</view>
				</view>
				<view class="trend-chart">
					<!-- 简化的趋势图 -->
					<view class="trend-container">
						<view class="trend-grid">
							<view class="trend-point" v-for="(point, index) in trendData" :key="index" :style="{ left: point.position + '%' }">
								<view class="point-marker" :style="{ bottom: point.value + '%' }"></view>
								<text class="point-label">{{ point.label }}</text>
							</view>
						</view>
						<view class="trend-line"></view>
					</view>
				</view>
			</view>

			<!-- 弱项分析 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">需要加强的词汇</text>
				</view>
				<view class="weak-words">
					<view class="word-item" v-for="(word, index) in weakWords" :key="index">
						<view class="word-info">
							<text class="word-text">{{ word.word }}</text>
							<text class="word-pronunciation">{{ word.pronunciation }}</text>
						</view>
						<view class="word-stats">
							<text class="stats-text">正确率: {{ word.accuracy }}%</text>
							<text class="stats-text">练习次数: {{ word.practiceCount }}</text>
						</view>
						<button class="review-btn" @click="reviewWord(word)">复习</button>
					</view>
				</view>
			</view>

			<!-- 成就系统 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">学习成就</text>
				</view>
				<view class="achievements">
					<view class="achievement-item" v-for="(achievement, index) in achievements" :key="index">
						<view class="achievement-icon" :class="{ unlocked: achievement.unlocked }">
							<text :class="['fa', achievement.icon]"></text>
						</view>
						<view class="achievement-info">
							<text class="achievement-name" :class="{ unlocked: achievement.unlocked }">{{ achievement.name }}</text>
							<text class="achievement-desc">{{ achievement.description }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'LearningReport',
	data() {
		return {
			reportPeriod: '本周报告',
			reportDate: '2023年6月12日',
			totalLearned: 42,
			totalReviewed: 87,
			accuracyRate: 85,
			selectedPeriod: 'week',
			timePeriods: [
				{ label: '周', value: 'week' },
				{ label: '月', value: 'month' },
				{ label: '年', value: 'year' }
			],
			masteryLevels: [
				{ name: '已掌握', class: 'mastered', percentage: 65, count: 28 },
				{ name: '熟悉', class: 'familiar', percentage: 25, count: 12 },
				{ name: '需复习', class: 'needs-review', percentage: 10, count: 4 }
			],
			trendData: [
				{ position: 10, value: 60, label: '周一' },
				{ position: 30, value: 65, label: '周二' },
				{ position: 50, value: 70, label: '周三' },
				{ position: 70, value: 75, label: '周四' },
				{ position: 90, value: 85, label: '今天' }
			],
			weakWords: [
				{ word: 'いらっしゃいませ', pronunciation: 'irasshaimase', accuracy: 45, practiceCount: 8 },
				{ word: 'お土産', pronunciation: 'omiyage', accuracy: 52, practiceCount: 6 },
				{ word: '会計', pronunciation: 'kaikei', accuracy: 58, practiceCount: 5 }
			],
			achievements: [
				{ name: '初学者', description: '学习第一个词汇', icon: 'fa-graduation-cap', unlocked: true },
				{ name: '勤奋学者', description: '连续学习7天', icon: 'fa-fire', unlocked: true },
				{ name: '词汇大师', description: '掌握100个词汇', icon: 'fa-crown', unlocked: false },
				{ name: '完美准确', description: '正确率达到90%以上', icon: 'fa-check-circle', unlocked: false }
			]
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		downloadReport() {
			uni.showToast({
				title: '报告已保存到相册',
				icon: 'success'
			})
		},
		selectPeriod(period) {
			this.selectedPeriod = period
			uni.showToast({
				title: `切换到${period === 'week' ? '周' : period === 'month' ? '月' : '年'}视图`,
				icon: 'none'
			})
		},
		reviewWord(word) {
			uni.showToast({
				title: `开始复习: ${word.word}`,
				icon: 'none'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.learning-report-container {
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
	.download-btn {
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

/* 报告概览 */
.report-overview {
	margin-bottom: 48rpx;

	.overview-card {
		background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
		border-radius: 24rpx;
		padding: 40rpx 32rpx;
		color: white;
		box-shadow: 0 8rpx 16rpx rgba(99, 102, 241, 0.3);

		.overview-header {
			margin-bottom: 32rpx;

			.period-text {
				display: block;
				font-size: 32rpx;
				font-weight: 600;
				margin-bottom: 8rpx;
			}

			.date-text {
				display: block;
				font-size: 24rpx;
				opacity: 0.9;
			}
		}

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
					margin-bottom: 8rpx;
				}

				.stat-label {
					display: block;
					font-size: 24rpx;
					opacity: 0.9;
				}
			}
		}
	}
}

/* 通用section样式 */
.section {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: 500;
			color: #1F2937;
		}

		.time-filter {
			display: flex;
			background: #F3F4F6;
			border-radius: 24rpx;
			padding: 4rpx;

			.period-item {
				font-size: 24rpx;
				padding: 8rpx 16rpx;
				border-radius: 20rpx;
				cursor: pointer;
				transition: all 0.2s;

				&.active {
					background: #6366F1;
					color: white;
				}
			}
		}
	}
}

/* 掌握情况 */
.mastery-chart {
	.chart-container {
		.chart-bar {
			margin-bottom: 24rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.bar-label {
				font-size: 28rpx;
				color: #1F2937;
				margin-bottom: 8rpx;
				display: block;
			}

			.bar-container {
				display: flex;
				align-items: center;

				.bar-fill {
					height: 24rpx;
					border-radius: 12rpx;
					margin-right: 16rpx;
					transition: width 0.5s ease;

					&.mastered {
						background: #10B981;
					}

					&.familiar {
						background: #F59E0B;
					}

					&.needs-review {
						background: #EF4444;
					}
				}

				.bar-value {
					font-size: 24rpx;
					color: #6B7280;
					min-width: 40rpx;
				}
			}
		}
	}
}

/* 进步趋势 */
.trend-chart {
	.trend-container {
		height: 300rpx;
		position: relative;
		background: #F9FAFB;
		border-radius: 16rpx;
		padding: 32rpx;

		.trend-grid {
			position: relative;
			width: 100%;
			height: 100%;

			.trend-point {
				position: absolute;
				display: flex;
				flex-direction: column;
				align-items: center;
				bottom: 0;

				.point-marker {
					width: 24rpx;
					height: 24rpx;
					border-radius: 50%;
					background: #6366F1;
					margin-bottom: 8rpx;
					position: absolute;
				}

				.point-label {
					font-size: 20rpx;
					color: #6B7280;
					position: absolute;
					top: 100%;
					transform: translateX(-50%);
				}
			}
		}

		.trend-line {
			position: absolute;
			bottom: 40rpx;
			left: 40rpx;
			right: 40rpx;
			height: 2rpx;
			background: #E5E7EB;
		}
	}
}

/* 弱项分析 */
.weak-words {
	.word-item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		border: 2rpx solid #E5E7EB;
		border-radius: 16rpx;
		margin-bottom: 16rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.word-info {
			flex: 1;
			margin-right: 16rpx;

			.word-text {
				display: block;
				font-size: 28rpx;
				font-weight: 500;
				color: #1F2937;
				margin-bottom: 4rpx;
			}

			.word-pronunciation {
				display: block;
				font-size: 24rpx;
				color: #6B7280;
			}
		}

		.word-stats {
			margin-right: 16rpx;

			.stats-text {
				display: block;
				font-size: 20rpx;
				color: #6B7280;
				margin-bottom: 4rpx;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		.review-btn {
			padding: 16rpx 24rpx;
			background: #6366F1;
			color: white;
			border: none;
			border-radius: 12rpx;
			font-size: 24rpx;
			cursor: pointer;
			transition: background 0.2s;

			&:hover {
				background: #4F46E5;
			}
		}
	}
}

/* 成就系统 */
.achievements {
	.achievement-item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		border-bottom: 2rpx solid #F3F4F6;

		&:last-child {
			border-bottom: none;
		}

		.achievement-icon {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background: #E5E7EB;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 24rpx;
			color: #9CA3AF;

			&.unlocked {
				background: rgba(99, 102, 241, 0.1);
				color: #6366F1;
			}

			.fa {
				font-size: 28rpx;
			}
		}

		.achievement-info {
			flex: 1;

			.achievement-name {
				display: block;
				font-size: 28rpx;
				color: #9CA3AF;
				margin-bottom: 4rpx;

				&.unlocked {
					color: #1F2937;
					font-weight: 500;
				}
			}

			.achievement-desc {
				display: block;
				font-size: 24rpx;
				color: #6B7280;
			}
		}
	}
}

/* 暗黑模式样式 */
.dark-theme .learning-report-container {
	background-color: #121212;
}

.dark-theme .header {
	background: #1F1F1F;
	border-bottom: 2rpx solid #3D3D3D;

	.back-btn,
	.download-btn {
		color: #A0A0A0;

		&:hover {
			color: #6366F1;
		}
	}

	.header-title {
		color: #E0E0E0;
	}
}

.dark-theme .section {
	background: #1F1F1F;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

.dark-theme .section-title {
	color: #E0E0E0;
}

.dark-theme .time-filter {
	background: #2D2D2D;

	.period-item {
		&.active {
			background: #6366F1;
			color: white;
		}
	}
}

.dark-theme .bar-label {
	color: #E0E0E0;
}

.dark-theme .bar-value {
	color: #CCCCCC;
}

.dark-theme .trend-container {
	background: #2D2D2D;
}

.dark-theme .point-label {
	color: #A0A0A0;
}

.dark-theme .trend-line {
	background: #3D3D3D;
}

.dark-theme .word-item {
	border: 2rpx solid #3D3D3D;
}

.dark-theme .word-text {
	color: #E0E0E0;
}

.dark-theme .word-pronunciation,
.dark-theme .stats-text {
	color: #CCCCCC;
}

.dark-theme .achievement-item {
	border-bottom: 2rpx solid #3D3D3D;
}

.dark-theme .achievement-name:not(.unlocked) {
	color: #CCCCCC;
}

.dark-theme .achievement-desc {
	color: #CCCCCC;
}
</style>