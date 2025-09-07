<template name="page-head">
	<view class="common-page-head">
		<view class="common-page-head-title">{{title}}</view>
	</view>
</template>
<script>
	export default {
		name: "page-head",
		props: {
			title: {
				type: String,
				default: ""
			}
		}
	}
</script>
<style>
	.common-page-head {
		padding: 30rpx;
		background-color: #FFFFFF;
		border-bottom: 1rpx solid #E5E5E5;
	}

	.common-page-head-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
		text-align: center;
	}

	/* 暗黑模式样式 */
	.dark-theme .common-page-head {
		background-color: #1F1F1F;
		border-bottom-color: #3D3D3D;
	}

	.dark-theme .common-page-head-title {
		color: #E0E0E0;
	}
</style>
</script>
