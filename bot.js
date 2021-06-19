// main imports
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
require('dotenv').config();

// importing all commands
const commandList = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandList) {
	const command = require(`./commands/${file}`);
	client.command.set(command.name, command);
}

const prefix = process.env.prefix;

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim.split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.command.get(command).execute(message, args);
	} catch(error) {
		console.error(error);
		message.reply("Wack");
	}
});

client.login(process.env.token);
