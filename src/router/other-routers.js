import BaseLayout from '@/layout';

export default [
	{
		path: '/fresh',
		component: BaseLayout,
		meta: { title: '刷新', icon: null, pin: false, cache: false, hidden: true },
		children: [
			{
				path: '/refresh',
				name: 'Refresh',
				meta: { title: '刷新', icon: null, pin: false, cache: false, hidden: true, showInTabs: false },
				component: () => import('@/views/refresh/index.vue'),
			},
		],
	},
];
