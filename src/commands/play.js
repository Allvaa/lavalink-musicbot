module.exports = {
    name: "play",
    aliases: ["p"],
    exec: async (msg, args) => {
        if (!msg.member.voice.channel)
            return msg.channel.send("You must be on a voice channel.");
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`You must be on ${msg.guild.me.voice.channel} to use this command.`);

        const query = args.join(" ");
        const { music } = msg.guild;
        try {
            const { loadType, playlistInfo: { name }, tracks } = await music.load(isURL(query) ? query : `ytsearch:${query}`);
            if (!tracks.length) return msg.channel.send("Couldn't find any results.");
            
            if (loadType === "PLAYLIST_LOADED") {
                for (const track of tracks) {
                    track.requester = msg.author;
                    music.queue.push(track);
                }
                msg.channel.send(`Loaded \`${tracks.length}\` tracks from **${name}**.`);
            } else {
                const track = tracks[0];
                track.requester = msg.author;
                music.queue.push(track);
                if (music.player) msg.channel.send(`**${track.info.title}** added to the queue.`);
            }
            
            if (!music.player) {
                await music.join(msg.member.voice.channel);
                music.start();
            }

            music.setTextCh(msg.channel);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}`);
        }
    }
};

function isURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}