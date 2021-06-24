const Discord = require('discord.js');
const fs = require('fs');
const jsonfile = require('jsonfile');

var stats = {};

module.exports = {
	name: 'user',
	description: 'provides server info on a user',

	execute(message, args) {
		let user;

		// reload the stats from the json file
		if (fs.existsSync('stats.json')) {
			stats = jsonfile.readFileSync('stats.json');
		}

		user = message.author;

		if (args.length === 1 && message.mentions.users.size) {
			user = message.mentions.users.first();
		}

		if (!(user.id in stats)) {
			stats[user.id] = {
				xp: 0,
				level: 0,
				description: 'a person on the internet',
				embed_color: '#32c32c',
			};	
		}

		if (args.length > 1) {
			if (args[0].toLowerCase() === 'desc' || args[0].toLowerCase() === 'description') {
				args.shift();
				stats[user.id].description = args.join(' ');
			}
		}

		// pull user data from profiles.json
		const xp = stats[user.id].xp;
		const level = stats[user.id].level;
		const description = stats[user.id].description;
		const embed_color = stats[user.id].embed_color;
		const xpNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100;

		const embed = new Discord.MessageEmbed()
			.setColor(embed_color)
			.setTitle(user.username)
			.setDescription(description)
			.addField('Level: ' + level, xp + ' / ' + xpNextLevel, true)
			.setThumbnail(user.displayAvatarURL());
		message.channel.send(embed);

		jsonfile.writeFileSync('profiles.json', stats);
	},
};