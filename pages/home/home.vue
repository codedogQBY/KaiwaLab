<template>
	<view class="home-container">
		<!-- 主要内容 -->
		<scroll-view class="content" scroll-y="true">
			<view class="content-padding">
				<!-- 用户信息栏 -->
				<view class="user-section">
					<view class="user-info">
						<text class="greeting">こんにちは、</text>
						<text class="username">田中さん</text>
					</view>
					<view class="user-avatar">
						<text class="fas fa-user"></text>
					</view>
				</view>
				
				<!-- 学习进度卡片 - 实验烧瓶样式 -->
				<view class="progress-card">
					<!-- 装饰元素 -->
					<view class="decoration">
						<view class="test-tube">
							<view class="test-tube-fill"></view>
						</view>
					</view>
					
					<view class="progress-content">
						<view class="progress-info">
							<text class="progress-title">本周实验进度</text>
							<text class="progress-value">4/7 天</text>
						</view>
						<view class="flask-progress">
							<view class="flask-shape">
								<view class="flask-liquid"></view>
							</view>
							<text class="flask-percentage">57%</text>
						</view>
					</view>
					
					<view class="progress-bar">
						<view class="progress-fill"></view>
					</view>
				</view>
				
				<!-- 每日签到提示 -->
				<view class="checkin-card" @click="goToCheckin">
					<view class="checkin-content">
						<view class="checkin-left">
							<view class="checkin-icon">
								<text class="fas fa-calendar-check"></text>
							</view>
							<view class="checkin-info">
								<text class="checkin-title">今日实验签到</text>
								<text class="checkin-desc">连续第5天 • 获得15经验值</text>
							</view>
						</view>
						<view class="checkin-status">
							<text class="fas fa-chevron-right"></text>
						</view>
					</view>
				</view>
				
				<!-- 功能分类 - 实验台和试剂概念 -->
				<view class="section-title">实验模式</view>
				<view class="function-grid">
					<view class="function-item" @click="goToLab">
						<view class="function-icon primary">
							<text class="fas fa-flask"></text>
						</view>
						<text class="function-text">AI实验台</text>
					</view>
					<view class="function-item">
						<view class="function-icon secondary">
							<text class="fas fa-vial"></text>
						</view>
						<text class="function-text">场景试剂</text>
					</view>
					<view class="function-item" @click="goToLibrary">
						<view class="function-icon accent">
							<text class="fas fa-book"></text>
						</view>
						<text class="function-text">学习库</text>
					</view>
					<view class="function-item" @click="goToMembership">
						<view class="function-icon orange">
							<text class="fas fa-trophy"></text>
						</view>
						<text class="function-text">排行榜</text>
					</view>
				</view>
				
				<!-- 会员提示 -->
				<view class="member-card" @click="goToMembership">
					<view class="member-content">
						<view class="member-icon">
							<text class="fas fa-star"></text>
						</view>
						<view class="member-info">
							<text class="member-title">升级至会员</text>
							<text class="member-desc">解锁全部实验场景和高级分析功能</text>
							<text class="member-link">了解会员权益 →</text>
						</view>
					</view>
				</view>
				
				<!-- 推荐实验 -->
				<view class="section-title">推荐实验</view>
				<view class="experiment-list">
					<view class="experiment-item" @click="goToExperiment('convenience-store')">
						<view class="experiment-content">
							<view class="experiment-tag blue">初级实验</view>
							<text class="experiment-title">便利店购物对话</text>
							<text class="experiment-desc">5个场景 · 10分钟</text>
						</view>
						<text class="fas fa-chevron-right"></text>
					</view>
					<view class="experiment-item" @click="goToExperiment('restaurant')">
						<view class="experiment-content">
							<view class="experiment-tag purple">中级实验</view>
							<text class="experiment-title">餐厅点餐进阶</text>
							<text class="experiment-desc">8个场景 · 15分钟</text>
						</view>
						<text class="fas fa-chevron-right"></text>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 自定义底部导航栏 -->
		<BottomTabBar :current="0" @change="switchTab" />
	</view>
</template>

<script>
import NavigationBar from '@/components/NavigationBar/NavigationBar.vue'
import BottomTabBar from '@/components/BottomTabBar/BottomTabBar.vue'
import Icon from '@/components/Icon/Icon.vue'

export default {
	name: 'Home',
	components: {
		NavigationBar,
		BottomTabBar,
		Icon
	},
	data() {
		return {
			todayProgress: 65,
			studyTime: 45,
			wordsLearned: 12,
			practiceCount: 3,
			recentActivities: [
				{
					icon: 'fas fa-microphone',
					title: '完成语音练习',
					time: '2分钟前'
				},
				{
					icon: 'fas fa-book-open',
					title: '学习新单词',
					time: '15分钟前'
				},
				{
					icon: 'fas fa-check-circle',
					title: '完成每日任务',
					time: '1小时前'
				}
			]
		}
	},
	methods: {
		goToLab() {
			uni.switchTab({
				url: '/pages/lab/lab'
			})
		},
		goToLibrary() {
			uni.switchTab({
				url: '/pages/library/library'
			})
		},
		goToProfile() {
			uni.switchTab({
				url: '/pages/profile/profile'
			})
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
		goToExperiment(type) {
			// 跳转到具体的实验页面
			uni.navigateTo({
				url: `/pages/experiment/experiment?type=${type}`
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
			if (index !== 0) { // 当前页面是home(index=0)，只有点击其他tab才跳转
				uni.switchTab({
					url: tabPages[index]
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.home-container {
	height: 100vh;
	background-color: #FFFFFF;
	display: flex;
	flex-direction: column;
	position: relative;
}

/* 主要内容 */
.content {
	flex: 1;
	height: 100vh;
}

.content-padding {
	padding: 0 48rpx calc(48rpx + 60px + env(safe-area-inset-bottom));
}

/* 用户信息栏 */
.user-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 48rpx;
	padding-top: 48rpx;
}

.user-info {
	display: flex;
	flex-direction: column;
}

.greeting {
	font-size: 28rpx;
	color: #64748B;
	margin-bottom: 8rpx;
}

.username {
	font-size: 42rpx;
	font-weight: bold;
	color: #1E293B;
}

.user-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: rgba(37, 99, 235, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
}

.user-avatar text {
	font-size: 32rpx;
	color: #2563EB;
}

/* 学习进度卡片 */
.progress-card {
	background: linear-gradient(135deg, #2563EB 0%, rgba(37, 99, 235, 0.8) 100%);
	border-radius: 32rpx;
	padding: 40rpx;
	color: white;
	margin-bottom: 48rpx;
	position: relative;
	overflow: hidden;
}

.decoration {
	position: absolute;
	top: 24rpx;
	right: 24rpx;
	width: 64rpx;
	height: 64rpx;
	opacity: 0.2;
}

.test-tube {
	width: 16rpx;
	height: 40rpx;
	background-color: transparent;
	border: 2rpx solid white;
	border-radius: 0 0 8rpx 8rpx;
	position: relative;
	border-top: none;
}

.test-tube-fill {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 60%;
	background-color: white;
	border-radius: 0 0 8rpx 8rpx;
}

.progress-content {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 32rpx;
}

.progress-info {
	display: flex;
	flex-direction: column;
}

.progress-title {
	font-size: 30rpx;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.progress-value {
	font-size: 48rpx;
	font-weight: bold;
}

.flask-progress {
	position: relative;
	height: 240rpx;
	width: 120rpx;
	margin: 0 auto;
}

.flask-shape {
	position: absolute;
	bottom: 0;
	width: 80rpx;
	height: 200rpx;
	border: 6rpx solid #2563EB;
	border-radius: 20rpx 20rpx 40rpx 40rpx;
	overflow: hidden;
}

.flask-liquid {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 57%;
	background: linear-gradient(180deg, #3B82F6 0%, #2563EB 100%);
	transition: height 1s ease-out;
}

.flask-percentage {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	font-weight: bold;
	margin-top: 80rpx;
	margin-right: 40rpx;
	color: white;
}

.progress-bar {
	width: 100%;
	height: 16rpx;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 8rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	width: 57%;
	background-color: white;
	border-radius: 8rpx;
}

/* 每日签到提示 */
.checkin-card {
	background-color: rgba(16, 185, 129, 0.05);
	border: 1rpx solid rgba(16, 185, 129, 0.2);
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
}

.checkin-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.checkin-left {
	display: flex;
	align-items: center;
}

.checkin-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: rgba(16, 185, 129, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;

	text {
		font-size: 32rpx;
		color: #10B981;
	}
}

.checkin-info {
	display: flex;
	flex-direction: column;
}

.checkin-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #1E293B;
	margin-bottom: 8rpx;
}

.checkin-desc {
	font-size: 24rpx;
	color: #64748B;
}

.checkin-status {
	width: 60rpx;
	height: 48rpx;
	background-color: #2563EB;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;

	text {
		font-size: 24rpx;
		color: white;
	}
}

/* 功能分类 */
.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #64748B;
	margin-bottom: 24rpx;
}

.function-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 24rpx;
	margin-bottom: 48rpx;
}

.function-item {
	background-color: #EFF6FF;
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	transition: all 0.2s;
	box-shadow: 0 4rpx 20rpx rgba(37, 99, 235, 0.1);

	&:active {
		transform: scale(0.98);
		box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.15);
	}

	&:hover {
		box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.15);
	}
}

.function-icon {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;

	&.primary {
		background-color: rgba(37, 99, 235, 0.1);
		text {
			color: #2563EB;
		}
	}

	&.secondary {
		background-color: rgba(249, 115, 22, 0.1);
		text {
			color: #F97316;
		}
	}

	&.accent {
		background-color: rgba(16, 185, 129, 0.1);
		text {
			color: #10B981;
		}
	}

	&.orange {
		background-color: rgba(249, 115, 22, 0.1);
		text {
			color: #F97316;
		}
	}

	text {
		font-size: 32rpx;
	}
}

.function-text {
	font-size: 28rpx;
	font-weight: 500;
	color: #1E293B;
}

/* 会员提示 */
.member-card {
	background-color: rgba(249, 115, 22, 0.05);
	border: 1rpx solid rgba(249, 115, 22, 0.2);
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 48rpx;
}

.member-content {
	display: flex;
	align-items: flex-start;
}

.member-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background-color: rgba(249, 115, 22, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;

	text {
		font-size: 32rpx;
		color: #F97316;
	}
}

.member-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.member-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #1E293B;
	margin-bottom: 8rpx;
}

.member-desc {
	font-size: 24rpx;
	color: #64748B;
	margin-bottom: 16rpx;
}

.member-link {
	font-size: 28rpx;
	color: #F97316;
	font-weight: 500;
}

/* 推荐实验 */
.experiment-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.experiment-item {
	border: 1rpx solid #DBEAFE;
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	background-color: white;
	box-shadow: 0 2rpx 10rpx rgba(249, 115, 22, 0.15);
	transition: all 0.2s;

	&:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 16rpx rgba(249, 115, 22, 0.2);
	}

	&:hover {
		box-shadow: 0 4rpx 16rpx rgba(249, 115, 22, 0.2);
	}

	> text {
		font-size: 28rpx;
		color: #94A3B8;
	}
}

.experiment-content {
	display: flex;
	flex-direction: column;
}

.experiment-tag {
	font-size: 24rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	margin-bottom: 16rpx;
	align-self: flex-start;

	&.blue {
		background-color: rgba(59, 130, 246, 0.1);
		color: #3B82F6;
	}

	&.purple {
		background-color: rgba(37, 99, 235, 0.1);
		color: #2563EB;
	}
}

.experiment-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #1E293B;
	margin-bottom: 8rpx;
}

.experiment-desc {
	font-size: 24rpx;
	color: #64748B;
}


</style>