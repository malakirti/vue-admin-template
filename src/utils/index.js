export function sleep(ms = 4) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getShowRoutes(routes) {
	if (!routes) {
		return [];
	}
	return routes.filter((route) => !route.hidden);
}

/**
 * 权限判断
 * @param {Array} allRoles
 * @param {Array} roles
 * @returns {boolean|*}
 */
export function checkRolesPermission(allRoles, roles) {
	if (!roles || !Array.isArray(roles)) {
		return true;
	}

	if (roles.length === 0) {
		return true;
	}

	if (!allRoles || !Array.isArray(allRoles)) {
		return false;
	}

	return allRoles.some((value) => roles.includes(value));
}

/**
 * 简单递归整理路由列表数据
 * 1. 过滤隐藏的路由
 * 2. 过滤无权限路由
 * @param {Array} routes
 * @param {Array} roles
 */
export function travelRoutes(routes, roles = []) {
	function loop(list) {
		if (!Array.isArray(list)) {
			return [];
		}

		return list
			.filter((route) => !(route.meta && route.meta.hidden) && checkRolesPermission(roles, route.roles))
			.map((route) => {
				const filteredSubRoute = (route.children || []).filter((subRoute) => {
					return !(subRoute.meta && subRoute.meta.hidden) && checkRolesPermission(roles, subRoute.roles);
				});
				return {
					...route,
					children: loop(filteredSubRoute),
				};
			});
	}
	return loop(routes);
}

export function findPinRoute() {}
