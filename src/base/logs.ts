import {
  Message,
  MessageEmbed,
  TextChannel,
  GuildMember,
  Emoji,
  Role,
} from "discord.js";

export default class Log {
  constructor(channel: TextChannel) {
    this.channel = channel;
  }

  private channel: TextChannel;

  public async ModifiedMessages({
    oldMessage,
    newMessage,
  }: {
    oldMessage: Message;
    newMessage: Message;
  }): Promise<Message> {
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${oldMessage.author.tag}`,
        iconURL: oldMessage.author.displayAvatarURL({
          format: "png",
          dynamic: true,
        }),
      })
      .setDescription(`💬 | Message modified on : ${oldMessage.channel}.`)
      .addField("Before", oldMessage.content)
      .addField("After", newMessage.content)
      .setTimestamp()
      .setFooter({
        text: newMessage.id,
      });

    return this.channel.send({ embeds: [embed] });
  }

  public async DeletedMessages({
    message,
  }: {
    message: Message;
  }): Promise<Message> {
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({
          format: "png",
          dynamic: true,
        }),
      })
      .setDescription(`💬 | Message deleted on : ${message.channel}.`)
      .addField("Message", message.content)
      .setTimestamp()
      .setFooter({
        text: message.id,
      });

    return this.channel.send({ embeds: [embed] });
  }

  public async NewMembers({
    member,
  }: {
    member: GuildMember;
  }): Promise<Message> {
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${member.user.tag}`,
        iconURL: member.user.displayAvatarURL({
          format: "png",
          dynamic: true,
        }),
      })
      .setDescription(`🎉 | New member : ${member.user.tag}`)
      .setTimestamp()
      .setFooter({
        text: member.user.id,
      });

    return this.channel.send({ embeds: [embed] });
  }

  public async LeaveMembers({
    member,
  }: {
    member: GuildMember;
  }): Promise<Message> {
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${member.user.tag}`,
        iconURL: member.user.displayAvatarURL({
          format: "png",
          dynamic: true,
        }),
      })
      .setDescription(`😕 | Member left : ${member.user.tag}`)
      .setTimestamp()
      .setFooter({
        text: member.user.id,
      });

    return this.channel.send({ embeds: [embed] });
  }

  public async NewRoles({
    oldMember,
    newMember,
  }: {
    oldMember: GuildMember;
    newMember: GuildMember;
  }): Promise<Message<boolean> | undefined> {
    let newRole: any;
    newMember.roles.cache.forEach((role) => {
      if (!oldMember.roles.cache.has(role.id)) {
        newRole = role;
      }
    });
    if (!newRole) return;
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${oldMember.user.tag}`,
        iconURL: oldMember.user.displayAvatarURL({
          format: "png",
          dynamic: true,
        }),
      })
      .setDescription(`:tada: | Role added for ${newMember} : ${newRole}`)
      .setTimestamp()
      .setFooter({
        text: oldMember.user.id,
      });

    return this.channel.send({ embeds: [embed] });
  }

  public async DeletedRoles({
    oldMember,
    newMember,
  }: {
    oldMember: GuildMember;
    newMember: GuildMember;
  }): Promise<Message<boolean> | undefined> {
    let oldRole: any;
    oldMember.roles.cache.forEach((role) => {
      if (!newMember.roles.cache.has(role.id)) {
        oldRole = role;
      }
    });

    if (!oldRole) return;
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${oldMember.user.tag}`,
        iconURL: oldMember.user.displayAvatarURL({
          format: "png",
          dynamic: true,
        }),
      })
      .setDescription(`😕 | Role deleted for ${newMember} : ${oldRole}`)
      .setTimestamp()
      .setFooter({
        text: oldMember.user.id,
      });

    return this.channel.send({ embeds: [embed] });
  }

  public async NewChannel({ channel }: { channel: TextChannel }) {
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${channel.guild.name}`,
        iconURL: channel.guild.iconURL({
          format: "png",
          dynamic: true,
        }) as string,
      })
      .setDescription(`📁 | New channel : ${channel}`)
      .setTimestamp()
      .setFooter({
        text: channel.id,
      });
    this.channel.send({ embeds: [embed] });
  }

  public async DeletedChannel({ channel }: { channel: TextChannel }) {
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${channel.guild.name}`,
        iconURL: channel.guild.iconURL({
          format: "png",
          dynamic: true,
        }) as string,
      })
      .setDescription(`📁 | Channel deleted : ${channel}`)
      .setTimestamp()
      .setFooter({
        text: channel.id,
      });

    this.channel.send({ embeds: [embed] });
  }

  public async ChannelUpdate({
    oldChannel,
    newChannel,
  }: {
    oldChannel: TextChannel;
    newChannel: TextChannel;
  }): Promise<Message<boolean> | undefined> {
    if (oldChannel.name === newChannel.name) return;

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${oldChannel.guild.name}`,
        iconURL: oldChannel.guild.iconURL({
          format: "png",
          dynamic: true,
        }) as string,
      })
      .setDescription(`📁 | Channel updated : ${oldChannel}`)
      .addField("Before", oldChannel.name)
      .addField("After", newChannel.name)
      .setTimestamp()
      .setFooter({
        text: oldChannel.id,
      });

    return this.channel.send({ embeds: [embed] });
  }

  public async NewEmoji({ emoji }: { emoji: Emoji }) {
    const embed = new MessageEmbed()
      .setDescription(`🎉 | New emoji`)
      .setImage(emoji.url as string)
      .setTimestamp()
      .setFooter({
        text: emoji.id || emoji.identifier,
      });

    this.channel.send({ embeds: [embed] });
  }

  public async DeletedEmoji({ emoji }: { emoji: Emoji }) {
    const embed = new MessageEmbed()
      .setDescription(`😕 | Emoji deleted`)
      .setImage(emoji.url as string)
      .setTimestamp()
      .setFooter({
        text: emoji.id || emoji.identifier,
      });

    this.channel.send({ embeds: [embed] });
  }

  public async EmojiUpdate({
    oldEmoji,
    newEmoji,
  }: {
    oldEmoji: Emoji;
    newEmoji: Emoji;
  }): Promise<Message<boolean> | undefined> {
    if (oldEmoji.name === newEmoji.name) return;

    const embed = new MessageEmbed()
      .setDescription(`🎉 | Emoji updated`)
      .setImage(newEmoji.url as string)
      .addField("Before", oldEmoji.name ?? "")
      .addField("After", newEmoji.name ?? "")
      .setTimestamp()
      .setFooter({
        text: oldEmoji.id || oldEmoji.identifier,
      });

    return this.channel.send({ embeds: [embed] });
  }

  public async NewRole({ role }: { role: Role }) {
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${role.guild.name}`,
        iconURL: role.guild.iconURL({
          format: "png",
          dynamic: true,
        }) as string,
      })
      .setDescription(`🎉 | New role : ${role}`)
      .setTimestamp()
      .setFooter({
        text: role.id,
      });

    this.channel.send({ embeds: [embed] });
  }

  public async DeletedRole({ role }: { role: Role }) {
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${role.guild.name}`,
        iconURL: role.guild.iconURL({
          format: "png",
          dynamic: true,
        }) as string,
      })
      .setDescription(`😕 | Role deleted : ${role}`)
      .setTimestamp()
      .setFooter({
        text: role.id,
      });

    this.channel.send({ embeds: [embed] });
  }

  public async RoleUpdate({
    oldRole,
    newRole,
  }: {
    oldRole: Role;
    newRole: Role;
  }): Promise<Message<boolean> | undefined> {
    if (oldRole.name === newRole.name) return;

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${oldRole.guild.name}`,
        iconURL: oldRole.guild.iconURL({
          format: "png",
          dynamic: true,
        }) as string,
      })
      .setDescription(`🎉 | Role updated : ${oldRole}`)
      .addField("Before", oldRole.name)
      .addField("After", newRole.name)
      .setTimestamp()
      .setFooter({
        text: oldRole.id,
      });

    return this.channel.send({ embeds: [embed] });
  }
}
