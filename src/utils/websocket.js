import { isString, noop } from './functions';

const ENUM_READY_STATE = {
	CONNECTING: 0,
	OPEN: 1,
	CLOSING: 2,
	CLOSED: 3,
};

export default class WS {
	constructor(props) {
		this.wsInstance = null;
		this.manualCloseCode = 4096;
		this.isManualClosed = false;
		this.heartbeatTimer = null;
		this.reCreateConnectTimer = null;

		if (isString(props)) {
			props = { debug: true, url: props };
		}

		this.heartbeat = {
			enable: true,
			message: 'h',
			delay: 6000,
			...props.heartbeat,
		};

		delete props.heartbeat;

		const { onopen = noop, onmessage = noop, onclose = noop, onerror = noop } = props;
		this.config = { ...props, onopen, onmessage, onclose, onerror };

		this._onCreateConnect();

		this._log('info', '正在建立连接...');
	}
	_onCreateConnect() {
		const { url, protocols } = this.config;
		const ps = [...(protocols || [])].filter((protocol) => protocol);

		this.wsInstance = new WebSocket(url, ps);

		this.wsInstance.addEventListener('open', this._onopen.bind(this));
		this.wsInstance.addEventListener('message', this._onmessage.bind(this));
		this.wsInstance.addEventListener('close', this._onclose.bind(this));
		this.wsInstance.addEventListener('error', this._onerror.bind(this));
	}

	/**
	 * 重连
	 * @param immediate
	 */
	_onReCreateConnect(immediate) {
		if (this.wsInstance) {
			const { readyState } = this.wsInstance;
			const { CONNECTING, OPEN } = ENUM_READY_STATE;
			if (readyState === CONNECTING || readyState === OPEN) return;
		}

		clearInterval(this.heartbeatTimer);

		clearTimeout(this.reCreateConnectTimer);

		this.reCreateConnectTimer = setTimeout(
			() => {
				if (this.isManualClosed) {
					clearTimeout(this.reCreateConnectTimer);
				} else {
					this._log('info', '正在重建连接...');

					this._onCreateConnect();
				}
			},
			immediate ? 4 : this.heartbeat.delay,
		);
	}

	/**
	 * 连接建立。如果有initMessage直接发送
	 * @param event
	 */
	_onopen(event) {
		this._log('success', '连接建立成功!');

		const { initMessage } = this.config;
		const { enable, message } = this.heartbeat;

		if (initMessage) {
			this.send(initMessage);
		} else if (enable && message) {
			this.send(message);
		}

		this.config.onopen(event);

		this._heartCheck();
	}

	/**
	 * 接收到消息
	 * @param event
	 */
	_onmessage(event) {
		this._log('success', '接收到远程消息!');

		this.config.onmessage(event);

		this._heartCheck();
	}

	/**
	 * 关闭连接。定义4096为主动关闭，其他全部异常关闭。
	 * @param event
	 */
	_onclose(event) {
		this.isManualClosed = event.code === this.manualCloseCode;

		this._log(
			'error',
			this.isManualClosed ? '连接被主动关闭!' : '连接异常关闭!',
			`${event.code}: ${event.reason}`,
		);

		this.config.onclose(event);

		// 非主动关闭重连
		if (!this.isManualClosed) {
			this._onReCreateConnect();
		}
	}

	/**
	 * 关闭连接。只要触发这个事件，都会尝试重连
	 * @param event
	 */
	_onerror(event) {
		this._log('error', '连接错误!', `${event.code}: ${event.reason}`);

		this.config.onerror(event);

		this._onReCreateConnect();
	}

	/**
	 * 发送消息。
	 * @param message
	 */
	send(message) {
		const { readyState } = this.wsInstance;
		const { CONNECTING, CLOSING, CLOSED } = ENUM_READY_STATE;

		if (readyState === CLOSING || readyState === CLOSED) {
			if (this.isManualClosed) {
				// 手动关闭，再次发消息直接抛异常
				this._log('error', '消息发送失败: 当前WebSocket连接已经被主动关闭!');

				this.config.onerror({
					code: this.manualCloseCode,
					reason: '消息发送失败: 当前WebSocket连接已经被主动关闭!',
				});

				throw new Error('消息发送失败: 当前WebSocket连接已经被主动关闭!');
			} else {
				// 这个断开情况触发了close或者error事件，会在对应的事件中直接尝试重连，这儿仅提醒
				this._log('error', '消息发送失败: 当前WebSocket断开，正在尝试重连...');

				this.config.onerror({
					reason: '消息发送失败: 当前WebSocket断开，正在尝试重连...',
				});

				this._onReCreateConnect();
			}
		} else if (readyState === CONNECTING) {
			this._log('error', '消息发送失败: 当前WebSocket正在建立连接...');

			this.config.onerror({
				reason: '消息发送失败: 当前WebSocket正在建立连接...',
			});
		} else {
			this._log('info', '向远程发送消息:', message);
			this.wsInstance.send(message);
		}
	}

	/**
	 * 获取缓冲区大小
	 * @returns {number}
	 */
	getBufferedAmount() {
		if (this.wsInstance) {
			return this.wsInstance.bufferedAmount;
		}
	}

	/**
	 * 调用此方法为主动关闭
	 * @param code 默认4096 4096为主动关闭，不会重建连接，其他code属于异常关闭，会重建连接。
	 * @param reason
	 */
	close(code, reason) {
		const { readyState } = this.wsInstance;
		const { CLOSING, CLOSED } = ENUM_READY_STATE;

		if (readyState === CLOSING || readyState === CLOSED) {
			if (this.isManualClosed) {
				this._log('error', '关闭失败: 连接已经被主动关闭!');
			} else {
				this._log('error', '关闭失败: 当前连接处于正在关闭或关闭状态!');
			}
		} else {
			this.wsInstance.close(code || this.manualCloseCode, reason);
			this._log('warn', '连接正在按预期关闭...');
		}
	}

	/**
	 * 简单心跳
	 * 服务端并不回应心跳包，所以唯一的用处也就是极端断连的情况
	 */
	_heartCheck() {
		const { enable, message, delay } = this.heartbeat;
		if (enable) {
			clearInterval(this.heartbeatTimer);

			this.heartbeatTimer = setInterval(() => {
				if (this.isManualClosed) {
					clearInterval(this.heartbeatTimer);
				} else {
					this._log('grey', '心跳检查...');

					this.send(message);
				}
			}, delay);
		}
	}

	/**
	 * log
	 * @param type
	 * @param message
	 * @param data
	 */
	_log(type, message = '默认输出...', data) {
		if (!this.config.debug) return;
		const cs = 'color:#fff;padding:1px 6px;';
		const lbr = 'border-top-left-radius:3px;border-bottom-left-radius:3px;';
		const rbr = 'border-top-right-radius:3px;border-bottom-right-radius:3px;';
		const config = {
			info: `background-color:#1475b2;${rbr}${cs}`,
			warn: `background-color:#ff9800;${rbr}${cs}`,
			success: `background-color:#00be06;${rbr}${cs}`,
			error: `background-color:#ff0000;${rbr}${cs}`,
			grey: `background-color:#606060;${rbr}${cs}`,
		};
		const styleBody = config[type];
		const styleHeader = `background-color:#fe007f;${lbr}${cs}`;

		const date = new Date().toLocaleString();

		const currentWsProtocol = this.config.url.split(':')[0];

		console.log(`%c${currentWsProtocol}[${date}]%c${message}`, styleHeader, styleBody, data || '');
	}
}
