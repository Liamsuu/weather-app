const allowedRegenx = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

export default function checkInputValidity(input) {
  return allowedRegenx.test(input); // validates to either true or false.
}
