module.exports = {
    name: "voiceStateUpdate",
    exec: async (client, oldState, newState) => {
        // if the member was not cached
        if (!newState.member) await newState.guild.members.fetch(newState.id);

        const { guild: { music } } = newState;
        if (newState.member.user.equals(client.user) && !newState.channel && music.player) {
            if (music.player.playing) await music.stop();
            if (music.player) await client.manager.leave(music.guild.id);
        }
         if (oldState.channelID !==  oldState.guild.me.voice.channelID || newState.channel)
    return;
        
         if (!oldState.channel.members.size - 1 && !music.player.playing && music.player) {
    setTimeout(() => { 
      if (!oldState.channel.members.size - 1 && !music.player.playing && music.player)   
      client.manager.leave(music.guild.id); 
  music.textChannel.send(util.embed().setDescription(`I wasn't Playing Anything And No One Was there So I left.`)
					.setFooter(music.guild.name, music.guild.iconURL({ dynamic: true }))
				.setTimestamp());
      music.reset();
     }, 600000);
  } else if (!oldState.channel.members.size - 1 && music.player.playing && music.player) {
    setTimeout(() => { 
      if (!oldState.channel.members.size - 1 && music.player.playing && music.player) 	  
      client.manager.leave(music.guild.id);
         music.textChannel.send(util.embed().setDescription(`No One Was In VC So I left.`)
					.setFooter(music.guild.name, music.guild.iconURL({ dynamic: true }))
				.setTimestamp());
      music.reset();
     }, 1800000); 
  } 
    }
    
};
