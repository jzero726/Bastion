/**
 * @file musicMasterRole command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

const string = require('../../handlers/languageHandler');

exports.run = async (Bastion, message, args) => {
  if (!Bastion.credentials.ownerId.includes(message.author.id)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  try {
    if (!(parseInt(args[0]) < 9223372036854775807)) {
      await Bastion.db.run(`UPDATE guildSettings SET musicMasterRole=null WHERE guildID=${message.guild.id}`);

      return message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: 'Music Master role has been removed.'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }

    let role = message.guild.roles.get(args[0]);
    if (!role) {
      /**
      * Error condition is encountered.
      * @fires error
      */
      return Bastion.emit('error', string('notFound', 'errors'), string('roleNotFound', 'errorMessage'), message.channel);
    }

    await Bastion.db.run(`UPDATE guildSettings SET musicMasterRole=${args[0]} WHERE guildID=${message.guild.id}`);

    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `**${role.name}** has been set as the Music Master role.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'musicmaster' ],
  enabled: true
};

exports.help = {
  name: 'musicmasterrole',
  description: string('musicMasterRole', 'commandDescription'),
  botPermission: '',
  userPermission: 'BOT_OWNER',
  usage: 'musicMasterRole [ROLE_ID]',
  example: [ 'musicMasterRole 319225727067095043', 'musicMasterRole' ]
};
