<template>
	<view class="container">
		<!-- 导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: (statusBarHeight + 16) + 'px' }">
			<view class="nav-left" @click="goBack">
				<text class="fa fa-arrow-left"></text>
			</view>
			<view class="nav-title">添加好友</view>
			<view class="nav-right"></view>
		</view>

		<view class="content">
			<!-- 搜索框 -->
			<view class="search-section">
				<view class="search-box">
					<text class="fa fa-search search-icon"></text>
					<input type="text" placeholder="输入用户ID或昵称" class="search-input" v-model="searchText" />
					<view class="search-btn" @click="searchUser">
						<text class="search-btn-text">搜索</text>
					</view>
				</view>
			</view>

			<!-- 快速添加方式 -->
			<view class="quick-add-section">
				<view class="section-title">快速添加</view>
				<view class="quick-add-grid">
					<view class="quick-add-item" @click="scanQRCode">
						<view class="quick-add-icon primary">
							<text class="fa fa-qrcode"></text>
						</view>
						<text class="quick-add-text">扫码添加</text>
					</view>
					<view class="quick-add-item" @click="shareInvite">
						<view class="quick-add-icon accent">
							<text class="fa fa-share-alt"></text>
						</view>
						<text class="quick-add-text">分享邀请</text>
					</view>
				</view>
			</view>

			<!-- 我的二维码 -->
			<view class="qr-section">
				<view class="section-title">我的二维码</view>
				<view class="qr-card">
					<view class="qr-code">
						<text class="fa fa-qrcode qr-placeholder"></text>
					</view>
					<text class="user-name">田中さん</text>
					<text class="user-id">ID: TanakaLab2024</text>
					<view class="save-btn" @click="saveQRCode">
						<text class="save-btn-text">保存二维码</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchText: '',
			statusBarHeight: 0
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
		},
		searchUser() {
			if (!this.searchText.trim()) {
				uni.showToast({
					title: '请输入搜索内容',
					icon: 'none'
				})
				return
			}
			// TODO: 实现搜索用户功能
			uni.showToast({
				title: '搜索功能开发中',
				icon: 'none'
			})
		},
		scanQRCode() {
			// TODO: 实现扫码功能
			uni.showToast({
				title: '扫码功能开发中',
				icon: 'none'
			})
		},
		shareInvite() {
			// TODO: 实现分享邀请功能
			uni.showToast({
				title: '分享功能开发中',
				icon: 'none'
			})
		},
		saveQRCode() {
			// TODO: 实现保存二维码功能
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
		}
	},
	mounted() {
		this.getSystemInfo()
	}
}
</script>

<style scoped>
.container {
	background-color: #ffffff;
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.nav-bar {
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

.nav-left {
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
}

.fa-arrow-left {
	font-size: 32rpx;
}

.nav-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1F2937;
}

.nav-right {
	width: 48rpx;
}

.content {
	margin-top: 120rpx;
	padding: 32rpx;
	background-color: #ffffff;
	min-height: calc(100vh - 120rpx);
}

.search-section {
	margin-bottom: 48rpx;
}

.search-box {
	position: relative;
	display: flex;
	align-items: center;
	border: 1px solid #DBEAFE;
	border-radius: 24rpx;
	padding: 24rpx;
	background-color: #ffffff;
}

.search-icon {
	position: absolute;
	left: 24rpx;
	font-size: 32rpx;
	color: #9CA3AF;
}

.search-input {
	flex: 1;
	padding-left: 56rpx;
	padding-right: 80rpx;
	font-size: 28rpx;
	border: none;
	outline: none;
}

.search-btn {
	position: absolute;
	right: 24rpx;
}

.search-btn-text {
	color: #2563EB;
	font-size: 28rpx;
	font-weight: 500;
}

.quick-add-section {
	margin-bottom: 48rpx;
}

.section-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #6B7280;
	margin-bottom: 24rpx;
}

.quick-add-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}

.quick-add-item {
	background-color: #EFF6FF;
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.quick-add-icon {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
}

.quick-add-icon.primary {
	background-color: rgba(37, 99, 235, 0.1);
}

.quick-add-icon.accent {
	background-color: rgba(16, 185, 129, 0.1);
}

.quick-add-icon .fa {
	font-size: 40rpx;
}

.quick-add-icon.primary .fa {
	color: #2563EB;
}

.quick-add-icon.accent .fa {
	color: #10B981;
}

.quick-add-text {
	font-size: 28rpx;
	font-weight: 500;
	color: #1F2937;
}

.qr-section {
	margin-bottom: 48rpx;
}

.qr-card {
	background-color: #ffffff;
	border: 1px solid #DBEAFE;
	border-radius: 24rpx;
	padding: 32rpx;
	text-align: center;
}

.qr-code {
	width: 256rpx;
	height: 256rpx;
	background-color: #F3F4F6;
	border-radius: 24rpx;
	margin: 0 auto 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.qr-placeholder {
	font-size: 80rpx;
	color: #9CA3AF;
}

.user-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #1F2937;
	display: block;
	margin-bottom: 8rpx;
}

.user-id {
	font-size: 24rpx;
	color: #6B7280;
	display: block;
	margin-bottom: 24rpx;
}

.save-btn {
	background-color: #2563EB;
	color: #ffffff;
	border-radius: 40rpx;
	padding: 16rpx 32rpx;
	display: inline-block;
}

.save-btn-text {
	font-size: 28rpx;
	font-weight: 500;
	color: #ffffff;
}

/* 暗黑模式样式 */
.dark-theme .container {
	background-color: #121212;
}

.dark-theme .nav-bar {
	background-color: #1F1F1F;
	border-bottom: 1rpx solid #3D3D3D;
}

.dark-theme .nav-title {
	color: #E0E0E0;
}

.dark-theme .nav-left {
	color: #A0A0A0;
}

.dark-theme .nav-left:active {
	color: #6366F1;
}

.dark-theme .content {
	background-color: #121212;
}

.dark-theme .search-box {
	background-color: #1F1F1F;
	border: 1px solid #3D3D3D;
}

.dark-theme .search-input {
	background-color: #1F1F1F;
	color: #E0E0E0;
}

.dark-theme .search-input::placeholder {
	color: #666666;
}

.dark-theme .search-icon {
	color: #808080;
}

.dark-theme .search-btn-text {
	color: #6366F1;
}

.dark-theme .section-title {
	color: #A0A0A0;
}

.dark-theme .quick-add-item {
	background-color: #1E1E1E;
}

.dark-theme .quick-add-text {
	color: #E0E0E0;
}

.dark-theme .qr-card {
	background-color: #1F1F1F;
	border: 1px solid #3D3D3D;
}

.dark-theme .qr-code {
	background-color: #2D2D2D;
}

.dark-theme .qr-placeholder {
	color: #808080;
}

.dark-theme .user-name {
	color: #E0E0E0;
}

.dark-theme .user-id {
	color: #A0A0A0;
}


</style>