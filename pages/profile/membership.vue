<template>
	<view class="membership-container">
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

		<!-- 标题栏 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="fa fa-arrow-left"></text>
			</view>
			<text class="header-title">会話Lab 会员</text>
			<view class="header-spacer"></view>
		</view>

		<!-- 会员介绍 -->
		<view class="intro-section">
			<view class="intro-icon">
				<text class="star-icon">★</text>
			</view>
			<text class="intro-title">解锁全部实验功能</text>
			<text class="intro-subtitle">成为会员，获取完整的日语会话实验体验</text>
		</view>

		<!-- 会员套餐 -->
		<view class="plans-section">
			<!-- 月度会员 -->
			<view class="plan-card recommended">
				<view class="plan-badge">推荐</view>
				<text class="plan-title">月度会员</text>
				<view class="plan-price">
					<text class="price">¥28</text>
					<text class="period">/月</text>
				</view>
				<view class="plan-features">
					<view class="feature-item">
						<text class="check-icon">✓</text>
						<text class="feature-text">解锁全部24种场景试剂</text>
					</view>
					<view class="feature-item">
						<text class="check-icon">✓</text>
						<text class="feature-text">高级发音分析功能</text>
					</view>
					<view class="feature-item">
						<text class="check-icon">✓</text>
						<text class="feature-text">无限制AI对话实验</text>
					</view>
					<view class="feature-item">
						<text class="check-icon">✓</text>
						<text class="feature-text">个性化学习计划</text>
					</view>
				</view>
				<button class="plan-button primary" @click="selectPlan('monthly')">选择月度会员</button>
			</view>

			<!-- 年度会员 -->
			<view class="plan-card">
				<view class="plan-badge best-value">最优惠</view>
				<text class="plan-title">年度会员</text>
				<view class="plan-price">
					<text class="price">¥198</text>
					<text class="period">/年</text>
					<view class="savings-badge">
						<text class="savings-text">省¥138</text>
					</view>
				</view>
				<text class="plan-subtitle">平均每月仅¥16.5</text>
				<view class="plan-features">
					<view class="feature-item">
						<text class="check-icon">✓</text>
						<text class="feature-text">包含月度会员全部功能</text>
					</view>
					<view class="feature-item">
						<text class="check-icon">✓</text>
						<text class="feature-text">专属学习顾问</text>
					</view>
					<view class="feature-item">
						<text class="check-icon">✓</text>
						<text class="feature-text">季度学习报告分析</text>
					</view>
					<view class="feature-item">
						<text class="check-icon">✓</text>
						<text class="feature-text">优先体验新功能</text>
					</view>
				</view>
				<button class="plan-button secondary" @click="selectPlan('yearly')">选择年度会员</button>
			</view>
		</view>

		<!-- 兑换码 -->
		<view class="redeem-section">
			<view class="redeem-card">
				<view class="redeem-header">
				<view class="redeem-icon">
					<text class="fas fa-gift"></text>
				</view>
				<text class="redeem-title">有兑换码？</text>
			</view>
				<view class="redeem-input-group">
					<input class="redeem-input" placeholder="输入兑换码" v-model="redeemCode" />
					<button class="redeem-button" @click="redeemCode">兑换</button>
				</view>
			</view>
		</view>

		<!-- 会员权益 -->
		<view class="benefits-section">
			<text class="benefits-title">会员专属权益</text>
			<view class="benefits-grid">
				<view class="benefit-item">
						<view class="benefit-icon primary">
							<text class="fas fa-flask"></text>
						</view>
						<text class="benefit-text">全部场景试剂</text>
					</view>
				<view class="benefit-item">
						<view class="benefit-icon secondary">
							<text class="fas fa-microphone-alt"></text>
						</view>
						<text class="benefit-text">高级发音分析</text>
					</view>
				<view class="benefit-item">
						<view class="benefit-icon accent">
							<text class="fas fa-robot"></text>
						</view>
						<text class="benefit-text">AI深度对话</text>
					</view>
				<view class="benefit-item">
						<view class="benefit-icon purple">
							<text class="fas fa-chart-line"></text>
						</view>
						<text class="benefit-text">详细实验报告</text>
					</view>
			</view>
		</view>

		<!-- 服务条款 -->
		<view class="terms-section">
			<text class="terms-text">
				订阅将自动续费，您可以在设置中随时取消。<br>
				查看<text class="terms-link">服务条款</text>和<text class="terms-link">隐私政策</text>
			</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			redeemCode: ''
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		selectPlan(planType) {
			console.log('选择套餐:', planType)
			// 这里可以添加支付逻辑
			uni.showToast({
				title: `已选择${planType === 'monthly' ? '月度' : '年度'}会员`,
				icon: 'none'
			})
		},
		redeemCode() {
			if (!this.redeemCode.trim()) {
				uni.showToast({
					title: '请输入兑换码',
					icon: 'none'
				})
				return
			}
			// 这里可以添加兑换逻辑
			console.log('兑换码:', this.redeemCode)
			uni.showToast({
				title: '兑换成功！',
				icon: 'success'
			})
			this.redeemCode = ''
		}
	}
}
</script>

<style scoped>
.membership-container {
	background: #f8f9fa;
	min-height: 100vh;
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
	width: 20rpx;
	height: 120rpx;
	border: 4rpx solid #E5E7EB;
	border-radius: 0 0 20rpx 20rpx;
	background: rgba(255, 255, 255, 0.8);
	opacity: 0.6;
}

.test-tube-1 {
	top: 190rpx;
	left: 60rpx;
	transform: rotate(-15deg);
}

.test-tube-2 {
	top: 180rpx;
	right: 80rpx;
	transform: rotate(20deg);
}

.test-tube-3 {
	top: 350rpx;
	left: 90%;
	transform: translateX(-50%) rotate(-8deg);
}

.test-tube-fill {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	border-radius: 0 0 16rpx 16rpx;
	transition: height 0.3s ease;
}

/* 标题栏 */
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	background: white;
	border-bottom: 2rpx solid #DBEAFE;
	position: relative;
	z-index: 10;
}

.header-left, .header-spacer {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1F2937;
}

.header-left .fa {
	font-size: 32rpx;
	color: #6B7280;
}

/* 会员介绍 */
.intro-section {
	padding: 48rpx;
	text-align: center;
	background: white;
}

.intro-icon {
	width: 128rpx;
	height: 128rpx;
	border-radius: 50%;
	background: rgba(249, 115, 22, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 32rpx;
}

.star-icon {
	font-size: 48rpx;
	color: #F97316;
}

.intro-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #1F2937;
	display: block;
	margin-bottom: 16rpx;
}

.intro-subtitle {
	font-size: 28rpx;
	color: #6B7280;
	display: block;
}

/* 会员套餐 */
.plans-section {
	padding: 0 48rpx;
	margin-bottom: 48rpx;
}

.plan-card {
	border: 4rpx solid #DBEAFE;
	border-radius: 32rpx;
	padding: 40rpx;
	margin-bottom: 32rpx;
	position: relative;
	background: white;
}

.plan-card.recommended {
	border-color: #2563EB;
}

.plan-badge {
	position: absolute;
	top: 0;
	right: 0;
	background: #2563EB;
	color: white;
	font-size: 24rpx;
	padding: 8rpx 24rpx;
	border-radius: 0 28rpx 0 16rpx;
}

.plan-badge.best-value {
	background: #10B981;
}

.plan-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1F2937;
	display: block;
	margin-bottom: 8rpx;
}

.plan-price {
	display: flex;
	align-items: baseline;
	margin-bottom: 32rpx;
}

.price {
	font-size: 60rpx;
	font-weight: bold;
	color: #1F2937;
}

.period {
	font-size: 28rpx;
	color: #6B7280;
	margin-left: 8rpx;
}

.savings-badge {
	margin-left: 16rpx;
}

.savings-text {
	font-size: 24rpx;
	background: #DCFCE7;
	color: #16A34A;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.plan-subtitle {
	font-size: 28rpx;
	color: #6B7280;
	display: block;
	margin-bottom: 32rpx;
}

.plan-features {
	margin-bottom: 40rpx;
}

.feature-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 16rpx;
}

.check-icon {
	font-size: 28rpx;
	color: #10B981;
	margin-right: 16rpx;
	margin-top: 4rpx;
}

.feature-text {
	font-size: 28rpx;
	color: #374151;
	flex: 1;
}

.plan-button {
	width: 100%;
	padding: 24rpx;
	border-radius: 40rpx;
	font-size: 32rpx;
	font-weight: 500;
	border: none;
	transition: all 0.2s;
}

.plan-button.primary {
	background: #2563EB;
	color: white;
}

.plan-button.secondary {
	background: white;
	border: 2rpx solid #2563EB;
	color: #2563EB;
}

/* 兑换码 */
.redeem-section {
	padding: 0 48rpx;
	margin-bottom: 64rpx;
}

.redeem-card {
	background: #EFF6FF;
	border: 2rpx solid #DBEAFE;
	border-radius: 24rpx;
	padding: 40rpx;
}

.redeem-header {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
}

.redeem-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: rgba(37, 99, 235, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
}

.redeem-icon .fas {
	font-size: 32rpx;
	color: #2563EB;
}

.redeem-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #1F2937;
}

.redeem-input-group {
	display: flex;
	height: 96rpx;
}

.redeem-input {
	flex: 1;
	background: white;
	border: 2rpx solid #DBEAFE;
	border-radius: 24rpx 0 0 24rpx;
	padding: 24rpx 32rpx;
	font-size: 28rpx;
	border-right: none;
	height: 96rpx;
	box-sizing: border-box;
}

.redeem-button {
	background: #2563EB;
	color: white;
	padding: 0 48rpx;
	border-radius: 0 24rpx 24rpx 0;
	font-size: 28rpx;
	font-weight: 500;
	border: none;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 会员权益 */
.benefits-section {
	padding: 0 48rpx;
	margin-bottom: 48rpx;
}

.benefits-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #1F2937;
	display: block;
	margin-bottom: 24rpx;
}

.benefits-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}

.benefit-item {
	background: #EFF6FF;
	border-radius: 24rpx;
	padding: 24rpx;
	text-align: center;
}

.benefit-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 16rpx;
}

.benefit-icon.primary {
	background: rgba(37, 99, 235, 0.8);
}

.benefit-icon.secondary {
	background: rgba(249, 115, 22, 0.8);
}

.benefit-icon.accent {
	background: rgba(16, 185, 129, 0.8);
}

.benefit-icon.purple {
	background: rgba(139, 92, 246, 0.8);
}

.icon-text {
	font-size: 32rpx;
}

.fas {
	font-size: 32rpx;
	color: white;
	font-family: 'Font Awesome 6 Free';
	font-weight: 900;
}

.benefit-text {
	font-size: 24rpx;
	color: #374151;
	display: block;
}

/* 服务条款 */
.terms-section {
	padding: 0 48rpx 64rpx;
	text-align: center;
}

.terms-text {
	font-size: 24rpx;
	color: #9CA3AF;
	line-height: 1.5;
}

.terms-link {
	color: #2563EB;
}
</style>