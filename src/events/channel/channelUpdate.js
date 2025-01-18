module.exports = async (oldChannel, newChannel, bot) => {
    let data = {
        guild: newChannel.guild,
        oldChannel: oldChannel,
        newChannel: newChannel
    }
    const cmds = bot.cmd.channelUpdate.values()
    for (const cmd of cmds) {
        let executionChannel;
        if (cmd?.channel?.includes("$")) {
            executionChannel = bot.client.channels.cache.get(await require("../../function.js")(cmd?.channel, "channeleval", bot.db, data, bot.client, bot));
        } else {
            executionChannel = bot.client.channels.cache.get(cmd?.channel);
        }
        data.executionChannel = executionChannel;

        require("../../function.js")(cmd?.code, "channelUpdate", bot.db, data, bot.client, bot);
    }
}
