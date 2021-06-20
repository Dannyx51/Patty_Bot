const Discord = require('discord.js');

module.exports = {
	name: 'userinfo',
	description: 'provides server info on a user',
	
	execute(message, args) {
		let user;

		if (args.length === 0) {
			user = message.author;
		} else {
			if (!message.mentions.users.size) {
				return message.reply('err: invalid format');
			}
			user = message.mentions.users.first();
		}

		const embed = new Discord.MessageEmbed()
			.setColor('#32c32c')
			.setTitle(user.username)
			.setDescription('a person on the internet')
			.addField('Level: null', 'null / null', true)
			.setThumbnail(user.displayAvatarURL());

		message.channel.send(embed);
	},
};