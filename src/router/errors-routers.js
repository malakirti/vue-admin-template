export default [
	{
		path: '/errors/403',
		name: '403',
		meta: { title: '403', icon: 'el-icon-setting', pin: false, cache: false, hidden: true },
		component: () => import('@/views/errors/403'),
	},
	{
		path: '/errors/404',
		name: '404',
		meta: { title: '404', icon: 'el-icon-setting', pin: false, cache: false, hidden: true },
		component: () => import('@/views/errors/404'),
	},
	{
		path: '*',
		name: '*',
		meta: { title: '*', icon: 'el-icon-setting', pin: false, cache: false, hidden: true },
		redirect: '/errors/404',
	},
];
