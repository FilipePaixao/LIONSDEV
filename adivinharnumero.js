const readline = require("readline");


// VARIAVEIS EDITAVEIS
let rodadas = 2;
let maxtry = 7;
const valormaximodonumero = 200 + 1
//-----------------------

let numeroaleatrio = Math.floor(Math.random() + 100 * valormaximodonumero); // 1 -> 10

console.log(numeroaleatrio);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.prompt();

console.log(`\n---------- JOGO DA ADIVINHAÇÃO ----------
Tente acertar o numero que foi gerado de 1 a 10
Digite "sair" para sair do jogo
Para uma dick de > ou < digite "dica"
Para uma dick de PAR ou IMPAR ditie "dica2"
==========================================`);
rl.on("line", (input) => {
  if (input == "sair") {
    console.log(`Seu número era: ${numeroaleatrio}`);
    process.exit();
  }
  if (maxtry == 0 && input != numeroaleatrio) {
    console.log(
      `Voce tentou ${rodadas} vezes e atingiu o limite seu BURRO o numero era ${numeroaleatrio}`
    );
    process.exit();
  }
  if (input == "dica2") {
    if (numeroaleatrio % 2 == 0) {
      console.log("O numero e PAR");
    } else {
      console.log("o numero e IMPAR");
    }
  } else if (input == "dica") {
    if (numeroaleatrio >= 5) {
      console.log("O numero e maior ou igual que 5");
    } else {
      console.log("O numero e menor que 5");
    }
  } else if (input == numeroaleatrio) {
    console.log(
      "Entre tudo que e possivel e nao possivel vc fez o impossivel se tornar possivel e acertou o"
    );
    if (rodadas == 1) {
      console.log(`Voce é pica acertou em apenas ${rodadas} tentativa`);
    } else {
      console.log(`Voce acertou em ${rodadas} tentativas!!`);
    }
    rodadas++;
    maxtry--;
    process.exit();
  } else {
    console.log("xD errou tenta ai dnv");
    rodadas++;
    maxtry--;
  }
});
