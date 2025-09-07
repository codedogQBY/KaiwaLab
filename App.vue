<script>
	import {
		mapMutations
	} from 'vuex'
	import {
		version
	} from './package.json'
	// #ifdef APP
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	// #endif

	export default {
		onLaunch: function() {
			// 初始化主题
			this.initTheme();
			
			// #ifdef H5
			console.log(
				`%c hello uniapp %c v${version} `,
				'background:#35495e ; padding: 2rpx; border-radius: 6rpx 0 0 6rpx;  color: #fff',
				'background:#007aff ;padding: 2rpx; border-radius: 0 6rpx 6rpx 0;  color: #fff; font-weight: bold;'
			)
			// #endif
			// 线上示例使用
			// console.log('%c uni-app官方团队诚邀优秀前 端工程师加盟，一起打造更卓越的uni-app & uniCloud，欢迎投递简历到 hr2013@dcloud.io', 'color: red');
			console.log('App Launch');
			// #ifdef APP-PLUS
			// App平台检测升级，服务端代码是通过uniCloud的云函数实现的，详情可参考：https://ext.dcloud.net.cn/plugin?id=4542
			if (plus.runtime.appid !== 'HBuilder') { // 真机运行不需要检查更新，真机运行时appid固定为'HBuilder'，这是调试基座的appid
				checkUpdate()
			}

			// 一键登录预登陆，可以显著提高登录速度
			uni.preLogin({
				provider: 'univerify',
				success: (res) => {
					// 成功
					this.setUniverifyErrorMsg();
					console.log("preLogin success: ", res);
				},
				fail: (res) => {
					this.setUniverifyLogin(false);
					this.setUniverifyErrorMsg(res.errMsg);
					// 失败
					console.log("preLogin fail res: ", res);
				}
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			test: ''
		},
		methods: {
			...mapMutations(['setUniverifyErrorMsg', 'setUniverifyLogin']),
			
			// 初始化主题
			initTheme() {
				const savedTheme = uni.getStorageSync('theme') || 'light';
				this.applyTheme(savedTheme);
			},
			
			// 应用主题
			applyTheme(theme) {
				// #ifdef H5
				if (theme === 'dark') {
					document.body.classList.add('dark-theme');
					document.body.classList.remove('light-theme');
				} else if (theme === 'light') {
					document.body.classList.add('light-theme');
					document.body.classList.remove('dark-theme');
				} else if (theme === 'system') {
					const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
					if (isDark) {
						document.body.classList.add('dark-theme');
						document.body.classList.remove('light-theme');
					} else {
						document.body.classList.add('light-theme');
						document.body.classList.remove('dark-theme');
					}
				}
				// #endif
				
				// #ifdef APP-PLUS
				// App端主题切换逻辑
				if (typeof plus !== 'undefined') {
					try {
						if (theme === 'dark') {
							plus.navigator.setStatusBarStyle('light');
						} else {
							plus.navigator.setStatusBarStyle('dark');
						}
					} catch (error) {
						console.error("设置状态栏样式失败:", error);
					}
				}
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	@import '@/static/customicons.css';
	@import '@/static/font-awesome.css';
	/* H5 兼容 pc 所需 */
	/* #ifdef H5 */
	@media screen and (min-width: 768px) {
		body {
			overflow-y: scroll;
		}
	}

	/* 顶栏通栏样式 */
	/* .uni-top-window {
	    left: 0;
	    right: 0;
	} */

	uni-page-body {
		background-color: #F5F5F5 !important;
		min-height: 100% !important;
		height: auto !important;
	}

	.uni-top-window uni-tabbar .uni-tabbar {
		background-color: #fff !important;
	}

	.uni-app--showleftwindow .hideOnPc {
		display: none !important;
	}

	/* #endif */

	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background-color: #efeff4;
		height: 100%;
		font-size: 28rpx;
		/* line-height: 1.8; */
	}

	.fix-pc-padding {
		padding: 0 100rpx;
	}

	.uni-header-logo {
		padding: 30rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
	}

	.uni-header-image {
		width: 200rpx;
		height: 200rpx;
	}

	.uni-hello-text {
		color: #7A7E83;
	}

	.uni-hello-addfile {
		text-align: center;
		line-height: 300rpx;
		background: #FFF;
		padding: 50rpx;
		margin-top: 20rpx;
		font-size: 38rpx;
		color: #808080;
	}
	
	/* 暗黑模式样式 */
	.dark-theme {
		background-color: #121212 !important;
		color: #E0E0E0;
	}
	
	.dark-theme page {
		background-color: #121212;
	}

	.dark-theme .uni-top-window uni-tabbar .uni-tabbar {
		background-color: #1F1F1F !important;
	}
	
	.dark-theme .uni-hello-text {
		color: #A0A0A0;
	}
	
	.dark-theme .uni-hello-addfile {
		background: #1F1F1F;
		color: #808080;
	}
</style>