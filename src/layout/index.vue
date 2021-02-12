<template>
	<section class="app-container" :class="containerClassNames">
		<transition name="slide">
			<global-aside v-if="isMenuInAside" />
		</transition>

		<div class="app-layout">
			<div class="app-header" :class="headerClassNames">
				<div class="content">
					<global-header />
					<transition name="fade">
						<tabs-bar v-if="isShowTabsView" />
					</transition>
				</div>
			</div>

			<section class="app-battlefield">
				<container />
			</section>
		</div>

		<global-setting v-if="isShowSetting" />
	</section>
</template>

<script>
import { mapState } from 'vuex';
import GlobalHeader from './components/global-header/index.vue';
import TabsBar from './components/tabs-bar/index.vue';
import GlobalAside from './components/global-aside/index.vue';
import Container from './components/container/index.vue';
import GlobalSetting from './components/global-setting/index.vue';

export default {
	name: 'BaseLayout',
	components: {
		GlobalHeader,
		TabsBar,
		GlobalAside,
		Container,
		GlobalSetting,
	},
	computed: {
		...mapState({
			theme: (state) => state.layout.theme,
			isFixedHeader: (state) => state.layout.isFixedHeader,
			isShowTabsView: (state) => state.layout.isShowTabsView,
			isShowSetting: (state) => state.layout.isShowSetting,
			isLogoShow: (state) => state.layout.isLogoShow,
			isMenuInAside: (state) => state.layout.isMenuInAside,
			isMenuCollapse: (state) => state.layout.isMenuCollapse,
		}),
		containerClassNames() {
			const position = this.isMenuInAside ? 'menu-in-aside' : 'menu-in-header';
			const collapse = this.isMenuCollapse ? 'collapse' : '';
			return `${position} ${collapse}`;
		},
		headerClassNames() {
			const fixed = this.isFixedHeader ? 'fixed' : '';
			const hasTabs = this.isShowTabsView ? 'has-tabs' : '';
			return `${fixed} ${hasTabs}`;
		},
	},
	watch: {
		theme: {
			handler(theme) {
				document.body.setAttribute('data-theme', theme);
			},
		},
	},
	beforeMount() {
		document.body.setAttribute('data-theme', this.theme);
	},
};
</script>

<style lang="less" scoped>
.app-container {
	overflow-x: hidden;
	transition: margin-left 0.3s linear;
	&.menu-in-header {
		margin-left: 0;
		.content {
			left: 0;
		}
	}
	&.menu-in-aside {
		margin-left: @app-aside-width;
		.content {
			left: @app-aside-width;
		}
		&.collapse {
			margin-left: @app-aside-collapse-width;
			.content {
				left: @app-aside-collapse-width;
			}
		}
	}

	.app-layout {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.app-header {
		&.fixed {
			height: 50px;
			transition: height 0.3s linear;
			&.has-tabs {
				height: @app-header-height + @app-tabs-bar-height;
			}
			.content {
				position: fixed;
				top: 0;
				right: 0;
				z-index: @small-z-index;
				box-shadow: 0 1px 1px #ebeef5;
				transition: left 0.3s linear;
			}
		}
	}

	.app-battlefield {
		flex: 1;
		min-width: 568px;
		padding: 10px;
		overflow-y: auto;
	}
}

[data-theme='dark'] {
	.app-container {
		.app-header {
			&.fixed {
				.content {
					box-shadow: none;
				}
			}
		}
	}
}

.slide-enter-active,
.slide-leave-active {
	transition: left 0.3s linear;
}
.slide-enter,
.slide-leave-to {
	left: -200px;
}
.fade-enter-active,
.fade-leave-active {
	transition: all 0.3s linear;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-100%);
}
</style>
