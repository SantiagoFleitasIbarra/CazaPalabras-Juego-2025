export const words = {
  3: ["sol", "mar", "pez", "luz", "paz", "pie", "vez", "ves", "ojo", "ser", "oso", "dos", "bar", "ave", "fin", "rio", "rey"],
  4: ["casa", "rojo", "azul", "vida", "alto", "bajo", "cama", "luna", "amor", "gato", "mesa", "vela", "pato", "silla", "loco", "taza", "lago", "mano", "ropa", "vino", "flor"],
  5: ["perro", "gatos", "libro", "tarde", "noche", "playa", "verde", "papel", "feliz", "mundo"],
  6: ["amigos", "colina", "cocina", "dormir", "espuma", "flores", "gritar", "lluvia", "medico", "musica"],
  7: ["armario", "paisaje", "hermoso", "caminar", "festejo", "mañana", "palacio", "tesoros", "ventana", "silencio"]
};

export function getRandomWordLength() {
  const lengths = Object.keys(words);
  return lengths[Math.floor(Math.random() * lengths.length)];
}

export function getRandomWord(length) {
  const wordList = words[length];
  return wordList[Math.floor(Math.random() * wordList.length)];
}