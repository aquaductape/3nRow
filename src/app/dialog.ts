export const randomGen = (name: string) => {
  const randomCommands = [
    `${name}, your time to shine!`,
    `Go ${name}!`,
    `Your move ${name}`
  ];
  const length = randomCommands.length;

  const idx = Math.floor(Math.random() * length);

  return randomCommands[idx];
};
