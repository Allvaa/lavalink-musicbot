const util = require("../util");

module.exports = {
    name: "source",
    aliases: ["src"],
    exec: (ctx) => {
        ctx.respond(util.embed().setDescription("✅ | [Here](https://github.com/Allvaa/lavalink-musicbot) is the open source repository this bot uses."));
    }
};
