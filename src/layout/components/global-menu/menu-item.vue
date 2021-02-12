<template>
	<el-submenu v-if="route.children.length > 1" :index="route.path" :popper-append-to-body="false">
		<template slot="title">
			<icon v-if="route.meta.icon" :icon="route.meta.icon" />
			<span>{{ route.meta.title }}</span>
		</template>
		<menu-item v-for="child in route.children" :key="child.path" :route="child" />
	</el-submenu>
	<!-- 只有一个子路由不做sub-item处理，仅index使用子路由路径 -->
	<el-menu-item v-else-if="route.children.length === 1" :index="route.children[0].path">
		<icon v-if="route.meta.icon" :icon="route.meta.icon" />
		<span slot="title">{{ route.meta.title }}</span>
	</el-menu-item>
	<el-menu-item v-else :index="route.path">
		<icon v-if="route.meta.icon" :icon="route.meta.icon" />
		<span slot="title">{{ route.meta.title }}</span>
	</el-menu-item>
</template>

<script>
import Icon from './icon.vue';

export default {
	name: 'MenuItem',
	props: {
		route: Object,
	},
	components: { Icon },
};
</script>

<style scoped></style>
