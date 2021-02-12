<template>
	<div class="global-header">
		<div class="header-left" v-if="isMenuInAside" @click="onChangeMenuCollapseStatus">
			<i :class="isMenuCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'" />
		</div>
		<transition name="fade">
			<global-logo class="header-aside" v-if="!isMenuInAside && isLogoShow" />
		</transition>
		<transition name="fade">
			<el-scrollbar v-if="!isMenuInAside" style="flex: 1">
				<global-menu class="header-menu" mode="horizontal" />
			</el-scrollbar>
		</transition>
		<div class="header-right">
			<user-center />
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import GlobalLogo from '../global-logo';
import GlobalMenu from '../global-menu/index.vue';
import UserCenter from './components/user-center/index.vue';

export default {
	name: 'GlobalAside',
	components: {
		GlobalLogo,
		GlobalMenu,
		UserCenter,
	},
	computed: {
		...mapState({
			isLogoShow: (state) => state.layout.isLogoShow,
			isMenuInAside: (state) => state.layout.isMenuInAside,
			isMenuCollapse: (state) => state.layout.isMenuCollapse,
		}),
	},
	methods: {
		onChangeMenuCollapseStatus() {
			this.$store.dispatch('layout/onChangeMenuCollapseStatus');
		},
	},
};
</script>

<style lang="less" scoped>
.global-header {
	position: relative;
	z-index: 9;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: @app-header-height;
	background: #fff;
	border-bottom: 1px solid #ebeef5;
	.header-aside {
		float: left;
		min-width: 145px;
		padding: 0 10px;
	}
	.header-menu {
		display: flex;
		flex-wrap: nowrap;
	}
}
.header-left {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 60px;
	height: 100%;
	font-size: 26px;
	cursor: pointer;
	transition: all 0.3s linear;

	&:hover {
		background: #ebeef5;
	}
}

[data-theme='dark'] {
	.global-header {
		color: @dark-primary-color;
		background: @dark-aside-bg-color;
		border-bottom: 1px solid @dark-aside-border-color;
	}
	.header-left:hover {
		background: @dark-hover-bg-color;
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
