const Discord = require("discord.js");

class Util {
    static checkCondition(condition) {
        let cond = condition.replaceAll('&&', "#__AND__#")
        cond = cond.replaceAll('||', '#__OR__#')
        cond = cond.replaceAll('"', '\\"')

        cond = '"' + cond + '"'
        cond = cond.replaceAll('==', '"=="')
        cond = cond.replaceAll('!=', '"!="')
        cond = cond.replaceAll('>', '">"')
        cond = cond.replaceAll('<', '"<"')
        cond = cond.replaceAll('>=', '">="')
        cond = cond.replaceAll('<=', '"<="')
        cond = cond.replaceAll('#__AND__#', '"&&"')
        cond = cond.replaceAll('#__OR__#', '"||"')
        const condArray = cond.split('"')
        condArray.forEach(z => {
            if (z == '') return z
            if (!isNaN(Number(z))) {
                cond = cond.replace('"' + z + '"', z)
            }
            if (z == 'true' || z == 'false') {
                cond = cond.replace('"' + z + '"', z)
            }
        });
        const result = eval(cond);
        return result == true || result == false ? result : false;
    }
    static embedParser(message) {
        let content = message;
        let embeds = [];
        if (message?.includes("{createEmbed:")) {
            const raw = message.split("{createEmbed:").slice(1);
            for (const sp of raw) {
                let embed = {};
                embed.fields = [];
                let insides = sp.slice(0, sp.lastIndexOf("}"));
                if (Check(insides, "title")) {
                    const title = Inside(insides, "title").split(":");
                    embed.title = title[0]?.unescape()
                    if (title[1] !== undefined) embed.url = title.slice(1).join(":")?.unescape();
                };
                if (Check(insides, "description")) {
                    embed.description = Inside(insides, "description")?.unescape();
                };
                if (Check(insides, "color")) {
                    embed.color = Inside(insides, "color")?.unescape();
                };
                if (Check(insides, "thumbnail")) {
                    embed.thumbnail = {
                        url: Inside(insides, "thumbnail")?.unescape()
                    };
                };
                if (Check(insides, "author")) {
                    embed.author = {};
                    const inside = Inside(insides, "author").split(":");
                    embed.author.name = inside[0]?.unescape();
                    const inside1 = inside.slice(1).join(":");
                    if (inside1 !== undefined) embed.author.icon_url = inside1?.unescape();
                };
                if (Check(insides, "authorUrl")) {
                    if (embed.author) {
                        embed.author.url = Inside(insides, "authorUrl")?.unescape();
                    }
                };
                if (Check(insides, "field")) {
                    const ins = insides.split("{field:").slice(1);
                    for (const uh of ins) {
                        const insideField = uh.split("}")[0];
                        const inside = insideField.split(":");
                        embed.fields.push({
                            name: inside[0]?.unescape(),
                            value: inside[1]?.unescape(),
                            inline: inside[2] ? inside[2] === "yes" : false
                        })
                    }
                };
                if (Check(insides, "image")) {
                    embed.image = {
                        url: Inside(insides, "image")?.unescape()
                    };
                };
                if (Check(insides, "footer")) {
                    const inside = Inside(insides, "footer").split(":");
                    embed.footer = {};
                    embed.footer.text = inside[0]?.unescape()
                    if (inside[1] !== undefined) embed.footer.icon_url = inside.slice(1)?.unescape();
                };
                if (Check(insides, "addTimestamp")) {
                    const ins = Inside(insides, "addTimestamp")
                    embed.timestamp = ins.trim() === "" ? Date.now() : Number(ins);

                };
                embeds.push(embed)
                content = content.replace("{createEmbed:" + insides + "}", "")
            }
            return {
                content: content === "" ? " " : content?.unescape(),
                embeds: embeds
            };
        } else return {
            content: message?.unescape() || " ",
            embeds
        };
        function Check(sp, text) {
            return sp.includes(`{${text}:`)
        }

        function Inside(sp, text) {
            const a = sp.split("{" + text + ":")[1].split("}")
            return a[0]
        }
    }

    static get channelTypes() {
        return {
            Text: Discord.ChannelType.GuildText,
            Voice: Discord.ChannelType.GuildVoice,
            Category: Discord.ChannelType.GuildCategory,
            DM: Discord.ChannelType.DM,
            Announcement: Discord.ChannelType.GuildAnnouncement,
            AnnouncementThread: Discord.ChannelType.AnnouncementThread,
            PublicThread: Discord.ChannelType.PublicThread,
            PrivateThread: Discord.ChannelType.PrivateThread,
            Stage: Discord.ChannelType.GuildStageVoice,
            Forum: Discord.ChannelType.GuildForum,
            Media: Discord.ChannelType.GuildMedia,
            GuildDirectory: Discord.ChannelType.GuildDirectory,
            GroupDM: Discord.ChannelType.GroupDM
        };
    }

    static get threadTypes() {
        return {
            public: Discord.ChannelType.PublicThread,
            private: Discord.ChannelType.PrivateThread
        };
    }


     static async fetchMembers(guild, options) {
     return guild.members.fetch(options);
    }

    static getMember(guild, id) {
        let member = guild.members.cache.get(id);
        if (!member) member = this.fetchMember(guild, id);
        return member;
    }

    static getMembers(guild, options = { type: "startsWith", query: "", limit: 10 }, force = false) {
        let members;
        if (!force) {
            members = guild.members.cache.filter((x) => x.user.username.toLowerCase()[options.type](options.query) || x.displayName?.toLowerCase()[options.type](options.query)).first(options.limit);
        } else {
            members = this.fetchMembers(guild, options);
        }
        return members;
    }

    static async fetchUser(d, userid) {
        const user = await d.client.users.fetch(userid, { force: true }).catch(x => { })
        return user;
    }
    static async getUser(d, userid) {
        let user = d.client.users.cache.get(userid)
        if (!user) user = await this.fetchUser(d, userid)
        return user;
    }

    static async fetchMessage(channel, id) {
        try {
            return await channel.messages.fetch(id, { force: true });
        } catch (err) {
            return undefined;
        }
    }
    static async getMessage(channel, id) {
        let message = await channel.messages.cache.get(id, { force: true });
        if (!message) message = await this.fetchMessage(channel, id);
        return message;
    }

    static async fetchChannel(d, id) {
        try {
            return await d.client.channels.fetch(id, { force: true });
        } catch (e) {
            return undefined;
        }
    }

    static getChannel(d, id, force = false) {
        if (d.channel?.id === id) return d.channel;
        else {
            let channel = d.client.channels.cache.get(id);
            if (!channel && force) channel = this.fetchChannel(d, id);
            return channel;
        }
    }

    static async fetchGuildChannel(guild, channelid) {
        const channel = await guild.channels.fetch(channelid, { force: true }).catch(x => { })
        return channel;
    }
    static async getGuildChannel(guild, channelid) {
        let channel = guild.channels.cache.get(channelid)
        if (!channel) channel = await this.fetchGuildChannel(guild, channelid)
        return channel;
    } 
    static async fetchGuild(d, id) {
        const guild = await d.client.guilds.fetch(id, { force: true }).catch(x => { })
        return guild;
    }
    static async getGuild(d, id) {
        let guild = d.client.guilds.cache.get(id)
        if (!guild) guild = await this.fetchGuild(d, id)
        return guild;
    }
    static async getRole(guild, id) {
        try {
            let role = guild.roles.cache.get(id);
            if (!role) role = await this.fetchRole(guild, id);
            return role;
        } catch (err) {
            return undefined;
        }
    }
    static async fetchRole(guild, id) {
        try {
            return await guild.roles.fetch(id, { force: true });
        } catch (err) {
            return undefined;
        }
    }

    static getEmoji(d, Emoji) {
        if (!Emoji) return;
        if (Emoji.includes(":")) {
            Emoji = Emoji.split(":")[2].split(">")[0];
        }

        const clientEmojis = d.client.emojis.cache.find((x) => x.name.toLowerCase().addBrackets() === Emoji.toLowerCase() || x.id === Emoji || x.toString() === Emoji);

        if (clientEmojis) return clientEmojis;

        const application = d.client.application;
        const fetchEmojis = application.emojis.cache.size ? Promise.resolve() : application.emojis.fetch();

        return fetchEmojis.then(() => {
            const appEmojis = application.emojis.cache.find((x) => x.name.toLowerCase().addBrackets() === Emoji.toLowerCase() || x.id === Emoji || x.toString() === Emoji);

            return appEmojis;
        });
    }
    
    static getSticker(guild, Sticker) {
        return guild.stickers.cache.find((x) => x.name.toLowerCase() === Sticker.toLowerCase().addBrackets() || x.id === Sticker);
    }

    static findMember(guild, memberResolver) {
        return guild.members.cache.findKey(
            (x) =>
                x.displayName.toLowerCase() === memberResolver.toLowerCase() ||
                x.user.username.toLowerCase() === memberResolver.toLowerCase() ||
                x.id === memberResolver ||
                x.toString() === memberResolver
        );
    }

    static findGuildChannel(guild, ChannelResolver) {
        return guild.channels.cache.findKey((x) => x.name.toLowerCase() === ChannelResolver.toLowerCase() || x.id === ChannelResolver || x.toString() === ChannelResolver);
    }

    static findChannel(client, ChannelResolver) {
        return client.channels.cache.findKey((x) => x.name.toLowerCase() === ChannelResolver.toLowerCase() || x.id === ChannelResolver || x.toString() === ChannelResolver);
    }

    static findRole(guild, RoleResolver) {
        return guild.roles.cache.findKey((x) => x.name.toLowerCase() === RoleResolver.toLowerCase() || x.id === RoleResolver || x.toString() === RoleResolver);
    }

    static findUser(client, UserResolver) {
        return client.users.cache.findKey(
            (x) => x.username.toLowerCase() === UserResolver.toLowerCase() || x.tag.toLowerCase() === UserResolver.toLowerCase() || x.id === UserResolver || x.toString() === UserResolver
        );
    }

    static findRoles(guild, options = { type: "startsWith", query: "", limit: 10 }) {
        return guild.roles.cache
            .filter((x) => {
                return x.name.toLowerCase()[options.type](options.query.toLowerCase());
            })
            .first(options.limit);
    }
}

module.exports = Util;
