import { getStoredDecided, getStoredFile } from "./utils/localStorage";

export const confirmEvent = (test_id: string) => {
  const file = getStoredFile();
  const tests = getStoredDecided();

  if (!tests || !file) {
    console.error("SimpleSplit Error: Cannot track event. Data not available");
    return;
  }

  const decidedTest = tests[test_id];
  const fileTest = file.tests.find((t) => t.test_id === test_id);

  if (!decidedTest || !fileTest) {
    console.error("SimpleSplit Error: Cannot track event. Data not available");
    return;
  }

  fetch(
    "https://jsonplaceholder.typicode.com/posts?" +
      new URLSearchParams({
        test_id: test_id,
        option_id: decidedTest.option_id,
        organization_id: file.organization_id,
      }).toString(),
    {}
  );
};
