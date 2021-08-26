const prettyMs = require("pretty-ms");
const util = require("../util");
const { mem, cpu} = require("node-os-utils");
module.exports = {
    name: "stats",
    description: "Check nodes stats",
    exec: async (ctx) => {
        /** @type {import("lavacord").LavalinkNode[]} */
        const nodes = [...ctx.client.shoukaku.nodes.values()];
        const { totalMemMb, usedMemMb } = await mem.info();
        const serverStats = `\`\`\`asciidoc
CPU  :: ${cpu.model()}
Cores :: ${cpu.count()}
CPU Usage :: ${await cpu.usage()} %
RAM :: ${totalMemMb} MB
RAM Usage :: ${usedMemMb} MB \`\`\``;        
        const [lavalink] = nodes.map(node  => {
            const cpuLoad = (node.stats.cpu.lavalinkLoad * 100).toFixed(2);
            const memUsage = (node.stats.memory.used / 1024 / 1024).toFixed(2);
            const uptime = prettyMs(node.stats.uptime, { verbose: false, secondsDecimalDigits: 0 });
            return `\`\`\`asciidoc
Lavalink ID        :: ${node.name.toUpperCase()}
Lavalink Status    :: ${node.state === 1 ? "Connected" : "Disconnected"}
${node.state === 1 ? `
CPU Load :: ${cpuLoad}%
Memory Usage :: ${memUsage} MB
Lavalink Player Uptime :: ${uptime}
Lavalink Players :: ${node.stats.playingPlayers} of ${node.stats.players} Playing` : ""}\`\`\``;});        
        ctx.respond({ embeds: [util.embed()
            .setAuthor("Lavalink Node(s) Stats", ctx.client.user.displayAvatarURL())
            .setTitle("Source Code")
            .setURL("https://github.com/Allvaa/lavalink-musicbot")
            .addField("Server",serverStats)
            .addField("Lavalink",lavalink)
            .setTimestamp()
        ] });
    }
};
