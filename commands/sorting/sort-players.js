const commando = require('discord.js-commando');

module.exports = class SortPlayersCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'sort-players',
            aliases: ['sort', 'sort-players', 'sort-p', 'sp'],
            group: 'sort',
            memberName: 'sort-players',
            description: 'Sort players into even teams by providing League summoner names',
            args: [
                
            ]
        })
    }
}