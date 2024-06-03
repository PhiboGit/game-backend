export function rollDice(sides: number): number{
  return Math.floor(Math.random() * sides + 1)
}


export function rollRange(min: number, max: number): number{
return Math.floor((Math.random() * (max - min + 1)) + min)
}

export function weightedChoice<T>(events: T[], outputs: number, weights: number[] = []): T[] {
  const choices: T[] = []
  if (outputs <= 0) choices;
  if (weights.length) {
    if (events.length !== weights.length) {
      console.error("Events and weights must have the same length.");
      return choices
    }

    if (weights.some(weight => weight < 0)) {
      console.error("Weights cannot contain negative values.");
      return choices
    }
  } else{
    if (weights.length === 0) {
      // If no weights are provided, assign equal weights
      weights = new Array(events.length).fill(1);
    }
  }

  for (let i = 0; i < outputs; i++) {
    let totalWeight = 0;
    const random = Math.random() * weights.reduce((a, b) => a + b, 0);

    for (let j = 0; j < events.length; j++) {
      totalWeight += weights[j];
      if (random < totalWeight) {
        choices.push(events[j]);
        break;
      }
    }
  }
  return choices;
}

export function weightedChoiceRemoved<T>(events: T[], outputs: number, weights: number[] = []): T[] {
  const choices: T[] = [];

  if (outputs <= 0) return choices
  let eventsCopy = events.slice(); // slice to to a copy
  let weightsCopy = (weights.length) ? weights.slice() : new Array(events.length).fill(1);
  if (eventsCopy.length !== weightsCopy.length) {
    console.error("Events and weights must have the same length.");
    return choices
  }

  if (weightsCopy.some(weight => weight < 0)) {
    console.error("Weights cannot contain negative values.");
    return choices
  }


  // Limit the outputs to the number of available events
  outputs = Math.min(outputs, eventsCopy.length);

  for (let i = 0; i < outputs; i++) {
    if (eventsCopy.length === 0) {
      // If there are no more events to choose from, break out of the loop.
      break;
    }

    let totalWeight = 0;
    const random = Math.random() * weightsCopy.reduce((a, b) => a + b, 0);

    for (let j = 0; j < eventsCopy.length; j++) {
      totalWeight += weightsCopy[j];
      if (random < totalWeight) {
        choices.push(eventsCopy[j]);
        // Remove the selected event and its weight from the copies
        eventsCopy.splice(j, 1);
        weightsCopy.splice(j, 1);
        break;
      }
    }
  }
  return choices;
}
