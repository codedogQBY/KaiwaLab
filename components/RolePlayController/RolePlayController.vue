<template>
	<view class="roleplay-controller">
		<!-- 角色选择区域 -->
		<view class="role-section">
			<view class="section-header">
				<text class="section-title">角色设定</text>
				<view class="role-switch" @click="toggleRole">
					<text class="switch-text">切换角色</text>
					<text class="fas fa-exchange-alt"></text>
				</view>
			</view>
			
			<view class="roles-container">
				<!-- 用户角色 -->
				<view class="role-card" :class="{ 'active': currentRole === 'user' }">
					<view class="role-avatar user-avatar">
						<text class="fas fa-user"></text>
					</view>
					<view class="role-info">
						<text class="role-name">{{ userRole.name }}</text>
						<text class="role-description">{{ userRole.description }}</text>
					</view>
					<view class="role-status" v-if="currentRole === 'user'">
						<text class="status-text">当前角色</text>
					</view>
				</view>
				
				<!-- AI角色 -->
				<view class="role-card" :class="{ 'active': currentRole === 'ai' }">
					<view class="role-avatar ai-avatar">
						<text class="fas fa-robot"></text>
					</view>
					<view class="role-info">
						<text class="role-name">{{ aiRole.name }}</text>
						<text class="role-description">{{ aiRole.description }}</text>
					</view>
					<view class="role-status" v-if="currentRole === 'ai'">
						<text class="status-text">当前角色</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 场景设置 -->
		<view class="scenario-section">
			<view class="section-header">
				<text class="section-title">对话场景</text>
				<view class="current-scenario">
					<text class="current-scenario-text">{{ currentScenario.name }}</text>
				</view>
			</view>
			
			<!-- 场景卡片选择 -->
			<scroll-view class="scenarios-scroll" scroll-x="true" show-scrollbar="false">
				<view class="scenarios-container">
					<view 
						v-for="scenario in scenarios" 
						:key="scenario.id"
						class="scenario-card"
						:class="{ 'active': scenario.id === currentScenario.id }"
						@click="selectScenario(scenario)"
					>
						<view class="card-icon">
							<text :class="scenario.icon"></text>
						</view>
						<text class="card-name">{{ scenario.name }}</text>
						<text class="card-desc">{{ scenario.description }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 语音交互设置 -->
		<view class="voice-settings">
			<view class="section-header">
				<text class="section-title">语音设置</text>
			</view>
			
			<view class="settings-grid">
				<!-- 自动播放 -->
				<view class="setting-item">
					<view class="setting-info">
						<text class="setting-name">自动播放AI语音</text>
						<text class="setting-desc">AI回复时自动播放语音</text>
					</view>
					<ToggleSwitch :value="settings.autoPlay" @change="(val) => toggleSetting('autoPlay')" />
				</view>
				
				<!-- 实时评分 -->
				<view class="setting-item">
					<view class="setting-info">
						<text class="setting-name">实时发音评分</text>
						<text class="setting-desc">录音后立即显示发音评分</text>
					</view>
					<ToggleSwitch :value="settings.realTimeScore" @change="(val) => toggleSetting('realTimeScore')" />
				</view>
				
				<!-- 语音提示 -->
				<view class="setting-item">
					<view class="setting-info">
						<text class="setting-name">发音纠正提示</text>
						<text class="setting-desc">发音错误时给出语音提示</text>
					</view>
					<ToggleSwitch :value="settings.voiceCorrection" @change="(val) => toggleSetting('voiceCorrection')" />
				</view>
			</view>
		</view>
		
		<!-- 对话模式选择 -->
		<view class="mode-section">
			<view class="section-header">
				<text class="section-title">对话模式</text>
			</view>
			
			<view class="mode-tabs">
				<view 
					class="mode-tab" 
					:class="{ 'active': currentMode === 'free' }"
					@click="setMode('free')"
				>
					<text class="tab-text">自由对话</text>
				</view>
				<view 
					class="mode-tab" 
					:class="{ 'active': currentMode === 'guided' }"
					@click="setMode('guided')"
				>
					<text class="tab-text">引导对话</text>
				</view>
				<view 
					class="mode-tab" 
					:class="{ 'active': currentMode === 'practice' }"
					@click="setMode('practice')"
				>
					<text class="tab-text">发音练习</text>
				</view>
			</view>
			
			<view class="mode-description">
				<text class="description-text">{{ getModeDescription(currentMode) }}</text>
			</view>
		</view>
		

	</view>
</template>

<script>
import ToggleSwitch from '@/components/ToggleSwitch.vue'

export default {
	name: 'RolePlayController',
	components: {
		ToggleSwitch
	},
	props: {
		initialRole: {
			type: String,
			default: 'user'
		},
		initialScenario: {
			type: String,
			default: 'restaurant'
		},
		// 初始模式
		initialMode: {
			type: String,
			default: 'free'
		}
	},
	data() {
		return {
			currentRole: this.initialRole,
			currentMode: this.initialMode,
			currentScenarioId: this.initialScenario,
			
			// 角色定义
			userRole: {
				name: '学习者',
				description: '正在学习日语的用户'
			},
			aiRole: {
				name: 'AI老师',
				description: '专业的日语教学助手'
			},
			
			// 场景列表
			scenarios: [
				{
					id: 'restaurant',
					name: '餐厅用餐',
					description: '在日本餐厅点餐和用餐的场景',
					icon: 'fas fa-utensils'
				},
				{
					id: 'shopping',
					name: '购物消费',
					description: '在商店购买商品的场景',
					icon: 'fas fa-shopping-cart'
				},
				{
					id: 'travel',
					name: '旅游观光',
					description: '旅游时问路和观光的场景',
					icon: 'fas fa-map-marked-alt'
				},
				{
					id: 'hotel',
					name: '酒店住宿',
					description: '酒店入住和服务的场景',
					icon: 'fas fa-bed'
				},
				{
					id: 'business',
					name: '商务会谈',
					description: '商务场合的正式对话',
					icon: 'fas fa-briefcase'
				},
				{
					id: 'daily',
					name: '日常交流',
					description: '朋友间的日常对话',
					icon: 'fas fa-comments'
				}
			],
			
			// 语音设置
			settings: {
				autoPlay: true,
				realTimeScore: true,
				voiceCorrection: true
			}
		}
	},
	computed: {
		// 当前场景
		currentScenario() {
			return this.scenarios.find(s => s.id === this.currentScenarioId) || this.scenarios[0]
		}
	},
	methods: {
		// 切换角色
		toggleRole() {
			this.currentRole = this.currentRole === 'user' ? 'ai' : 'user'
			this.$emit('role-change', this.currentRole)
		},
		
		// 设置对话模式
		setMode(mode) {
			this.currentMode = mode
			this.$emit('mode-change', mode)
		},
		
		// 获取模式描述
		getModeDescription(mode) {
			const descriptions = {
				free: '自由进行对话，AI会根据场景给出自然回应',
				guided: 'AI会引导对话方向，帮助学习特定表达',
				practice: '专注于发音练习，AI会重点纠正发音问题'
			}
			return descriptions[mode] || ''
		},
		
		// 切换设置
		toggleSetting(key) {
			this.settings[key] = !this.settings[key]
			this.$emit('setting-change', { key, value: this.settings[key] })
		},
		
		// 选择场景
		selectScenario(scenario) {
			this.currentScenarioId = scenario.id
			this.$emit('scenario-change', scenario)
		}
	},
	emits: ['role-change', 'mode-change', 'setting-change', 'scenario-change']
}
</script>

<style lang="scss" scoped>
.roleplay-controller {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
	padding: 32rpx;
	background-color: #F9FAFB;
	border-radius: 24rpx;
}

/* 暗黑模式样式 */
.dark-theme .roleplay-controller {
	background-color: #1F1F1F;
}

/* 通用样式 */
.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1F2937;
}

/* 暗黑模式样式 */
.dark-theme .section-title {
	color: #E0E0E0;
}

.current-scenario {
	padding: 8rpx 16rpx;
	background-color: #EFF6FF;
	border-radius: 12rpx;
	border: 1rpx solid #DBEAFE;
}

/* 暗黑模式样式 */
.dark-theme .current-scenario {
	background-color: #2D2D2D;
	border-color: #3D3D3D;
}

.current-scenario-text {
	font-size: 24rpx;
	font-weight: 500;
	color: #1D4ED8;
}

/* 暗黑模式样式 */
.dark-theme .current-scenario-text {
	color: #6366F1;
}

/* 角色部分 */
.role-section {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 32rpx;
	border: 1rpx solid #E5E7EB;
}

/* 暗黑模式样式 */
.dark-theme .role-section {
	background-color: #1F1F1F;
	border-color: #3D3D3D;
}

.role-switch {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 12rpx 20rpx;
	background-color: #EFF6FF;
	color: #2563EB;
	border-radius: 12rpx;
	transition: all 0.2s ease;
	
	&:active {
		background-color: #DBEAFE;
	}
}

/* 暗黑模式样式 */
.dark-theme .role-switch {
	background-color: #2D2D2D;
	color: #6366F1;
	
	&:active {
		background-color: #3D3D3D;
	}
}

.switch-text {
	font-size: 26rpx;
	font-weight: 500;
}

.roles-container {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.role-card {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 24rpx;
	background-color: #F9FAFB;
	border-radius: 16rpx;
	border: 2rpx solid transparent;
	transition: all 0.2s ease;
	
	&.active {
		background-color: #EFF6FF;
		border-color: #2563EB;
	}
}

/* 暗黑模式样式 */
.dark-theme .role-card {
	background-color: #2D2D2D;
	
	&.active {
		background-color: #2D2D2D;
		border-color: #6366F1;
	}
}

.role-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	
	&.user-avatar {
		background-color: #DBEAFE;
		color: #2563EB;
	}
	
	&.ai-avatar {
		background-color: #D1FAE5;
		color: #10B981;
	}
}

.role-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.role-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #1F2937;
}

/* 暗黑模式样式 */
.dark-theme .role-name {
	color: #E0E0E0;
}

.role-description {
	font-size: 26rpx;
	color: #6B7280;
	line-height: 1.4;
}

/* 暗黑模式样式 */
.dark-theme .role-description {
	color: #A0A0A0;
}

.role-status {
	padding: 8rpx 16rpx;
	background-color: #10B981;
	color: white;
	border-radius: 12rpx;
}

/* 暗黑模式样式 */
.dark-theme .role-status {
	background-color: #10B981;
	color: #FFFFFF;
}

.status-text {
	font-size: 24rpx;
	font-weight: 500;
}

/* 场景部分 */
.scenario-section {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 32rpx;
	border: 1rpx solid #E5E7EB;
}

/* 暗黑模式样式 */
.dark-theme .scenario-section {
	background-color: #1F1F1F;
	border-color: #3D3D3D;
}

/* 场景卡片选择 */
.scenarios-scroll {
	width: 100%;
	white-space: nowrap;
}

.scenarios-container {
	display: flex;
	gap: 16rpx;
	padding: 8rpx 0;
}

.scenario-card {
	min-width: 200rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	background-color: #F9FAFB;
	border: 2rpx solid #E5E7EB;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	transition: all 0.2s ease;
	cursor: pointer;
	
	&:active {
		transform: scale(0.98);
	}
	
	&.active {
		background-color: #EFF6FF;
		border-color: #2563EB;
		
		.card-icon {
			background-color: #2563EB;
			color: white;
		}
		
		.card-name {
			color: #2563EB;
			font-weight: 600;
		}
	}
}

/* 暗黑模式样式 */
.dark-theme .scenario-card {
	background-color: #2D2D2D;
	border-color: #3D3D3D;
	
	&.active {
		background-color: #2D2D2D;
		border-color: #6366F1;
		
		.card-icon {
			background-color: #6366F1;
			color: #FFFFFF;
		}
		
		.card-name {
			color: #6366F1;
		}
	}
}

.card-icon {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background-color: #E5E7EB;
	color: #6B7280;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	transition: all 0.2s ease;
}

/* 暗黑模式样式 */
.dark-theme .card-icon {
	background-color: #3D3D3D;
	color: #A0A0A0;
}

.card-name {
	font-size: 26rpx;
	font-weight: 500;
	color: #1F2937;
	text-align: center;
	transition: all 0.2s ease;
}

/* 暗黑模式样式 */
.dark-theme .card-name {
	color: #E0E0E0;
}

.card-desc {
	font-size: 22rpx;
	color: #6B7280;
	text-align: center;
	line-height: 1.3;
	max-width: 180rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* 暗黑模式样式 */
.dark-theme .card-desc {
	color: #A0A0A0;
}

/* 语音设置 */
.voice-settings {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 32rpx;
	border: 1rpx solid #E5E7EB;
}

/* 暗黑模式样式 */
.dark-theme .voice-settings {
	background-color: #1F1F1F;
	border-color: #3D3D3D;
}

.settings-grid {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.setting-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
}

.setting-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.setting-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #1F2937;
}

/* 暗黑模式样式 */
.dark-theme .setting-name {
	color: #E0E0E0;
}

.setting-desc {
	font-size: 24rpx;
	color: #6B7280;
	line-height: 1.4;
}

/* 暗黑模式样式 */
.dark-theme .setting-desc {
	color: #A0A0A0;
}



/* 模式部分 */
.mode-section {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 32rpx;
	border: 1rpx solid #E5E7EB;
}

/* 暗黑模式样式 */
.dark-theme .mode-section {
	background-color: #1F1F1F;
	border-color: #3D3D3D;
}

.mode-tabs {
	display: flex;
	background-color: #F3F4F6;
	border-radius: 16rpx;
	padding: 8rpx;
	margin-bottom: 20rpx;
}

/* 暗黑模式样式 */
.dark-theme .mode-tabs {
	background-color: #2D2D2D;
}

.mode-tab {
	flex: 1;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12rpx;
	transition: all 0.2s ease;
	
	&.active {
		background-color: #2563EB;
		color: white;
	}
}

/* 暗黑模式样式 */
.dark-theme .mode-tab {
	&.active {
		background-color: #6366F1;
		color: #FFFFFF;
	}
}

.tab-text {
	font-size: 26rpx;
	font-weight: 500;
}

.mode-description {
	padding: 20rpx;
	background-color: #F9FAFB;
	border-radius: 12rpx;
}

/* 暗黑模式样式 */
.dark-theme .mode-description {
	background-color: #2D2D2D;
}

.description-text {
	font-size: 26rpx;
	color: #6B7280;
	line-height: 1.5;
}

/* 暗黑模式样式 */
.dark-theme .description-text {
	color: #A0A0A0;
}


</style>