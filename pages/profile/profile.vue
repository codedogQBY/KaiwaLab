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
					<text class="iconfont icon-user"></text>
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

		<!-- 设置容器 -->
		<view class="settings-container">
			<!-- 学习设置 -->
			<view class="menu-group">
				<text class="group-title">学习设置</text>
				<view class="menu-card">
					<view class="menu-item">
						<view class="icon-container primary">
							<text class="fa fa-clock"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">学习提醒</text>
							<text class="menu-subtitle">每日 20:00 提醒</text>
						</view>
						<view class="toggle-switch active">
							<view class="toggle-thumb"></view>
						</view>
					</view>
					
					<view class="menu-item">
						<view class="icon-container secondary">
							<text class="fa fa-volume-up"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">语音播放</text>
							<text class="menu-subtitle">自动播放日语发音</text>
						</view>
						<view class="toggle-switch active">
							<view class="toggle-thumb"></view>
						</view>
					</view>
					
					<view class="menu-item last">
						<view class="icon-container accent">
							<text class="fa fa-microphone"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">发音评估</text>
							<text class="menu-subtitle">实时发音纠正</text>
						</view>
						<view class="toggle-switch">
							<view class="toggle-thumb"></view>
						</view>
					</view>
				</view>
			</view>

			<!-- 应用设置 -->
			<view class="menu-group">
				<text class="group-title">应用设置</text>
				<view class="menu-card">
					<view class="menu-item" @click="goToTheme">
						<view class="icon-container purple">
							<text class="fa fa-palette"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">主题设置</text>
							<text class="menu-subtitle">浅色模式</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
					
					<view class="menu-item" @click="goToLanguage">
						<view class="icon-container blue">
							<text class="fa fa-language"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">界面语言</text>
							<text class="menu-subtitle">简体中文</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
					
					<view class="menu-item last" @click="goToDownload">
						<view class="icon-container green">
							<text class="fa fa-download"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">离线下载</text>
							<text class="menu-subtitle">管理离线内容</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
				</view>
			</view>

			<!-- 学习与成长 -->
			<view class="menu-group">
				<text class="group-title">学习与成长</text>
				<view class="menu-card">
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
							<text class="fa fa-trophy"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">发现瞬间</text>
							<text class="menu-subtitle">成就系统和等级</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
					
					<view class="menu-item" @click="goToReport">
						<view class="icon-container blue">
							<text class="fa fa-file-text"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">实验报告</text>
							<text class="menu-subtitle">学习数据分析</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
					
					<view class="menu-item last" @click="goToCheckin">
						<view class="icon-container accent">
							<text class="fa fa-calendar-check"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">每日签到</text>
							<text class="menu-subtitle">签到记录和奖励</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
				</view>
			</view>

			<!-- 账户与隐私 -->
			<view class="menu-group">
				<text class="group-title">账户与隐私</text>
				<view class="menu-card">
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
					
					<view class="menu-item" @click="goToPrivacy">
						<view class="icon-container red">
							<text class="fa fa-shield"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">隐私设置</text>
							<text class="menu-subtitle">数据使用与隐私</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
					
					<view class="menu-item last logout" @click="logout">
						<view class="icon-container gray">
							<text class="fa fa-sign-out"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">退出登录</text>
							<text class="menu-subtitle">安全退出当前账户</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
				</view>
			</view>

			<!-- 帮助与反馈 -->
			<view class="menu-group">
				<text class="group-title">帮助与反馈</text>
				<view class="menu-card">
					<view class="menu-item" @click="goToHelp">
						<view class="icon-container blue">
							<text class="fa fa-question-circle"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">帮助中心</text>
							<text class="menu-subtitle">使用指南和FAQ</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
					
					<view class="menu-item" @click="goToFeedback">
						<view class="icon-container orange">
							<text class="fa fa-comment"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">意见反馈</text>
							<text class="menu-subtitle">告诉我们您的建议</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
					
					<view class="menu-item last">
						<view class="icon-container green">
							<text class="fa fa-info-circle"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">关于会話Lab</text>
							<text class="menu-subtitle">版本 2.1.0</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 自定义底部导航栏 -->
		<BottomTabBar :current="3" @change="switchTab" />
	</view>
</template>

<script>
import BottomTabBar from '@/components/BottomTabBar/BottomTabBar.vue'

export default {
	components: {
		BottomTabBar
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
		navigateTo(url) {
			uni.navigateTo({
				url: url
			})
		},
		feedback() {
			uni.showToast({
				title: '意见反馈功能开发中',
				icon: 'none'
			})
		},
		logout() {
			uni.showModal({
				title: '确认退出',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '已退出登录',
							icon: 'success'
						})
					}
				}
			})
		},
		goToCheckin() {
			uni.navigateTo({
				url: '/pages/checkin/checkin'
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
	height: 100%;
	position: relative;
	padding-top: 32rpx;
}



/* 用户信息卡片 */
.user-card {
	background: linear-gradient(135deg, #2563EB 0%, rgba(37, 99, 235, 0.8) 100%);
	border-radius: 32rpx;
	padding: 40rpx;
	margin:0 32rpx 32rpx 32rpx;
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

.avatar-container .iconfont {
	font-size: 64rpx;
	color: white;
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

/* 设置容器 */
.settings-container {
	padding: 0 32rpx calc(48rpx + 120rpx + env(safe-area-inset-bottom));
}

.menu-group {
	margin-bottom: 48rpx;
}

.group-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #8E8E93;
	margin-bottom: 24rpx;
	display: block;
}

.menu-card {
	background: white;
	border: 2rpx solid #DBEAFE;
	border-radius: 24rpx;
	overflow: hidden;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 32rpx;
	border-bottom: 2rpx solid #DBEAFE;
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

/* 学习设置图标颜色 */
.icon-container.primary {
	background: rgba(37, 99, 235, 0.1);
}

.icon-container.primary text {
	color: #2563EB;
}

.icon-container.secondary {
	background: rgba(249, 115, 22, 0.1);
}

.icon-container.secondary text {
	color: #F97316;
}

.icon-container.accent {
	background: rgba(16, 185, 129, 0.1);
}

.icon-container.accent text {
	color: #10B981;
}

/* 应用设置图标颜色 */
.icon-container.purple {
	background: rgba(168, 85, 247, 0.1);
}

.icon-container.purple text {
	color: #A855F7;
}

.icon-container.blue {
	background: rgba(59, 130, 246, 0.1);
}

.icon-container.blue text {
	color: #3B82F6;
}

.icon-container.green {
	background: rgba(34, 197, 94, 0.1);
}

.icon-container.green text {
	color: #22C55E;
}

/* 学习与成长图标颜色 */
.icon-container.orange {
	background: rgba(234, 88, 12, 0.1);
}

.icon-container.orange text {
	color: #EA580C;
}

/* 账户与隐私图标颜色 */
.icon-container.yellow {
	background: rgba(234, 179, 8, 0.1);
}

.icon-container.yellow text {
	color: #EAB308;
}

.icon-container.red {
	background: rgba(239, 68, 68, 0.1);
}

.icon-container.red text {
	color: #EF4444;
}

.icon-container.gray {
	background: rgba(107, 114, 128, 0.1);
}

.icon-container.gray text {
	color: #6B7280;
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
	font-size: 28rpx;
	color: #8E8E93;
}

.toggle-switch {
	width: 88rpx;
	height: 48rpx;
	background: #C6C6C8;
	border-radius: 24rpx;
	position: relative;
	transition: background-color 0.3s ease;
}

.toggle-switch.active {
	background: #007AFF;
}

.toggle-thumb {
	width: 40rpx;
	height: 40rpx;
	background: white;
	border-radius: 50%;
	position: absolute;
	top: 4rpx;
	left: 4rpx;
	transition: transform 0.3s ease;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.toggle-switch.active .toggle-thumb {
	transform: translateX(40rpx);
}
</style>