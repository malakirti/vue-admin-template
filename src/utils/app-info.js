export default function getAppInfo(log) {
	const env = process.env.NODE_ENV;
	const name = process.env.__APP_NAME__;
	const version = process.env.__APP_VERSION__;
	const prodUpdateTime = new Date(process.env.__APP_UPGRADE_TIME__).toLocaleString();
	const devUpdateTime = new Date().toLocaleString();
	const time = env === 'development' ? `刷新于: ${devUpdateTime}` : `发布于: ${prodUpdateTime}`;

	if (log) {
		const pd = 'padding:2px 4px;font-size:14px;font-weight:700';
		const br = (dir, size) => `border-top-${dir}-radius:${size}px;border-bottom-${dir}-radius:${size}px`;
		const nameStyle = `${pd};color:#f90;background:#000;${br('left', 3)};`;
		const versionStyle = `${pd};color:#fff;background:#007ec6;`;
		const envStyle = `${pd};color:#fff;background:#3c1;`;
		const timeStyle = `${pd};color:#fff;background:#dfb317;${br('right', 3)};`;
		console.log(`%c${name}%cv${version}%c${env}%c${time}`, nameStyle, versionStyle, envStyle, timeStyle);
	}

	return {
		name,
		version,
		time,
		env,
	};
}
