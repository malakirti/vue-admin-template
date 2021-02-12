<script>
export default {
	name: 'Refresh',
	mounted() {
		const { params, query } = this.$route;
		const { name, __redirect__ } = params;

		delete params.__redirect__;

		if (name) {
			this.$router.replace({ name, query, params });
			return;
		}
		if (__redirect__) {
			this.$router.replace({ path: `${__redirect__}`, query });
			return;
		}
		this.$message.warning('刷新错误，为您跳转到首页');
		this.$router.replace('/');
	},
	render(h) {
		return h();
	},
};
</script>
