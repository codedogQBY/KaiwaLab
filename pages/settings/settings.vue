<template>
	<view class="settings-page">
		<!-- 设置中心页面 -->
		<view class="settings-container">
			<!-- 标题栏 -->
			<view class="header">
				<view class="header-content">
					<text class="back-btn fa fa-arrow-left" @click="goBack"></text>
					<text class="header-title">设置</text>
					<view class="header-placeholder"></view>
				</view>
			</view>

			<!-- 学习设置 -->
			<view class="menu-group" style="margin-top: 32rpx;">
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
						<ToggleSwitch :value="settings.learningReminder" @change="(val) => toggleSetting('learningReminder', val)" />
					</view>
					
					<view class="menu-item">
						<view class="icon-container secondary">
							<text class="fa fa-volume-up"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">语音播放</text>
							<text class="menu-subtitle">自动播放日语发音</text>
						</view>
						<ToggleSwitch :value="settings.voicePlay" @change="(val) => toggleSetting('voicePlay', val)" />
					</view>
					
					<view class="menu-item last">
						<view class="icon-container accent">
							<text class="fa fa-microphone"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">发音评估</text>
							<text class="menu-subtitle">实时发音纠正</text>
						</view>
						<ToggleSwitch :value="settings.pronunciationAssessment" @change="(val) => toggleSetting('pronunciationAssessment', val)" />
					</view>
				</view>
			</view>

			<!-- 应用设置 -->
			<view class="menu-group">
				<text class="group-title">应用设置</text>
				<view class="menu-card">
					<view class="menu-item" @click="showThemePopup">
						<view class="icon-container purple">
							<text class="fa fa-palette"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">主题设置</text>
							<text class="menu-subtitle">{{ getThemeName(currentTheme) }}</text>
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

			<!-- 账户与隐私 -->
			<view class="menu-group">
				<text class="group-title">账户与隐私</text>
				<view class="menu-card">
	
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
					
					<view class="menu-item last" @click="logout">
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
						<view class="icon-container accent">
							<text class="fa fa-comment"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">意见反馈</text>
							<text class="menu-subtitle">提交建议和问题</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
					
					<view class="menu-item last" @click="goToAbout">
						<view class="icon-container purple">
							<text class="fa fa-info-circle"></text>
						</view>
						<view class="menu-content">
							<text class="menu-title">关于会話Lab</text>
							<text class="menu-subtitle">版本信息和更新</text>
						</view>
						<text class="menu-arrow fa fa-chevron-right"></text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 主题选择弹出层 - 实验室风格 -->
		<uni-popup ref="themePopup" type="bottom" :mask-click="true">
			<view class="theme-popup">
				<!-- 实验室装饰背景 -->
				<view class="lab-decoration">
					<view class="test-tube-decoration left">
						<view class="test-tube-fill" style="height: 60%; background: linear-gradient(180deg, #3B82F6, #2563EB);"></view>
					</view>
					<view class="test-tube-decoration right">
						<view class="test-tube-fill" style="height: 40%; background: linear-gradient(180deg, #F97316, #EA580C);"></view>
					</view>
				</view>
				
				<view class="popup-header">
					<view class="popup-title-container">
						<text class="fa fa-flask popup-icon"></text>
						<view class="popup-title">实验室主题</view>
					</view>
					<text class="fa fa-times popup-close" @click="closeThemePopup"></text>
				</view>
				
				<view class="theme-subtitle"></view>
				
				<view class="theme-options">
					<view class="theme-option" :class="{active: currentTheme === 'light'}" @click="selectTheme('light')">
						<view class="theme-preview-container">
							<view class="theme-preview light">
								<view class="preview-elements">
									<view class="preview-header"></view>
									<view class="preview-content">
										<view class="preview-card"></view>
										<view class="preview-card small"></view>
									</view>
								</view>
							</view>
							<view class="theme-glow light-glow"></view>
						</view>
						<view class="theme-info">
							<view class="theme-name">
								<text class="fa fa-sun-o theme-icon"></text>
								明亮实验室
							</view>
							<view class="theme-desc">清晰明亮的实验环境，适合日间研究</view>
						</view>
						<view class="theme-check-container" v-if="currentTheme === 'light'">
							<text class="fa fa-check-circle theme-check"></text>
						</view>
					</view>
					
					<view class="theme-option" :class="{active: currentTheme === 'dark'}" @click="selectTheme('dark')">
						<view class="theme-preview-container">
							<view class="theme-preview dark">
								<view class="preview-elements">
									<view class="preview-header dark"></view>
									<view class="preview-content">
										<view class="preview-card dark"></view>
										<view class="preview-card small dark"></view>
									</view>
								</view>
							</view>
							<view class="theme-glow dark-glow"></view>
						</view>
						<view class="theme-info">
							<view class="theme-name">
								<text class="fa fa-moon-o theme-icon"></text>
								深色实验室
							</view>
							<view class="theme-desc">专注沉浸的暗色环境，护眼且专业</view>
						</view>
						<view class="theme-check-container" v-if="currentTheme === 'dark'">
							<text class="fa fa-check-circle theme-check"></text>
						</view>
					</view>
					
					<view class="theme-option" :class="{active: currentTheme === 'system'}" @click="selectTheme('system')">
						<view class="theme-preview-container">
							<view class="theme-preview system">
								<view class="preview-elements split">
									<view class="preview-half light">
										<view class="preview-header"></view>
										<view class="preview-card mini"></view>
									</view>
									<view class="preview-half dark">
										<view class="preview-header dark"></view>
										<view class="preview-card mini dark"></view>
									</view>
								</view>
							</view>
							<view class="theme-glow system-glow"></view>
						</view>
						<view class="theme-info">
							<view class="theme-name">
								<text class="fa fa-magic theme-icon"></text>
								智能适配
							</view>
							<view class="theme-desc">根据系统设置自动调节实验室环境</view>
						</view>
						<view class="theme-check-container" v-if="currentTheme === 'system'">
							<text class="fa fa-check-circle theme-check"></text>
						</view>
					</view>
				</view>
				
				<view class="experiment-note">
					<text class="fa fa-lightbulb-o note-icon"></text>
					<text class="note-text">实验提示：主题切换将立即生效，为你创造最佳的学习环境</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import ToggleSwitch from '@/components/ToggleSwitch.vue'

export default {
	name: 'Settings',
	components: {
		ToggleSwitch
	},
	data() {
		return {
			settings: {
				learningReminder: true,
				voicePlay: true,
				pronunciationAssessment: false
			},
			currentTheme: 'light'
		}
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		toggleSetting(key, value) {
			this.settings[key] = value
			// 保存设置到本地存储
			uni.setStorageSync('settings', this.settings)
		},
		showThemePopup() {
				this.$refs.themePopup.open();
			},
			
			closeThemePopup() {
				this.$refs.themePopup.close();
			},
			
			selectTheme(theme) {
				this.currentTheme = theme;
				uni.setStorageSync('theme', theme);
				
				// 立即应用主题
				const app = getApp();
				if (app && app.applyTheme) {
					app.applyTheme(theme);
				}
				
				uni.showToast({
					title: '主题已切换',
					icon: 'success'
				});
				
				this.closeThemePopup();
			},
		goToLanguage() {
			uni.navigateTo({
				url: '/pages/language/language'
			})
		},
		goToDownload() {
			uni.navigateTo({
				url: '/pages/download/download'
			})
		},
		
		goToPrivacy() {
			uni.navigateTo({
				url: '/pages/privacy/privacy'
			})
		},
		goToHelp() {
			uni.navigateTo({
				url: '/pages/help/help'
			})
		},
		goToFeedback() {
			uni.navigateTo({
				url: '/pages/feedback/feedback'
			})
		},
		goToAbout() {
			uni.navigateTo({
				url: '/pages/about/about'
			})
		},
		logout() {
			uni.showModal({
				title: '确认退出',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除用户数据
						uni.removeStorageSync('userInfo')
						uni.removeStorageSync('token')
						// 跳转到登录页
						uni.reLaunch({
							url: '/pages/login/login'
						})
					}
				}
			})
		},
		getThemeName(theme) {
			switch(theme) {
				case 'light': return '浅色模式'
				case 'dark': return '深色模式'
				case 'system': return '跟随系统'
				default: return '浅色模式'
			}
		}
	},
	onLoad() {
		// 从本地存储加载设置
		const savedSettings = uni.getStorageSync('settings')
		if (savedSettings) {
			this.settings = { ...this.settings, ...savedSettings }
		}
		// 加载主题设置
		const savedTheme = uni.getStorageSync('theme')
		if (savedTheme) {
			this.currentTheme = savedTheme
		}
	},
	onShow() {
		// 页面显示时刷新主题设置
		const savedTheme = uni.getStorageSync('theme')
		if (savedTheme) {
			this.currentTheme = savedTheme
		}
	}
}
</script>

<style scoped>
.settings-page {
	background: #ffffff;
	min-height: 100vh;
}

.settings-container {
	padding: 0 0 32rpx 0;
}

.header {
	padding: 32rpx;
	border-bottom: 1rpx solid #e2e8f0;
	background: #ffffff;
	position: sticky;
	top: 0;
	z-index: 10;
}

.header-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0;
}

.back-btn {
	font-size: 36rpx;
	color: #6b7280;
	cursor: pointer;
	transition: color 0.3s ease;
}

.back-btn:hover {
	color: #667eea;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1f2937;
	flex: 1;
	text-align: center;
}

.header-placeholder {
	width: 36rpx;
}

.menu-group {
	margin-bottom: 48rpx;
	padding: 0 32rpx;
}

.group-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #6b7280;
	margin-bottom: 24rpx;
	display: block;
}

.menu-card {
	background: #ffffff;
	border: 1rpx solid #e2e8f0;
	border-radius: 24rpx;
	overflow: hidden;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 32rpx;
	border-bottom: 1rpx solid #e2e8f0;
	transition: background-color 0.3s ease;
}

.menu-item:hover {
	background-color: #f8fafc;
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

.icon-container.primary {
	background: rgba(102, 126, 234, 0.1);
}

.icon-container.secondary {
	background: rgba(240, 147, 251, 0.1);
}

.icon-container.accent {
	background: rgba(79, 172, 254, 0.1);
}

.icon-container.purple {
	background: rgba(168, 85, 247, 0.1);
}

.icon-container.blue {
	background: rgba(59, 130, 246, 0.1);
}

.icon-container.green {
	background: rgba(34, 197, 94, 0.1);
}

.icon-container.yellow {
	background: rgba(251, 191, 36, 0.1);
}

.icon-container.red {
	background: rgba(239, 68, 68, 0.1);
}

.icon-container.gray {
	background: rgba(107, 114, 128, 0.1);
}

.icon-container text {
	font-size: 32rpx;
}

.icon-container.primary text {
	color: #667eea;
}

.icon-container.secondary text {
	color: #f093fb;
}

.icon-container.accent text {
	color: #4facfe;
}

.icon-container.purple text {
	color: #a855f7;
}

.icon-container.blue text {
	color: #3b82f6;
}

.icon-container.green text {
	color: #22c55e;
}

.icon-container.yellow text {
	color: #fbbf24;
}

.icon-container.red text {
	color: #ef4444;
}

.icon-container.gray text {
	color: #6b7280;
}

.menu-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.menu-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #1f2937;
	margin-bottom: 8rpx;
}

.menu-subtitle {
	font-size: 24rpx;
	color: #6b7280;
	line-height: 1.4;
}

.menu-arrow {
	font-size: 24rpx;
	color: #9ca3af;
	margin-left: 20rpx;
}

/* 深色主题样式 */
/* #ifdef H5 */
:global(.dark-theme) .settings-page {
	background-color: #111827;
}

:global(.dark-theme) .header {
	background-color: #1f2937;
	border-bottom-color: #374151;
}

:global(.dark-theme) .header-title {
	color: #f9fafb;
}

:global(.dark-theme) .back-btn {
	color: #9ca3af;
}

:global(.dark-theme) .back-btn:hover {
	color: #667eea;
}

:global(.dark-theme) .group-title {
	color: #9ca3af;
}

:global(.dark-theme) .menu-card {
	background-color: #1f2937;
	border-color: #374151;
}

:global(.dark-theme) .menu-item {
	border-bottom-color: #374151;
}

:global(.dark-theme) .menu-item:hover {
	background-color: #374151;
}

:global(.dark-theme) .menu-title {
	color: #f9fafb;
}

:global(.dark-theme) .menu-subtitle {
	color: #9ca3af;
}

:global(.dark-theme) .menu-arrow {
		color: #6b7280;
	}
	/* #endif */
	
	/* 主题弹出层样式 - 实验室风格 */
	.theme-popup {
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		border-radius: 24rpx 24rpx 0 0;
		padding: 0;
		max-height: 85vh;
		position: relative;
		overflow: hidden;
	}
	
	/* 实验室装饰元素 */
	.lab-decoration {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		background: linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #F97316 100%);
		opacity: 0.1;
		z-index: 0;
	}
	
	.test-tube-decoration {
		position: absolute;
		top: 20rpx;
		width: 20rpx;
		height: 60rpx;
		border: 2rpx solid rgba(37, 99, 235, 0.3);
		border-radius: 4rpx 4rpx 12rpx 12rpx;
		overflow: hidden;
	}
	
	.test-tube-decoration.left {
		left: 40rpx;
	}
	
	.test-tube-decoration.right {
		right: 40rpx;
	}
	
	.test-tube-fill {
		position: absolute;
		bottom: 0;
		width: 100%;
		transition: height 0.5s ease;
	}
	
	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40rpx 40rpx 20rpx;
		position: relative;
		z-index: 1;
	}
	
	.popup-title-container {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}
	
	.popup-icon {
		font-size: 32rpx;
		color: #2563EB;
	}
	
	.popup-title {
		font-size: 36rpx;
		font-weight: 700;
		color: #1f2937;
		letter-spacing: 0.5rpx;
	}
	
	.popup-close {
		font-size: 28rpx;
		color: #6b7280;
		padding: 12rpx;
		border-radius: 50%;
		transition: all 0.2s ease;
	}
	
	.popup-close:hover {
		background-color: #f3f4f6;
		color: #374151;
	}
	
	.theme-subtitle {
		font-size: 28rpx;
		color: #6b7280;
		text-align: center;
		margin: 0 40rpx 40rpx;
		position: relative;
		z-index: 1;
	}
	
	.theme-options {
		padding: 0 30rpx;
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		position: relative;
		z-index: 1;
	}
	
	.theme-option {
		display: flex;
		align-items: center;
		padding: 24rpx;
		border-radius: 20rpx;
		border: 2rpx solid #e5e7eb;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(10rpx);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}
	
	.theme-option:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 8rpx 25rpx rgba(37, 99, 235, 0.15);
	}
	
	.theme-option.active {
		border-color: #2563EB;
		background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
		box-shadow: 0 8rpx 25rpx rgba(37, 99, 235, 0.2);
	}
	
	.theme-option:active {
		transform: scale(0.98);
	}
	
	.theme-preview-container {
		position: relative;
		margin-right: 24rpx;
	}
	
	.theme-preview {
		width: 100rpx;
		height: 100rpx;
		border-radius: 16rpx;
		border: 2rpx solid #e5e7eb;
		overflow: hidden;
		position: relative;
		background: #ffffff;
	}
	
	.theme-preview.dark {
		background: #111827;
		border-color: #374151;
	}
	
	.theme-preview.system {
		background: linear-gradient(45deg, #ffffff 50%, #111827 50%);
	}
	
	.preview-elements {
		padding: 12rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}
	
	.preview-elements.split {
		padding: 0;
		flex-direction: row;
		gap: 0;
	}
	
	.preview-half {
		flex: 1;
		padding: 8rpx;
		display: flex;
		flex-direction: column;
		gap: 4rpx;
	}
	
	.preview-half.light {
		background: #ffffff;
	}
	
	.preview-half.dark {
		background: #111827;
	}
	
	.preview-header {
		height: 16rpx;
		background: #2563EB;
		border-radius: 4rpx;
		opacity: 0.8;
	}
	
	.preview-header.dark {
		background: #3B82F6;
	}
	
	.preview-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4rpx;
	}
	
	.preview-card {
		height: 20rpx;
		background: #f3f4f6;
		border-radius: 4rpx;
	}
	
	.preview-card.small {
		height: 12rpx;
		opacity: 0.7;
	}
	
	.preview-card.mini {
		height: 8rpx;
	}
	
	.preview-card.dark {
		background: #374151;
	}
	
	.theme-glow {
		position: absolute;
		top: -10rpx;
		left: -10rpx;
		right: -10rpx;
		bottom: -10rpx;
		border-radius: 20rpx;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}
	
	.theme-option.active .theme-glow {
		opacity: 1;
	}
	
	.light-glow {
		background: radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%);
	}
	
	.dark-glow {
		background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
	}
	
	.system-glow {
		background: radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%);
	}
	
	.theme-info {
		flex: 1;
	}
	
	.theme-name {
		font-size: 32rpx;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 8rpx;
		display: flex;
		align-items: center;
		gap: 12rpx;
	}
	
	.theme-icon {
		font-size: 28rpx;
		color: #2563EB;
	}
	
	.theme-desc {
		font-size: 24rpx;
		color: #6b7280;
		line-height: 1.4;
	}
	
	.theme-check-container {
		position: relative;
	}
	
	.theme-check {
		font-size: 36rpx;
		color: #10B981;
		animation: checkPulse 0.6s ease-out;
	}
	
	@keyframes checkPulse {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
	
	.experiment-note {
		margin: 40rpx 30rpx 30rpx;
		padding: 24rpx;
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
		border: 1rpx solid rgba(16, 185, 129, 0.2);
		border-radius: 16rpx;
		display: flex;
		align-items: flex-start;
		gap: 16rpx;
		position: relative;
		z-index: 1;
	}
	
	.note-icon {
		font-size: 28rpx;
		color: #10B981;
		margin-top: 2rpx;
	}
	
	.note-text {
		font-size: 24rpx;
		color: #374151;
		line-height: 1.5;
		flex: 1;
	}
	
	/* 深色主题下的弹出层样式 - 实验室风格 */
	/* #ifdef H5 */
	:global(.dark-theme) .theme-popup {
		background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
	}
	
	:global(.dark-theme) .lab-decoration {
		background: linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #F97316 100%);
		opacity: 0.15;
	}
	
	:global(.dark-theme) .test-tube-decoration {
		border-color: rgba(59, 130, 246, 0.4);
	}
	
	:global(.dark-theme) .popup-title {
		color: #f9fafb;
	}
	
	:global(.dark-theme) .popup-icon {
		color: #3B82F6;
	}
	
	:global(.dark-theme) .popup-close {
		color: #9ca3af;
	}
	
	:global(.dark-theme) .popup-close:hover {
		background-color: #374151;
		color: #d1d5db;
	}
	
	:global(.dark-theme) .theme-subtitle {
		color: #9ca3af;
	}
	
	:global(.dark-theme) .theme-option {
		border-color: #374151;
		background: rgba(31, 41, 55, 0.8);
	}
	
	:global(.dark-theme) .theme-option:hover {
		box-shadow: 0 8rpx 25rpx rgba(59, 130, 246, 0.2);
	}
	
	:global(.dark-theme) .theme-option.active {
		border-color: #3B82F6;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
		box-shadow: 0 8rpx 25rpx rgba(59, 130, 246, 0.25);
	}
	
	:global(.dark-theme) .theme-preview {
		border-color: #4b5563;
	}
	
	:global(.dark-theme) .theme-name {
		color: #f9fafb;
	}
	
	:global(.dark-theme) .theme-icon {
		color: #3B82F6;
	}
	
	:global(.dark-theme) .theme-desc {
		color: #9ca3af;
	}
	
	:global(.dark-theme) .preview-header {
		background: #3B82F6;
	}
	
	:global(.dark-theme) .preview-card {
		background: #374151;
	}
	
	:global(.dark-theme) .experiment-note {
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%);
		border-color: rgba(16, 185, 129, 0.3);
	}
	
	:global(.dark-theme) .note-text {
		color: #d1d5db;
	}
	/* #endif */
</style>