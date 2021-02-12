import { routes } from '@/router';
import { travelRoutes } from '@/utils';
import { deepCopy } from '@/utils/functions';

export default {
	namespaced: true,
	state: {
		routes: deepCopy(travelRoutes(routes)),
	},
	mutations: {},
	actions: {},
};
