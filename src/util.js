const { MessageEmbed } = require("discord.js");

module.exports = {
    embed: () => {
        return new MessageEmbed()
            .setColor("#99AAB5");
    },
    durationToMillis: (dur) => {
        return dur.split(":").map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    } 
};
