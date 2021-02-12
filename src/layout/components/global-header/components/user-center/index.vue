<template>
	<el-dropdown>
		<div class="user-center">
			<el-avatar :size="30" src="" />
			<span class="name">用户名</span>
		</div>
		<el-dropdown-menu slot="dropdown">
			<el-dropdown-item icon="el-icon-plus">个人中心</el-dropdown-item>
			<el-dropdown-item icon="el-icon-setting">关于系统</el-dropdown-item>
			<el-dropdown-item icon="el-icon-circle-check">退出系统</el-dropdown-item>
		</el-dropdown-menu>
	</el-dropdown>
</template>

<script>
export default {
	name: 'UserCenter',
};
</script>

<style lang="less" scoped>
.user-center {
	display: flex;
	align-items: center;
	justify-content: center;
	height: @app-header-height;
	padding: 0 10px;
	cursor: pointer;
	transition: all 0.3s;
	.name {
		margin-left: 4px;
	}
	&:hover {
		background: @light-hover-bg-color;
	}
}

[data-theme='dark'] {
	.user-center:hover {
		background: @dark-hover-bg-color;
	}
}
</style>
