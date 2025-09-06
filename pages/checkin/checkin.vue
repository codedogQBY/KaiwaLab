<template>
	<view class="checkin-container">
		<!-- 装饰背景 -->
		<view class="decoration-bg">
			<view class="test-tube-left">
				<view class="test-tube">
					<view class="test-tube-fill accent" style="height: 90%"></view>
				</view>
			</view>
			<view class="test-tube-right">
				<view class="test-tube">
					<view class="test-tube-fill primary" style="height: 60%"></view>
				</view>
			</view>
		</view>
		
		<!-- 头部导航 -->
		<view class="header fixed-header">
			<view class="header-left" @click="goBack">
				<text class="fas fa-chevron-left back-btn"></text>
			</view>
			<view class="header-title"></view>
			<view class="header-right"></view>
		</view>

		<!-- 内容区域 -->
		<view class="content-area">

			<!-- 签到成功动画区域 -->
			<view class="checkin-success">
			<view class="success-icon" :class="{animate: showAnimation}">
				<text class="fas fa-check-circle"></text>
			</view>
			<view class="success-title">签到成功！</view>
			<view class="success-subtitle">连续实验第 {{ consecutiveDays }} 天</view>
		</view>

			<!-- 本周签到记录 -->
			<view class="weekly-record">
			<view class="record-header">
				<view class="record-title">本周实验记录</view>
				<view class="record-legend">
					<view class="legend-item">
						<view class="legend-dot completed"></view>
						<text class="legend-text">已完成</text>
					</view>
					<view class="legend-item">
						<view class="legend-dot pending"></view>
						<text class="legend-text">待完成</text>
					</view>
				</view>
			</view>
			<view class="week-grid">
				<view class="day-item" v-for="(day, index) in weekDays" :key="index">
					<view class="day-label">{{ day.label }}</view>
					<view class="day-circle" :class="{completed: day.completed, today: day.isToday}">
					<text class="fas fa-check" v-if="day.completed"></text>
					<text class="fas fa-calendar" v-else></text>
					<view class="star-badge" v-if="day.isToday && day.completed">
						<text class="fas fa-star"></text>
					</view>
				</view>
					<view class="day-reward" :class="{earned: day.completed}">+{{ day.reward }}</view>
				</view>
			</view>
		</view>

			<!-- 奖励信息 -->
			<view class="reward-section">
			<view class="section-title">今日奖励</view>
			<view class="reward-card">
				<view class="reward-item">
					<view class="reward-icon-container basic">
						<text class="fas fa-gift"></text>
					</view>
					<view class="reward-info">
						<view class="reward-name">基础奖励</view>
						<view class="reward-desc">每日签到奖励</view>
					</view>
					<view class="reward-value basic">+15</view>
				</view>
				
				<view class="reward-item">
					<view class="reward-icon-container bonus">
						<text class="fas fa-fire"></text>
					</view>
					<view class="reward-info">
						<view class="reward-name">连续奖励</view>
						<view class="reward-desc">连续{{ consecutiveDays }}天额外奖励</view>
					</view>
					<view class="reward-value bonus">+5</view>
				</view>
			</view>
		</view>

			<!-- 连续签到进度 -->
			<view class="progress-section">
			<view class="section-title">连续实验进度</view>
			<view class="progress-card">
				<view class="progress-header">
					<view class="progress-current">连续 {{ consecutiveDays }} 天</view>
					<view class="progress-next">距离下一奖励还需 {{ nextRewardDays }} 天</view>
				</view>
				<view class="progress-bar">
					<view class="progress-fill" :style="{width: progressPercent + '%'}"></view>
				</view>
				<view class="progress-footer">
					<view class="progress-label">第{{ consecutiveDays }}天</view>
					<view class="progress-target">第{{ targetDays }}天解锁特殊奖励</view>
				</view>
			</view>
		</view>

			<!-- 下次奖励预览 -->
			<view class="preview-section">
			<view class="preview-title">明日奖励预览</view>
			<view class="preview-rewards">
				<view class="preview-item">
					<view class="preview-icon basic">
						<text class="fas fa-gift"></text>
					</view>
					<view class="preview-text">+20 经验</view>
				</view>
				<view class="preview-item">
					<view class="preview-icon primary">
						<text class="fas fa-unlock"></text>
					</view>
					<view class="preview-text">解锁场景</view>
				</view>
			</view>
		</view>

			<!-- 底部按钮 -->
			<view class="bottom-action">
			<button class="start-btn" @click="startExperiment">开始今日实验</button>
		</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'Checkin',
	data() {
		return {
			showAnimation: false,
			consecutiveDays: 5,
			nextRewardDays: 2,
			targetDays: 7,
			weekDays: [
				{ label: '周一', completed: true, reward: 10, isToday: false },
				{ label: '周二', completed: true, reward: 10, isToday: false },
				{ label: '周三', completed: true, reward: 10, isToday: false },
				{ label: '周四', completed: true, reward: 10, isToday: false },
				{ label: '周五', completed: true, reward: 15, isToday: true },
				{ label: '周六', completed: false, reward: 20, isToday: false },
				{ label: '周日', completed: false, reward: 25, isToday: false }
			]
		}
	},
	computed: {
		progressPercent() {
			return Math.round((this.consecutiveDays / this.targetDays) * 100)
		}
	},
	mounted() {
		// 延迟显示动画
		setTimeout(() => {
			this.showAnimation = true
		}, 300)
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		startExperiment() {
			uni.navigateTo({
				url: '/pages/lab/lab'
			})
		}
	}
}
</script>

<style lang="scss">

.checkin-container {
	background: linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 0%, #ffffff 20%, rgba(37, 99, 235, 0.05) 100%);
	height: 100vh;
	position: relative;
	overflow-y: auto;
}

.content-area {
	padding: 120rpx 32rpx 0;
	min-height: calc(100vh - 120rpx);
	display: flex;
	flex-direction: column;
}

/* 装饰背景 */
.decoration-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	z-index: 0;
}

.test-tube-left {
	position: absolute;
	top: 60rpx;
	left: 32rpx;
	width: 48rpx;
	height: 48rpx;
	opacity: 0.1;
}

.test-tube-right {
	position: absolute;
	bottom: 160rpx;
	right: 48rpx;
	width: 64rpx;
	height: 64rpx;
	opacity: 0.1;
}

.test-tube {
	width: 32rpx;
	height: 72rpx;
	border: 4rpx solid #2563EB;
	border-radius: 4rpx 4rpx 16rpx 16rpx;
	position: relative;
	overflow: hidden;
}

.test-tube-fill {
	position: absolute;
	bottom: 0;
	width: 100%;
	transition: height 0.5s ease;
}

.test-tube-fill.accent {
	background: #10B981;
}

.test-tube-fill.primary {
	background: #2563EB;
}

/* 头部导航 */
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx 32rpx;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
}

.header-left,
.header-right {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-btn {
	color: #6B7280;
	font-size: 36rpx;
	cursor: pointer;
	transition: color 0.2s;
}

.back-btn:hover {
	color: #2563EB;
}

.header-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #1F2937;
}

/* 签到成功区域 */
.checkin-success {
	text-align: center;
	margin-bottom: 64rpx;
	position: relative;
	z-index: 1;
}

.success-icon {
	width: 192rpx;
	height: 192rpx;
	border-radius: 50%;
	background: rgba(16, 185, 129, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 32rpx;
	transition: transform 0.3s ease;
}

.success-icon.animate {
	animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
	0%, 100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
}

.success-icon .fas {
	font-size: 60rpx;
	color: #10B981;
}

.success-title {
	font-size: 42rpx;
	font-weight: 600;
	color: #1F2937;
	margin-bottom: 16rpx;
}

.success-subtitle {
	font-size: 28rpx;
	color: #6B7280;
}

/* 本周签到记录 */
.weekly-record {
	margin-bottom: 64rpx;
	position: relative;
	z-index: 1;
}

.record-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.record-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #1F2937;
}

.record-legend {
	display: flex;
	align-items: center;
	gap: 32rpx;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.legend-dot {
	width: 24rpx;
	height: 24rpx;
	border-radius: 50%;
}

.legend-dot.completed {
	background: #10B981;
}

.legend-dot.pending {
	border: 2rpx solid #D1D5DB;
	background: transparent;
}

.legend-text {
	font-size: 24rpx;
	color: #6B7280;
}

.week-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 16rpx;
}

.day-item {
	text-align: center;
}

.day-label {
	font-size: 24rpx;
	color: #6B7280;
	margin-bottom: 16rpx;
}

.day-circle {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 8rpx;
	position: relative;
}

.day-circle.completed {
	background: #10B981;
}

.day-circle.completed .fas {
	color: white;
	font-size: 28rpx;
}

.day-circle:not(.completed) {
	border: 4rpx solid #E5E7EB;
	background: #F9FAFB;
}

.day-circle:not(.completed) .fas {
	color: #9CA3AF;
	font-size: 28rpx;
}

.star-badge {
	position: absolute;
	top: -8rpx;
	right: -8rpx;
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	background: #F97316;
	display: flex;
	align-items: center;
	justify-content: center;
}

.star-badge .fas {
	color: white;
	font-size: 20rpx !important;
}

.day-reward {
	font-size: 24rpx;
	margin-top: 8rpx;
}

.day-reward.earned {
	color: #10B981;
}

.day-reward:not(.earned) {
	color: #9CA3AF;
}

/* 奖励信息 */
.reward-section {
	margin-bottom: 64rpx;
	position: relative;
	z-index: 1;
}

.section-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #1F2937;
	margin-bottom: 32rpx;
}

.reward-card {
	background: white;
	border: 2rpx solid #DBEAFE;
	border-radius: 24rpx;
	padding: 32rpx;
}

.reward-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.reward-item:last-child {
	margin-bottom: 0;
}

.reward-icon-container {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
}

.reward-icon-container.basic {
	background: rgba(249, 115, 22, 0.1);
}

.reward-icon-container.basic .fas {
	color: #F97316;
	font-size: 32rpx;
}

.reward-icon-container.bonus {
	background: rgba(16, 185, 129, 0.1);
}

.reward-icon-container.bonus .fas {
	color: #10B981;
	font-size: 32rpx;
}

.reward-info {
	flex: 1;
}

.reward-name {
	font-size: 32rpx;
	font-weight: 500;
	color: #1F2937;
	margin-bottom: 4rpx;
}

.reward-desc {
	font-size: 24rpx;
	color: #6B7280;
}

.reward-value {
	font-size: 36rpx;
	font-weight: 600;
}

.reward-value.basic {
	color: #F97316;
}

.reward-value.bonus {
	color: #10B981;
}

/* 连续签到进度 */
.progress-section {
	margin-bottom: 64rpx;
	position: relative;
	z-index: 1;
}

.progress-card {
	background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
	border-radius: 24rpx;
	padding: 32rpx;
}

.progress-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.progress-current {
	font-size: 28rpx;
	font-weight: 500;
	color: #1F2937;
}

.progress-next {
	font-size: 28rpx;
	color: #6B7280;
}

.progress-bar {
	width: 100%;
	height: 16rpx;
	background: rgba(255, 255, 255, 0.5);
	border-radius: 8rpx;
	overflow: hidden;
	margin-bottom: 16rpx;
}

.progress-fill {
	height: 100%;
	background: #10B981;
	border-radius: 8rpx;
	transition: width 0.5s ease;
}

.progress-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.progress-label {
	font-size: 24rpx;
	color: #6B7280;
}

.progress-target {
	font-size: 24rpx;
	color: #2563EB;
	font-weight: 500;
}

/* 下次奖励预览 */
.preview-section {
	background: rgba(37, 99, 235, 0.05);
	border: 2rpx solid rgba(37, 99, 235, 0.2);
	border-radius: 24rpx;
	padding: 32rpx;
	text-align: center;
	margin-bottom: 48rpx;
	position: relative;
	z-index: 1;
}

.preview-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #1F2937;
	margin-bottom: 32rpx;
}

.preview-rewards {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 64rpx;
}

.preview-item {
	text-align: center;
}

.preview-icon {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 8rpx;
}

.preview-icon.basic {
	background: rgba(249, 115, 22, 0.2);
}

.preview-icon.basic .fas {
	color: #F97316;
	font-size: 28rpx;
}

.preview-icon.primary {
	background: rgba(37, 99, 235, 0.2);
}

.preview-icon.primary .fas {
	color: #2563EB;
	font-size: 28rpx;
}

.preview-text {
	font-size: 24rpx;
	color: #6B7280;
}

/* 底部按钮 */
.bottom-action {
	margin-top: auto;
	padding-top: 48rpx;
	padding-bottom: 32rpx;
	position: relative;
	z-index: 1;
}

.start-btn {
	width: 100%;
	height: 96rpx;
	background: #2563EB;
	color: white;
	border-radius: 48rpx;
	font-size: 32rpx;
	font-weight: 500;
	border: none;
	transition: background-color 0.2s;
}

.start-btn:hover {
	background: rgba(37, 99, 235, 0.9);
}
</style>