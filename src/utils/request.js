/**
 * |  方法      |  请求是否有主体  |  成功的响应是否有主体  |  安全  |  幂等  |  可缓存               |  HTML 表单是否支持  |
 * |  GET      |  否           |  是                 |  是   |  是    |  是                  |  是               |
 * |  POST     |  是           |  是                 |  否   |  否    |  是(包含新鲜度信息除外)  |  是               |
 * |  OPTIONS  |  否           |  是                 |  是   |  是    |  否                  |  否               |
 * |  HEAD     |  否           |  否                 |  是   |  是    |  是                  |  否               |
 * |  CONNECT  |  否           |  是                 |  否   |  否    |  否                  |  否               |
 * |  PUT      |  是           |  否                 |  否   |  是    |  否                  |  否               |
 * |  DELETE   |  可有          |  可有               |  否   |  是    |  否                  |  否               |
 * |  TRACE    |  否           |  否                 |  是   |  是    |  否                  |  否               |
 * |  PATCH    |  是           |  是                 |  否   |  否    |  否                  |  否               |
 */
import qs from 'qs';
import axios from 'axios';
import globalConfig from '@/config';
import ApiResponseException from './exception';
import { getQueryString } from './functions';

const { environment, baseUrls } = globalConfig;
const codeMessageMap = new Map([
	[200, '服务器成功返回请求的数据。'],
	[201, '新建或修改数据成功。'],
	[202, '一个请求已经进入后台排队（异步任务）。'],
	[204, '删除数据成功。'],
	[400, '请求不正确。'],
	[401, '没有登录。'],
	[403, '没有权限。'],
	[404, '发出的请求针对的是不存在的记录，服务器没有进行操作。'],
	[406, '请求的格式不可得。'],
	[408, '请求超时'],
	[410, '请求的资源被永久删除，且不会再得到的。'],
	[413, '发送内容过大。'],
	[422, '当创建一个对象时，发生一个验证错误。'],
	[500, '服务器发生错误，请检查服务器。'],
	[502, '网关错误。'],
	[503, '服务不可用，服务器暂时过载或维护。'],
	[504, '网关超时。'],
]);

function errorHandler(error) {
	const response = error.response;
	const config = response?.config;
	const status = response?.status;
	const statusText = response?.statusText;
	const serverMessage = response?.data?.message;
	const codeMessage = status ? codeMessageMap.get(status) : '';
	const message = serverMessage || codeMessage || statusText || error.message || '未知错误';

	if (config?.background) {
		// @todo 隐藏菊花图动作
	}

	// @todo message

	if (status) {
		if (status === 401) {
			// @todo 登陆
		}

		if (status === 403) {
			// @todo 权限不足
		}

		return Promise.reject(new ApiResponseException(message, status));
	}

	if (error.message.startsWith('timeout of ')) {
		return Promise.reject(new ApiResponseException(message, 408));
	}

	return Promise.reject(new ApiResponseException(message, status || -1));
}

class Request {
	constructor(env = 'production', config) {
		this.env = env;

		this.customConfig = {
			format: config?.format || 'json',
			background: !!config?.background,
			fullResponse: !!config?.fullResponse,
		};

		delete config?.format;
		delete config?.background;
		delete config?.fullResponse;

		this.client = axios.create({
			timeout: 0, // 永不超时
			withCredentials: true, // 携带cookie
			paramsSerializer: (params) => qs.stringify(params),
			...config,
		});
		this.useRequestInterceptors();
		this.useResponseInterceptors();
	}

	useRequestInterceptors() {
		this.client.interceptors.request.use(
			(config) => {
				if (config?.background) {
					// @todo 打开菊花图动作
				}

				return config;
			},
			(error) => {
				console.log(error);
			},
		);
	}

	useResponseInterceptors() {
		this.client.interceptors.response.use(
			(response) => {
				const config = response.config;
				if (config?.background) {
					// @todo 隐藏菊花图动作
				}
				// 其他自定义业务处理
				return response;
			},
			(error) => {
				return errorHandler(error);
			},
		);
	}

	request(config) {
		const relConfig = { ...this.customConfig, ...config };
		const url = relConfig.url?.replace(/^\//, '') || '';
		const apiPrefix = url.split('/')[0] || 'api';
		const baseUrlConfig = baseUrls?.[apiPrefix] || baseUrls.api;
		const baseUrl = baseUrlConfig?.[this.env].replace(/\/$/, '');

		relConfig.url = `${baseUrl}/${url}`;

		const { method, headers = {}, format = 'json', params, data } = relConfig;

		// 加戳防缓存
		if (!method || ['get', 'head'].includes(method.toLowerCase())) {
			if (params) {
				params.timestamp = Date.now();
			} else {
				relConfig.params = { timestamp: Date.now() };
			}
		}

		// 不校验method，直接处理
		if (data) {
			// @todo FormData
			// if (format.toLowerCase() === 'formdata') {
			// 	body = transformToFormData(body);
			// }

			// urlencoded
			if (format.toLowerCase() === 'urlencoded') {
				relConfig.data = qs.stringify(data);
				headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
			}
		}

		return this.client
			.request(relConfig)
			.then((response) => {
				if (relConfig.fullResponse) {
					return response;
				}

				return response.data;
			})
			.catch((error) => {
				return Promise.reject(error);
			});
	}

	/**
	 * 通过Blob下载文件，约定响应头content-disposition字段编码
	 * @param {Object} config 参数同request
	 */
	downLoadByBlob(config) {
		const fileName = config.downloadName;
		delete config.downloadName;

		this.request({
			...config,
			responseType: 'blob',
			fullResponse: true,
		}).then((res) => {
			let name = fileName || getQueryString('filename', res.headers['content-disposition'], ';');
			if (!name) {
				name = 'unknown';
			}
			const url = URL.createObjectURL(res.data);
			const el = document.createElement('a');
			el.target = '_blank';
			el.download = decodeURIComponent(name);
			el.href = url;
			el.click();
			URL.revokeObjectURL(url);
		});
	}
}

const client = new Request(environment);

export { axios, Request };
export default client;
