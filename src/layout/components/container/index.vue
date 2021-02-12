<!-- 当前keep-alive组件只包含tabs标签页需要缓存的组件，include字段值也仅在/src/layout/tabs-bar中更新 -->
<template>
	<transition name="fade-transform" mode="out-in">
		<keep-alive :include="cacheViews" exclude="Refresh">
			<router-view :key="$route.path" />
		</keep-alive>
	</transition>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Container',
	computed: {
		...mapState({
			cacheViews: (state) => state.global.cacheViews,
		}),
	},
};
</script>

<style lang="less" scoped></style>
