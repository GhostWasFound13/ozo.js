# bds.js get started
bds.js is package that simplified your discord bot coding without any programming knowledge (but it's recommended to do)
fork version of easier-discord.js but this time i will try to revamp this:
update to djs v14

**To get started**:

Make sure you have node js 16 or lastest 

## Install
```
npm i ozo.js
```

after installation complete, u can now setup your main file (index.js, main.js or whatever file name u want)
## Setup
create main file (index.js) and put this code:
```javascript
const { Bot, CommandHandler } = require("ozo.js") //require bds.js bot class
const bot = new Bot({
    intents: [
        "Guilds",
        "GuildMessages",
        "MessageContent",
        "GuildMembers",
        "GuildMessageReactions"
    ],//create your bot intents, put this with your needed
    prefix: "!", //set your bot command prefix to !
   partials: ["Message", "Channel", "Reaction"]
});
bot.onMessage() //callback that execute command when there's message send, put this once in your bot

const loader = new CommandHandler({
    bot: bot
});
loader.load('./cmds');

bot.command({
    name: "ping",
    code: `
 $sendMessage[$channelId;$pingMs]
 `
})//create your first ping command
/*
    Note that $sendmessage first part (channelid) is optional
    u can pass that part
    $sendMessage[;$pingMs] will work too
*/
bot.login("TOKEN_HERE") //put your bot token here
```
After that setup, run your bot with `node index.js` in your terminal

And go to your server and type !ping, if it success bot should sended you `(botping)Ms`

Congrats! your first bot is ready to be used!
### Client presence
With easier-discord.js, you can set multiple client statuses by doing the following:
```js
const myBot = new Bot({...});
myBot.addPresence({
    text: 'Easier status', // the status text
    time: 12000, // status time
    type: 'WATCHING', // status type
    status: 'idle' // presence type
},{
    text: 'Added by CGX',
    time: '1m 20s', // Time also supports this format. (Must be number or string)
    type: 'COMPETING',
    status: 'dnd'
});

#### Command format
The command must look like this:
```js
module.exports = {
    name: 'ping',
    type: 'default',
    code: `
        $sendMessage[pong]
    `
}
```

# changelog v0.0.1-a1
- removed debug.ez
- update index.js
- adding userID, userPerms, isBotVerify,authorBanner, authorBannerColor, other thing
- update userTag, authorAvatar
- update functions.js with nested parsing
- update always.js
- adding shardEvent
- adding toUpperCase functions 



