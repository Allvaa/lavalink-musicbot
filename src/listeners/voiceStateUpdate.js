module.exports = {
    name: "voiceStateUpdate",
    exec: async (client, oldState, newState) => {
        const music = client.musics.get(newState.guild.id);
        if (newState.member.user.equals(client.user) && !newState.channel && music?.player) {
            if (music.player.track) await music.stop();
            if (music.player) await music.node.leaveChannel(music.guild.id);
        }
        if (oldState.channelId !== oldState.guild.me.voice.channelId || newState.channel) return;
          if (oldState.channel?.members.size === 1 && music?.player?.track ) {
                setTimeout(() => { 
                    if (oldState.channel?.members.size === 1 && music?.player?.track) 	
                    music.node.leaveChannel(music.guild.id);
                    if (music.textChannel) music.textChannel.send({embeds:[util.embed().setDescription("✅ | Playing Alone in vc So left. Leaving voice channel..")]});
                    music.reset();
                    return;                   
                }, client.timeout ? (client.timeout * 1000) : 30000); 
            }
    }
};
