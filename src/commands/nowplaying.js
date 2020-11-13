module.exports = {
    name: "nowplaying",
    aliases: ["np", "nowplay"],
    exec: (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send("Currently not playing anything.");
        if (!msg.member.voice.channel)
            return msg.channel.send("You must be on a voice channel.");
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`You must be on ${msg.guild.me.voice.channel} to use this command.`);

        msg.channel.send(`Now playing: ${music.current.info.title}`);
    }
};
