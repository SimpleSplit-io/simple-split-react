import {
  TestFileType,
  TestType,
  DecidedObjectType,
  DecisionType,
} from "../types";
import {
  storeDecisions,
  addNewDecisions,
  removeDecisions,
  getStoredDecided,
} from "./localStorage";
let deciding = false;

const pickOption = (test: TestType): DecisionType => {
  if (test.test_status === "complete" && test.default_option_id) {
    const defaultOption = test.options.find(
      (o) => o.option_id === test.default_option_id
    );
    if (defaultOption) {
      return {
        ...defaultOption,
        test_status: test.test_status,
        option_type: test.option_type,
      };
    }
  }

  const randomValue = Math.floor(Math.random() * test.options.length + 1) - 1;
  return {
    ...test.options[randomValue],
    test_status: test.test_status,
    option_type: test.option_type,
  };
};

const pickOptions = (tests: TestType[]): DecidedObjectType => {
  const decided = tests.reduce((p, c) => {
    p[c.test_id] = pickOption(c);
    return p;
  }, {} as { [index: string]: DecisionType });
  return decided;
};

const decider = (file: TestFileType): DecidedObjectType | undefined => {
  if (!deciding) {
    deciding = true;
    const storedTests = getStoredDecided();
    if (!storedTests) {
      return storeDecisions(pickOptions(file.tests));
    }
    const storedTestKeys = Object.keys(storedTests);
    const fileTestsKeys = file.tests.map((t) => t.test_id);
    const completedTests: TestType[] = [];

    storedTestKeys.forEach((t) => {
      const testFromStorage = storedTests[t];
      const testFromFile = file.tests.find((ft) => ft.test_id === t);

      if (
        testFromFile &&
        testFromFile.test_status == "complete" &&
        testFromStorage.test_status == "active"
      ) {
        completedTests.push(testFromFile);
      }
      return;
    });

    // If a test has been completed since the last fetch
    if (completedTests.length > 0) {
      addNewDecisions(pickOptions(completedTests), storedTests);
    }

    // If new tests were created since last fetch
    if (storedTestKeys.length < fileTestsKeys.length) {
      const newTests = file.tests.filter(
        (t) => !storedTestKeys.includes(t.test_id)
      );
      addNewDecisions(pickOptions(newTests), storedTests);
    }

    // If  tests were removed since last fetch
    if (storedTestKeys.length > fileTestsKeys.length) {
      const oldTestIds = storedTestKeys.filter(
        (t) => !fileTestsKeys.includes(t)
      );
      removeDecisions(oldTestIds, storedTests);
    }
    return getStoredDecided();
  }
  return undefined;
};

export default decider;
