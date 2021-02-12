<template>
	<i v-if="icon && icon.startsWith('el-')" :class="icon" />
	<i v-else>图标</i>
</template>

<script>
export default {
	name: 'Icon',
	props: {
		icon: String,
	},
};
</script>

<style scoped></style>
