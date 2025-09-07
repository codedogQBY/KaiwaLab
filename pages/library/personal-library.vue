<template>
	<view class="personal-library-container">
		<!-- 标题栏 -->
		<view class="header">
			<view class="header-left" @click="goBack">
				<text class="fa fa-arrow-left back-btn"></text>
			</view>
			<text class="header-title">个人词库</text>
			<view class="header-right" @click="showAddWordModal">
				<text class="fa fa-plus add-btn"></text>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-wrapper">
			<!-- 搜索和筛选 -->
			<view class="search-section">
				<view class="search-box">
					<text class="fa fa-search search-icon"></text>
					<input class="search-input" placeholder="搜索词汇或释义" v-model="searchKeyword" />
				</view>
				<view class="filter-tabs">
					<view 
						class="filter-tab" 
						:class="{ active: activeFilter === 'all' }" 
						@click="setFilter('all')"
					>
						<text>全部</text>
					</view>
					<view 
						class="filter-tab" 
						:class="{ active: activeFilter === 'saved' }" 
						@click="setFilter('saved')"
					>
						<text>已收藏</text>
					</view>
					<view 
						class="filter-tab" 
						:class="{ active: activeFilter === 'learned' }" 
						@click="setFilter('learned')"
					>
						<text>已学会</text>
					</view>
				</view>
			</view>

			<!-- 词汇统计 -->
			<view class="stats-section">
				<view class="stats-grid">
					<view class="stat-item">
						<text class="stat-value">{{ totalWords }}</text>
						<text class="stat-label">总词汇</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ learnedWords }}</text>
						<text class="stat-label">已学会</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ savedWords }}</text>
						<text class="stat-label">已收藏</text>
					</view>
				</view>
			</view>

			<!-- 词汇列表 -->
			<view class="section">
				<view class="section-header">
					<text class="section-title">我的词汇</text>
					<text class="section-subtitle">共 {{ filteredWords.length }} 个</text>
				</view>
				<view class="words-list">
					<view class="word-card" v-for="(word, index) in filteredWords" :key="index">
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
							<view class="action-btn" @click="playPronunciation(word)">
								<text class="fa fa-volume-up"></text>
							</view>
							<view class="action-btn" @click="toggleSaved(word)">
								<text class="fa fa-bookmark" :class="{ 'saved': word.saved }"></text>
							</view>
							<view class="action-btn" @click="toggleLearned(word)">
								<text class="fa fa-check-circle" :class="{ 'learned': word.learned }"></text>
							</view>
							<view class="action-btn" @click="showEditWordModal(word)">
								<text class="fa fa-edit"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 添加/编辑词汇模态框 -->
		<view class="modal" v-if="showModal">
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">{{ isEditing ? '编辑词汇' : '添加词汇' }}</text>
					<text class="fa fa-times close-btn" @click="closeModal"></text>
				</view>
				<view class="modal-body">
					<view class="form-group">
						<text class="form-label">词汇</text>
						<input class="form-input" placeholder="请输入日语词汇" v-model="currentWord.word" />
					</view>
					<view class="form-group">
						<text class="form-label">发音</text>
						<input class="form-input" placeholder="请输入发音（假名+罗马音）" v-model="currentWord.pronunciation" />
					</view>
					<view class="form-group">
						<text class="form-label">释义</text>
						<input class="form-input" placeholder="请输入中文释义" v-model="currentWord.meaning" />
					</view>
					<view class="form-group">
						<text class="form-label">分类</text>
						<picker mode="selector" :range="categories" range-key="name" @change="onCategoryChange">
							<view class="picker">
								<text>{{ currentCategory.name }}</text>
							</view>
						</picker>
					</view>
					<view class="form-group">
						<text class="form-label">例句</text>
						<textarea class="form-textarea" placeholder="请输入例句（可选）" v-model="currentWord.example"></textarea>
					</view>
				</view>
				<view class="modal-footer">
					<button class="cancel-btn" @click="closeModal">取消</button>
					<button class="confirm-btn" @click="saveWord">{{ isEditing ? '保存' : '添加' }}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PersonalLibrary',
	data() {
		return {
			searchKeyword: '',
			activeFilter: 'all',
			showModal: false,
			isEditing: false,
			currentWord: {
				word: '',
				pronunciation: '',
				meaning: '',
				category: 'other',
				categoryName: '其他',
				example: '',
				addedDate: ''
			},
			currentCategory: { id: 'other', name: '其他' },
			categories: [
				{ id: 'other', name: '其他' },
				{ id: 'restaurant', name: '餐厅用语' },
				{ id: 'shopping', name: '购物' },
				{ id: 'travel', name: '旅游' },
				{ id: 'business', name: '商务' },
				{ id: 'daily', name: '日常生活' }
			],
			personalWords: [
				{
					word: '刺身',
					pronunciation: 'さしみ (sashimi)',
					meaning: '生鱼片',
					category: 'restaurant',
					categoryName: '餐厅用语',
					addedDate: '2023-06-10',
					saved: true,
					learned: true,
					example: '刺身は新鮮でとても美味しいです。'
				},
				{
					word: 'お土産',
					pronunciation: 'おみやげ (omiyage)',
					meaning: '礼品，土特产',
					category: 'shopping',
					categoryName: '购物',
					addedDate: '2023-06-08',
					saved: true,
					learned: false,
					example: '日本からお土産を買いました。'
				},
				{
					word: '観光',
					pronunciation: 'かんこう (kankou)',
					meaning: '观光',
					category: 'travel',
					categoryName: '旅游',
					addedDate: '2023-06-05',
					saved: false,
					learned: true,
					example: '京都で観光しました。'
				}
			]
		}
	},
	computed: {
		totalWords() {
			return this.personalWords.length
		},
		learnedWords() {
			return this.personalWords.filter(word => word.learned).length
		},
		savedWords() {
			return this.personalWords.filter(word => word.saved).length
		},
		filteredWords() {
			let filtered = this.personalWords
			
			// 搜索过滤
			if (this.searchKeyword) {
				filtered = filtered.filter(word => 
					word.word.includes(this.searchKeyword) || 
					word.meaning.includes(this.searchKeyword)
				)
			}
			
			// 筛选过滤
			if (this.activeFilter === 'saved') {
				filtered = filtered.filter(word => word.saved)
			} else if (this.activeFilter === 'learned') {
				filtered = filtered.filter(word => word.learned)
			}
			
			return filtered
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		setFilter(filter) {
			this.activeFilter = filter
		},
		playPronunciation(word) {
			uni.showToast({
				title: `播放: ${word.word}`,
				icon: 'none'
			})
		},
		toggleSaved(word) {
			word.saved = !word.saved
			uni.showToast({
				title: word.saved ? '已收藏' : '已取消收藏',
				icon: 'none'
			})
		},
		toggleLearned(word) {
			word.learned = !word.learned
			uni.showToast({
				title: word.learned ? '已标记为已学' : '已取消标记',
				icon: 'none'
			})
		},
		showAddWordModal() {
			this.isEditing = false
			this.currentWord = {
				word: '',
				pronunciation: '',
				meaning: '',
				category: 'other',
				categoryName: '其他',
				example: '',
				addedDate: ''
			}
			this.currentCategory = { id: 'other', name: '其他' }
			this.showModal = true
		},
		showEditWordModal(word) {
			this.isEditing = true
			this.currentWord = { ...word }
			this.currentCategory = this.categories.find(cat => cat.id === word.category) || { id: 'other', name: '其他' }
			this.showModal = true
		},
		closeModal() {
			this.showModal = false
		},
		onCategoryChange(e) {
			const selectedIndex = e.detail.value
			this.currentCategory = this.categories[selectedIndex]
			this.currentWord.category = this.currentCategory.id
			this.currentWord.categoryName = this.currentCategory.name
		},
		saveWord() {
			if (!this.currentWord.word || !this.currentWord.meaning) {
				uni.showToast({
					title: '请填写词汇和释义',
					icon: 'none'
				})
				return
			}
			
			if (this.isEditing) {
				// 编辑词汇
				const index = this.personalWords.findIndex(word => word.word === this.currentWord.word)
				if (index !== -1) {
					this.personalWords[index] = { ...this.currentWord }
				}
			} else {
				// 添加新词汇
				this.currentWord.addedDate = new Date().toISOString().split('T')[0]
				this.personalWords.push({ ...this.currentWord })
			}
			
			this.closeModal()
			uni.showToast({
				title: this.isEditing ? '词汇已更新' : '词汇已添加',
				icon: 'success'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.personal-library-container {
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
	.add-btn {
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

/* 搜索和筛选 */
.search-section {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

	.search-box {
		display: flex;
		align-items: center;
		background: #F9FAFB;
		border-radius: 16rpx;
		padding: 16rpx 24rpx;
		margin-bottom: 24rpx;

		.search-icon {
			color: #9CA3AF;
			font-size: 28rpx;
			margin-right: 16rpx;
		}

		.search-input {
			flex: 1;
			font-size: 28rpx;
			color: #1F2937;
			background: transparent;
		}
	}

	.filter-tabs {
		display: flex;
		gap: 16rpx;

		.filter-tab {
			padding: 16rpx 24rpx;
			border-radius: 16rpx;
			background: #F3F4F6;
			color: #6B7280;
			font-size: 24rpx;
			cursor: pointer;
			transition: all 0.2s;

			&.active {
				background: #007AFF;
				color: white;
			}

			&:hover:not(.active) {
				background: #E5E7EB;
			}
		}
	}
}

/* 词汇统计 */
.stats-section {
	background: white;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

	.stats-grid {
		display: flex;
		justify-content: space-between;

		.stat-item {
			text-align: center;
			flex: 1;

			.stat-value {
				display: block;
				font-size: 40rpx;
				font-weight: 600;
				margin-bottom: 8rpx;
			}

			.stat-label {
				font-size: 24rpx;
				color: #6B7280;
			}
		}
	}
}

/* 词汇列表 */
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

						&.business {
							background: #DDD6FE;
							color: #7C3AED;
						}

						&.daily {
							background: #FEF3C7;
							color: #D97706;
						}

						&.other {
							background: #E5E7EB;
							color: #374151;
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
}

/* 模态框 */
.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(8rpx);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	animation: modalFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	.modal-content {
		width: 90%;
		max-width: 520rpx;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20rpx);
		border-radius: 28rpx;
		overflow: hidden;
		box-shadow: 0 32rpx 80rpx rgba(0, 0, 0, 0.12), 0 0 0 1rpx rgba(255, 255, 255, 0.1);
		animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 36rpx 36rpx 28rpx;
			background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(255, 255, 255, 0.8) 100%);
			border-bottom: 1rpx solid rgba(37, 99, 235, 0.08);

			.modal-title {
				font-size: 34rpx;
				font-weight: 700;
				color: #1e293b;
				letter-spacing: -0.8rpx;
			}

			.close-btn {
				width: 44rpx;
				height: 44rpx;
				border-radius: 50%;
				background: rgba(148, 163, 184, 0.08);
				color: #64748b;
				font-size: 26rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				border: 1rpx solid rgba(148, 163, 184, 0.1);

				&:hover {
					background: rgba(239, 68, 68, 0.08);
					color: #ef4444;
					transform: scale(1.05);
					border-color: rgba(239, 68, 68, 0.2);
				}
			}
		}

		.modal-body {
			padding: 36rpx;
			background: rgba(255, 255, 255, 0.6);

			.form-group {
				margin-bottom: 32rpx;
				padding: 28rpx;
				background: rgba(255, 255, 255, 0.7);
				border-radius: 20rpx;
				border: 1rpx solid rgba(37, 99, 235, 0.06);
				transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
				backdrop-filter: blur(10rpx);

				&:last-child {
					margin-bottom: 0;
				}

				&:hover {
					transform: translateY(-4rpx);
					box-shadow: 0 16rpx 40rpx rgba(37, 99, 235, 0.08);
					border-color: rgba(37, 99, 235, 0.12);
					background: rgba(255, 255, 255, 0.85);
				}

				.form-label {
					display: block;
					font-size: 28rpx;
					font-weight: 600;
					color: #1e293b;
					letter-spacing: -0.5rpx;
					margin-bottom: 16rpx;
				}

				.form-input,
				.form-textarea {
					width: 100%;
					padding: 20rpx 24rpx;
					border: 2rpx solid rgba(37, 99, 235, 0.1);
					border-radius: 16rpx;
					font-size: 26rpx;
					font-weight: 500;
					color: #64748b;
					background: rgba(255, 255, 255, 0.8);
					box-sizing: border-box;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					backdrop-filter: blur(10rpx);

					&:focus {
						border-color: rgba(37, 99, 235, 0.3);
						outline: none;
						background: rgba(37, 99, 235, 0.04);
						color: #2563eb;
						transform: translateY(-2rpx);
					}
				}

				.form-textarea {
					height: 120rpx;
					resize: none;
				}

				.picker {
					padding: 20rpx 24rpx;
					border: 2rpx solid rgba(37, 99, 235, 0.1);
					border-radius: 16rpx;
					font-size: 26rpx;
					font-weight: 500;
					color: #64748b;
					background: rgba(255, 255, 255, 0.8);
					cursor: pointer;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					backdrop-filter: blur(10rpx);

					&:hover {
						background: rgba(37, 99, 235, 0.04);
						border-color: rgba(37, 99, 235, 0.2);
						color: #2563eb;
						transform: translateY(-2rpx);
					}
				}
			}
		}

		.modal-footer {
			display: flex;
			justify-content: center;
			gap: 20rpx;
			padding: 28rpx 36rpx 36rpx;
			background: linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(255, 255, 255, 0.9) 100%);
			border-top: 1rpx solid rgba(37, 99, 235, 0.08);

			.cancel-btn,
			.confirm-btn {
				flex: 1;
				padding: 20rpx 36rpx;
				border-radius: 16rpx;
				font-size: 30rpx;
				font-weight: 600;
				cursor: pointer;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				letter-spacing: -0.5rpx;
				border: none;
			}

			.cancel-btn {
				background: rgba(148, 163, 184, 0.1);
				color: #64748b;
				box-shadow: 0 4rpx 12rpx rgba(148, 163, 184, 0.15);

				&:hover {
					background: rgba(148, 163, 184, 0.15);
					color: #475569;
					transform: translateY(-2rpx);
					box-shadow: 0 6rpx 16rpx rgba(148, 163, 184, 0.2);
				}
			}

			.confirm-btn {
				background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
				color: white;
				box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.25);

				&:hover {
					background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
					transform: translateY(-3rpx);
					box-shadow: 0 12rpx 32rpx rgba(37, 99, 235, 0.35);
				}

				&:active {
					transform: translateY(-1rpx);
				}
			}
		}
	}
}

@keyframes modalFadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes modalSlideIn {
	from {
		opacity: 0;
		transform: scale(0.9) translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: scale(1) translateY(0);
	}
}

/* 暗黑模式样式 */
.dark-theme .personal-library-container {
	background-color: #121212;
}

.dark-theme .header {
	background: #1F1F1F;
	border-bottom: 2rpx solid #3D3D3D;

	.back-btn,
	.add-btn {
		color: #A0A0A0;

		&:hover {
			color: #6366F1;
		}
	}

	.header-title {
		color: #E0E0E0;
	}
}

.dark-theme .search-section,
.dark-theme .stats-section,
.dark-theme .section {
	background: #1F1F1F;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

.dark-theme .search-box {
	background: #2D2D2D;

	.search-icon {
		color: #808080;
	}

	.search-input {
		color: #E0E0E0;
	}
}

.dark-theme .filter-tab {
	background: #2D2D2D;
	color: #A0A0A0;

	&.active {
		background: #6366F1;
		color: white;
	}

	&:hover:not(.active) {
		background: #3D3D3D;
	}
}

.dark-theme .section-title {
	color: #E0E0E0;
}

.dark-theme .section-subtitle {
	color: #A0A0A0;
}

.dark-theme .stat-value {
	color: #E0E0E0;
}

.dark-theme .stat-label {
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

	.word-date {
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

	.word-tag.business {
		background: #3D3D3D;
		color: #A78BFA;
	}

	.word-tag.daily {
		background: #3D3D3D;
		color: #FBBF24;
	}

	.word-tag.other {
		background: #3D3D3D;
		color: #A0A0A0;
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

.dark-theme .modal {
	background: rgba(0, 0, 0, 0.8);
	backdrop-filter: blur(12rpx);

	.modal-content {
		background: rgba(30, 41, 59, 0.95);
		backdrop-filter: blur(24rpx);
		box-shadow: 0 32rpx 80rpx rgba(0, 0, 0, 0.4), 0 0 0 1rpx rgba(51, 65, 85, 0.3);

		.modal-header {
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(30, 41, 59, 0.9) 100%);
			border-bottom: 1rpx solid rgba(51, 65, 85, 0.4);

			.modal-title {
				color: #f1f5f9;
			}

			.close-btn {
				background: rgba(71, 85, 105, 0.3);
				color: #94a3b8;
				border: 1rpx solid rgba(71, 85, 105, 0.4);

				&:hover {
					background: rgba(239, 68, 68, 0.2);
					color: #f87171;
					border-color: rgba(239, 68, 68, 0.4);
				}
			}
		}

		.modal-body {
			background: rgba(15, 23, 42, 0.6);

			.form-group {
				background: rgba(30, 41, 59, 0.8);
				border: 1rpx solid rgba(51, 65, 85, 0.3);

				&:hover {
					background: rgba(51, 65, 85, 0.8);
					border-color: rgba(59, 130, 246, 0.3);
					box-shadow: 0 16rpx 40rpx rgba(59, 130, 246, 0.15);
				}

				.form-label {
					color: #e2e8f0;
				}

				.form-input,
				.form-textarea {
					background: rgba(15, 23, 42, 0.8);
					border: 2rpx solid rgba(51, 65, 85, 0.4);
					color: #cbd5e1;

					&:focus {
						background: rgba(59, 130, 246, 0.08);
						border-color: rgba(59, 130, 246, 0.5);
						color: #93c5fd;
					}
				}

				.picker {
					background: rgba(15, 23, 42, 0.8);
					border: 2rpx solid rgba(51, 65, 85, 0.4);
					color: #cbd5e1;

					&:hover {
						background: rgba(59, 130, 246, 0.08);
						border-color: rgba(59, 130, 246, 0.4);
						color: #93c5fd;
					}
				}
			}
		}

		.modal-footer {
			background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(30, 41, 59, 0.9) 100%);
			border-top: 1rpx solid rgba(51, 65, 85, 0.4);

			.cancel-btn {
				background: rgba(71, 85, 105, 0.3);
				color: #94a3b8;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);

				&:hover {
					background: rgba(71, 85, 105, 0.5);
					color: #cbd5e1;
					box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.4);
				}
			}

			.confirm-btn {
				background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
				box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.4);

				&:hover {
					background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
					box-shadow: 0 12rpx 32rpx rgba(59, 130, 246, 0.5);
				}
			}
		}
	}
}

.dark-theme .cancel-btn {
	background: #2D2D2D;
	color: #A0A0A0;

	&:hover {
		background: #3D3D3D;
	}
}
</style>