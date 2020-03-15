const { Client } = require("discord.js");
const MusicManager = require("./structures/MusicManager");

class MusicClient extends Client {
    /**
     * @param {import("discord.js").ClientOptions} [opt]
     */
    constructor(opt) {
        super(opt);
        this.config = require("./config.json");
        this.request = require("node-superfetch");
        this.musicManager = null;

        this.login(this.config.token);

        this
        .on("ready", () => {
            this.musicManager = new MusicManager(this);
            console.log("Bot is online!");
        })
        .on("message", async message => {
            if (message.author.bot || !message.guild) return;
            if (!message.content.startsWith(this.config.prefix)) return;
            const serverQueue = this.musicManager.queue.get(message.guild.id);
            const args = message.content.slice(this.config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            if (command === "play") {
                if (!message.member.voice.channel) return message.channel.send("You must join a voice channel to use this command.");

                const track = args.join(" ");
                const song = await this.musicManager.getSongs(`ytsearch: ${track}`);
                if (!song[0]) return message.channel.send("Couldn't find any songs.");

                this.musicManager.handleVideo(message, message.member.voice.channel, song[0]);
            }
            
            if (command === "eval") {
                if (message.author.id !== this.config.owner) return;
                if (args.join(" ").startsWith("exec") || args.join(" ").startsWith("--exec") || args.join(" ").startsWith("-ex")) {
                    const { exec } = require("child_process");
                    exec(args.slice(1).join(" "), (err, stdout, stderr) => {
                        try {
                            if (err) message.channel.send(`\`\`\`bash\n${err}\`\`\``);
                            if (stdout) message.channel.send(`\`\`\`bash\n${stdout}\`\`\``);
                            if (stderr) message.channel.send(`\`\`\`bash\n${stderr}\`\`\``);
                        } catch (e) {
                            return message.channel.send(`\`\`\`\n${e.message}\`\`\``);
                        }
                    });
                } else {
                    try {
                        let evaled = eval(args.join(" "));
                        if (typeof evaled !== "string") {
                            evaled = require("util").inspect(evaled, { depth: 0 });
                        }
                        message.channel.send(`\`\`\`js\n${evaled}\`\`\``);
                    } catch (e) {
                        return message.channel.send(`\`\`\`js\n${e.message}\`\`\``);
                    }
                }
            }
        });
    }
}

new MusicClient({
    disableMentions: "everyone"
});

exports.client = MusicClient;