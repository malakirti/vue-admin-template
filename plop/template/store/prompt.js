const { nameValidate } = require('../../utils');

module.exports = {
  description: 'generate store',
  prompts: [
  	{
			type: 'input',
			name: 'name',
			message: 'store name please:',
			validate: nameValidate('name')
		},
		{
			type: 'checkbox',
			name: 'blocks',
			message: 'Blocks:',
			choices: [
				{
					name: 'actions',
					value: 'actions',
					checked: true,
				},
				{
					name: 'modules',
					value: 'modules',
					checked: false,
				}
			],
		}
  ],
  actions(data) {
    const { blocks } = data;

		return [{
			type: 'add',
			path: `src/store/modules/{{name}}.js`,
			templateFile: 'plop/template/store/index.hbs',
			data: {
				actions: blocks.includes('actions'),
				modules: blocks.includes('modules'),
			}
		}]
  }
}
