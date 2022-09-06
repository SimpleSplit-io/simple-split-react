import React from "react";

import type { DecidedObjectType, SimpleSplitContextType } from "./types";

import useFetch from "./utils/useFetch";
import decider from "./utils/decider";
import { storeFile } from "./utils/localStorage";

export const SimpleSplitContext = React.createContext<SimpleSplitContextType>({
  apiKey: undefined,
  file: undefined,
  isReady: false,
  decisionData: undefined,
});

export const SimpleSplitProvider = ({
  apiKey,
  children,
  blocking,
}: {
  apiKey: string;
  children?: React.ReactNode;
  blocking?: boolean;
}) => {
  const [decisionData, setDecisionData] = React.useState<DecidedObjectType>();
  const [isReady, setIsReady] = React.useState(false);
  if (!apiKey) {
    console.error("SimpleSplit Error: Api key is required");
  }

  const { data, status } = useFetch(`https://simplesplit.com/test.json`);

  React.useEffect(() => {
    if (status === "done") {
      if (data) {
        storeFile(data);
        const decisions = decider(data);
        if (decisions) {
          setDecisionData(decisions);
        }
      }
      setIsReady(true);
    }
  }, [status]);

  return (
    <SimpleSplitContext.Provider
      value={{
        apiKey,
        file: data,
        isReady: isReady,
        decisionData,
      }}
    >
      {blocking && status !== "done" ? null : children}
    </SimpleSplitContext.Provider>
  );
};
