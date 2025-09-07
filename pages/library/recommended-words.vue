<template>
	<view class="recommended-words-container">
		<!-- 标题栏 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="fa fa-arrow-left back-btn"></text>
			</view>
			<text class="header-title">推荐词汇</text>
			<view class="header-right">
				<text class="fa fa-sync-alt refresh-btn" @click="refreshRecommendations"></text>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-wrapper">
			<!-- 推荐理由 -->
			<view class="section">
				<view class="reason-card">
					<view class="reason-icon">
						<text class="fa fa-star"></text>
					</view>
					<view class="reason-content">
						<text class="reason-title">基于您的学习情况推荐</text>
						<text class="reason-desc">这些词汇与您最近学习的场景和对话内容相关</text>
					</view>
				</view>
			</view>

			<!-- 推荐词汇列表 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">推荐词汇</text>
					<text class="section-subtitle">共 {{ recommendedWords.length }} 个</text>
				</view>
				<view class="words-list">
					<view class="word-card" v-for="(word, index) in recommendedWords" :key="index">
						<view class="word-content">
							<text class="word-title">{{ word.word }}</text>
							<text class="word-pronunciation">{{ word.pronunciation }}</text>
							<text class="word-meaning">{{ word.meaning }}</text>
							<view class="word-meta">
								<view class="word-tag" :class="word.category">
									<text class="tag-text">{{ word.categoryName }}</text>
								</view>
								<text class="word-frequency">词频: {{ word.frequency }}</text>
							</view>
						</view>
						<view class="word-actions">
							<view class="action-btn" @click="playPronunciation(word)">
								<text class="fa fa-volume-up"></text>
							</view>
							<view class="action-btn" @click="addToPersonal(word)">
								<text class="fa fa-bookmark" :class="{ 'saved': word.saved }"></text>
							</view>
							<view class="action-btn" @click="markAsLearned(word)">
								<text class="fa fa-check-circle" :class="{ 'learned': word.learned }"></text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 学习建议 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">学习建议</text>
				</view>
				<view class="suggestion-card">
					<view class="suggestion-item">
						<view class="suggestion-icon">
							<text class="fa fa-lightbulb"></text>
						</view>
						<view class="suggestion-content">
							<text class="suggestion-title">建议学习顺序</text>
							<text class="suggestion-desc">优先学习高频词汇，再学习场景专用词汇</text>
						</view>
					</view>
					<view class="suggestion-item">
						<view class="suggestion-icon">
							<text class="fa fa-history"></text>
						</view>
						<view class="suggestion-content">
							<text class="suggestion-title">复习计划</text>
							<text class="suggestion-desc">建议在1天、3天、7天后复习这些词汇</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'RecommendedWords',
	data() {
		return {
			recommendedWords: [
				{
					word: 'いらっしゃいませ',
					pronunciation: 'いらっしゃいませ (irasshaimase)',
					meaning: '欢迎光临',
					category: 'restaurant',
					categoryName: '餐厅用语',
					frequency: '高',
					saved: false,
					learned: false
				},
				{
					word: 'おすすめ',
					pronunciation: 'おすすめ (osusume)',
					meaning: '推荐',
					category: 'restaurant',
					categoryName: '餐厅用语',
					frequency: '高',
					saved: true,
					learned: false
				},
				{
					word: '会計',
					pronunciation: 'かいけい (kaikei)',
					meaning: '结账',
					category: 'restaurant',
					categoryName: '餐厅用语',
					frequency: '中',
					saved: false,
					learned: false
				},
				{
					word: 'お土産',
					pronunciation: 'おみやげ (omiyage)',
					meaning: '礼品，土特产',
					category: 'shopping',
					categoryName: '购物',
					frequency: '中',
					saved: false,
					learned: true
				},
				{
					word: '免税',
					pronunciation: 'めんぜい (menzei)',
					meaning: '免税',
					category: 'shopping',
					categoryName: '购物',
					frequency: '低',
					saved: false,
					learned: false
				}
			]
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		refreshRecommendations() {
			uni.showToast({
				title: '推荐已刷新',
				icon: 'none'
			})
		},
		playPronunciation(word) {
			uni.showToast({
				title: `播放: ${word.word}`,
				icon: 'none'
			})
		},
		addToPersonal(word) {
			word.saved = !word.saved
			uni.showToast({
				title: word.saved ? '已收藏' : '已取消收藏',
				icon: 'none'
			})
		},
		markAsLearned(word) {
			word.learned = !word.learned
			uni.showToast({
				title: word.learned ? '已标记为已学' : '已取消标记',
				icon: 'none'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.recommended-words-container {
	min-height: 100vh;
	background-color: #f9fafb;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	background: white;
	border-bottom: 2rpx solid #E5E7EB;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;

	.header-left,
	.header-right {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-btn,
	.refresh-btn {
		color: #6B7280;
		font-size: 36rpx;
		cursor: pointer;
		transition: color 0.2s;

		&:hover {
			color: #007AFF;
		}
	}

	.header-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #1F2937;
	}
}

.content-wrapper {
	margin-top: 120rpx;
	padding: 32rpx;
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}

.section {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

	.section-header {
		margin-bottom: 32rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: 600;
			color: #1F2937;
			display: block;
			margin-bottom: 8rpx;
		}

		.section-subtitle {
			font-size: 24rpx;
			color: #6B7280;
		}
	}
}

/* 推荐理由 */
.reason-card {
	display: flex;
	align-items: center;
	background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
	border-radius: 16rpx;
	padding: 32rpx;

	.reason-icon {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		background: rgba(245, 158, 11, 0.1);
		color: #F59E0B;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 24rpx;

		.fa {
			font-size: 28rpx;
		}
	}

	.reason-content {
		.reason-title {
			display: block;
			font-size: 32rpx;
			font-weight: 500;
			color: #1F2937;
			margin-bottom: 8rpx;
		}

		.reason-desc {
			display: block;
			font-size: 24rpx;
			color: #6B7280;
		}
	}
}

/* 推荐词汇列表 */
.words-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;

	.word-card {
		padding: 32rpx;
		background: #F9FAFB;
		border-radius: 16rpx;
		border: 2rpx solid #E5E7EB;
		transition: all 0.2s;

		&:hover {
			background: #F3F4F6;
			box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
		}

		.word-content {
			margin-bottom: 24rpx;

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
				justify-content: space-between;

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
				}

				.word-frequency {
					font-size: 24rpx;
					color: #6B7280;
				}
			}
		}

		.word-actions {
			display: flex;
			justify-content: flex-end;
			gap: 16rpx;

			.action-btn {
				width: 56rpx;
				height: 56rpx;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.8);
				display: flex;
				align-items: center;
				justify-content: center;
				color: #6B7280;
				transition: all 0.2s;
				border: 1rpx solid #E5E7EB;

				&:hover {
					background: white;
					color: #007AFF;
				}

				.fa {
					font-size: 28rpx;

					&.saved {
						color: #F59E0B;
					}

					&.learned {
						color: #10B981;
					}
				}
			}
		}
	}
}

/* 学习建议 */
.suggestion-card {
	background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
	border-radius: 16rpx;
	padding: 32rpx;

	.suggestion-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 32rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.suggestion-icon {
			width: 48rpx;
			height: 48rpx;
			border-radius: 50%;
			background: rgba(37, 99, 235, 0.1);
			color: #2563EB;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 24rpx;
			flex-shrink: 0;

			.fa {
				font-size: 24rpx;
			}
		}

		.suggestion-content {
			.suggestion-title {
				display: block;
				font-size: 28rpx;
				font-weight: 500;
				color: #1F2937;
				margin-bottom: 8rpx;
			}

			.suggestion-desc {
				display: block;
				font-size: 24rpx;
				color: #6B7280;
			}
		}
	}
}

/* 暗黑模式样式 */
.dark-theme .recommended-words-container {
	background-color: #121212;
}

.dark-theme .header {
	background: #1F1F1F;
	border-bottom: 2rpx solid #3D3D3D;

	.back-btn,
	.refresh-btn {
		color: #A0A0A0;

		&:hover {
			color: #6366F1;
		}
	}

	.header-title {
		color: #E0E0E0;
	}
}

.dark-theme .section {
	background: #1F1F1F;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

.dark-theme .section-title {
	color: #E0E0E0;
}

.dark-theme .section-subtitle {
	color: #A0A0A0;
}

.dark-theme .reason-card {
	background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
}

.dark-theme .reason-title {
	color: #E0E0E0;
}

.dark-theme .reason-desc {
	color: #A0A0A0;
}

.dark-theme .word-card {
	background: #2D2D2D;
	border: 2rpx solid #3D3D3D;

	&:hover {
		background: #3D3D3D;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
	}

	.word-title {
		color: #E0E0E0;
	}

	.word-pronunciation {
		color: #A0A0A0;
	}

	.word-meaning {
		color: #C0C0C0;
	}

	.word-frequency {
		color: #A0A0A0;
	}

	.word-tag.restaurant {
		background: #3D3D3D;
		color: #F97316;
	}

	.word-tag.shopping {
		background: #3D3D3D;
		color: #60A5FA;
	}

	.word-tag.travel {
		background: #3D3D3D;
		color: #34D399;
	}
}

.dark-theme .action-btn {
	background: rgba(45, 45, 45, 0.8);
	color: #A0A0A0;
	border: 1rpx solid #3D3D3D;

	&:hover {
		background: #2D2D2D;
		color: #6366F1;
	}
}

.dark-theme .suggestion-card {
	background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
}

.dark-theme .suggestion-title {
	color: #E0E0E0;
}

.dark-theme .suggestion-desc {
	color: #A0A0A0;
}
</style>