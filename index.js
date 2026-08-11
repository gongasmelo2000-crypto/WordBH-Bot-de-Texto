require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName("msg")
    .setDescription("Envia uma mensagem pelo bot")
    .addStringOption(option =>
      option
        .setName("texto")
        .setDescription("Texto que o bot deve enviar")
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registrando comando /msg...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("Comando /msg registrado!");
  } catch (error) {
    console.error(error);
  }
})();

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} está online!`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "msg") {
    const texto = interaction.options.getString("texto");

    await interaction.channel.send(texto);

    await interaction.reply({
      content: "✅ Mensagem enviada!",
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);