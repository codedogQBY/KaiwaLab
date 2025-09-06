<template>
	<view class="report-container">
		<!-- 标题栏 -->
		<view class="header" :style="{ paddingTop: (statusBarHeight + 16) + 'px' }">
			<view class="header-left" @click="goBack">
				<text class="fas fa-arrow-left"></text>
			</view>
			<view class="header-center">
				<text class="header-title">实验报告</text>
			</view>
			<view class="header-right">
				<!-- 占位元素，保持标题居中 -->
			</view>
		</view>

		<!-- 报告内容 -->
		<scroll-view class="report-content" scroll-y="true">
			<!-- 学习统计 -->
			<view class="stats-section">
				<view class="stats-header">
					<text class="stats-title">本周实验数据</text>
					<view class="view-full-btn">
						<text class="view-full-text">查看完整报告</text>
						<text class="fas fa-chevron-right"></text>
					</view>
				</view>

				<!-- 统计卡片 -->
				<view class="stats-grid">
					<view class="stat-card">
						<text class="stat-label">总实验时间</text>
						<text class="stat-value">2小时15分</text>
						<view class="stat-change positive">
							<text class="fas fa-arrow-up"></text>
							<text class="change-text">较上周 +15%</text>
						</view>
					</view>
					<view class="stat-card">
						<text class="stat-label">实验次数</text>
						<text class="stat-value">18次</text>
						<view class="stat-change positive">
							<text class="fas fa-arrow-up"></text>
							<text class="change-text">较上周 +8%</text>
						</view>
					</view>
					<view class="stat-card">
						<text class="stat-label">平均发音评分</text>
						<text class="stat-value">82分</text>
						<view class="stat-change negative">
							<text class="fas fa-arrow-down"></text>
							<text class="change-text">较上周 -3%</text>
						</view>
					</view>
					<view class="stat-card">
						<text class="stat-label">掌握句型</text>
						<text class="stat-value">36个</text>
						<view class="stat-change positive">
							<text class="fas fa-arrow-up"></text>
							<text class="change-text">较上周 +5个</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 学习趋势图 -->
			<view class="chart-section">
				<text class="chart-title">每日实验时间 (分钟)</text>
				<view class="chart-container">
					<view class="chart-bars">
						<view class="chart-bar" v-for="(day, index) in chartData" :key="index">
							<view class="bar" :class="day.active ? 'active' : ''" :style="{ height: day.height + '%' }"></view>
							<text class="bar-label">{{ day.label }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 发现瞬间（成就） -->
			<view class="achievements-section">
				<text class="achievements-title">本周发现瞬间</text>
				<view class="achievements-grid">
					<view class="achievement-card" v-for="(achievement, index) in achievements" :key="index">
						<view class="achievement-icon" :class="achievement.color">
							<text :class="achievement.icon"></text>
						</view>
						<text class="achievement-text">{{ achievement.text }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: 'Report',
	data() {
		return {
			statusBarHeight: 0,
			chartData: [
				{ label: '周一', height: 30, active: false },
				{ label: '周二', height: 45, active: false },
				{ label: '周三', height: 80, active: true },
				{ label: '周四', height: 60, active: false },
				{ label: '周五', height: 20, active: false },
				{ label: '周六', height: 50, active: false },
				{ label: '周日', height: 10, active: false }
			],
			achievements: [
				{
					icon: 'fas fa-fire',
					color: 'green',
					text: '连续3天实验'
				},
				{
					icon: 'fas fa-comment',
					color: 'blue',
					text: '10次对话达成'
				},
				{
					icon: 'fas fa-star',
					color: 'purple',
					text: '发音90+分'
				}
			],

		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		getSystemInfo() {
			uni.getSystemInfo({
				success: (res) => {
					this.statusBarHeight = res.statusBarHeight || 0
				}
			})
		}
	},
	mounted() {
		this.getSystemInfo()
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.report-container {
	height: 100vh;
	background-color: #F9FAFB;
	display: flex;
	flex-direction: column;
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
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #374151;
	transition: color 0.2s;

	&:active {
		color: #2563EB;
	}

	text {
		font-size: 32rpx;
	}
}

.header-center {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1F2937;
}

.header-right {
	width: 64rpx;
	height: 64rpx;
}

/* 报告内容 */
.report-content {
	flex: 1;
	overflow-y: auto;
	background: #f8f9fa;
}

/* 学习统计 */
.stats-section {
	padding: 48rpx 32rpx;
	margin-bottom: 32rpx;
}

.stats-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.stats-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1F2937;
}

.view-full-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	color: #2563EB;
	transition: color 0.2s;

	&:active {
		color: #1D4ED8;
	}
}

.view-full-text {
	font-size: 28rpx;
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}

.stat-card {
	padding: 32rpx;
	background: #f0f4f8;
	border-radius: 24rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 8rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #6B7280;
}

.stat-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #1F2937;
}

.stat-change {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;

	&.positive {
		color: #10B981;
	}

	&.negative {
		color: #EF4444;
	}
}

.change-text {
	font-size: 24rpx;
}

/* 学习趋势图 */
.chart-section {
	padding: 32rpx;
	background: white;
	margin-bottom: 32rpx;
}

.chart-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1F2937;
	margin-bottom: 32rpx;
}

.chart-container {
	height: 300rpx;
	position: relative;
}

.chart-bars {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	height: 100%;
	padding: 0 16rpx;
}

.chart-bar {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	flex: 1;
	height: 100%;
	position: relative;
}

.bar {
	width: 32rpx;
	background: #E5E7EB;
	border-radius: 16rpx;
	transition: all 0.3s ease;

	&.active {
		background: linear-gradient(135deg, #3B82F6, #1D4ED8);
	}
}

.bar-label {
	font-size: 24rpx;
	color: #6B7280;
	position: absolute;
	bottom: 0;
}

/* 发现瞬间（成就） */
.achievements-section {
	padding: 32rpx;
	background: white;
	margin-bottom: 32rpx;
}

.achievements-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1F2937;
	margin-bottom: 32rpx;
}

.achievements-grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 24rpx;
}

.achievement-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	padding: 24rpx;
	background: white;
	border: 1rpx solid #e5e7eb;
	border-radius: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	text-align: center;
}

.achievement-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	flex-shrink: 0;
	margin-bottom: 8rpx;
}

.achievement-icon.green {
	background: linear-gradient(135deg, #10B981, #047857);
}

.achievement-icon.blue {
	background: linear-gradient(135deg, #3B82F6, #1D4ED8);
}

.achievement-icon.purple {
	background: linear-gradient(135deg, #8B5CF6, #7C3AED);
}

.achievement-icon text {
	font-size: 28rpx;
}

.achievement-text {
	font-size: 24rpx;
	color: #374151;
	font-weight: 500;
	line-height: 1.3;
}

.header-subtitle {
	font-size: 24rpx;
	color: #6B7280;
	font-style: italic;
}

.header-actions {
	display: flex;
	gap: 16rpx;
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

/* 报告内容 */
.report-content {
	flex: 1;
	padding-top: 120rpx;
	overflow-y: auto;
}


</style>