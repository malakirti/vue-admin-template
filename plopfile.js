const { view, store, component } = require('./plop');

module.exports = function (plop) {
	plop.setGenerator('view', view);
	plop.setGenerator('store', store);
	plop.setGenerator('component', component);
};
