const { nameValidate } = require('../../utils');

module.exports = {
  description: 'generate vue component',
  prompts: [
  	{
			type: 'input',
			name: 'name',
			message: 'component name please',
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
		}
  ],
  actions: data => {
    const name = '{{properCase name}}';

		return [{
			type: 'add',
			path: `src/components/${name}/index.vue`,
			templateFile: 'plop/template/component/index.hbs',
			data: {
				name,
				script: data.blocks.includes('script'),
				style: data.blocks.includes('style')
			}
		}]
  }
}
