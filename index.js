const botconfig = require('./botconfig.json');
const Discord = require('discord.js');
const request = require('request');

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`)
    bot.user.setActivity("på GlobeLAN!");
});

bot.on("error", console.error);

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix= botconfig.prefix;
    let messageArray = message.content.split(" ");

    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}hello`) {
        return message.channel.send("Hello!");
    }
    if (cmd === `${prefix}botinfo`) {
        let botembed = new Discord.RichEmbed()
            .setDescription ("Bot Information")
            .setColor("#15f153")
            .addField("Bot Name", bot.user.username);
        return message.channel.send(botembed);
    }
    if (cmd === `${prefix}plasser`) {
        //return message.channel.send("Jada, jeg jobber med det!");
        request(botconfig.partysys_url + '/?api=seatmap', {json: true}, (err, res, body) => {
            if (err) {return console.log(err);}
            //console.log(body);
            //console.log(body.eventinfo.name);
            if(!body.seating_enabled) {
                // Seatmap is not yet opened!
                console.log("Seatmap not yet opened");
                let serverembed = new Discord.RichEmbed()
                    .setDescription("Plassregistering er ikke åpnet ennå!")
                    .setColor("#FF0000")
                    .addField("Plasskart er ikke åpnet ennå. Sjekk websiden for når det er planlagt åpning!");
                
                return message.channel.send(serverembed);
            }
            else {
                console.log("Seatmap is open");
                let seats = +body.seats.open + +body.seats.not_open + +body.seats.password_reserved;
                let serverembed = new Discord.RichEmbed()
                    .setDescription("Plassinformasjon")
                    .setColor("#15f153")
                    .addField("Ledige plasser:", seats - body.seats_taken)
                    .addField("Totalt antall plasser:", seats)
                    .addField("Antall plasser tatt:", body.seats_taken);
                return message.channel.send(serverembed);
                }
                
            
        });
    }
});



bot.login(botconfig.token);