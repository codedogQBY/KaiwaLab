<template>
	<view class="ranking-container">
		<!-- 标题栏 -->
		<view class="header" :style="{ paddingTop: (statusBarHeight + 32) + 'rpx' }">
			<view class="header-left">
				<view class="back-btn" @click="goBack">
					<text class="fas fa-arrow-left"></text>
				</view>
				<text class="header-title">实验室排行榜</text>
			</view>
			<view class="header-actions">
				<view class="action-btn">
					<text class="fas fa-trophy"></text>
				</view>
			</view>
		</view>
			
		<!-- 时间范围选择 -->
		<view class="time-filter">
			<view class="filter-tabs">
				<view 
					v-for="(tab, index) in timeTabs" 
					:key="index"
					:class="['filter-tab', { active: currentTab === index }]"
					@click="switchTab(index)"
				>
					<text>{{ tab }}</text>
				</view>
			</view>
		</view>
			
		<scroll-view scroll-y class="scroll-content">
			<!-- 我的排名 -->
			<view class="my-ranking">
				<view class="my-rank-card">
					<view class="rank-badge">
						<text class="rank-number">#{{ myRank.rank }}</text>
					</view>
					<view class="rank-info">
						<text class="rank-name">{{ myRank.name }} (您)</text>
						<text class="rank-desc">{{ myRank.description }}</text>
					</view>
					<view class="rank-score">
						<text class="score-number">{{ myRank.score }}</text>
						<text class="score-label">经验值</text>
					</view>
				</view>
			</view>
				
				<!-- 前三名展示 -->
				<view class="top-three">
					<text class="section-title">本周实验达人</text>
					<view class="podium">
						<!-- 第二名 -->
						<view class="podium-item second">
							<view class="avatar-container">
									<view class="avatar silver">
										<text class="fa fa-user"></text>
									</view>
									<view class="rank-medal silver">
										<text>2</text>
									</view>
								</view>
							<text class="podium-name">{{ topThree[1].name }}</text>
							<text class="podium-score">{{ topThree[1].score }} 经验</text>
							<view class="podium-bar silver"></view>
						</view>
						
						<!-- 第一名 -->
						<view class="podium-item first">
							<view class="avatar-container">
								<view class="avatar gold">
									<text class="fa fa-user"></text>
								</view>
								<view class="rank-medal gold">
									<text>1</text>
								</view>
							</view>
							<text class="podium-name">{{ topThree[0].name }}</text>
							<text class="podium-score">{{ topThree[0].score }} 经验</text>
							<view class="podium-bar gold"></view>
						</view>
						
						<!-- 第三名 -->
						<view class="podium-item third">
							<view class="avatar-container">
								<view class="avatar bronze">
									<text class="fa fa-user"></text>
								</view>
								<view class="rank-medal bronze">
									<text>3</text>
								</view>
							</view>
							<text class="podium-name">{{ topThree[2].name }}</text>
							<text class="podium-score">{{ topThree[2].score }} 经验</text>
							<view class="podium-bar bronze"></view>
						</view>
					</view>
				</view>
				
				<!-- 排行榜列表 -->
				<view class="ranking-list">
					<view 
						v-for="(user, index) in rankingList" 
						:key="index"
						:class="['ranking-item', { 'is-me': user.isMe }]"
					>
						<view :class="['rank-number-badge', getRankColor(user.rank)]">
							<text>{{ user.rank }}</text>
						</view>
						<view :class="['user-avatar', getRankColor(user.rank)]">
							<text class="fa fa-user"></text>
						</view>
						<view class="user-info">
							<text class="user-name">{{ user.name }}{{ user.isMe ? ' (您)' : '' }}</text>
							<text class="user-desc">{{ user.description }}</text>
						</view>
						<view class="user-score">
							<text :class="['score-number', { 'primary': user.isMe }]">{{ user.score }}</text>
							<text class="score-label">经验值</text>
						</view>
					</view>
				</view>
				
			<!-- 激励信息 -->
			<view class="motivation">
				<text class="fa fa-trophy motivation-icon"></text>
				<text class="motivation-title">再接再厉！</text>
				<text class="motivation-desc">再获得 7 经验值即可超越吉田，冲进前7名！</text>
			</view>
			<view style="height: 32rpx;">

			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusBarHeight: 0,
			timeTabs: ['本周', '本月', '总榜'],
			currentTab: 0,
			myRank: {
				rank: 8,
				name: '田中さん',
				description: '本周实验 2小时15分',
				score: 135
			},
			topThree: [
				{ name: '山田', score: 312 },
				{ name: '佐藤', score: 248 },
				{ name: '鈴木', score: 201 }
			],
			rankingList: [
				{
					rank: 4,
					name: '高橋',
					description: '连续学习 5 天',
					score: 189,
					isMe: false
				},
				{
					rank: 5,
					name: '中村',
					description: '完成 12 个场景',
					score: 176,
					isMe: false
				},
				{
					rank: 6,
					name: '小林',
					description: '发音评分 92 分',
					score: 158,
					isMe: false
				},
				{
					rank: 7,
					name: '吉田',
					description: '学习时长 3 小时',
					score: 142,
					isMe: false
				},
				{
					rank: 8,
					name: '田中さん',
					description: '实验时长 2小时15分',
					score: 135,
					isMe: true
				}
			]
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		switchTab(index) {
			this.currentTab = index
			// 这里可以根据不同的时间范围加载不同的数据
		},
		getSystemInfo() {
			uni.getSystemInfo({
				success: (res) => {
					this.statusBarHeight = res.statusBarHeight || 0
				}
			})
		},
		getRankColor(rank) {
			if (rank === 4) return 'blue'
			if (rank === 5) return 'purple'
			if (rank === 6) return 'green'
			if (rank === 7) return 'red'
			if (rank === 8) return 'primary'
			return 'gray'
		}
	},
	mounted() {
		this.getSystemInfo()
	}
}
</script>

<style scoped>
.ranking-container {
	width: 100%;
	height: 100vh;
	background: #ffffff;
	position: relative;
	display: flex;
	flex-direction: column;
}

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
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.back-btn {
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

.time-filter {
	padding: 32rpx;
	border-bottom: 1rpx solid #DBEAFE;
	background: #fff;
	margin-top: 120rpx;
}

.filter-tabs {
	display: flex;
	gap: 16rpx;
}

.filter-tab {
	padding: 16rpx 32rpx;
	border-radius: 40rpx;
	background: #EFF6FF;
	color: #666;
	font-size: 28rpx;
	font-weight: 500;
	transition: all 0.3s;
}

.filter-tab.active {
	background: #2563EB;
	color: #fff;
}

.scroll-content {
	flex: 1;
	height: calc(100vh - 200rpx);
	overflow-y: auto;
	padding-bottom: env(safe-area-inset-bottom, 68rpx);
}

.my-ranking {
	margin: 32rpx;
}

.my-rank-card {
	padding: 32rpx;
	border-radius: 24rpx;
	background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
	display: flex;
	align-items: center;
	gap: 24rpx;
	width: 100%;
	box-sizing: border-box;
}

.rank-badge {
	width: 96rpx;
	height: 96rpx;
	border-radius: 48rpx;
	background: rgba(37, 99, 235, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
}

.rank-number {
	font-size: 32rpx;
	font-weight: bold;
	color: #2563EB;
}

.rank-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.rank-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.rank-desc {
	font-size: 28rpx;
	color: #666;
}

.rank-score {
	text-align: right;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 4rpx;
}

.score-number {
	font-size: 48rpx;
	font-weight: bold;
	color: #2563EB;
}

.score-number.primary {
	color: #2563EB;
}

.score-label {
	font-size: 24rpx;
	color: #666;
}

.top-three {
	margin-bottom: 48rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #333;
	margin-bottom: 32rpx;
	margin-left: 32rpx;
	display: block;
}

.podium {
	display: flex;
	justify-content: center;
	align-items: flex-end;
	gap: 32rpx;
	margin-bottom: 48rpx;
}

.podium-item {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.avatar-container {
	position: relative;
	margin-bottom: 16rpx;
}

.avatar {
	width: 128rpx;
	height: 128rpx;
	border-radius: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 48rpx;
}

.avatar.gold {
	width: 160rpx;
	height: 160rpx;
	border-radius: 80rpx;
	background: #FEF3C7;
	color: #F59E0B;
	font-size: 64rpx;
}

.avatar.silver {
	background: #F3F4F6;
	color: #6B7280;
	font-size: 40rpx;
}

.avatar.bronze {
	background: #FED7AA;
	color: #EA580C;
	font-size: 40rpx;
}

.rank-medal {
	position: absolute;
	top: -16rpx;
	right: -16rpx;
	width: 48rpx;
	height: 48rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	font-weight: bold;
	color: #fff;
}

.rank-medal.gold {
	width: 64rpx;
	height: 64rpx;
	border-radius: 32rpx;
	background: #F59E0B;
	font-size: 28rpx;
}

.rank-medal.silver {
	background: #6B7280;
}

.rank-medal.bronze {
	background: #EA580C;
}

.podium-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #333;
}

.podium-score {
	font-size: 24rpx;
	color: #666;
}

.podium-bar {
	width: 96rpx;
	border-radius: 16rpx 16rpx 0 0;
	margin-top: 16rpx;
}

.podium-bar.gold {
	width: 128rpx;
	height: 192rpx;
	background: #F59E0B;
}

.podium-bar.silver {
	height: 160rpx;
	background: #6B7280;
}

.podium-bar.bronze {
	height: 128rpx;
	background: #EA580C;
}

.ranking-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	margin-bottom: 48rpx;
	margin-left: 32rpx;
	margin-right: 32rpx;
}

.ranking-item {
	padding: 24rpx;
	border-radius: 24rpx;
	background: #fff;
	border: 2rpx solid #DBEAFE;
	display: flex;
	align-items: center;
	gap: 24rpx;
	width: 100%;
	box-sizing: border-box;
	min-width: 0;
}

.ranking-item.is-me {
	background: rgba(37, 99, 235, 0.05);
	border: 4rpx solid rgba(37, 99, 235, 0.2);
}

.rank-number-badge {
	width: 64rpx;
	height: 64rpx;
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: bold;
	color: #fff;
}

.rank-number-badge.blue {
	background: #3B82F6;
}

.rank-number-badge.purple {
	background: #8B5CF6;
}

.rank-number-badge.green {
	background: #10B981;
}

.rank-number-badge.red {
	background: #EF4444;
}

.rank-number-badge.primary {
	background: #2563EB;
}

.user-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
}

.user-avatar.blue {
	background: #DBEAFE;
	color: #3B82F6;
}

.user-avatar.purple {
	background: #EDE9FE;
	color: #8B5CF6;
}

.user-avatar.green {
	background: #D1FAE5;
	color: #10B981;
}

.user-avatar.red {
	background: #FEE2E2;
	color: #EF4444;
}

.user-avatar.primary {
	background: #2563EB;
	color: #fff;
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	min-width: 0;
	overflow: hidden;
}

.user-name {
	font-size: 32rpx;
	font-weight: 500;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.user-desc {
	font-size: 24rpx;
	color: #666;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.user-score {
	text-align: right;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 4rpx;
}

.motivation {
	padding: 32rpx;
	border-radius: 24rpx;
	background: rgba(245, 158, 11, 0.05);
	border: 2rpx solid rgba(245, 158, 11, 0.2);
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	margin: 32rpx 32rpx 0 32rpx;
}

.motivation-icon {
	font-size: 64rpx;
	color: #F59E0B;
}

.motivation-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #333;
}

.motivation-desc {
	font-size: 24rpx;
	color: #666;
}

/* Font Awesome 图标样式 */
.fa {
	font-family: 'FontAwesome';
}
</style>