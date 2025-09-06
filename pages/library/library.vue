<template>
	<view class="library-container">

		
		<!-- 固定顶部栏 -->
		<view class="fixed-header">
			<!-- 标题栏 -->
			<view class="header">
				<view class="header-left">
				</view>
				<text class="header-title">我的单词本</text>
				<view class="header-right">
					<text class="fa fa-search search-btn"></text>
				</view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class="content-wrapper">
			
			<!-- 统计信息 -->
			<view class="stats-section">
				<view class="stats-header">
					<view class="stats-left">
						<text class="stats-title">收藏单词</text>
						<text class="stats-count">共 24 个单词</text>
					</view>
					<view class="stats-right">
						<text class="review-label">今日复习</text>
						<text class="review-count">8/12</text>
					</view>
				</view>
				
				<!-- 复习进度 -->
				<view class="progress-container">
					<view class="progress-bar">
						<view class="progress-fill"></view>
					</view>
					<text class="progress-text">复习进度 67%</text>
				</view>
			</view>
			
			<!-- 分类标签 -->
			<view class="categories">
				<scroll-view class="categories-scroll" scroll-x="true" show-scrollbar="false">
					<view class="categories-wrapper">
						<view 
						v-for="category in categories" 
						:key="category.id"
						class="category-tag"
						:class="{ active: activeCategory === category.id }"
						@click="selectCategory(category.id)"
					>
						<text>{{ category.name }}</text>
					</view>
					</view>
				</scroll-view>
			</view>
			
			<!-- 单词卡片列表 -->
			<view class="word-list">
				<view 
					class="word-card" 
					:class="{ 'review-needed': word.needReview }"
					v-for="(word, index) in filteredWords" 
					:key="index"
					@click="openWord(word)"
				>
					<view class="word-content">
						<text class="word-title">{{ word.word }}</text>
						<text class="word-pronunciation">{{ word.pronunciation }}</text>
						<text class="word-meaning">{{ word.meaning }}</text>
						<view class="word-meta">
							<view class="word-tag" :class="word.category">
								<text class="tag-text">{{ word.categoryName }}</text>
							</view>
							<text class="word-date">{{ word.addedDate }}</text>
						</view>
					</view>
					<view class="word-actions">
						<view class="play-btn" @click.stop="playAudio(word)">
							<text class="fa fa-volume-up"></text>
						</view>
						<view class="proficiency">
							<view class="proficiency-dots">
								<view 
									class="dot" 
									:class="{ active: index < word.proficiency }"
									v-for="(dot, index) in 5" 
									:key="index"
								></view>
							</view>
							<text class="proficiency-label">熟练度</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 自定义底部导航栏 -->
		<BottomTabBar :current="2" @change="switchTab" />
	</view>
</template>

<script>
import BottomTabBar from '@/components/BottomTabBar/BottomTabBar.vue'

export default {
	name: 'Library',
	components: {
		BottomTabBar
	},
	data() {
		return {
			searchKeyword: '',
			activeCategory: 'all',
			categories: [
				{ id: 'all', name: '全部' },
				{ id: 'restaurant', name: '餐厅用语' },
				{ id: 'shopping', name: '购物' },
				{ id: 'travel', name: '旅游' },
				{ id: 'review', name: '待复习' }
			],
			words: [
				{
					word: '刺身',
					pronunciation: 'さしみ (sashimi)',
					meaning: '生鱼片',
					category: 'restaurant',
					categoryName: '餐厅用语',
					addedDate: '2天前添加',
					proficiency: 3,
					needReview: false
				},
				{
					word: '寿司',
					pronunciation: 'すし (sushi)',
					meaning: '寿司',
					category: 'restaurant',
					categoryName: '餐厅用语',
					addedDate: '3天前添加',
					proficiency: 4,
					needReview: false
				},
				{
					word: 'お願いします',
					pronunciation: 'おねがいします (onegaishimasu)',
					meaning: '请，拜托',
					category: 'review',
					categoryName: '待复习',
					addedDate: '1天前添加',
					proficiency: 2,
					needReview: true
				},
				{
					word: '新鮮',
					pronunciation: 'しんせん (shinsen)',
					meaning: '新鲜',
					category: 'shopping',
					categoryName: '购物',
					addedDate: '5天前添加',
					proficiency: 5,
					needReview: false
				}
			]
		}
	},
	computed: {
		filteredWords() {
			let filtered = this.words
			
			// 按分类筛选
			if (this.activeCategory !== 'all') {
				filtered = filtered.filter(item => item.category === this.activeCategory)
			}
			
			// 按搜索关键词筛选
			if (this.searchKeyword) {
				filtered = filtered.filter(item => 
					item.word.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
					item.meaning.toLowerCase().includes(this.searchKeyword.toLowerCase())
				)
			}
			
			return filtered
		}
	},
	methods: {
		selectCategory(categoryId) {
			this.activeCategory = categoryId
		},
		onSearch() {
			// 搜索逻辑已在computed中处理
		},
		openWord(word) {
			uni.showToast({
				title: `查看单词: ${word.word}`,
				icon: 'none'
			})
			// TODO: 导航到单词详情页面
		},
		playPronunciation(word) {
			uni.showToast({
				title: `播放: ${word.word}`,
				icon: 'none'
			})
			// TODO: 播放单词发音
		},
		// 处理底部导航栏切换
		switchTab(index) {
			const tabPages = [
				'/pages/home/home',
				'/pages/lab/lab',
				'/pages/library/library',
				'/pages/profile/profile'
			]
			if (index !== 2) { // 当前页面是library(index=2)，只有点击其他tab才跳转
				uni.switchTab({
					url: tabPages[index]
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>

.library-container {
	min-height: 100vh;
	background-color: #ffffff;
	position: relative;
}



/* 固定顶部栏 */
.fixed-header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	background: white;
	border-bottom: 2rpx solid #E5E7EB;
}

/* 内容区域 */
.content-wrapper {
	margin-top: 120rpx; /* 为固定顶部栏留出空间 */
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom)); /* 为底部导航栏留出空间 */
	overflow-y: auto;
}

/* 标题栏 */
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	background: white;
	
	.header-left,
	.header-right {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.back-btn,
	.search-btn {
		color: #6B7280;
		font-size: 32rpx;
		cursor: pointer;
		transition: color 0.2s;
		
		&:hover {
			color: #007AFF;
		}
	}
	
	.header-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1F2937;
	}
}

/* 统计信息 */
.stats-section {
	padding: 32rpx;
	background: linear-gradient(135deg, rgba(0, 122, 255, 0.05) 0%, rgba(88, 86, 214, 0.05) 100%);
	
	.stats-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;
		
		.stats-left {
			.stats-title {
				font-size: 36rpx;
				font-weight: 600;
				color: #1F2937;
				display: block;
				margin-bottom: 8rpx;
			}
			
			.stats-count {
				font-size: 28rpx;
				color: #6B7280;
				display: block;
			}
		}
		
		.stats-right {
			text-align: right;
			
			.review-label {
				font-size: 28rpx;
				color: #6B7280;
				display: block;
				margin-bottom: 8rpx;
			}
			
			.review-count {
				font-size: 36rpx;
				font-weight: 600;
				color: #007AFF;
				display: block;
			}
		}
	}
	
	.progress-container {
		.progress-bar {
			width: 100%;
			height: 16rpx;
			background: rgba(255, 255, 255, 0.5);
			border-radius: 8rpx;
			overflow: hidden;
			margin-bottom: 8rpx;
			
			.progress-fill {
				height: 100%;
				width: 67%;
				background: #007AFF;
				border-radius: 8rpx;
			}
		}
		
		.progress-text {
			font-size: 24rpx;
			color: #6B7280;
		}
	}
}

/* 分类标签 */
.categories {
	padding: 16rpx 0;
	background: white;
	border-bottom: 2rpx solid #E5E7EB;
	margin-bottom: 32rpx;
	
	.categories-scroll {
		white-space: nowrap;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		
		&::-webkit-scrollbar {
			display: none;
		}
		
		scrollbar-width: none;
	}
	
	.categories-wrapper {
		display: inline-flex;
		gap: 24rpx;
		padding: 0 16rpx;
		min-width: 100%;
	}
	
	.category-tag {
		padding: 16rpx 32rpx;
		border-radius: 40rpx;
		background: #F3F4F6;
		color: #6B7280;
		font-size: 28rpx;
		font-weight: 500;
		white-space: nowrap;
		cursor: pointer;
		transition: all 0.2s;
		flex-shrink: 0;
		margin: 24rpx 0;
		
		&.active {
			background: #007AFF;
			color: white;
		}
		
		&:hover {
			background: #E5E7EB;
			
			&.active {
				background: #007AFF;
			}
		}
	}
}

/* 单词卡片列表 */
.word-list {
	padding: 0 32rpx;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.word-card {
	background: white;
	border: 2rpx solid #E5E7EB;
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	
	&.review-needed {
		background: #FFFBEB;
		border-color: #FDE68A;
	}
	
	&:hover {
		box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
	}
	
	.word-content {
		flex: 1;
		
		.word-title {
			font-size: 36rpx;
			font-weight: 600;
			color: #1F2937;
			display: block;
			margin-bottom: 8rpx;
		}
		
		.word-pronunciation {
			font-size: 28rpx;
			color: #6B7280;
			display: block;
			margin-bottom: 16rpx;
		}
		
		.word-meaning {
			font-size: 28rpx;
			color: #374151;
			display: block;
			margin-bottom: 16rpx;
		}
		
		.word-meta {
			display: flex;
			align-items: center;
			gap: 16rpx;
			
			.word-tag {
				padding: 4rpx 16rpx;
				border-radius: 24rpx;
				font-size: 24rpx;
				
				&.restaurant {
					background: #FED7AA;
					color: #EA580C;
				}
				
				&.shopping {
					background: #DBEAFE;
					color: #2563EB;
				}
				
				&.travel {
					background: #D1FAE5;
					color: #059669;
				}
				
				&.review {
					background: #FEF3C7;
					color: #D97706;
				}
			}
			
			.word-date {
				font-size: 24rpx;
				color: #6B7280;
			}
		}
	}
	
	.word-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16rpx;
		margin-left: 32rpx;
		
		.play-btn {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background: rgba(0, 122, 255, 0.1);
			display: flex;
			align-items: center;
			justify-content: center;
			color: #007AFF;
			cursor: pointer;
			transition: all 0.2s;
			
			&:hover {
				background: rgba(0, 122, 255, 0.2);
			}
		}
		
		.proficiency {
			text-align: center;
			
			.proficiency-dots {
				display: flex;
				gap: 4rpx;
				margin-bottom: 8rpx;
				
				.dot {
					width: 16rpx;
					height: 16rpx;
					border-radius: 50%;
					background: #E5E7EB;
					
					&.active {
						background: #10B981;
					}
				}
			}
			
			.proficiency-label {
				font-size: 24rpx;
				color: #6B7280;
			}
		}
	}
}


</style>