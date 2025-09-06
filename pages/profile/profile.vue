<template>
	<view class="profile-container">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="test-tube-decoration">
				<view class="test-tube">
					<view class="test-tube-fill"></view>
				</view>
			</view>
			
			<view class="user-info-row">
				<view class="avatar-container">
					<text class="fa fa-user"></text>
				</view>
				<view class="user-info">
					<text class="username">田中さん</text>
					<text class="user-level">Lv.5 探索者</text>
					<text class="member-status">会员至 2024-06-15</text>
				</view>
				<view class="edit-btn" @click="editProfile">
					<text class="fa fa-chevron-right"></text>
				</view>
			</view>
		</view>

		<!-- 社交实验室 -->
		<view class="social-section">
			<text class="section-title">社交实验室</text>
			<view class="social-grid">
				<view class="social-item" @click="addFriend">
					<view class="social-icon accent">
						<text class="fa fa-user-plus"></text>
					</view>
					<text class="social-title">添加好友</text>
					<text class="social-subtitle">扩展实验伙伴</text>
				</view>
				<view class="social-item" @click="friendList">
					<view class="social-icon secondary">
						<text class="fa fa-users"></text>
					</view>
					<text class="social-title">好友列表</text>
					<text class="social-subtitle">12位实验伙伴</text>
				</view>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-container">
			<view class="menu-card">
				<view class="menu-item" @click="goToCheckin">
					<view class="icon-container accent">
						<text class="fa fa-calendar-check"></text>
					</view>
					<view class="menu-content">
						<text class="menu-title">每日签到</text>
						<text class="menu-subtitle">签到记录和奖励</text>
					</view>
					<text class="menu-arrow fa fa-chevron-right"></text>
				</view>
				
				<view class="menu-item" @click="goToMembership">
					<view class="icon-container yellow">
						<text class="fa fa-star"></text>
					</view>
					<view class="menu-content">
						<text class="menu-title">会员中心</text>
						<text class="menu-subtitle">管理订阅和权益</text>
					</view>
					<text class="menu-arrow fa fa-chevron-right"></text>
				</view>
				
				<view class="menu-item" @click="goToReport">
					<view class="icon-container accent">
						<text class="fa fa-line-chart"></text>
					</view>
					<view class="menu-content">
						<text class="menu-title">学习报告</text>
						<text class="menu-subtitle">查看详细实验数据</text>
					</view>
					<text class="menu-arrow fa fa-chevron-right"></text>
				</view>
				
				<view class="menu-item" @click="goToRanking">
					<view class="icon-container orange">
						<text class="fa fa-trophy"></text>
					</view>
					<view class="menu-content">
						<text class="menu-title">学习排行榜</text>
						<text class="menu-subtitle">查看实验室排名</text>
					</view>
					<text class="menu-arrow fa fa-chevron-right"></text>
				</view>
				
				<view class="menu-item" @click="goToAchievements">
					<view class="icon-container purple">
						<text class="fa fa-star"></text>
					</view>
					<view class="menu-content">
						<text class="menu-title">发现瞬间</text>
						<text class="menu-subtitle">成就系统和等级</text>
					</view>
					<text class="menu-arrow fa fa-chevron-right"></text>
				</view>
				
				<view class="menu-item last" @click="goToSettings">
					<view class="icon-container secondary">
						<text class="fa fa-cog"></text>
					</view>
					<view class="menu-content">
						<text class="menu-title">设置</text>
						<text class="menu-subtitle">个性化实验环境</text>
					</view>
					<text class="menu-arrow fa fa-chevron-right"></text>
				</view>
			</view>
		</view>
		
		<!-- 自定义底部导航栏 -->
		<BottomTabBar :current="3" @change="switchTab" />
	</view>
</template>

<script>
import BottomTabBar from '@/components/BottomTabBar/BottomTabBar.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'

export default {
	components: {
		BottomTabBar,
		ToggleSwitch
	},
	data() {
		return {
			userInfo: {
				name: '田中さん',
				level: 'Lv.5 探索者',
				avatar: '/static/images/default-avatar.png',
				membershipExpiry: '2024-06-15'
			},
			learningProgress: {
			totalDays: 45,
			totalHours: '128h',
			completedLessons: 32,
			monthlyProgress: 68,
			completedThisMonth: 17,
			monthlyTarget: 25
		}
		}
	},
	methods: {
		editProfile() {
			uni.showToast({
				title: '编辑个人资料',
				icon: 'none'
			})
			// TODO: 导航到编辑个人资料页面
		},
		goToSettings() {
			uni.navigateTo({
				url: '/pages/settings/settings'
			})
		},
		goToMembership() {
			uni.navigateTo({
				url: '/pages/profile/membership'
			})
		},
		goToReport() {
			uni.navigateTo({
				url: '/pages/lab/report'
			})
		},
		goToRanking() {
			uni.navigateTo({
				url: '/pages/ranking/ranking'
			})
		},
		goToAchievements() {
			uni.showToast({
				title: '发现瞬间功能开发中',
				icon: 'none'
			})
		},
		goToCheckin() {
			uni.navigateTo({
				url: '/pages/checkin/checkin'
			})
		},
		addFriend() {
			uni.navigateTo({
				url: '/pages/friends/add-friend'
			})
		},
		friendList() {
			uni.navigateTo({
				url: '/pages/friends/friend-list'
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
			if (index !== 3) { // 当前页面是profile(index=3)，只有点击其他tab才跳转
				uni.switchTab({
					url: tabPages[index]
				})
			}
		}
	}
}
</script>

<style lang="scss">
.profile-container {
	background: #ffffff;
	height: 100vh;
	position: relative;
	padding: 32rpx;
	padding-bottom: calc(32rpx + 120rpx + env(safe-area-inset-bottom));
}

/* 用户信息卡片 */
.user-card {
	background: linear-gradient(135deg, #2563EB 0%, rgba(37, 99, 235, 0.8) 100%);
	border-radius: 32rpx;
	padding: 40rpx;
	margin-bottom: 48rpx;
	position: relative;
	overflow: hidden;
}

.test-tube-decoration {
	position: absolute;
	top: 48rpx;
	right: 112rpx;
	width: 48rpx;
	height: 48rpx;
	opacity: 0.2;
	transform: rotate(24deg);
}

.test-tube {
	width: 16rpx;
	height: 72rpx;
	border: 4rpx solid white;
	border-radius: 4rpx 4rpx 16rpx 16rpx;
	position: relative;
	overflow: hidden;
}

.test-tube-fill {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 69%;
	background: white;
}

.user-info-row {
	display: flex;
	align-items: center;
}

.avatar-container {
	width: 128rpx;
	height: 128rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 32rpx;
}

.avatar-container .fa {
	font-size: 64rpx;
	color: white;
}

/* 社交实验室 */
.social-section {
	margin-bottom: 48rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #6B7280;
	margin-bottom: 24rpx;
	display: block;
}

.social-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}

.social-item {
	background: #EFF6FF;
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	transition: all 0.2s ease;
}

.social-item:active {
	transform: scale(0.98);
	background: #DBEAFE;
}

.social-icon {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
}

.social-icon.accent {
	background: rgba(16, 185, 129, 0.1);
}

.social-icon.accent .fa {
	color: #10B981;	
	font-size: 32rpx;
}

.social-icon.secondary {
	background: rgba(249, 115, 22, 0.1);
}

.social-icon.secondary .fa {
	color: #F97316;
	font-size: 32rpx;
}

.social-title {
	font-size: 28rpx;
	font-weight: 500;
	color: #1F2937;
	margin-bottom: 8rpx;
	display: block;
}

.social-subtitle {
	font-size: 24rpx;
	color: #6B7280;
	display: block;
}

.user-info {
	flex: 1;
}

.username {
	font-size: 36rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 8rpx;
	display: block;
}

.user-level {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-bottom: 4rpx;
	display: block;
}

.member-status {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	display: block;
}

.edit-btn {
	margin-left: auto;
	color: rgba(255, 255, 255, 0.8);
}

.edit-btn .iconfont {
	font-size: 32rpx;
	color: rgba(255, 255, 255, 0.8);
}

/* 菜单容器 */
.menu-container {
	margin-bottom: 48rpx;
}

.menu-card {
	background: white;
	border: 2rpx solid #DBEAFE;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(37, 99, 235, 0.05);
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 32rpx;
	border-bottom: 2rpx solid #DBEAFE;
	transition: background-color 0.2s ease;
}

.menu-item:active {
	background-color: rgba(243, 244, 246, 0.5);
}

.menu-item.last {
	border-bottom: none;
}

.icon-container {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
}

.icon-container .fa {
	font-size: 40rpx;
}

/* 图标颜色样式 */
.icon-container.accent {
	background: rgba(16, 185, 129, 0.1);
}

.icon-container.accent .fa {
	color: #10B981;
}

.icon-container.secondary {
	background: rgba(249, 115, 22, 0.1);
}

.icon-container.secondary .fa {
	color: #F97316;
}

.icon-container.orange {
	background: rgba(234, 88, 12, 0.1);
}

.icon-container.orange .fa {
	color: #EA580C;
}

.icon-container.purple {
	background: rgba(168, 85, 247, 0.1);
}

.icon-container.purple .fa {
	color: #A855F7;
}

.icon-container.yellow {
	background: rgba(251, 191, 36, 0.1);
}

.icon-container.yellow .fa {
	color: #FBBF24;
}

.menu-content {
	flex: 1;
}

.menu-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #1F2937;
	margin-bottom: 4rpx;
	display: block;
}

.menu-subtitle {
	font-size: 24rpx;
	color: #8E8E93;
	display: block;
}

.menu-arrow {
	font-size: 32rpx;
	color: #9CA3AF;
}

.menu-arrow .fa {
	color: #9CA3AF;
}


</style>