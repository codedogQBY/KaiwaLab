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
				color: #1F2937;
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
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;

	.modal-content {
		width: 90%;
		max-width: 600rpx;
		background: white;
		border-radius: 24rpx;
		overflow: hidden;

		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx;
			border-bottom: 2rpx solid #E5E7EB;

			.modal-title {
				font-size: 36rpx;
				font-weight: 600;
				color: #1F2937;
			}

			.close-btn {
				color: #9CA3AF;
				font-size: 36rpx;
				cursor: pointer;
				transition: color 0.2s;

				&:hover {
					color: #6B7280;
				}
			}
		}

		.modal-body {
			padding: 32rpx;

			.form-group {
				margin-bottom: 32rpx;

				.form-label {
					display: block;
					font-size: 28rpx;
					color: #1F2937;
					margin-bottom: 16rpx;
					font-weight: 500;
				}

				.form-input,
				.form-textarea {
					width: 100%;
					padding: 24rpx;
					border: 2rpx solid #E5E7EB;
					border-radius: 16rpx;
					font-size: 28rpx;
					color: #1F2937;
					background: #F9FAFB;

					&:focus {
						border-color: #007AFF;
						outline: none;
					}
				}

				.form-textarea {
					height: 160rpx;
					resize: none;
				}

				.picker {
					padding: 24rpx;
					border: 2rpx solid #E5E7EB;
					border-radius: 16rpx;
					font-size: 28rpx;
					color: #1F2937;
					background: #F9FAFB;
				}
			}
		}

		.modal-footer {
			display: flex;
			justify-content: flex-end;
			gap: 24rpx;
			padding: 32rpx;
			border-top: 2rpx solid #E5E7EB;

			.cancel-btn,
			.confirm-btn {
				padding: 24rpx 32rpx;
				border-radius: 16rpx;
				font-size: 28rpx;
				font-weight: 500;
				cursor: pointer;
				transition: all 0.2s;
			}

			.cancel-btn {
				background: #F3F4F6;
				color: #6B7280;
				border: none;

				&:hover {
					background: #E5E7EB;
				}
			}

			.confirm-btn {
				background: #007AFF;
				color: white;
				border: none;

				&:hover {
					background: #1D4ED8;
				}
			}
		}
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

.dark-theme .modal-content {
	background: #1F1F1F;

	.modal-header {
		border-bottom: 2rpx solid #3D3D3D;

		.modal-title {
			color: #E0E0E0;
		}

		.close-btn {
			color: #808080;

			&:hover {
				color: #A0A0A0;
			}
		}
	}

	.form-label {
		color: #E0E0E0;
	}

	.form-input,
	.form-textarea,
	.picker {
		border: 2rpx solid #3D3D3D;
		background: #2D2D2D;
		color: #E0E0E0;

		&:focus {
			border-color: #6366F1;
		}
	}

	.modal-footer {
		border-top: 2rpx solid #3D3D3D;
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