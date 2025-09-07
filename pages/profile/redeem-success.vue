<template>
	<view class="redeem-success-container">
		<view class="content-wrapper">
			<!-- 成功图标 -->
			<view class="success-icon">
				<text class="fas fa-flask"></text>
			</view>
			
			<text class="success-title">兑换成功！</text>
			<text class="success-subtitle">您的会员权益已激活</text>
			
			<!-- 会员信息 -->
			<view class="member-info-card">
				<view class="info-row">
					<text class="info-label">会员类型</text>
					<text class="info-value">年度会员</text>
				</view>
				<view class="info-row">
					<text class="info-label">激活日期</text>
					<text class="info-value">{{ activationDate }}</text>
				</view>
				<view class="info-row">
					<text class="info-label">到期日期</text>
					<text class="info-value">{{ expirationDate }}</text>
				</view>
			</view>
			
			<text class="success-message">
				您已成功解锁全部实验功能<br>
				开始您的日语会话实验吧！
			</text>
			
			<button class="explore-button" @click="exploreFeatures">探索全部功能</button>
			
			<button class="benefits-button" @click="viewBenefits">查看会员权益</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			activationDate: '',
			expirationDate: ''
		}
	},
	onLoad() {
		this.initDates()
	},
	methods: {
		initDates() {
			const now = new Date()
			const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
			
			this.activationDate = this.formatDate(now)
			this.expirationDate = this.formatDate(nextYear)
		},
		formatDate(date) {
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			return `${year}-${month}-${day}`
		},
		exploreFeatures() {
			uni.switchTab({
				url: '/pages/lab/lab'
			})
		},
		viewBenefits() {
			uni.navigateTo({
				url: '/pages/profile/membership'
			})
		}
	}
}
</script>

<style scoped>
.redeem-success-container {
	background: white;
	min-height: 100vh;
	position: relative;
	padding: 0 32rpx;
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
	top: 80rpx;
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

.content-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 48rpx;
	text-align: center;
	min-height: 100vh;
	position: relative;
	z-index: 10;
}

.success-icon {
	width: 192rpx;
	height: 192rpx;
	border-radius: 50%;
	background: rgba(16, 185, 129, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 48rpx;
}

.success-icon .fas {
	font-size: 96rpx;
	color: #10B981;
	font-family: 'Font Awesome 6 Free';
	font-weight: 900;
}

.success-title {
	font-size: 48rpx;
	font-weight: bold;
	color: #1F2937;
	display: block;
	margin-bottom: 16rpx;
}

.success-subtitle {
	font-size: 32rpx;
	color: #6B7280;
	display: block;
	margin-bottom: 48rpx;
}

.member-info-card {
	background: #EFF6FF;
	border-radius: 40rpx;
	padding: 40rpx;
	width: 100%;
	margin-bottom: 64rpx;
}

.info-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.info-row:last-child {
	margin-bottom: 0;
}

.info-label {
	font-size: 28rpx;
	color: #6B7280;
}

.info-value {
	font-size: 28rpx;
	font-weight: 500;
	color: #1F2937;
}

.success-message {
	font-size: 32rpx;
	color: #6B7280;
	line-height: 1.5;
	display: block;
	margin-bottom: 64rpx;
}

.explore-button {
	width: 100%;
	padding: 24rpx;
	background: #2563EB;
	color: white;
	border-radius: 40rpx;
	font-size: 32rpx;
	font-weight: 500;
	border: none;
	margin-bottom: 24rpx;
	transition: all 0.2s;
}

.benefits-button {
	width: 100%;
	padding: 24rpx;
	background: white;
	border: 2rpx solid #E5E7EB;
	color: #6B7280;
	border-radius: 40rpx;
	font-size: 32rpx;
	font-weight: 500;
	transition: all 0.2s;
}

/* 暗黑模式样式 */
.dark-theme .redeem-success-container {
	background: #121212;
}

.dark-theme .success-icon {
	background: rgba(16, 185, 129, 0.1);
}

.dark-theme .success-icon .fas {
	color: #10B981;
}

.dark-theme .success-title {
	color: #E0E0E0;
}

.dark-theme .success-subtitle {
	color: #A0A0A0;
}

.dark-theme .member-info-card {
	background: #1E1E1E;
}

.dark-theme .info-label {
	color: #A0A0A0;
}

.dark-theme .info-value {
	color: #E0E0E0;
}

.dark-theme .success-message {
	color: #A0A0A0;
}

.dark-theme .explore-button {
	background: #6366F1;
	color: white;
}

.dark-theme .benefits-button {
	background: #1F1F1F;
	border: 2rpx solid #3D3D3D;
	color: #A0A0A0;
}
</style>