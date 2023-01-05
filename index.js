// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
var playing = false;

// Create a new client instance
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.on('messageCreate', async message => {
    console.log(message)
    // console.log(message.member.voice.channel);
    var channel = message.member.voice.channel;
    // console.log(channel)
    if((message.content.includes('bluey') || message.content.includes('Bluey')) && !playing){
    console.log('bluey contained')
        client.user.setActivity(message.member.user.username, { type: ActivityType.Watching });
        console.log(message.member.user.username)
        if (!channel && message.member.id != '800084491934367784') {

            console.log('called, didnt join');

        } else if(channel != null) {

            console.log('playing')
            const player = createAudioPlayer();

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            connection.subscribe(player)
            const resource = createAudioResource('bluey.mp3');
            player.play(resource)

            player.on(AudioPlayerStatus.Idle, () =>{
                connection.destroy()
                console.log('done playing!')
            })
        }
    }
});

client.login(token);