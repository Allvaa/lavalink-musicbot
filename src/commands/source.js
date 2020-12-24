const util = require("../util");

module.exports = {
    name: "source",
    aliases: ["src"],
    exec: (msg) => {
        msg.channel.send(util.embed().setDescription("✅ | [Here](https://github.com/Allvaa/lavalink-musicbot) is the open source repository this bot uses."));
    }
};
