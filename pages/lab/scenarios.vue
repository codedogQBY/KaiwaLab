<template>
	<div class="scenarios-container">
		<!-- 主要内容区域 -->
		<div class="main-content">
			<!-- 标题栏 -->
			<div class="header">
				<view class="header-left" @click="goBack">
					<text class="fa fa-arrow-left"></text>
				</view>
				<text class="header-title">场景试剂库</text>
				<view class="header-spacer"></view>
			</div>

			<!-- 内容包装器 -->
			<div class="content-wrapper">
				<!-- 分类标签 -->
				<scroll-view class="category-tabs" scroll-x="true" show-scrollbar="false">
					<view 
						v-for="(category, index) in categories" 
						:key="index" 
						:class="['category-tab', { active: activeCategory === index }]"
						@click="switchCategory(category.name)"
					>
						<text>{{ category.name }}</text>
					</view>
				</scroll-view>

				<!-- 会员提示 -->
				<view class="member-tip" @click="showMemberUpgrade">
					<view class="tip-icon">
						<text class="fa fa-lock"></text>
					</view>
					<view class="tip-content">
						<text class="tip-title">升级会员解锁全部24种场景试剂</text>
						<text class="tip-subtitle">包含商务日语和高级会话场景</text>
					</view>
					<view class="tip-button">
						<text>升级</text>
					</view>
				</view>

				<!-- 场景列表 -->
				<view class="scenarios-list">
					<view 
						v-for="scenario in currentScenarios" 
						:key="scenario.id || scenario.title" 
						:class="['scenario-card', { locked: scenario.locked }]"
						@click="enterScenario(scenario)"
					>
						<!-- 场景图片 -->
						<view class="scenario-image">
							<image class="image" :src="scenario.image" mode="aspectFill"></image>
							<view :class="['level-badge', scenario.levelClass]">
								<text>{{ scenario.level }}</text>
							</view>
							<view v-if="scenario.locked" class="lock-overlay">
								<text class="fa fa-lock lock-icon"></text>
							</view>
						</view>

						<!-- 场景信息 -->
						<view class="scenario-info">
							<text class="scenario-title">{{ scenario.title }}</text>
							<text class="scenario-description">{{ scenario.description }}</text>
							<view class="scenario-bottom">
								<view class="scenario-meta">
									<view class="meta-item">
										<text class="fa fa-clock-o"></text>
										<text>{{ scenario.duration }}</text>
									</view>
									<text class="meta-separator">•</text>
									<view class="meta-item">
										<text class="fa fa-flask"></text>
										<text>{{ scenario.experiments }}个实验</text>
									</view>
								</view>
								<view class="scenario-action">
									<text :class="['action-text', { locked: scenario.locked }]">
										{{ scenario.locked ? '会员专享' : '开始' }}
										<text v-if="!scenario.locked" class="fa fa-arrow-right"></text>
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Scenarios',
	data() {
		return {
			statusBarHeight: 0,
			activeCategory: 0,
			categories: [
				{ name: '全部试剂', key: 'all' },
				{ name: '日常问候', key: 'greeting' },
				{ name: '购物', key: 'shopping' },
				{ name: '餐厅', key: 'restaurant' },
				{ name: '交通', key: 'transport' },
				{ name: '旅游', key: 'travel' }
			],
			scenarios: [
				{
					title: '餐厅点餐',
					description: '学习如何在日本餐厅点餐、询问菜品和结账，包括菜单询问、点菜、结账等常用表达',
					level: '中级试剂',
					levelClass: 'level-intermediate',
					duration: '15分钟',
					experiments: 8,
					image: 'https://picsum.photos/400/200?random=1',
					category: 'restaurant',
					locked: false,
					id: 'restaurant'
				},
				{
					title: '便利店购物',
					description: '学习在便利店购买商品的基础日语表达，练习询问价格、付款等表达',
					level: '初级试剂',
					levelClass: 'level-beginner',
					duration: '10分钟',
					experiments: 5,
					image: 'https://picsum.photos/400/200?random=2',
					category: 'shopping',
					locked: false
				},
				{
					title: '商务会谈',
					description: '学习商务场合的日语礼仪和专业表达，包括自我介绍、商务洽谈等',
					level: '高级试剂',
					levelClass: 'level-advanced',
					duration: '25分钟',
					experiments: 12,
					image: 'https://picsum.photos/400/200?random=3',
					category: 'greeting',
					locked: true
				},
				{
					title: '地铁问路',
					description: '学习如何在地铁站询问路线和方向，在机场询问方向和信息，学习旅行相关的实用对话',
					level: '中级试剂',
					levelClass: 'level-intermediate',
					duration: '12分钟',
					experiments: 7,
					image: 'https://picsum.photos/400/200?random=4',
					category: 'transport',
					locked: false
				},
				{
					title: '酒店入住',
					description: '练习酒店前台办理入住手续的对话，学习酒店入住登记的对话，包括预订确认、房间要求等',
					level: '中级试剂',
					levelClass: 'level-intermediate',
					duration: '15分钟',
					experiments: 9,
					image: 'https://picsum.photos/400/200?random=5',
					category: 'travel',
					locked: true
				},
				{
					title: '机场办理登机',
					description: '学习在机场办理登机手续的日语对话',
					level: '高级试剂',
					levelClass: 'level-advanced',
					duration: '20分钟',
					experiments: 10,
					image: 'https://picsum.photos/400/200?random=6',
					category: 'travel',
					locked: true
				},
				{
					title: '医院看病',
					description: '学习在医院看病时的基本对话，包括症状描述、预约等',
					level: '中级试剂',
					levelClass: 'level-intermediate',
					duration: '18分钟',
					experiments: 8,
					image: 'https://picsum.photos/400/200?random=7',
					category: 'greeting',
					locked: true
				}
			]
		}
	},
	computed: {
		currentCategory() {
			return this.categories[this.activeCategory]?.key || 'all'
		},
		currentScenarios() {
			if (this.currentCategory === 'all') {
				return this.scenarios
			}
			return this.scenarios.filter(scenario => scenario.category === this.currentCategory)
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		showMemberUpgrade() {
			uni.navigateTo({
				url: '/pages/profile/membership'
			})
		},
		switchCategory(categoryName) {
			const index = this.categories.findIndex(cat => cat.name === categoryName)
			if (index !== -1) {
				this.activeCategory = index
			}
		},
		enterScenario(scenario) {
			if (scenario.locked) {
				uni.navigateTo({
					url: '/pages/profile/membership'
				})
				return
			}
			
			if (scenario.id === 'restaurant') {
				uni.navigateTo({
					url: '/pages/lab/scenario-practice'
				})
			} else {
				uni.showToast({
					title: `${scenario.title}场景开发中`,
					icon: 'none'
				})
			}
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

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css');

.scenarios-container {
	background: #FFFFFF;
	min-height: 100vh;
}

/* 主要内容区域 */
.main-content {
	min-height: 100vh;
	overflow-y: auto;
}

/* 标题栏 */
.header {
	padding: 32rpx;
	border-bottom: 1px solid #DBEAFE;
	display: flex;
	justify-content: space-between;
	align-items: center;
	sticky: top 0;
	background: white;
	z-index: 10;
}

.header-left {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6B7280;
	transition: color 0.2s;
}

.header-left:active {
	color: #2563EB;
}

.header-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1F2937;
}

.header-spacer {
	width: 48rpx;
	height: 48rpx;
}

/* 内容包装器 */
.content-wrapper {
	padding: 32rpx;
}

/* 分类标签 */
.category-tabs {
	padding-bottom: 16rpx;
	margin-bottom: 48rpx;
	white-space: nowrap;
}

.category-tabs .category-tab {
	display: inline-block;
	margin-right: 8rpx;
}

.category-tab {
	white-space: nowrap;
	padding: 16rpx 32rpx;
	background: #F3F4F6;
	color: #6B7280;
	border-radius: 50rpx;
	font-size: 28rpx;
	font-weight: 500;
	transition: all 0.2s ease;
	border: none;
}

.category-tab.active {
	background: #2563EB;
	color: white;
}

.category-tab:active {
	background: rgba(37, 99, 235, 0.05);
}

/* 会员提示 */
.member-tip {
	background: rgba(37, 99, 235, 0.05);
	border: 1px solid rgba(37, 99, 235, 0.2);
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 48rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.tip-icon {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(37, 99, 235, 0.1);
	border-radius: 50%;
	flex-shrink: 0;
	color: #2563EB;
}

.tip-content {
	flex: 1;
	margin-right: 24rpx;
}

.tip-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1F2937;
	margin-bottom: 8rpx;
	display: block;
}

.tip-subtitle {
	font-size: 24rpx;
	color: #6B7280;
	display: block;
}

.tip-button {
	padding: 12rpx 32rpx;
	background: #2563EB;
	color: #FFFFFF;
	border-radius: 28rpx;
	font-size: 24rpx;
	font-weight: 600;
	transition: all 0.2s ease;
}

.tip-button:active {
	transform: scale(0.95);
}

/* 场景列表 */
.scenarios-list {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

/* 场景卡片 */
.scenario-card {
	background: white;
	border-radius: 24rpx;
	overflow: hidden;
	transition: all 0.3s ease;
	border: 2rpx solid #E5E7EB;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	position: relative;
	cursor: pointer;
}

.scenario-card:active {
	box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);
}

.scenario-card.locked {
	opacity: 0.7;
}

/* 场景图片 */
.scenario-image {
	width: 100%;
	height: 288rpx;
	position: relative;
	overflow: hidden;
	background: #F3F4F6;
}

.image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.level-badge {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	padding: 6rpx 16rpx;
	border-radius: 32rpx;
	font-size: 24rpx;
	font-weight: 500;
	color: white;
	z-index: 2;
}

.level-badge.level-beginner {
	background: #3B82F6 !important; /* 初级试剂 - 蓝色 */
}

.level-badge.level-intermediate {
	background: #F97316 !important; /* 中级试剂 - 橙色 */
}

.level-badge.level-advanced {
	background: #8B5CF6 !important; /* 高级试剂 - 紫色 */
}

.lock-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
}

.lock-icon {
	color: #FFFFFF;
	font-size: 48rpx;
}

/* 场景信息 */
.scenario-info {
	padding: 32rpx;
}

.scenario-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1F2937;
	margin-bottom: 8rpx;
	display: block;
}

.scenario-description {
	font-size: 28rpx;
	color: #6B7280;
	line-height: 1.4;
	margin-bottom: 24rpx;
	display: block;
}

.scenario-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 24rpx;
}

.scenario-meta {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;
	color: #6B7280;
}

.meta-separator {
	font-size: 24rpx;
	color: #6B7280;
}

.scenario-action {
	display: flex;
	justify-content: flex-end;
}

.action-text {
	font-size: 28rpx;
	font-weight: 500;
	color: #2563EB;
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.action-text.locked {
	color: #94A3B8;
}

/* FontAwesome 图标样式 */
.fa {
	font-family: FontAwesome;
}
</style>