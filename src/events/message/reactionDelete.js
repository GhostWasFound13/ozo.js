module.exports = async (msg, emoji, bot) => {
    let data = {
        author: msg.author,
        guild: msg.guild,
        member: msg.member,
        message: msg
    }
    const cmds = bot.cmd.reactionRemove.values()
    for (const cmd of cmds) {
        if (cmd?.channel?.includes("$")) {
            data.channel = bot.client.channels.cache.get(await require("../../function.js")(cmd?.channel, "channeleval", bot.db, data, bot.client, bot))
        }
        else {
            data.channel = bot.client.channels.cache.get(cmd?.channel)
        }
        require("../../function.js")(cmd?.code, "reactionRemove", bot.db, data, bot.client, bot, { emoji })
    }
}
