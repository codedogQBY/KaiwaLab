<template>
	<view class="profile-edit-container">
		<!-- 导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: (statusBarHeight + 16) + 'px' }">
			<view class="nav-left" @click="goBack">
				<text class="fa fa-arrow-left"></text>
			</view>
			<view class="nav-title">基本信息</view>
			<view class="nav-right" @click="saveProfile">
				<text class="save-btn">保存</text>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content">
			<!-- 实验室装饰 -->
			<view class="test-tube-decoration">
				<view class="test-tube">
					<view class="test-tube-fill"></view>
				</view>
			</view>

			<!-- 头像上传 -->
			<view class="avatar-section">
				<view class="avatar-upload" @click="uploadAvatar">
					<view class="avatar-container">
						<text class="fa fa-user"></text>
						<view class="avatar-overlay">
							<text class="fa fa-camera"></text>
						</view>
					</view>
				</view>
				<text class="avatar-tip">点击更换头像</text>
			</view>

			<!-- 表单区域 -->
			<view class="form-section">
				<!-- 昵称 -->
				<view class="edit-field">
					<view class="field-label">
						<text class="fa fa-user field-icon"></text>
						<text class="label-text">昵称</text>
					</view>
					<input 
						v-model="userInfo.nickname" 
						class="field-input" 
						placeholder="请输入昵称"
						maxlength="20"
					/>
				</view>

				<!-- 性别 -->
				<view class="edit-field">
					<view class="field-label">
						<text class="fa fa-venus-mars field-icon"></text>
						<text class="label-text">性别</text>
					</view>
					<view class="radio-group">
						<label class="radio-item" @click="selectGender('male')">
							<view class="radio-circle" :class="{active: userInfo.gender === 'male'}">
								<view class="radio-dot" v-if="userInfo.gender === 'male'"></view>
							</view>
							<text class="radio-text">男</text>
						</label>
						<label class="radio-item" @click="selectGender('female')">
							<view class="radio-circle" :class="{active: userInfo.gender === 'female'}">
								<view class="radio-dot" v-if="userInfo.gender === 'female'"></view>
							</view>
							<text class="radio-text">女</text>
						</label>
						<label class="radio-item" @click="selectGender('other')">
							<view class="radio-circle" :class="{active: userInfo.gender === 'other'}">
								<view class="radio-dot" v-if="userInfo.gender === 'other'"></view>
							</view>
							<text class="radio-text">其他</text>
						</label>
					</view>
				</view>

				<!-- 生日 -->
				<view class="edit-field">
					<view class="field-label">
						<text class="fa fa-birthday-cake field-icon"></text>
						<text class="label-text">生日</text>
					</view>
					<picker 
						mode="date" 
						:value="userInfo.birthday" 
						@change="onBirthdayChange"
						class="field-picker"
					>
						<view class="picker-content">
							<text class="picker-text">{{ userInfo.birthday || '请选择生日' }}</text>
							<text class="fa fa-chevron-right picker-arrow"></text>
						</view>
					</picker>
				</view>

				<!-- 所在地 -->
				<view class="edit-field">
					<view class="field-label">
						<text class="fa fa-map-marker field-icon"></text>
						<text class="label-text">所在地</text>
					</view>
					<picker 
						:range="cityList" 
						:value="cityIndex" 
						@change="onCityChange"
						class="field-picker"
					>
						<view class="picker-content">
							<text class="picker-text">{{ userInfo.city || '请选择所在地' }}</text>
							<text class="fa fa-chevron-right picker-arrow"></text>
						</view>
					</picker>
				</view>

				<!-- 手机号 -->
				<view class="edit-field">
					<view class="field-label">
						<text class="fa fa-phone field-icon"></text>
						<text class="label-text">手机号</text>
					</view>
					<input 
						v-model="userInfo.phone" 
						class="field-input" 
						placeholder="请输入手机号"
						type="number"
						maxlength="11"
					/>
				</view>

				<!-- 邮箱 -->
				<view class="edit-field">
					<view class="field-label">
						<text class="fa fa-envelope field-icon"></text>
						<text class="label-text">邮箱</text>
					</view>
					<input 
						v-model="userInfo.email" 
						class="field-input" 
						placeholder="请输入邮箱地址"
						type="email"
					/>
				</view>

				<!-- 微信绑定 -->
				<view class="edit-field">
					<view class="field-label">
						<text class="fa fa-wechat field-icon"></text>
						<text class="label-text">微信绑定</text>
					</view>
					<view class="wechat-bind-container">
						<view class="bind-status">
							<view class="status-indicator" :class="{bound: userInfo.wechatBound}">
								<text class="fa fa-check" v-if="userInfo.wechatBound"></text>
								<text class="fa fa-times" v-else></text>
							</view>
							<text class="status-text">{{ userInfo.wechatBound ? '已绑定' : '未绑定' }}</text>
						</view>
						<view class="bind-action" @click="toggleWechatBind">
							<text class="action-text">{{ userInfo.wechatBound ? '解绑' : '绑定' }}</text>
							<text class="fa fa-chevron-right action-arrow"></text>
						</view>
					</view>
				</view>

				<!-- 个人简介 -->
				<view class="edit-field">
					<view class="field-label">
						<text class="fa fa-edit field-icon"></text>
						<text class="label-text">个人简介</text>
					</view>
					<textarea 
						v-model="userInfo.bio" 
						class="field-textarea" 
						placeholder="介绍一下自己吧..."
						maxlength="200"
						auto-height
					/>
				</view>

				<!-- 日语水平 -->
				<view class="edit-field">
					<view class="field-label">
						<text class="fa fa-graduation-cap field-icon"></text>
						<text class="label-text">日语水平</text>
					</view>
					<view class="radio-group vertical">
						<label class="radio-item" @click="selectLevel('beginner')">
							<view class="radio-circle" :class="{active: userInfo.level === 'beginner'}">
								<view class="radio-dot" v-if="userInfo.level === 'beginner'"></view>
							</view>
							<text class="radio-text">初学者 (N5-N4)</text>
						</label>
						<label class="radio-item" @click="selectLevel('intermediate')">
							<view class="radio-circle" :class="{active: userInfo.level === 'intermediate'}">
								<view class="radio-dot" v-if="userInfo.level === 'intermediate'"></view>
							</view>
							<text class="radio-text">中级 (N3-N2)</text>
						</label>
						<label class="radio-item" @click="selectLevel('advanced')">
							<view class="radio-circle" :class="{active: userInfo.level === 'advanced'}">
								<view class="radio-dot" v-if="userInfo.level === 'advanced'"></view>
							</view>
							<text class="radio-text">高级 (N1)</text>
						</label>
					</view>
				</view>

				<!-- 保存按钮 -->
				<view class="save-section">
					<button class="save-button" @click="saveProfile">
						<text class="fa fa-save"></text>
						<text class="save-text">保存信息</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusBarHeight: 0,
			userInfo: {
				nickname: '田中さん',
				gender: 'female',
				birthday: '1995-06-15',
				city: '北京',
				phone: '138****8888',
				email: 'user@example.com',
				bio: '日语学习爱好者，喜欢动漫和日本文化',
				level: 'intermediate',
				wechatBound: false
			},
			cityList: ['北京', '上海', '广州', '深圳', '杭州', '成都', '其他'],
			cityIndex: 0
		}
	},
	mounted() {
		this.getSystemInfo()
		this.initCityIndex()
	},
	methods: {
		// 获取系统信息
		getSystemInfo() {
			uni.getSystemInfo({
				success: (res) => {
					this.statusBarHeight = res.statusBarHeight || 0
				}
			})
		},
		
		// 初始化城市索引
		initCityIndex() {
			const index = this.cityList.findIndex(city => city === this.userInfo.city)
			this.cityIndex = index >= 0 ? index : 0
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack()
		},
		
		// 上传头像
		uploadAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					// TODO: 上传头像到服务器
					uni.showToast({
						title: '头像上传成功',
						icon: 'success'
					})
				}
			})
		},
		
		// 选择性别
		selectGender(gender) {
			this.userInfo.gender = gender
		},
		
		// 选择日语水平
		selectLevel(level) {
			this.userInfo.level = level
		},
		
		// 生日变化
		onBirthdayChange(e) {
			this.userInfo.birthday = e.detail.value
		},
		
		// 城市变化
		onCityChange(e) {
			this.cityIndex = e.detail.value
			this.userInfo.city = this.cityList[e.detail.value]
		},
		
		// 切换微信绑定状态
		toggleWechatBind() {
			if (this.userInfo.wechatBound) {
				// 解绑微信
				uni.showModal({
					title: '确认解绑',
					content: '确定要解绑微信吗？',
					success: (res) => {
						if (res.confirm) {
							this.userInfo.wechatBound = false
							uni.showToast({
								title: '微信解绑成功',
								icon: 'success'
							})
						}
					}
				})
			} else {
				// 绑定微信
				uni.showLoading({
					title: '绑定中...'
				})
				
				// TODO: 调用微信绑定接口
				setTimeout(() => {
					uni.hideLoading()
					this.userInfo.wechatBound = true
					uni.showToast({
						title: '微信绑定成功',
						icon: 'success'
					})
				}, 1000)
			}
		},
		
		// 保存个人资料
		saveProfile() {
			// 表单验证
			if (!this.userInfo.nickname.trim()) {
				uni.showToast({
					title: '请输入昵称',
					icon: 'none'
				})
				return
			}
			
			if (this.userInfo.phone && !/^1[3-9]\d{9}$/.test(this.userInfo.phone)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				})
				return
			}
			
			if (this.userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.userInfo.email)) {
				uni.showToast({
					title: '请输入正确的邮箱地址',
					icon: 'none'
				})
				return
			}
			
			// TODO: 保存到服务器
			uni.showLoading({
				title: '保存中...'
			})
			
			setTimeout(() => {
				uni.hideLoading()
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
				
				// 返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			}, 1000)
		}
	}
}
</script>

<style lang="scss">
.profile-edit-container {
	background: #ffffff;
	height: 100vh;
	position: relative;
}

/* 导航栏 */
.nav-bar {
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

.nav-left {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #374151;
	transition: color 0.2s;
}

.nav-left:active {
	color: #2563EB;
}

.nav-left .fa {
	font-size: 32rpx;
}

.nav-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1F2937;
}

.nav-right {
	width: 64rpx;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.save-btn {
	font-size: 28rpx;
	color: #2563EB;
	font-weight: 500;
	transition: color 0.2s;
}

.save-btn:active {
	color: #1D4ED8;
}

/* 内容区域 */
.content {
	margin-top: 120rpx;
	padding: 32rpx;
	padding-bottom: 64rpx;
	position: relative;
	background-color: #ffffff;
	min-height: calc(100vh - 120rpx);
}

/* 实验室装饰 */
.test-tube-decoration {
	position: absolute;
	top: 40rpx;
	right: 32rpx;
	width: 48rpx;
	height: 48rpx;
	opacity: 0.2;
	transform: rotate(24deg);
}

.test-tube {
	width: 16rpx;
	height: 72rpx;
	border: 4rpx solid #10B981;
	border-radius: 4rpx 4rpx 16rpx 16rpx;
	position: relative;
	overflow: hidden;
}

.test-tube-fill {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 60%;
	background: #10B981;
	animation: bubble 3s ease-in-out infinite;
}

@keyframes bubble {
	0%, 100% { height: 60%; }
	50% { height: 80%; }
}

/* 头像区域 */
.avatar-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 48rpx;
}

.avatar-upload {
	position: relative;
	margin-bottom: 16rpx;
}

.avatar-container {
	width: 192rpx;
	height: 192rpx;
	border-radius: 50%;
	background: rgba(37, 99, 235, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;
}

.avatar-container:active {
	transform: scale(1.05);
}

.avatar-container .fa {
	font-size: 96rpx;
	color: #2563EB;
}

.avatar-overlay {
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.avatar-upload:active .avatar-overlay {
	opacity: 1;
}

.avatar-overlay .fa {
	font-size: 48rpx;
	color: white;
}

.avatar-tip {
	font-size: 24rpx;
	color: #6B7280;
}

/* 表单区域 */
.form-section {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

.edit-field {
	background: #EFF6FF;
	border-radius: 24rpx;
	padding: 32rpx;
	transition: all 0.2s ease;
	border: 2rpx solid transparent;
}

.edit-field:focus-within {
	transform: translateY(-4rpx);
	box-shadow: 0 8rpx 24rpx rgba(37, 99, 235, 0.15);
	border-color: #2563EB;
}

.field-label {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.field-icon {
	font-size: 28rpx;
	color: #2563EB;
	margin-right: 16rpx;
}

.label-text {
	font-size: 28rpx;
	font-weight: 500;
	color: #374151;
}

.field-input {
	width: 100%;
	background: transparent;
	border: none;
	outline: none;
	font-size: 32rpx;
	color: #1F2937;
	font-weight: 500;
}

.field-input::placeholder {
	color: #9CA3AF;
}

.field-textarea {
	width: 100%;
	background: transparent;
	border: none;
	outline: none;
	font-size: 32rpx;
	color: #1F2937;
	min-height: 120rpx;
	resize: none;
}

.field-textarea::placeholder {
	color: #9CA3AF;
}

.field-picker {
	width: 100%;
}

.picker-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.picker-text {
	font-size: 32rpx;
	color: #1F2937;
	font-weight: 500;
}

.picker-arrow {
	font-size: 24rpx;
	color: #9CA3AF;
}

/* 单选组 */
.radio-group {
	display: flex;
	gap: 32rpx;
}

.radio-group.vertical {
	flex-direction: column;
	gap: 16rpx;
}

.radio-item {
	display: flex;
	align-items: center;
	cursor: pointer;
}

.radio-circle {
	width: 32rpx;
	height: 32rpx;
	border: 4rpx solid #D1D5DB;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 16rpx;
	transition: all 0.2s ease;
}

.radio-circle.active {
	border-color: #2563EB;
}

.radio-dot {
	width: 16rpx;
	height: 16rpx;
	background: #2563EB;
	border-radius: 50%;
}

.radio-text {
	font-size: 28rpx;
	color: #374151;
}

/* 微信绑定 */
.wechat-bind-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
}

.bind-status {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.status-indicator {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f5f5f5;
	color: #999999;
	font-size: 20rpx;
	transition: all 0.3s ease;
}

.status-indicator.bound {
	background-color: #07c160;
	color: #ffffff;
}

.status-text {
	font-size: 28rpx;
	color: #333333;
}

.bind-action {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 12rpx 20rpx;
	background-color: #f8f9fa;
	border-radius: 20rpx;
	transition: all 0.3s ease;
}

.bind-action:active {
	background-color: #e9ecef;
	transform: scale(0.98);
}

.action-text {
	font-size: 26rpx;
	color: #667eea;
	font-weight: 500;
}

.action-arrow {
	font-size: 20rpx;
	color: #999999;
}

/* 保存按钮 */
.save-section {
	margin-top: 32rpx;
}

.save-button {
	width: 100%;
	background: linear-gradient(135deg, #2563EB 0%, rgba(37, 99, 235, 0.8) 100%);
	color: white;
	border: none;
	border-radius: 24rpx;
	padding: 32rpx;
	font-size: 32rpx;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	transition: all 0.2s ease;
}

.save-button:active {
	transform: scale(0.98);
	background: linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(37, 99, 235, 0.7) 100%);
}

.save-button .fa {
	font-size: 28rpx;
}

.save-text {
	font-size: 32rpx;
	font-weight: 500;
}

/* 暗黑模式样式 */
.dark-theme .profile-edit-container {
	background: #121212;
}

.dark-theme .nav-bar {
	background-color: #1F1F1F;
	border-bottom: 1rpx solid #3D3D3D;
}

.dark-theme .nav-title {
	color: #E0E0E0;
}

.dark-theme .nav-left {
	color: #A0A0A0;
}

.dark-theme .nav-left:active {
	color: #6366F1;
}

.dark-theme .save-btn {
	color: #6366F1;
}

.dark-theme .save-btn:active {
	color: #4F46E5;
}

.dark-theme .content {
	background-color: #121212;
}

.dark-theme .edit-field {
	background: #1E1E1E;
	border: 2rpx solid #3D3D3D;
}

.dark-theme .edit-field:focus-within {
	box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.15);
	border-color: #6366F1;
}

.dark-theme .label-text {
	color: #E0E0E0;
}

.dark-theme .field-icon {
	color: #6366F1;
}

.dark-theme .field-input {
	color: #E0E0E0;
}

.dark-theme .field-input::placeholder {
	color: #666666;
}

.dark-theme .field-textarea {
	color: #E0E0E0;
}

.dark-theme .field-textarea::placeholder {
	color: #666666;
}

.dark-theme .picker-text {
	color: #E0E0E0;
}

.dark-theme .picker-arrow {
	color: #808080;
}

.dark-theme .radio-circle {
	border: 4rpx solid #4D4D4D;
}

.dark-theme .radio-circle.active {
	border-color: #6366F1;
}

.dark-theme .radio-dot {
	background: #6366F1;
}

.dark-theme .radio-text {
	color: #E0E0E0;
}

.dark-theme .status-indicator {
	background-color: #2D2D2D;
	color: #808080;
}

.dark-theme .status-indicator.bound {
	background-color: #07c160;
	color: #ffffff;
}

.dark-theme .status-text {
	color: #E0E0E0;
}

.dark-theme .bind-action {
	background-color: #2D2D2D;
}

.dark-theme .bind-action:active {
	background-color: #3D3D3D;
}

.dark-theme .action-text {
	color: #818CF8;
}

.dark-theme .action-arrow {
	color: #808080;
}

.dark-theme .avatar-container {
	background: rgba(99, 102, 241, 0.1);
}

.dark-theme .avatar-container .fa {
	color: #818CF8;
}

.dark-theme .avatar-tip {
	color: #A0A0A0;
}

.dark-theme .save-button {
	background: linear-gradient(135deg, #6366F1 0%, rgba(99, 102, 241, 0.8) 100%);
}

.dark-theme .save-button:active {
	background: linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(99, 102, 241, 0.7) 100%);
}
</style>