require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const http = require("http");

// ==============================
// SERVIDOR HTTP PARA O RENDER
// ==============================

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  res.end("WordBH-MSG está online!");
}).listen(PORT, () => {
  console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
});

// ==============================
// CLIENTE DO DISCORD
// ==============================

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ==============================
// COMANDO /MSG
// ==============================

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

// ==============================
// REGISTRAR COMANDO
// ==============================

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registrando comando /msg...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {
        body: commands
      }
    );

    console.log("Comando /msg registrado!");
  } catch (error) {
    console.error("Erro ao registrar comando:", error);
  }
})();

// ==============================
// BOT ONLINE
// ==============================

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} está online!`);
});

// ==============================
// INTERAÇÕES
// ==============================

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "msg") {
    const texto = interaction.options.getString("texto");

    try {
      await interaction.channel.send(texto);

      await interaction.reply({
        content: "✅ Mensagem enviada!",
        ephemeral: true
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ Não consegui enviar a mensagem.",
          ephemeral: true
        });
      }
    }
  }
});

// ==============================
// LOGIN
// ==============================

client.login(process.env.TOKEN);