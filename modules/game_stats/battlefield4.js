/**
 * @file battlefield4 command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');
const request = require('request');

exports.run = (Bastion, message, args) => {
  if (!args.name) {
  // if (!args.player || !args.mode) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  request({
    uri: `https://api.bf4stats.com/api/playerInfo?plat=${args.platform}&name=${args.name}&output=json`
  }, function (err, response, body) {
    let player, url, color, title = '', description = '', data = [];

    if (err) {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', string('connection', 'errors'), string('connection', 'errorMessage'), message.channel);
    }
    else if (response.statusCode === 200) {
      color = Bastion.colors.BLUE;
      try {
        body = JSON.parse(body);

        player = `[${body.player.tag}] ${body.player.name}`;
        url = body.player.blPlayer;
        description = `Played ${(body.player.timePlayed / 60 / 60).toFixed(2)} hours`;

        data = [
          {
            name: 'Country',
            value: `:flag_${body.player.country.toLowerCase()}: ${body.player.countryName}`,
            inline: true
          },
          {
            name: 'Rank',
            value: `${body.player.rank.nr} - ${body.player.rank.name}`,
            inline: true
          },
          {
            name: 'Score',
            value: `${body.player.score}`,
            inline: true
          },
          {
            name: 'Skill',
            value: `${body.stats.skill}`,
            inline: true
          },
          {
            name: 'SPM',
            value: `${(body.stats.extra.spm).toFixed(2)}`,
            inline: true
          },
          {
            name: 'KPM',
            value: `${(body.stats.extra.kpm).toFixed(2)}`,
            inline: true
          },
          {
            name: 'Wins',
            value: `${body.stats.numWins}`,
            inline: true
          },
          {
            name: 'Losses',
            value: `${body.stats.numLosses}`,
            inline: true
          },
          {
            name: 'W/L',
            value: `${(body.stats.extra.wlr).toFixed(2)}`,
            inline: true
          },
          {
            name: 'Kills',
            value: `${body.stats.kills}`,
            inline: true
          },
          {
            name: 'Deaths',
            value: `${body.stats.deaths}`,
            inline: true
          },
          {
            name: 'K/D',
            value: `${(body.stats.extra.kdr).toFixed(2)}`,
            inline: true
          }
        ];
      }
      catch (e) {
        /**
         * Error condition is encountered.
         * @fires error
         */
        return Bastion.emit('error', string('parseError', 'errors'), string('parse', 'errorMessage'), message.channel);
      }
    }
    else {
      /**
       * Error condition is encountered.
       * @fires error
       */
      return Bastion.emit('error', `${response.statusCode}`, response.statusMessage, message.channel);
    }

    message.channel.send({
      embed: {
        color: color,
        author: {
          name: player,
          url: url
        },
        title: title,
        description: description,
        fields: data,
        footer: {
          text: 'Powered by Battlefield'
        }
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  });
};

exports.config = {
  aliases: [ 'bf4' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, alias: 'n', defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'pc' }
  ]
};

exports.help = {
  name: 'battlefield4',
  description: string('battlefield4', 'commandDescription'),
  botPermission: '',
  userPermission: '',
  usage: 'battlefield4 <player_name>',
  example: [ 'battlefield4 VVipe' ]
};
