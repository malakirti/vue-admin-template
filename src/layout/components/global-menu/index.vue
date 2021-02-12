<template>
	<el-menu
		class="global-menu"
		:mode="mode"
		:default-active="active"
		:collapse="isMenuCollapse"
		:background-color="isMenuInAside ? themeConfig.backgroundColor.dark : themeConfig.backgroundColor[theme]"
		:active-text-color="isMenuInAside ? themeConfig.activeTextColor.dark : themeConfig.activeTextColor[theme]"
		:text-color="isMenuInAside ? themeConfig.textColor.dark : themeConfig.textColor[theme]"
		@open="onHandleOpen"
		@close="onHandleClose"
		@select="onHandleSelect"
	>
		<menu-item v-for="route in routes" :key="route.path" :route="route" />
	</el-menu>
</template>

<script>
import { mapState } from 'vuex';
import MenuItem from './menu-item.vue';

export default {
	name: 'GlobalMenu',
	props: {
		mode: String,
		default() {
			return 'vertical';
		},
	},
	data() {
		return {
			active: '/',
			themeConfig: {
				backgroundColor: {
					dark: '#222',
					light: '#fff',
				},
				activeTextColor: {
					dark: '#ff9900',
					light: '#0085fa',
				},
				textColor: {
					dark: 'hsla(0,0%,100%,.7)',
					light: '#333',
				},
			},
		};
	},
	components: { MenuItem },
	computed: {
		...mapState({
			routes: (state) => state.router.routes,
			theme: (state) => state.layout.theme,
			isMenuInAside: (state) => state.layout.isMenuInAside,
			isMenuCollapse: (state) => state.layout.isMenuCollapse,
		}),
	},
	mounted() {},
	watch: {
		$route: {
			immediate: true,
			handler(route) {
				this.active = route.path;
			},
		},
	},
	methods: {
		onHandleOpen(index, indexPath) {
			console.log(index, indexPath);
		},
		onHandleClose(index, indexPath) {
			console.log(index, indexPath);
		},
		onHandleSelect(index, indexPath) {
			if (this.active === index) {
				return;
			}
			this.active = index;
			this.$router.push(index);
			console.log(index, indexPath);
		},
	},
};
</script>

<style lang="less">
.global-menu.el-menu {
	&.el-menu--horizontal {
		border-bottom-width: 0;
		& > .el-menu-item {
			height: @app-header-height;
			line-height: @app-header-height;
		}
		& > .el-submenu .el-submenu__title {
			height: @app-header-height;
			line-height: @app-header-height;
		}
	}
}
</style>
