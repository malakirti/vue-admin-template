<template>
	<section class="global-setting">
		<div class="setting-btn" :class="isShowSetting ? 'open' : ''" @click="onHandleSettingBtnClick">
			<i :class="isShowSetting ? 'el-icon-close' : 'el-icon-setting'" />
		</div>

		<el-drawer class="drawer" :modal="false" size="340px" :with-header="false" :visible.sync="isShowSetting">
			<div class="settings">
				<div class="title">系统设置</div>

				<ul>
					<li class="setting-item">
						<span>切换主题</span>
						<el-select style="width: 120px" :value="theme" placeholder="请选择" @change="onChangeTheme">
							<el-option label="亮(light)" value="light" />
							<el-option label="暗(dark)" value="dark" />
						</el-select>
					</li>
					<li class="setting-item">
						<span>固定Header</span>
						<el-switch :value="isFixedHeader" @change="onChangeHeaderStatus" />
					</li>
					<li class="setting-item">
						<span>开启标签页功能</span>
						<el-switch :value="isShowTabsView" @change="onCHangeTabsViewStatus" />
					</li>
					<li class="setting-item">
						<span>侧边Logo(顶栏、侧边栏)</span>
						<el-switch :value="isLogoShow" @change="onChangeLogoVisibleStatus" />
					</li>
					<li class="setting-item">
						<span>菜单栏位置(默认在侧边)</span>
						<el-switch :value="isMenuInAside" @change="onChangeMenuPosition" />
					</li>
				</ul>
			</div>
		</el-drawer>
	</section>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'GlobalSetting',
	data() {
		return {
			isShowSetting: false,
		};
	},
	computed: {
		...mapState({
			theme: (state) => state.layout.theme,
			isFixedHeader: (state) => state.layout.isFixedHeader,
			isShowTabsView: (state) => state.layout.isShowTabsView,
			isLogoShow: (state) => state.layout.isLogoShow,
			isMenuInAside: (state) => state.layout.isMenuInAside,
		}),
	},
	methods: {
		onHandleSettingBtnClick() {
			this.isShowSetting = !this.isShowSetting;
		},
		onHandleElSwitch(action) {
			this.$store.dispatch(`layout/${action}`);
		},
		onChangeTheme() {
			this.$store.dispatch('layout/onChangeTheme', this.theme === 'light' ? 'dark' : 'light');
		},
		onChangeHeaderStatus() {
			this.$store.dispatch('layout/onChangeHeaderStatus');
		},
		onCHangeTabsViewStatus() {
			this.$store.dispatch('layout/onCHangeTabsViewStatus');
		},
		onChangeLogoVisibleStatus() {
			this.$store.dispatch('layout/onChangeLogoVisibleStatus');
		},
		onChangeMenuPosition() {
			this.$store.dispatch('layout/onChangeMenuPosition');
		},
	},
};
</script>

<style lang="less" scoped>
.global-setting {
	.setting-btn {
		position: fixed;
		top: 50%;
		right: 0;
		z-index: @max-z-index;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		font-size: 24px;
		color: #fff;
		cursor: pointer;
		background: #0085fa;
		border-top-left-radius: 8px;
		border-bottom-left-radius: 8px;
		transition: all 0.3s;
		&.open {
			right: 340px;
		}
	}
	.drawer {
		.settings {
			padding: 10px 20px;

			.title {
				margin-top: 10px;
				margin-bottom: 20px;
				font-size: 18px;
			}

			.setting-item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 15px;
				font-size: 14px;
				color: #888;
			}
		}
	}
}
[data-theme='dark'] {
	.global-setting {
		.setting-btn {
			background: @dark-primary-color;
		}
	}
}
</style>
