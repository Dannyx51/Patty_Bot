// main imports
const fs = require('fs');
const jsonfile = require('jsonfile');
const random = require('random');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
require('dotenv').config();

// importing all commands
const commandList = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandList) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const prefix = process.env.prefix;

var profiles = {};
if (fs.existsSync('profiles.json')) {
	profiles = jsonfile.readFileSync('profiles.json');
}

client.once('ready', () => {
	console.log('Ready!');
});

// leveling system
client.on('message', message => {
	if (message.author.bot) return;
	if (message.content.startsWith(prefix)) return;

	// create entry in the json file if you don't have an entry for this user.
	if (message.author.id in profiles === false) {
		profiles[message.author.id] = {
			xp: 0,
			level: 0,
			description: 'a person on the internet',
			embed_color: '#32c32c',
		};
	}

	const userStats = profiles[message.author.id];
	userStats.xp += random.int(15, 25);

	const xpToNxtLevel = 5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100;

	// level up if xp meets next level requirements
	if (userStats.xp >= xpToNxtLevel) {
		userStats.level += 1;
		userStats.xp -= xpToNxtLevel;
		message.channel.send(message.author.username + ' has reached level ' + userStats.level + '!');
	}

	// log xp to console for debug purposes.
	console.log(message.author.username + ' : ' + userStats.xp + ' / ' + xpToNxtLevel);

	// save to a file for various reasons lol
	jsonfile.writeFileSync('profiles.json', profiles);

});

// command handling
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
	} catch(error) {
		console.error(error);
		message.reply("Wack");
	}
});

client.login(process.env.token);
