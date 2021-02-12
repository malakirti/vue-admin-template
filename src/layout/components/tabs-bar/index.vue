<template>
	<div class="tabs-bar-container" @contextmenu="onNeedPreventDefault($event, false)">
		<el-scrollbar
			ref="elScrollbar"
			:vertical="false"
			v-if="dataSource.length"
			@wheel.native.prevent="onHandleScroll"
		>
			<ul class="tabs-bar">
				<li
					v-for="view in dataSource"
					class="tabs-item"
					:class="$route.path === view.path ? 'is-active' : ''"
					:key="view.path"
					@click="onHandleClick($event, view)"
					@contextmenu="onHandleContextmenu($event, view)"
				>
					{{ view.meta.title }}
					<span
						class="el-icon-close"
						v-if="view.meta && !view.meta.pin"
						@click="onHandleCloseMenu($event, view)"
						@contextmenu="onNeedPreventDefault($event, true)"
					/>
				</li>
			</ul>
		</el-scrollbar>
		<ul
			class="contextmenu"
			v-if="isContextmenuVisible && filteredContextmenu.length"
			@contextmenu="onNeedPreventDefault($event, true)"
			:style="{ ...position, width: `${contextmenuWidth}px` }"
		>
			<li
				class="item"
				v-for="menu in filteredContextmenu"
				:key="menu.type"
				@click="onContextmenuItemClick($event, menu.type)"
			>
				{{ menu.label }}
			</li>
		</ul>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import config from '@/config';

const { keyMap, localStorageTabsKey } = config;

export default {
	name: 'TabsBar',
	data() {
		return {
			contextmenu: [],
			contextmenuView: {},
			isContextmenuVisible: true,
			contextmenuWidth: 100,
			position: {
				top: '40px',
				left: '60px',
			},
		};
	},
	computed: {
		...mapState({
			dataSource: (state) => state.global.tabsViews,
			routes: (state) => state.router.routes,
		}),
		elScrollbarWrap() {
			return this.$refs.elScrollbar.$refs.wrap;
		},
		filteredContextmenu() {
			return this.contextmenu.filter((item) => item.visible);
		},
	},
	watch: {
		$route: {
			handler() {
				this.addViews();
			},
		},
	},
	mounted() {
		this.initialViews();
		window.addEventListener('keydown', this.onHandleKeydown);
		document.body.addEventListener('click', this.onCloseContextmenu);
		document.body.addEventListener('contextmenu', this.onCloseContextmenu);
		window.addEventListener('storage', this.onSynchroInDifferentTabs);
	},
	methods: {
		initialViews() {
			const vm = this;
			const routes = [];
			function loop(list) {
				list.forEach((item) => {
					if (item.meta && item.meta.pin && item.children.length <= 0) {
						routes.push(vm.getRealTabsView(item));
					}
					if (item.children) {
						loop(item.children);
					}
				});
			}
			if (!window.localStorage.getItem(localStorageTabsKey)) {
				loop(this.routes);
				this.$store.commit('global/SET_TABS_LIST', routes);
			}
			this.addViews();
		},
		addViews() {
			const view = this.getRealTabsView(this.$route);
			if (!view.meta.showInTabs) return;

			if (!view.meta.hidden) {
				this.$store.dispatch('global/onSetTabsViews', view);
				if (view.meta.cache && view.name) {
					this.$store.dispatch('global/onAddCacheView', view);
				}
			}
		},
		onHandleKeydown(event) {
			if (event.altKey && (event.which || event.keyCode) === keyMap.w) {
				const view = this.getRealTabsView(this.$route);
				if (view.meta.pin) return;
				this.onHandleCloseMenu(event, view);
			}
		},
		onHandleScroll(event) {
			this.elScrollbarWrap.scrollLeft += event.deltaY / 5;
			this.onCloseContextmenu();
		},
		onHandleClick(event, item) {
			if (this.$route.path !== item.path) {
				this.$router.push(item.path);
			}
		},
		onHandleContextmenu(event, view) {
			event.preventDefault();
			event.stopPropagation();

			this.contextmenuView = view;
			this.contextmenu = [
				{ type: 'refresh', label: '刷新', visible: this.isShowContextmenuItem(view, 'refresh') },
				{ type: 'close', label: '关闭', visible: this.isShowContextmenuItem(view, 'close') },
				{
					type: 'close-others',
					label: '关闭其他',
					visible: this.isShowContextmenuItem(view, 'close-others'),
				},
				{
					type: 'close-all',
					label: '关闭所有',
					visible: this.isShowContextmenuItem(view, 'close-all'),
				},
				{
					type: 'close-left',
					label: '关闭左侧',
					visible: this.isShowContextmenuItem(view, 'close-left'),
				},
				{
					type: 'close-right',
					label: '关闭右侧',
					visible: this.isShowContextmenuItem(view, 'close-right'),
				},
			];
			const { top, left, width } = this.$el.getBoundingClientRect();

			if (event.clientX + this.contextmenuWidth - left + 4 < width) {
				this.position = {
					top: `${event.clientY - top + 4}px`,
					left: `${event.clientX - left + 4}px`,
				};
			} else {
				this.position = {
					top: `${event.clientY + 4}px`,
					left: `${event.clientX - left - this.contextmenuWidth - 4}px`,
				};
			}

			this.isContextmenuVisible = true;
		},
		onNeedPreventDefault(event, stopPropagation) {
			event.preventDefault();
			if (stopPropagation) {
				event.stopPropagation();
			}
		},
		isActive(view) {
			return view.path === this.$route.path;
		},
		isShowContextmenuItem(view, type) {
			const list = this.dataSource;
			const length = list.length;
			const index = list.findIndex((item) => item.path === view.path);
			const leftIndex = list.findIndex((item) => !item.meta || !item.meta.pin);
			const rightIndex = [...list].reverse().findIndex((item) => !item.meta || !item.meta.pin);
			switch (type) {
				case 'refresh':
					return view.path === this.$route.path;
				case 'close':
					return !(view.meta && view.meta.pin);
				case 'close-others':
					return length > 1 && list.some((item) => item.path !== view.path && (!item.meta || !item.meta.pin));
				case 'close-all':
					return !(view.meta && view.meta.pin) && list.some((item) => !item.meta || !item.meta.pin);
				case 'close-left':
					return index < length - 1 && leftIndex > -1 && leftIndex < index;
				case 'close-right':
					return index > 0 && rightIndex > -1 && index < list.length - 1 - rightIndex;
				default:
					return false;
			}
		},
		onHandleCloseMenu(event, view) {
			event.stopPropagation();
			this.onHandleContextmenuItem(view, 'close');
		},
		onContextmenuItemClick(event, type) {
			event.stopPropagation();
			const view = this.contextmenuView;
			this.onHandleContextmenuItem(view, type);
		},
		async onHandleContextmenuItem(view, type) {
			let nextPath;
			const index = this.dataSource.findIndex((item) => item.path === view.path);
			if (this.dataSource.length === index + 1) {
				nextPath = (this.dataSource[index - 1] || {}).path;
			} else {
				nextPath = (this.dataSource[index + 1] || {}).path;
			}

			await this.$store.dispatch('global/onSetTabsViews', {
				...this.getRealTabsView(view),
				operation: type,
			});

			switch (type) {
				case 'refresh':
					await this.$router.replace({
						name: 'Refresh',
						query: this.$route.query,
						params: {
							...this.$route,
							__redirect__: this.$route.path,
						},
					});
					break;
				case 'close':
					if (view.path === this.$route.path) {
						await this.$router.push(nextPath);
					}
					break;
				case 'close-others':
					if (view.path !== this.$route.path) {
						await this.$router.push(view.path);
					}
					break;
				case 'close-all':
					if (view.meta && view.meta.pin) {
						await this.$router.push(view.path);
					} else {
						await this.$router.push((this.dataSource[0] || {}).path || '/');
					}
					break;
				case 'close-left':
					if (view.path !== this.$route.path) {
						await this.$router.push(view.path);
					}
					break;
				case 'close-right':
					if (view.path !== this.$route.path) {
						await this.$router.push(view.path);
					}
					break;
				default:
					break;
			}
			this.onCloseContextmenu();
		},
		onCloseContextmenu() {
			this.isContextmenuVisible = false;
		},
		getRealTabsView(view) {
			const { path, fullPath, icon, name, meta } = view || {};
			return {
				path,
				fullPath,
				icon,
				name,
				meta: { ...meta },
			};
		},
		onSynchroInDifferentTabs(event) {
			if (event.key === localStorageTabsKey) {
				const list = JSON.parse(event.newValue);
				if (!list.some((item) => item.path === this.$route.path)) {
					this.$router.push((list[0] || {}).path || '/');
				}
				this.$store.commit('global/SET_TABS_LIST', list);
			}
		},
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.onHandleKeydown);
		document.body.removeEventListener('click', this.onCloseContextmenu);
		document.body.removeEventListener('contextmenu', this.onCloseContextmenu);
		window.removeEventListener('storage', this.onSynchroInDifferentTabs);
	},
};
</script>

<style lang="less" scoped>
.tabs-bar-container {
	position: relative;
	z-index: @small-z-index - 1;
	background: #fff;

	.tabs-bar {
		display: flex;
		align-items: center;
		height: @app-tabs-bar-height;
		padding: 0 10px;
		margin: 0;
		white-space: nowrap;
		user-select: none;
		.tabs-item {
			position: relative;
			display: inline-block;
			height: 30px;
			padding: 0 10px;
			margin-right: 6px;
			line-height: 30px;
			list-style: none;
			cursor: default;
			border: 1px solid #ededed;
			border-radius: 2px;

			&:hover {
				color: #0085fa;
				border-color: #0085fa;
			}

			&.is-active {
				color: #fff;
				background: #0085fa;
				border-color: #0085fa;
				transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

				&:hover {
					background-color: #2d9afc;
					border-color: #2d9afc;
				}
			}

			.el-icon-close {
				position: relative;
				top: 0;
				right: -2px;
				width: 14px;
				height: 14px;
				overflow: hidden;
				font-size: 12px;
				line-height: 14px;
				text-align: center;
				vertical-align: middle;
				border-radius: 50%;
				transition: background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

				&:hover {
					color: #fff;
					background: #c0c4cc;
				}
			}
		}
	}

	.contextmenu {
		position: absolute;
		top: 50px;
		left: 10px;
		z-index: @small-z-index - 1;
		width: 140px;
		padding: 4px 0;
		font-size: 12px;
		user-select: none;
		background-color: #fff;
		border: 1px solid #ebeef5;
		border-radius: 2px;
		transition: background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
		.item {
			height: 34px;
			padding: 0 10px;
			line-height: 34px;
			cursor: default;
			transition: background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

			&:hover {
				background-color: #f5f7fa;
			}

			&.disabled {
				color: #c0c4cc;
				cursor: not-allowed;
				background-color: #ebeef5;
				&:hover {
					background-color: #ebeef5;
				}
			}
		}
	}
}

[data-theme='dark'] {
	.tabs-bar-container {
		background: @dark-aside-bg-color;
		border-bottom: 1px solid @dark-border-color;
		.tabs-bar {
			.tabs-item {
				border-color: @dark-border-color;
				&:hover {
					color: @dark-primary-color;
					border-color: @dark-primary-color;
				}

				&.is-active {
					color: @dark-black-font-color;
					background: @dark-primary-color;
					border-color: @dark-primary-color;

					&:hover {
						background-color: @dark-primary-hover-color;
						border-color: @dark-primary-hover-color;
					}
				}

				.el-icon-close {
					&:hover {
						color: #fff;
						background: #c0c4cc;
					}
				}
			}
		}

		.contextmenu {
			background-color: @dark-main-bg-color;
			border: 1px solid @dark-border-color;
			.item {
				&:hover {
					color: @dark-primary-hover-color;
					background-color: @dark-hover-bg-color;
				}

				&.disabled {
					color: @dark-main-font-color;
					background-color: @dark-disabled-bg-color;
					&:hover {
						background-color: @dark-disabled-bg-color;
					}
				}
			}
		}
	}
}
</style>
