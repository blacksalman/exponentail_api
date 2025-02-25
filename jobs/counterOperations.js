const generateRandomOutcome = () => {
    const random = Math.random();
    const bonus = random < 0.5 ? 10 : 0;
    const prize = random < 0.25 ? 1 : 0;
    return { bonus, prize };
};
  
const calculateNewScore = (currentScore, bonus) => currentScore + 1 + bonus;
  
module.exports = { generateRandomOutcome, calculateNewScore };