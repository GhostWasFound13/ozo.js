module.exports = async (channel, bot) => {
    let data = {
        guild: channel.guild,
        channel: channel
    }
    const cmds = bot.cmd.channelDelete.values()
    for (const cmd of cmds) {
        let executionChannel;
        if (cmd?.channel?.includes("$")) {
            executionChannel = bot.client.channels.cache.get(await require("../../function.js")(cmd?.channel, "channeleval", bot.db, data, bot.client, bot));
        } else {
            executionChannel = bot.client.channels.cache.get(cmd?.channel);
        }
        data.executionChannel = executionChannel;

        require("../../function.js")(cmd?.code, "channelDelete", bot.db, data, bot.client, bot);
    }
}
