export const noop = (args) => args;
export const getType = (value) => Object.prototype.toString.call(value).slice(8, -1);
export const isString = (value) => getType(value) === 'String';
export const isObject = (value) => getType(value) === 'Object';
export const isEmpty = function (val) {
	if (val === null || val === undefined) return true;

	if (typeof val === 'boolean') return false;

	if (typeof val === 'number') return !val;

	if (val instanceof Error) return val.message === '';

	switch (Object.prototype.toString.call(val)) {
		case '[object String]':
		case '[object Array]':
			return !val.length;
		case '[object File]':
		case '[object Map]':
		case '[object Set]':
			return !val.size;
		case '[object Object]':
			return !Object.keys(val).length;
		default:
			return false;
	}
};

export function objToStr(obj) {
	return Object.entries(obj)
		.reduce((res, [key, value]) => {
			res.push(`${key}=${value}`);
			return res;
		}, [])
		.join('&');
}

export function filterUndefinedNull(obj) {
	const res = {};

	if (!isObject(obj)) return res;

	Object.keys(obj).forEach((key) => {
		if (obj[key] === undefined || obj[key] === null) return;

		res[key] = obj[key];
	});

	return res;
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find(list, f) {
	return list.filter(f)[0];
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy(obj, cache = []) {
	// just return if obj is immutable value
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	// if obj is hit, it is in circular structure
	const hit = find(cache, (c) => c.original === obj);
	if (hit) {
		return hit.copy;
	}

	const copy = Array.isArray(obj) ? [] : {};
	// put the copy into cache at first
	// because we want to refer it in recursive deepCopy
	cache.push({
		original: obj,
		copy,
	});

	Object.keys(obj).forEach((key) => {
		copy[key] = deepCopy(obj[key], cache);
	});

	return copy;
}

/**
 * 从固定模式字符串中获取值 eg: key1=value1&key2=value2、key1=value1;key2=value2
 * @param name 名字
 * @param {String} search? 可选
 * @param {String} separator? 与第二个参数同在
 * @returns {string|null}
 */
export function getQueryString(name, search, separator) {
	search = search || window.location.href.split('?')[1] || '';
	separator = separator || '&';
	const reg = new RegExp(`(^|${separator})${name}=([^${separator}]*)(${separator}|$)`, 'i');
	const result = reg.exec(search);
	if (result != null) {
		return decodeURIComponent(result[2]);
	}
	return null;
}

/**
 * 仅支持将数组或对象转为FormData返回
 * @param {Object} data
 * @param {?"[]"|"."} accessType 对象数据访问类型，Literal|Identifier
 */
export function transformToFormData(data, accessType = '[]') {
	if (!isObject(data)) {
		throw new Error(`不支持将 ${getType(data)} 格式数据转为 FormData 格式。`);
	}
	const fd = new FormData();

	function travel(value, path) {
		if (isObject(value)) {
			Object.keys(value).forEach((key) => {
				if (accessType === '[]') {
					travel(value[key], `${path}[${key}]`);
				} else {
					travel(value[key], `${path}.${key}`);
				}
			});
		} else if (Array.isArray(value)) {
			value.forEach((item, index) => {
				travel(item, `${path}[${index}]`);
			});
			// 非Object、Array不再处理，特殊情况自行添加
		} else {
			fd.append(path, value);
		}
	}

	Object.keys(data).forEach((key) => {
		travel(data[key], key);
	});

	return fd;
}
