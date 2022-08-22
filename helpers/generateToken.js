// Desenvolvi minha solução com informações desses sites:
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/round
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Number/toString

// Lembrei do toString por conta desse site:
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

const generateToken = () => {
  const token1 = Math.round(Math.random() * 999999999999).toString(36);
  const token2 = Math.round(Math.random() * 999999999999).toString(36);
  const finalToken = token1 + token2;

  if (finalToken.length === 16) return finalToken;

  return generateToken();
};

module.exports = generateToken;
