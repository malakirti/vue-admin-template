<template>
	<el-row :gutter="10">
		<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
			<el-card class="card" shadow="never">
				<div slot="header">
					<span>更新日志</span>
				</div>
				<el-timeline>
					<el-timeline-item
						v-for="(activity, index) in activities"
						:key="index"
						:icon="activity.icon"
						:type="activity.type"
						:color="activity.color"
						:size="activity.size"
						:timestamp="activity.timestamp"
					>
						{{ activity.content }}
					</el-timeline-item>
				</el-timeline>
			</el-card>
		</el-col>
		<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
			<el-card class="card" shadow="never">
				<div slot="header">
					<span>关于</span>
				</div>
				<p>一个简单的 Vue 后台系统开发模板。</p>
				<img style="width: 100%" :src="path + '&show_icons=true&theme=' + theme" alt="about" />
			</el-card>
		</el-col>
	</el-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Dashboard',
	props: {},
	data() {
		return {
			path: 'https://github-readme-stats.vercel.app/api?username=malakirti&include_all_commits=true',
			tabPosition: 'right',
			activities: [
				{
					size: 'large',
					color: '#ff6700',
					icon: 'el-icon-loading',
					timestamp: '2020-11-01',
					content: '@todo',
				},
				{
					size: 'large',
					type: 'primary',
					icon: 'el-icon-bicycle',
					timestamp: '2020-11-01',
					content: '一个基本算是能用的模板。',
				},
				{
					size: 'large',
					icon: 'el-icon-mouse',
					timestamp: '2020-10-31',
					content: '正好周六，那索性就先准备个简单的项目模板吧。',
				},
				{
					size: 'large',
					icon: 'el-icon-more',
					timestamp: '2020-10-30',
					content: '领导说: 其他部门都用Vue，综合考虑我们以后的项目也用Vue。',
				},
			],
		};
	},
	computed: {
		...mapState({
			theme: (state) =>
				state.layout.theme === 'dark'
					? 'radical&bg_color=222&title_color=f90&icon_color=f90'
					: state.layout.theme,
		}),
	},
	created() {},
	mounted() {},
	methods: {},
};
</script>

<style lang="less" scoped></style>
