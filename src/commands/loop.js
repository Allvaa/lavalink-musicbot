const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { awaitSelection } = require("../util");
const util = require("../util");

const modes = ["None", "Track", "Queue"];

module.exports = {
    name: "loop",
    aliases: ["repeat"],
    exec: async (ctx) => {
        const { music } = ctx;
        if (!music.player) return ctx.respond({
            embeds: [util.embed().setDescription("❌ | Currently not playing anything.")]
        });

        if (!ctx.member.voice.channel)
            return ctx.respond({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")]
            });
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)]
            });

        const selectMsg = await ctx.respond({
            embeds: [
                util.embed()
                    .setDescription(`✅ | Current loop mode: ${modes[music.loop]}`)
                    .setFooter("Just click on the select menu if you wish to change it")
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId("selected")
                            .setPlaceholder("Nothing selected")
                            .addOptions([
                                {
                                    label: "None",
                                    description: "Disable loop",
                                    value: "0",
                                },
                                {
                                    label: "Track",
                                    description: "Repeat one track only",
                                    value: "1",
                                },
                                {
                                    label: "Queue",
                                    description: "Repeat all tracks in the queue",
                                    value: "2",
                                }
                            ])
                    )
            ]
        });

        const selected = await awaitSelection(selectMsg, interaction => interaction.user.equals(ctx.author));
        if (!selected) return selectMsg.edit({ embeds: [selectMsg.embeds[0].setFooter("")], components: [] });
        await selected.deferUpdate();

        music.loop = parseInt(selected.values[0]);
        selected.editReply({ embeds: [util.embed().setDescription(`✅ | Set loop mode to: ${modes[music.loop]}`)], components: [] });
    }
};
