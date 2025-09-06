<template>
	<view class="lab-container">
		<!-- 主要内容区域 -->
		<scroll-view class="main-content" scroll-y="true">
			<!-- 装饰背景 -->
			<view class="decoration-bg">
				<view class="test-tube test-tube-1">
					<view class="test-tube-fill" style="height: 60%; background: linear-gradient(to top, #2563EB, #3B82F6);"></view>
				</view>
				<view class="test-tube test-tube-2">
					<view class="test-tube-fill" style="height: 80%; background: linear-gradient(to top, #10B981, #34D399);"></view>
				</view>
				<view class="test-tube test-tube-3">
					<view class="test-tube-fill" style="height: 45%; background: linear-gradient(to top, #F59E0B, #FBBF24);"></view>
				</view>
			</view>

			<view class="content-wrapper">
				<!-- 欢迎区域 -->
				<view class="welcome-section">
					<text class="welcome-title">欢迎来到语言实验室</text>
					<text class="welcome-subtitle">选择您的实验类型，开始日语学习之旅</text>
				</view>

				<!-- 实验入口卡片 -->
				<view class="experiment-cards">
					<!-- AI实验台 -->
					<view class="experiment-card" @click="goToAILab">
						<view class="card-header">
							<view class="card-icon ai-icon">
								<text class="fas fa-robot"></text>
							</view>
							<view class="card-badge">核心实验</view>
						</view>
						<view class="card-content">
							<text class="card-title">AI实验台</text>
							<text class="card-description">与AI进行自由对话实验，提升日语表达能力</text>
							<view class="card-features">
								<view class="feature-item">
									<text class="fas fa-comments"></text>
									<text>智能对话</text>
								</view>
								<view class="feature-item">
									<text class="fas fa-microphone"></text>
									<text>语音识别</text>
								</view>
								<view class="feature-item">
									<text class="fas fa-chart-line"></text>
									<text>实时反馈</text>
								</view>
							</view>
						</view>
						<view class="card-action">
							<text class="action-text">开始对话实验</text>
							<text class="fas fa-arrow-right"></text>
						</view>
					</view>

					<!-- 场景试剂库 -->
					<view class="experiment-card" @click="goToScenarios">
						<view class="card-header">
							<view class="card-icon scenario-icon">
								<text class="fas fa-flask"></text>
							</view>
							<view class="card-badge scenario-badge">情景练习</view>
						</view>
						<view class="card-content">
							<text class="card-title">场景试剂库</text>
							<text class="card-description">在真实场景中练习日语，掌握实用表达</text>
							<view class="scenario-stats">
								<view class="stat-item">
									<text class="stat-number">24</text>
									<text class="stat-label">种场景</text>
								</view>
								<view class="stat-item">
									<text class="stat-number">120+</text>
									<text class="stat-label">个对话</text>
								</view>
							</view>
						</view>
						<view class="card-action">
							<text class="action-text">选择场景</text>
							<text class="fas fa-arrow-right"></text>
						</view>
					</view>

					<!-- 实验报告 -->
					<view class="experiment-card" @click="goToReport">
						<view class="card-header">
							<view class="card-icon report-icon">
								<text class="fas fa-chart-bar"></text>
							</view>
							<view class="card-badge report-badge">学习分析</view>
						</view>
						<view class="card-content">
							<text class="card-title">实验报告</text>
							<text class="card-description">查看学习进度和实验数据分析</text>
							<view class="report-preview">
								<view class="progress-item">
									<text class="progress-label">本周实验时间</text>
									<text class="progress-value">2小时15分</text>
								</view>
								<view class="progress-item">
									<text class="progress-label">发音评分</text>
									<text class="progress-value">82分</text>
								</view>
							</view>
						</view>
						<view class="card-action">
							<text class="action-text">查看详情</text>
							<text class="fas fa-arrow-right"></text>
						</view>
					</view>
				</view>

				<!-- 快速操作 -->
				<view class="quick-actions">
					<text class="section-title">快速操作</text>
					<view class="action-buttons">
						<view class="quick-btn" @click="continueLastExperiment">
							<text class="fas fa-play"></text>
							<text>继续上次实验</text>
						</view>
						<view class="quick-btn" @click="randomScenario">
							<text class="fas fa-random"></text>
							<text>随机场景</text>
						</view>
						<view class="quick-btn" @click="dailyChallenge">
							<text class="fas fa-trophy"></text>
							<text>每日挑战</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 自定义底部导航栏 -->
		<BottomTabBar :current="1" @change="switchTab" />
	</view>
</template>

<script>
import BottomTabBar from '@/components/BottomTabBar/BottomTabBar.vue'

export default {
	name: 'Lab',
	components: {
		BottomTabBar
	},
	data() {
		return {
			statusBarHeight: 0
		}
	},
	methods: {
		// 导航到AI实验台
		goToAILab() {
			uni.navigateTo({
				url: '/pages/lab/ai-lab'
			})
		},
		// 导航到场景试剂库
		goToScenarios() {
			uni.navigateTo({
				url: '/pages/lab/scenarios'
			})
		},
		// 导航到实验报告
		goToReport() {
			uni.navigateTo({
				url: '/pages/lab/report'
			})
		},
		// 继续上次实验
		continueLastExperiment() {
			uni.showToast({
				title: '继续上次实验',
				icon: 'none'
			})
		},
		// 随机场景
		randomScenario() {
			uni.showToast({
				title: '随机场景功能开发中',
				icon: 'none'
			})
		},
		// 每日挑战
		dailyChallenge() {
			uni.showToast({
				title: '每日挑战功能开发中',
				icon: 'none'
			})
		},
		showHistory() {
			uni.showToast({
				title: '实验历史记录',
				icon: 'none'
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
			if (index !== 1) { // 当前页面是lab(index=1)，只有点击其他tab才跳转
				uni.switchTab({
					url: tabPages[index]
				})
			}
		},
		showMenu() {
			uni.showToast({
				title: '实验台设置',
				icon: 'none'
			})
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

.lab-container {
	height: 100%;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
	position: relative;
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

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1F2937;
}

.header-actions {
	display: flex;
	gap: 24rpx;
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

/* 主要内容区域 */
.main-content {
	flex: 1;
	padding-top: 16rpx;
	padding-bottom: calc(120rpx + 120rpx + env(safe-area-inset-bottom));
	position: relative;
}

/* 装饰背景 */
.decoration-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 400rpx;
	pointer-events: none;
	z-index: 1;
}

.test-tube {
	position: absolute;
	width: 32rpx;
	height: 80rpx;
	border: 4rpx solid #2563EB;
	border-radius: 4rpx 4rpx 16rpx 16rpx;
	overflow: hidden;
	opacity: 0.1;
}

.test-tube-1 {
	top: 60rpx;
	left: 60rpx;
	transform: rotate(-15deg);
}

.test-tube-2 {
	top: 120rpx;
	right: 80rpx;
	transform: rotate(20deg);
}

.test-tube-3 {
	top: 200rpx;
	left: 50%;
	transform: translateX(-50%) rotate(-10deg);
}

.test-tube-fill {
	position: absolute;
	bottom: 0;
	width: 100%;
	transition: height 0.5s ease;
}

.content-wrapper {
	position: relative;
	z-index: 2;
	padding: 0 32rpx;
}

/* 欢迎区域 */
.welcome-section {
	text-align: center;
	padding: 40rpx 0 60rpx;
}

.welcome-title {
	font-size: 48rpx;
	font-weight: bold;
	color: #1F2937;
	margin-bottom: 16rpx;
	display: block;
}

.welcome-subtitle {
	font-size: 28rpx;
	color: #6B7280;
	display: block;
}

/* 实验卡片 */
.experiment-cards {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
	margin-bottom: 60rpx;
}

.experiment-card {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	border: 2rpx solid #DBEAFE;
	box-shadow: 0 8rpx 40rpx rgba(37, 99, 235, 0.1);
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.experiment-card:active {
	transform: translateY(4rpx);
	box-shadow: 0 4rpx 20rpx rgba(37, 99, 235, 0.15);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.card-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	text {
		font-size: 36rpx;
	}
}

.ai-icon {
	background: linear-gradient(135deg, #2563EB, #3B82F6);
	color: white;
}

.scenario-icon {
	background: linear-gradient(135deg, #F97316, #FB923C);
	color: white;
}

.report-icon {
	background: linear-gradient(135deg, #10B981, #34D399);
	color: white;
}

.card-badge {
	font-size: 24rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	background: #2563EB;
	color: white;
	font-weight: 500;
}

.scenario-badge {
	background: #F97316;
}

.report-badge {
	background: #10B981;
}

.card-content {
	margin-bottom: 24rpx;
}

.card-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1F2937;
	margin-bottom: 12rpx;
	display: block;
}

.card-description {
	font-size: 28rpx;
	color: #6B7280;
	line-height: 1.5;
	margin-bottom: 20rpx;
	display: block;
}

.card-features {
	display: flex;
	gap: 24rpx;
}

.feature-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;
	color: #6B7280;

	text:first-child {
		color: #2563EB;
		font-size: 20rpx;
	}
}

.scenario-stats {
	display: flex;
	gap: 32rpx;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-number {
	font-size: 32rpx;
	font-weight: bold;
	color: #F97316;
	display: block;
}

.stat-label {
	font-size: 24rpx;
	color: #6B7280;
	display: block;
}

.report-preview {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.progress-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.progress-label {
	font-size: 26rpx;
	color: #6B7280;
}

.progress-value {
	font-size: 26rpx;
	font-weight: 600;
	color: #10B981;
}

.card-action {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20rpx;
	border-top: 1rpx solid rgba(107, 114, 128, 0.1);
}

.action-text {
	font-size: 28rpx;
	font-weight: 500;
	color: #2563EB;
}

.card-action text:last-child {
	font-size: 24rpx;
	color: #2563EB;
}

/* 快速操作 */
.quick-actions {
	padding: 0 32rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1F2937;
	margin-bottom: 24rpx;
	display: block;
}

.action-buttons {
	display: flex;
	gap: 16rpx;
}

.quick-btn {
	flex: 1;
	background: white;
	border: 2rpx solid #E5E7EB;
	border-radius: 16rpx;
	padding: 24rpx 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	transition: all 0.2s ease;
}

.quick-btn:active {
	background: #F9FAFB;
	border-color: #2563EB;
	transform: translateY(2rpx);
}

.quick-btn text:first-child {
	font-size: 32rpx;
	color: #6B7280;
}

.quick-btn text:last-child {
	font-size: 24rpx;
	color: #374151;
	font-weight: 500;
	text-align: center;
}
</style>