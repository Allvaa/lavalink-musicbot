const { MessageEmbed, Permissions, MessageActionRow } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

class Util {
    static embed() {
        return new MessageEmbed()
            .setColor("#99AAB5");
    }

    static durationToMillis(dur) {
        return dur.split(":").map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    }

    static millisToDuration(ms) {
        return prettyMilliseconds(ms, { colonNotation: true, secondsDecimalDigits: 0 });
    }

    static chunk(arr, size) {
        const temp = [];
        for (let i = 0; i < arr.length; i += size) {
            temp.push(arr.slice(i, i + size));
        }
        return temp;
    }

    static isValidURL(url) {
        return /^https?:\/\/((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
            .test(url);
    }

    static shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    static get paginationEmojis() {
        return ["◀", "⛔", "▶"];
    }

    static pagination(msg, author, contents, currPage = 0) {
        /** @type {import("discord.js").InteractionCollector} */
        const collector = msg.createMessageComponentCollector({
            filter: interaction => this.paginationEmojis.includes(interaction.customId) && interaction.user.id === author.id,
            componentType: "BUTTON",
            max: 1,
            time: 15000
        });

        collector
            .on("collect", async (interaction) => {
                await interaction.deferUpdate();
                const emoji = interaction.customId;
                if (emoji === this.paginationEmojis[0]) currPage--;
                if (emoji === this.paginationEmojis[1]) return collector.stop();
                if (emoji === this.paginationEmojis[2]) currPage++;
                currPage = ((currPage % contents.length) + contents.length) % contents.length;

                const embed = interaction.message.embeds[0]
                    .setDescription(contents[currPage])
                    .setFooter(`Page ${currPage + 1} of ${contents.length}.`);

                await interaction.editReply({ embeds: [embed] });

                this.pagination(msg, author, contents, currPage);
            })
            .on("end", (collected, reason) => {
                if (reason === "time" || collected.first()?.customId === this.paginationEmojis[1]) msg.edit({
                    components: [
                        new MessageActionRow()
                            .addComponents(...msg.components[0].components.map(x => x.setDisabled(true)))
                    ]
                });
            });
    }

    /**
     * @param {import("discord.js").PermissionResolvable} memberPerms
     * @param {import("discord.js").PermissionResolvable} requiredPerms
     * @returns {import("discord.js").PermissionString[]}
     */
    static missingPerms(memberPerms, requiredPerms) {
        return new Permissions(memberPerms).missing(new Permissions(requiredPerms));
    }

    static moveArrayElement(arr, fromIndex, toIndex) {
        arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
        return arr;
    }
    
    static progress(current, total, size = 16) {
        const percent = current / total * size;
        const progbar = new Array(size).fill("▬");
        progbar[Math.round(percent)] = "🔘";
        return {
            bar: progbar.join(""),
            percent
        };
    }

    static async awaitSelection(msg, filter) {
        try {
            const selected = await msg.awaitMessageComponent(
                {   
                    filter,
                    time: 15000,
                    componentType: "SELECT_MENU"
                }
            );
            return selected;
        } catch {
            return null;
        }
    }
}

module.exports = Util;
