const { MessageEmbed, Permissions } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = class Util {
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

    static async pagination(msg, author, contents, init = true, currPage = 0) {
        if (init) for (const emoji of this.paginationEmojis) await msg.react(emoji);

        const collector = msg.createReactionCollector((reaction, user) => {
            return this.paginationEmojis.includes(reaction.emoji.name) && user.id === author.id;
        }, {
            max: 1,
            time: 30000
        });

        collector
            .on("collect", (reaction) => {
                reaction.users.remove(author);

                const emoji = reaction.emoji.name;
                if (emoji === this.paginationEmojis[0]) currPage--;
                if (emoji === this.paginationEmojis[1]) return collector.stop();
                if (emoji === this.paginationEmojis[2]) currPage++;
                currPage = ((currPage % contents.length) + contents.length) % contents.length;

                const embed = msg.embeds[0]
                    .setDescription(contents[currPage])
                    .setFooter(`Page ${currPage + 1} of ${contents.length}.`);

                msg.edit(embed);

                this.pagination(msg, author, contents, false, currPage);
            })
            .on("end", (_, reason) => {
                if (["time", "user"].includes(reason)) msg.reactions.removeAll();
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
};
