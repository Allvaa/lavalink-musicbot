const config = require("./config.json");
const request = require("node-superfetch");
const { Client, Collection } = require("discord.js");
const { PlayerManager } = require("discord.js-lavalink");

const client = new Client({disableEveryone: true});
const queue = new Collection();

client.on("ready", () => {
    client.player = new PlayerManager(client, config.nodes, {
        user: client.user.id,
        shards: client.shard ? client.shard.count : 0
    });
    console.log("Bot is online!");
});

client.on("error", console.error);
client.on("warn", console.warn);

client.on("message", async msg => {
    if (msg.author.bot || !msg.guild) return;
    if (!msg.content.startsWith(config.prefix)) return;
    const serverQueue = queue.get(msg.guild.id);
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "play") {
        if (!msg.member.voiceChannel) return msg.channel.send("You must be in a voice channel for this command.");

        const track = args.join(" ");
        const song = await getSongs(`ytsearch: ${track}`);
        if (!song[0]) return msg.channel.send("No songs found. try again!");

        return handleVideo(msg, msg.member.voiceChannel, song[0]);
    };
    if (command === "leave") {
        if (!serverQueue) return msg.channel.send("This server doesn't have a queue");
        client.player.leave(msg.guild.id);
        queue.delete(msg.guild.id)
        return msg.channel.send("Successfully left the voice channel");
    };
    if (command === "skip") {
        if (!serverQueue) return msg.channel.send("This server doesn't have a queue");
        if (serverQueue.playing === false) serverQueue.playing = true;
        serverQueue.player.stop();
        return msg.channel.send("Song skipped");
    };
    if (command === "nowplaying") {
        if (!serverQueue) return msg.channel.send("This server doesn't have a queue");
        if (serverQueue.playing === false) return msg.channel.send("Not playing anything because the queue is paused")
        return msg.channel.send(`Now playing: **${serverQueue.songs[0].info.title}** by *${serverQueue.songs[0].info.author}*`);
    };
    if (command === "queue") {
        let index = 1;
        if (!serverQueue) return msg.channel.send("This server doesn't have a queue");
        return msg.channel.send(`
**Current Queue**

${serverQueue.songs.map(songs => `**${index++}.** ${songs.info.title}`).splice(0, 10).join("\n")}
${serverQueue.songs.length <= 10 ? "" : `And ${serverQueue.songs.length - 10} more..`}
`);
    };
    if (command === "pause") {
        if (!serverQueue) return msg.channel.send("This server doesn't have a queue");
        if (serverQueue.playing === false) return msg.channel.send("Queue already paused");
        const player = client.player.get(msg.guild.id);
        if (!player) return msg.channel.send("No Lavalink player found");
        player.pause(true);
        serverQueue.playing = false;
        return msg.channel.send("Paused the music");
    };
    if (command === "resume") {
        if (!serverQueue) return msg.channel.send("This server doesn't have a queue");
        if (serverQueue.playing === true) return msg.channel.send("Queue is being played");
        const player = client.player.get(msg.guild.id);
        if (!player) return msg.channel.send("No Lavalink player found");
        player.pause(false);
        serverQueue.playing = true;
        return msg.channel.send("Resumed the music");
    };
    if (command === "loop") {
        if (!serverQueue) return msg.channel.send("This server doesn't have a queue");
        serverQueue.loop = !serverQueue.loop;
        return msg.channel.send(`Loop has been ${serverQueue.loop ? "enabled" : "disabled"}`);
    };
    if (command === "volume") {
        if (!serverQueue) return msg.channel.send("This server doesn't have a queue");
        if (!args[0]) {
            return msg.channel.send(`The current volume is **${serverQueue.volume}%**.`);
        } else {
            let value = args[0];
            if (isNaN(value)) return msg.channel.send("The value must be a number!");
            value = parseInt(value);
            serverQueue.volume = value;
            return msg.channel.send(`Successfully set the volume to **${value}%**.`);
        };
    };
});

async function getSongs(search) {
    const node = client.player.nodes.first();

    const params = new URLSearchParams();
    params.append("identifier", search);

    let result;
    try {
        result = await request.get(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`)
            .set('Authorization', node.password);
        } catch (e) {
            return e.message;
        };
    return result.body.tracks;
};

async function handleVideo(msg, voiceChannel, song) {
    let serverQueue = queue.get(msg.guild.id);
    song.requestedBy = msg.author;
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel,
            player: null,
            songs: [song],
            volume: 100,
            playing: true,
            loop: false
        };
        queue.set(msg.guild.id, queueConstruct);
        
        try {
			queueConstruct.player = await client.player.join({
                guild: msg.guild.id,
                channel: msg.member.voiceChannel.id,
                host: client.player.nodes.first().host
            }, { selfdeaf: true });
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
            client.player.leave(msg.guild.id)
			return msg.channel.send(`I could not join the voice channel: ${error.message}`);
		};
    } else {
        serverQueue.songs.push(song);
        return msg.channel.send(`Successfully added **${song.info.title}** to queue!`);
    };
    return;
};

function play(guild, song) {
    let serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.textChannel.send("No more queue to play. The player has been stopped")
        client.player.leave(guild.id);
        queue.delete(guild.id);
        return;
    } else {
        serverQueue.player.play(song.track)
            .once("error", console.error)
            .once("end", data => {
                if (data.reason === "REPLACED") return;
                console.log("Song has ended...");

                const shiffed = serverQueue.songs.shift();
                if (serverQueue.loop === true) {
                    serverQueue.songs.push(shiffed);
                };
                play(guild, serverQueue.songs[0])
            });
        serverQueue.player.volume(serverQueue.volume);
        return serverQueue.textChannel.send(`Now playing: **${song.info.title}** by *${song.info.author}*`);
    };
};


client.login(config.token);
