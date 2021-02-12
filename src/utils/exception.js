export default class ApiResponseException extends Error {
	constructor(message, code, data, memo) {
		super();
		this.message = message;
		this.code = code;
		this.data = data;
		this.memo = memo;
	}
	toString() {
		return `code:${this.code};message:${this.message};data:${JSON.stringify(this.data)};memo:${this.memo}`;
	}
}
