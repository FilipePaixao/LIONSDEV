import dotenv from "dotenv";
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

import express from "express";
import mongoose from "mongoose";
import rotas from "./Src/Routes/routes.js";

const app = express();
const port = process.env.PORT;

const PepServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado ao MongoDB com sucesso!");
    mongoose.connection.on("error", (err) => {
      console.error(`Erro de conexão com o MongoDB: ${err.message}`);
    });

    app.use(express.json());
    app.use(rotas);

    app.listen(port, () => {
      console.log(`🚀 Servidor iniciado na porta ${port}`);
    });
  } catch (err) {
    console.error(
      "❌ Falha ao conectar ao MongoDB. O servidor não foi iniciado."
    );
    console.error(err.message);
    process.exit(1);
  }
};

PepServer();
