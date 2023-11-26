import { v4 as uuidv4 } from "uuid";

const generate5DigitCode = async () => {
  try {
    const uuid = await uuidv4();
    const fiveDigitCode = uuid.replace(/-/g, "").substring(0, 5);
    return fiveDigitCode;
  } catch (error) {
    return null;
  }
};

export { generate5DigitCode };
