const util = require("../util");
const Discord = require('discord.js');

module.exports = {
    name: "removedupes",
    aliases: ["rdp"],
    description: "Removes All The Dupes In The Queue.",
    exec: (msg) => {
        const { music } = msg.guild;
        var seen = new Discord.Collection();

        if (!music.player || !music.player.playing) return msg.channel.send(util.embed().setDescription("❌|  Currently not playing anything."));
        if (!music.queue.length) return msg.channel.send(util.embed().setDescription("❌ | Queue is empty."));

        if (!msg.member.voice.channel)
            return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));
        try {
            music.queue.forEach(song => {
                if(!seen.has(song.track)) seen.set(song.track, song);
            });
            
            music.queue = seen.array()
            
            msg.channel.send(util.embed().setDescription("✅ | Removed all Dupes")).catch(e => e);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};
