<template>
	<i v-if="icon && icon.startsWith('el-')" :class="icon" />
	<svg v-else :use="`icon-${icon}`" />
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
