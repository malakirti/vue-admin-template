<template>
	<div class="global-aside" :class="isMenuCollapse ? 'collapse' : ''">
		<transition name="fade">
			<global-logo class="aside-header" v-if="isLogoShow" />
		</transition>
		<el-scrollbar style="height: 100%">
			<global-menu />
		</el-scrollbar>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import GlobalLogo from '../global-logo/index';
import GlobalMenu from '../global-menu/index.vue';

export default {
	name: 'GlobalAside',
	components: {
		GlobalLogo,
		GlobalMenu,
	},
	computed: {
		...mapState({
			isLogoShow: (state) => state.layout.isLogoShow,
			isMenuCollapse: (state) => state.layout.isMenuCollapse,
		}),
	},
};
</script>

<style lang="less" scoped>
.global-aside {
	position: fixed;
	top: 0;
	left: 0;
	z-index: @small-z-index;
	width: @app-aside-width;
	height: 100%;
	user-select: none;
	background: @light-aside-bg;
	border-right: solid 1px @light-aside-bg;
	transition: all 0.3s linear;
	&.collapse {
		width: @app-aside-collapse-width;
	}

	.aside-header {
		color: @dark-primary-color;
	}

	/deep/ .el-menu {
		border-right: none;
	}
}

[data-theme='dark'] {
	.global-aside {
		background: @dark-aside-bg-color;
		border-right: solid 1px @dark-aside-border-color;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s linear;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
