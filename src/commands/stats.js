const prettyMs = require("pretty-ms");
const util = require("../util");

module.exports = {
    name: "stats",
    description: "Check nodes stats",
    exec: (ctx) => {
        /** @type {import("lavacord").LavalinkNode[]} */
        const nodes = [...ctx.client.shoukaku.nodes.values()];

        ctx.respond({ embeds: [util.embed()
            .setAuthor("Lavalink Node(s) Stats", ctx.client.user.displayAvatarURL())
            .setTitle("Source Code")
            .setURL("https://github.com/Allvaa/lavalink-musicbot")
            .setDescription(
                nodes.map(node  => {
                    const cpuLoad = (node.stats.cpu.lavalinkLoad * 100).toFixed(2);
                    const memUsage = (node.stats.memory.used / 1024 / 1024).toFixed(2);
                    const uptime = prettyMs(node.stats.uptime, { verbose: true, secondsDecimalDigits: 0 });

                    return `\`\`\`asciidoc
ID        :: ${node.name}
Status    :: ${node.state === 1 ? "Connected" : "Disconnected"}
${node.state === 1 ? `
CPU Load  :: ${cpuLoad}%
Mem Usage :: ${memUsage} MB
Uptime    :: ${uptime}
Players   :: ${node.stats.playingPlayers} of ${node.stats.players} playing` : ""}\`\`\``;
                }).join("\n")
            )
            .setTimestamp()
        ] });
    }
};
