const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	name: 'help',
	description: 'provides a list of all commands and their descriptions',

	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		const embed = new Discord.MessageEmbed()
			.setColor('#32c32c')
			.setTitle('Command Help');
			// .addField('\u200B', '\u200B', false);

		const fileList = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		for (const file of fileList) {
			const command = require(path.resolve(__dirname, `./${file}`));
			embed.addField(command.name, command.description, false);
		}

		message.channel.send(embed);
	},
};