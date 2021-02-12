<template>
	<router-link class="global-logo" to="/">
		<img class="logo" src="../../../assets/logo.png" alt="模板" />
		<transition name="fade">
			<h1 class="title" v-if="!isMenuInAside || (isMenuInAside && !isMenuCollapse)">Admin Template</h1>
		</transition>
	</router-link>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'GlobalLogo',
	computed: {
		...mapState({
			isMenuInAside: (state) => state.layout.isMenuInAside,
			isMenuCollapse: (state) => state.layout.isMenuCollapse,
		}),
	},
	mounted() {
		console.log(this.isMenuInAside, this.isMenuCollapse);
	},
};
</script>

<style lang="less" scoped>
.global-logo {
	display: flex;
	align-items: center;
	justify-content: center;
	height: @app-header-height;
	color: inherit;
	cursor: pointer;

	.logo {
		width: 20px;
		height: 20px;
		margin-right: 4px;
	}
	.title {
		overflow: hidden;
		font-size: 18px;
		font-weight: normal;
		white-space: nowrap;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all 0.3s linear;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
