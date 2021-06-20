module.exports = {
	name: 'prune',
	description: 'Deletes 2 - 100 messages',

	execute(message, args) {
		if (args.length === 0) args[0] = 5;

		const amount = parseInt(args[0]) + 1;

		if (isNaN(amount)) {
			return message.reply('that doesn\'t seem to be a valid number.');
		} else if (amount < 2 || amount > 100) {
			return message.reply('please pick an amount between 2 and 100.');
		}
		
		try {
			message.channel.bulkDelete(amount, true);
			message.channel.send(`Successfully pruned ${amount - 1} messages.`);
		} catch(err) {
			console.error(err);
			message.channel.send('err: could not prune all messages.');
		}

	},
};