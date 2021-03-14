const util = require("../util");
const { readFileSync } = require("fs");
const fs = require("fs");

module.exports = {
    name: "setprefix",
    aliases: ["prefix", "pre"],
	  exec: (msg, args) => {
		 
		 msg.delete({ timeout: 000 /*time unitl delete in milliseconds*/});

		let prefixes = JSON.parse(readFileSync('./prefixes.json', "utf8"));
		
         if(!prefixes[msg.guild.id]){
			 prefixes[msg.guild.id] = {
				 prefix: process.env.PREFIX
			 }
		 }

let prefix  = prefixes[msg.guild.id].prefix;

if (msg.member.id === process.env.OWNER_ID) {
	
	if (!args[0])
		return msg.channel.send(util.embed().setDescription("❌ | You Need to Provide a Prefix.")
			
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));
	
	 prefixes[msg.guild.id] = {
				prefix: args[0].toLowerCase()
			}	
			fs.writeFile('./prefixes.json', JSON.stringify(prefixes, null, 2), (err) => {
        if (err) console.log(err);
    })
	
	msg.channel.send(util.embed()
		.setTitle(`*Prefix Changed*`)
		.setDescription(`The Prefix is Now **${args[0].toUpperCase()}**`)
		.setAuthor(`${msg.guild.name} Prefix`, msg.client.user.displayAvatarURL())
		
		.setThumbnail(msg.guild.iconURL)
		.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
		.setTimestamp()
		).then(msg => msg.delete({ timeout: 20000 }));
		return;
};

if (!msg.member.hasPermission('ADMINISTRATOR'))
		return msg.channel.send(util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")
			
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));
			
			
			if (!args[0])
		return msg.channel.send(util.embed().setDescription("❌ | You Need to Provide a Prefix.")			
			.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()).then(msg => msg.delete({ timeout: 10000 }));
		 
		  prefixes[msg.guild.id] = {
				prefix: args[0].toLowerCase()
			}	
			fs.writeFile('./prefixes.json', JSON.stringify(prefixes, null, 2), (err) => {
        if (err) console.log(err);
    })	
        msg.channel.send(util.embed()
		.setTitle(`*Prefix Changed*`)
		.setDescription(`The Prefix is Now **${args[0].toUpperCase()}**`)
		.setAuthor(`${msg.guild.name} Prefix`, msg.client.user.displayAvatarURL())
		
		.setThumbnail(msg.guild.iconURL)
		.setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
		.setTimestamp()
		).then(msg => msg.delete({ timeout: 20000 }));
    }
};
