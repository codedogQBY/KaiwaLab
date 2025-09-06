<template>
	<view class="container">
		<!-- 导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: (statusBarHeight + 16) + 'px' }">
			<view class="nav-left" @click="goBack">
				<text class="fa fa-arrow-left"></text>
			</view>
			<view class="nav-title">好友列表</view>
			<view class="nav-right" @click="addFriend">
				<text class="fa fa-user-plus"></text>
			</view>
		</view>

		<view class="content">
			<!-- 好友统计 -->
			<view class="stats-section">
				<view class="stats-item">
					<text class="stats-number primary">12</text>
					<text class="stats-label">实验伙伴</text>
				</view>
				<view class="stats-item">
					<text class="stats-number accent">8</text>
					<text class="stats-label">在线中</text>
				</view>
			</view>

			<!-- 好友分组 -->
			<view class="friends-section">
				<!-- 在线好友 -->
				<view class="friend-group">
					<view class="group-header">
						<view class="status-dot online"></view>
						<text class="group-title">在线好友 (8)</text>
					</view>
					<view class="friend-list">
						<view class="friend-item" v-for="friend in onlineFriends" :key="friend.id">
							<view class="friend-info">
								<view class="friend-avatar-container">
									<view class="friend-avatar" :class="friend.avatarClass">
										<text class="fa fa-user"></text>
									</view>
									<view class="online-indicator"></view>
								</view>
								<view class="friend-details">
									<text class="friend-name">{{ friend.name }}</text>
									<text class="friend-status">{{ friend.status }}</text>
								</view>
							</view>
							<view class="friend-level">
								<text class="level-text" :class="friend.levelClass">{{ friend.level }}</text>
								<text class="level-title">{{ friend.levelTitle }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 离线好友 -->
				<view class="friend-group">
					<view class="group-header">
						<view class="status-dot offline"></view>
						<text class="group-title">离线好友 (4)</text>
					</view>
					<view class="friend-list">
						<view class="friend-item offline" v-for="friend in offlineFriends" :key="friend.id">
							<view class="friend-info">
								<view class="friend-avatar-container">
									<view class="friend-avatar" :class="friend.avatarClass">
										<text class="fa fa-user"></text>
									</view>
								</view>
								<view class="friend-details">
									<text class="friend-name">{{ friend.name }}</text>
									<text class="friend-status">{{ friend.status }}</text>
								</view>
							</view>
							<view class="friend-level">
								<text class="level-text" :class="friend.levelClass">{{ friend.level }}</text>
								<text class="level-title">{{ friend.levelTitle }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'FriendList',
	data() {
		return {
			statusBarHeight: 0,
			onlineFriends: [
				{
					id: 1,
					name: '佐藤さん',
					status: '正在进行餐厅场景实验',
					level: 'Lv.8',
					levelTitle: '专家',
					avatarClass: 'primary',
					levelClass: 'primary'
				},
				{
					id: 2,
					name: '山田さん',
					status: '刚完成购物场景实验',
					level: 'Lv.6',
					levelTitle: '探索者',
					avatarClass: 'accent',
					levelClass: 'accent'
				}
			],
			offlineFriends: [
				{
					id: 3,
					name: '鈴木さん',
					status: '2小时前在线',
					level: 'Lv.4',
					levelTitle: '初学者',
					avatarClass: 'secondary',
					levelClass: 'secondary'
				}
			]
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
		addFriend() {
			uni.navigateTo({
				url: '/pages/friends/add-friend'
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

.nav-left, .nav-right {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #374151;
	transition: color 0.2s;
}

.nav-left:active, .nav-right:active {
	color: #2563EB;
}

.fa-arrow-left {
	font-size: 32rpx;
}

.fa-user-plus {
	font-size: 32rpx;
	color: #2563EB;
}

.nav-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1F2937;
}

.content {
	margin-top: 120rpx;
	background-color: #ffffff;
	min-height: calc(100vh - 120rpx);
}

.stats-section {
	padding: 32rpx;
	background-color: #EFF6FF;
	display: flex;
	justify-content: space-around;
	align-items: center;
}

.stats-item {
	text-align: center;
}

.stats-number {
	font-size: 48rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 8rpx;
}

.stats-number.primary {
	color: #2563EB;
}

.stats-number.accent {
	color: #10B981;
}

.stats-label {
	font-size: 24rpx;
	color: #6B7280;
}

.friends-section {
	padding: 32rpx;
}

.friend-group {
	margin-bottom: 48rpx;
}

.group-header {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
}

.status-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	margin-right: 16rpx;
}

.status-dot.online {
	background-color: #10B981;
}

.status-dot.offline {
	background-color: #9CA3AF;
}

.group-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #6B7280;
}

.friend-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.friend-item {
	background-color: #ffffff;
	border: 1px solid #DBEAFE;
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.friend-item.offline {
	opacity: 0.75;
}

.friend-info {
	display: flex;
	align-items: center;
}

.friend-avatar-container {
	position: relative;
	margin-right: 24rpx;
}

.friend-avatar {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.friend-avatar.primary {
	background: linear-gradient(135deg, #2563EB, rgba(37, 99, 235, 0.8));
}

.friend-avatar.accent {
	background: linear-gradient(135deg, #10B981, rgba(16, 185, 129, 0.8));
}

.friend-avatar.secondary {
	background: linear-gradient(135deg, #F97316, rgba(249, 115, 22, 0.8));
}

.friend-avatar .fa {
	font-size: 40rpx;
	color: #ffffff;
}

.online-indicator {
	position: absolute;
	bottom: -8rpx;
	right: -8rpx;
	width: 32rpx;
	height: 32rpx;
	background-color: #10B981;
	border-radius: 50%;
	border: 4rpx solid #ffffff;
}

.friend-details {
	display: flex;
	flex-direction: column;
}

.friend-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #1F2937;
	margin-bottom: 8rpx;
}

.friend-status {
	font-size: 24rpx;
	color: #6B7280;
}

.friend-level {
	text-align: right;
}

.level-text {
	font-size: 28rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 4rpx;
}

.level-text.primary {
	color: #2563EB;
}

.level-text.accent {
	color: #10B981;
}

.level-text.secondary {
	color: #F97316;
}

.level-title {
	font-size: 24rpx;
	color: #6B7280;
}


</style>