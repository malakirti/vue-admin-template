import JsCookie from 'js-cookie';

const key = 'vue-admin-template';

export function getToken() {
	return JsCookie.get(key);
}

export function setToken(token) {
	return JsCookie.set(key, token);
}

export function removeToken() {
	return JsCookie.remove(key);
}
