const { nameValidate } = require('../../utils');

module.exports = {
  description: 'generate a view',
  prompts: [
  	{
			type: 'input',
			name: 'name',
			message: 'view name please',
			validate: nameValidate('name'),
		},
		{
			type: 'checkbox',
			name: 'blocks',
			message: 'Blocks:',
			choices: [
				{
					name: '<script>',
					value: 'script',
					checked: true,
				},
				{
					name: '<style>',
					value: 'style',
					checked: true,
				},
			],
		},
  ],
  actions: data => {
    const name = '{{name}}';

		return [{
			type: 'add',
			path: `src/views/${name}/index.vue`,
			templateFile: 'plop/template/view/index.hbs',
			data: {
				name,
				script: data.blocks.includes('script'),
				style: data.blocks.includes('style'),
			},
		}];
  },
};
