export const randomTurnTexts = (name: string) => {
  const randomHumanCommands = [
    `Your turn ${name}`,
    `Go ${name}!`,
    `Your move ${name}`
  ];

  // const randomBotCommands = [
  //   `${name} is thinking`,
  //   `${name}`
  // ]
  const length = randomHumanCommands.length;

  const idx = Math.floor(Math.random() * length);

  return randomHumanCommands[idx];
};
