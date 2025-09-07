<template>
	<view class="review-plan-container">
		<!-- 标题栏 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="fa fa-arrow-left back-btn"></text>
			</view>
			<text class="header-title">复习计划</text>
			<view class="header-right">
				<text class="fa fa-sync-alt refresh-btn" @click="refreshPlan"></text>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-wrapper">
			<!-- 复习统计 -->
			<view class="stats-section">
				<view class="stats-grid">
					<view class="stat-item">
						<text class="stat-value">{{ totalReviewWords }}</text>
						<text class="stat-label">待复习</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ todayReviewWords }}</text>
						<text class="stat-label">今日复习</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ reviewProgress }}%</text>
						<text class="stat-label">完成率</text>
					</view>
				</view>
			</view>

			<!-- 复习进度 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">复习进度</text>
				</view>
				<view class="progress-container">
					<view class="progress-header">
						<text class="progress-title">今日复习进度</text>
						<text class="progress-percent">{{ Math.round(dailyProgress) }}%</text>
					</view>
					<view class="progress-bar">
						<view class="progress-fill" :style="{ width: dailyProgress + '%' }"></view>
					</view>
				</view>
			</view>

			<!-- 复习计划 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">复习计划</text>
					<text class="section-subtitle">按遗忘曲线安排</text>
				</view>
				<view class="plan-list">
					<view class="plan-item" v-for="(plan, index) in reviewPlan" :key="index">
						<view class="plan-date">
							<text class="date-text">{{ plan.date }}</text>
							<text class="weekday-text">{{ plan.weekday }}</text>
						</view>
						<view class="plan-content">
							<view class="plan-stats">
								<text class="stats-text">{{ plan.reviewWords }} 个词汇</text>
							</view>
							<view class="plan-progress">
								<view class="progress-bar">
									<view class="progress-fill" :style="{ width: plan.progress + '%' }"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 今日待复习词汇 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">今日待复习</text>
					<text class="section-subtitle">共 {{ todayWords.length }} 个词汇</text>
				</view>
				<view class="words-list">
					<view class="word-card" v-for="(word, index) in todayWords" :key="index">
						<view class="word-content">
							<text class="word-title">{{ word.word }}</text>
							<text class="word-pronunciation">{{ word.pronunciation }}</text>
							<text class="word-meaning">{{ word.meaning }}</text>
							<view class="word-meta">
								<view class="word-tag" :class="word.category">
									<text class="tag-text">{{ word.categoryName }}</text>
								</view>
								<text class="word-last-review">上次复习: {{ word.lastReview }}</text>
							</view>
						</view>
						<view class="word-actions">
							<view class="action-btn" @click="playPronunciation(word)">
								<text class="fa fa-volume-up"></text>
							</view>
							<view class="action-btn" @click="markAsReviewed(word)">
								<text class="fa fa-check-circle" :class="{ 'reviewed': word.reviewed }"></text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 复习提醒 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">复习提醒</text>
				</view>
				<view class="reminder-card">
					<view class="reminder-item">
						<view class="reminder-icon">
							<text class="fa fa-bell"></text>
						</view>
						<view class="reminder-info">
							<text class="reminder-title">定时复习提醒</text>
							<text class="reminder-desc">每天 19:00 提醒复习</text>
						</view>
						<switch class="reminder-switch" :checked="reminderEnabled" @change="toggleReminder" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ReviewPlan',
	data() {
		return {
			totalReviewWords: 42,
			todayReviewWords: 18,
			reviewProgress: 57,
			dailyProgress: 35,
			reminderEnabled: true,
			reviewPlan: [
				{ date: '06/12', weekday: '今天', reviewWords: 18, progress: 35 },
				{ date: '06/13', weekday: '明天', reviewWords: 12, progress: 0 },
				{ date: '06/15', weekday: '周四', reviewWords: 8, progress: 0 },
				{ date: '06/18', weekday: '周日', reviewWords: 15, progress: 0 },
				{ date: '06/22', weekday: '周四', reviewWords: 22, progress: 0 }
			],
			todayWords: [
				{
					word: 'いらっしゃいませ',
					pronunciation: 'いらっしゃいませ (irasshaimase)',
					meaning: '欢迎光临',
					category: 'restaurant',
					categoryName: '餐厅用语',
					lastReview: '3天前',
					reviewed: false
				},
				{
					word: 'おすすめ',
					pronunciation: 'おすすめ (osusume)',
					meaning: '推荐',
					category: 'restaurant',
					categoryName: '餐厅用语',
					lastReview: '2天前',
					reviewed: true
				},
				{
					word: '会計',
					pronunciation: 'かいけい (kaikei)',
					meaning: '结账',
					category: 'restaurant',
					categoryName: '餐厅用语',
					lastReview: '5天前',
					reviewed: false
				},
				{
					word: 'お土産',
					pronunciation: 'おみやげ (omiyage)',
					meaning: '礼品，土特产',
					category: 'shopping',
					categoryName: '购物',
					lastReview: '1天前',
					reviewed: false
				}
			]
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		refreshPlan() {
			uni.showToast({
				title: '计划已刷新',
				icon: 'none'
			})
		},
		playPronunciation(word) {
			uni.showToast({
				title: `播放: ${word.word}`,
				icon: 'none'
			})
		},
		markAsReviewed(word) {
			word.reviewed = !word.reviewed
			uni.showToast({
				title: word.reviewed ? '已标记为已复习' : '已取消标记',
				icon: 'none'
			})
			
			// 更新进度
			const reviewedCount = this.todayWords.filter(w => w.reviewed).length
			this.dailyProgress = (reviewedCount / this.todayWords.length) * 100
		},
		toggleReminder(e) {
			this.reminderEnabled = e.target.value
			uni.showToast({
				title: this.reminderEnabled ? '已开启提醒' : '已关闭提醒',
				icon: 'none'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.review-plan-container {
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
	.refresh-btn {
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

/* 复习统计 */
.stats-section {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
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
				margin-bottom: 8rpx;
			}

			.stat-label {
				font-size: 24rpx;
				color: #6B7280;
			}
		}
	}
}

.section {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

	.section-header {
		margin-bottom: 32rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #1F2937;
			display: block;
			margin-bottom: 8rpx;
		}

		.section-subtitle {
			font-size: 24rpx;
			color: #6B7280;
		}
	}
}

/* 复习进度 */
.progress-container {
	background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
	border-radius: 16rpx;
	padding: 32rpx;

	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;

		.progress-title {
			font-size: 28rpx;
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
			background: #10B981;
			border-radius: 8rpx;
			transition: width 0.3s ease;
		}
	}
}

/* 复习计划 */
.plan-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;

	.plan-item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		background: #F9FAFB;
		border-radius: 16rpx;
		transition: all 0.2s;

		&:hover {
			background: #F3F4F6;
		}

		.plan-date {
			width: 120rpx;
			text-align: center;
			margin-right: 24rpx;

			.date-text {
				display: block;
				font-size: 32rpx;
				font-weight: 600;
				margin-bottom: 4rpx;
			}

			.weekday-text {
				display: block;
				font-size: 24rpx;
				color: #6B7280;
			}
		}

		.plan-content {
			flex: 1;

			.plan-stats {
				margin-bottom: 16rpx;

				.stats-text {
					font-size: 24rpx;
					color: #6B7280;
				}
			}

			.plan-progress {
				.progress-bar {
					width: 100%;
					height: 12rpx;
					background: #E5E7EB;
					border-radius: 6rpx;
					overflow: hidden;

					.progress-fill {
						height: 100%;
						background: #6366F1;
						border-radius: 6rpx;
						transition: width 0.3s ease;
					}
				}
			}
		}
	}
}

/* 今日待复习词汇 */
.words-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;

	.word-card {
		padding: 32rpx;
		background: #F9FAFB;
		border-radius: 16rpx;
		border: 2rpx solid #E5E7EB;
		transition: all 0.2s;

		&:hover {
			background: #F3F4F6;
			box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
		}

		.word-content {
			margin-bottom: 24rpx;

			.word-title {
				font-size: 36rpx;
				font-weight: 600;
				color: #1F2937;
				display: block;
				margin-bottom: 8rpx;
			}

			.word-pronunciation {
				font-size: 28rpx;
				color: #6B7280;
				display: block;
				margin-bottom: 16rpx;
			}

			.word-meaning {
				font-size: 28rpx;
				color: #374151;
				display: block;
				margin-bottom: 16rpx;
			}

			.word-meta {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.word-tag {
					padding: 4rpx 16rpx;
					border-radius: 24rpx;
					font-size: 24rpx;

					&.restaurant {
						background: #FED7AA;
						color: #EA580C;
					}

					&.shopping {
						background: #DBEAFE;
						color: #2563EB;
					}

					&.travel {
						background: #D1FAE5;
						color: #059669;
					}
				}

				.word-last-review {
					font-size: 24rpx;
					color: #6B7280;
				}
			}
		}

		.word-actions {
			display: flex;
			justify-content: flex-end;
			gap: 16rpx;

			.action-btn {
				width: 56rpx;
				height: 56rpx;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.8);
				display: flex;
				align-items: center;
				justify-content: center;
				color: #6B7280;
				transition: all 0.2s;
				border: 1rpx solid #E5E7EB;

				&:hover {
					background: white;
					color: #007AFF;
				}

				.fa {
					font-size: 28rpx;

					&.reviewed {
						color: #10B981;
					}
				}
			}
		}
	}
}

/* 复习提醒 */
.reminder-card {
	background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
	border-radius: 16rpx;
	padding: 32rpx;

	.reminder-item {
		display: flex;
		align-items: center;

		.reminder-icon {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background: rgba(245, 158, 11, 0.1);
			color: #F59E0B;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 24rpx;

			.fa {
				font-size: 28rpx;
			}
		}

		.reminder-info {
			flex: 1;

			.reminder-title {
				display: block;
				font-size: 32rpx;
				font-weight: 500;
				color: #1F2937;
				margin-bottom: 4rpx;
			}

			.reminder-desc {
				display: block;
				font-size: 24rpx;
				color: #6B7280;
			}
		}

		.reminder-switch {
			transform: scale(0.8);
		}
	}
}

/* 暗黑模式样式 */
.dark-theme .review-plan-container {
	background-color: #121212;
}

.dark-theme .header {
	background: #1F1F1F;
	border-bottom: 2rpx solid #3D3D3D;

	.back-btn,
	.refresh-btn {
		color: #A0A0A0;

		&:hover {
			color: #6366F1;
		}
	}

	.header-title {
		color: #E0E0E0;
	}
}

.dark-theme .stats-section,
.dark-theme .section {
	background: #1F1F1F;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

.dark-theme .section-title {
	color: #E0E0E0;
}

.dark-theme .section-subtitle {
	color: #A0A0A0;
}

.dark-theme .stat-value {
	color: #E0E0E0;
}

.dark-theme .stat-label {
	color: #A0A0A0;
}

.dark-theme .progress-container {
	background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
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
	background: #10B981;
}

.dark-theme .plan-item {
	background: #2D2D2D;

	&:hover {
		background: #3D3D3D;
	}

	.date-text {
		color: #E0E0E0;
	}

	.weekday-text {
		color: #A0A0A0;
	}

	.stats-text {
		color: #A0A0A0;
	}
}

.dark-theme .plan-progress .progress-bar {
	background: #3D3D3D;
}

.dark-theme .plan-progress .progress-fill {
	background: #6366F1;
}

.dark-theme .word-card {
	background: #2D2D2D;
	border: 2rpx solid #3D3D3D;

	&:hover {
		background: #3D3D3D;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
	}

	.word-title {
		color: #E0E0E0;
	}

	.word-pronunciation {
		color: #A0A0A0;
	}

	.word-meaning {
		color: #C0C0C0;
	}

	.word-last-review {
		color: #A0A0A0;
	}

	.word-tag.restaurant {
		background: #3D3D3D;
		color: #F97316;
	}

	.word-tag.shopping {
		background: #3D3D3D;
		color: #60A5FA;
	}

	.word-tag.travel {
		background: #3D3D3D;
		color: #34D399;
	}
}

.dark-theme .action-btn {
	background: rgba(45, 45, 45, 0.8);
	color: #A0A0A0;
	border: 1rpx solid #3D3D3D;

	&:hover {
		background: #2D2D2D;
		color: #6366F1;
	}
}

.dark-theme .reminder-card {
	background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
}

.dark-theme .reminder-title {
	color: #E0E0E0;
}

.dark-theme .reminder-desc {
	color: #A0A0A0;
}
</style>