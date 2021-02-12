const { origin } = window.location;

// 为方便日后改造或变更，即便origin一样，api开头不一样的也请务必在此区分开。
const baseUrls = {
	api: {
		development: origin,
		test: origin,
		production: origin,
	},
	otherApi: {}, // 其他开头api
};

export default baseUrls;
