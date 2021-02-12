import Vue from 'vue';
import VueRouter from 'vue-router';
import BaseLayout from '../layout/index.vue';
import errorsRouter from './errors-routers';
import otherRouters from './other-routers';

Vue.use(VueRouter);

/**
 * path 			   							{String}   路由地址
 * name 				 							{String} 	组件名字
 * 只有当children.length >= 2时，才会出现sub-menu
 * meta 			   							{Object}   元数据
 * meta?.roles   							{[]} 			权限。需要固定的权限才可以显示。
 * meta.title    							{String}   菜单、面包屑显示的名字，同时也会作为页面标题。
 * meta?.icon    							{String}   显示的icon。
 * meta?.pin     							{Boolean}  是否固定在标签栏。默认: false。
 * meta?.cache   							{Boolean}  是否被keep-alive缓存，配置此项必须配置name。默认: false。
 * meta?.hidden  							{Boolean}  是否被从导航栏隐藏，如果为true，同时不会被添加到tabs栏。默认: false。
 * meta?.showInTabs						{Boolean}  是否被添加到tabs栏，优先级高于hidden，特殊情况自行修改`/src/layout/tabs-bar`逻辑。默认: true。
 * @type {*[]}
 */
export const routes = [
	{
		path: '/',
		name: 'Home',
		component: BaseLayout,
		redirect: '/dashboard',
		meta: { title: '工作台', icon: 'el-icon-s-platform', pin: true, cache: true },
		children: [
			{
				path: '/dashboard',
				name: 'Dashboard',
				meta: { title: '工作台', icon: 'el-icon-s-platform', pin: true, cache: true },
				component: () => import('@/views/dashboard/index.vue'),
			},
		],
	},
	{
		path: '/about',
		name: 'About',
		component: BaseLayout,
		redirect: '/components/index',
		meta: { title: '嵌套路由', icon: 'el-icon-s-home', pin: true, cache: true },
		children: [
			{
				path: '/about/auth',
				name: 'About1',
				meta: { title: '嵌套路由1', icon: 'el-icon-s-check', pin: true, cache: true },
				component: () => import('@/views/Home.vue'),
			},
			{
				path: '/about/auth2',
				name: 'About2',
				meta: { title: '嵌套路由2', icon: 'el-icon-setting', pin: false, cache: true },
				component: () => import('@/views/Home.vue'),
			},
		],
	},
	...otherRouters,
	...errorsRouter,
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;
