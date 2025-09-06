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
			}
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
		goToTheme() {
			uni.navigateTo({
				url: '/pages/theme/theme'
			})
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
		}
	},
	onLoad() {
		// 从本地存储加载设置
		const savedSettings = uni.getStorageSync('settings')
		if (savedSettings) {
			this.settings = { ...this.settings, ...savedSettings }
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
</style>