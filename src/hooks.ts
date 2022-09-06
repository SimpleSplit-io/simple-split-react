import { useContext, useEffect, useState } from "react";
import { SimpleSplitContext } from "./SimpleSplitContext";

export const useSimpleSplit = () => useContext(SimpleSplitContext);

export const useTest = (testId: string) => {
  const [value, setValue] = useState<string | boolean | number>();
  const { isReady, decisionData } = useContext(SimpleSplitContext);

  useEffect(() => {
    if (isReady && !decisionData) {
      console.error("Simple Split Error: Could not get test decision");
      return;
    }
    if (isReady && decisionData) {
      const option = decisionData[testId];
      if (!option) {
        return;
      }
      if (option.option_type === "string") {
        setValue(option.option_value);
        return;
      }

      if (option.option_type === "boolean") {
        option.option_value === "true"
          ? setValue(true)
          : option.option_value === "false"
          ? setValue(false)
          : undefined;
        return;
      }

      if (option.option_type === "number") {
        setValue(Number(option.option_value));
        return;
      }
    }
  });

  return value;
};
