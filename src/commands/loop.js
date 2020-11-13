module.exports = {
    name: "loop",
    aliases: ["repeat"],
    exec: (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send("Currently not playing anything.");
        if (!msg.member.voice.channel)
            return msg.channel.send("You must be on a voice channel.");
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`You must be on ${msg.guild.me.voice.channel} to use this command.`);

        music.loop = !music.loop;

        msg.channel.send(`Loop ${music.loop ? "enabled" : "disabled"}.`);
    }
};
