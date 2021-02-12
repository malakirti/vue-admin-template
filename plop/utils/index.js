const chalk = require('chalk');

const nameValidate = () => (value) => {
	if (!value) {
		return chalk.red('Error: 请输入文件名');
	}
	if (/\s/.test(value)) {
		return chalk.red('Error: 文件名中不可出现空格');
	}
	return true;
}

module.exports = {
	nameValidate,
}
