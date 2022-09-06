import { DecidedObjectType, TestFileType } from "../types";

const LOCAL_STORAGE_FILE = "simple-split.file";
const LOCAL_STORAGE_DECIDED = "simple-split.decided";

export const storeDecisions = (
  decisions: DecidedObjectType
): DecidedObjectType => {
  try {
    window.localStorage.setItem(
      LOCAL_STORAGE_DECIDED,
      JSON.stringify(decisions)
    );
    return decisions;
  } catch (e) {
    console.error("SimpleSplit Error: Failed to store decision string");
    return decisions;
  }
};

export const addNewDecisions = (
  newDecisions: DecidedObjectType,
  currentDecisions: DecidedObjectType
): DecidedObjectType => {
  const mergedDecisions = Object.assign({}, currentDecisions, newDecisions);
  return storeDecisions(mergedDecisions);
};

export const removeDecisions = (
  decisionIds: string[],
  currentDecisions: DecidedObjectType
): DecidedObjectType => {
  const copy_currentDecisions = Object.assign({}, currentDecisions);
  decisionIds.forEach((id) => {
    delete copy_currentDecisions[id];
  });
  return storeDecisions(copy_currentDecisions);
};

export const getStoredDecided = () => {
  const storageString = window.localStorage.getItem(LOCAL_STORAGE_DECIDED);
  if (!storageString) {
    return undefined;
  }
  try {
    const parsedStorageString = JSON.parse(storageString) as DecidedObjectType;
    return parsedStorageString;
  } catch (e) {
    console.error("SimpleSplit Error: Failed to parse stored decision string");
    return undefined;
  }
};

export const storeFile = (file: TestFileType) => {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_FILE, JSON.stringify(file));
  } catch (e) {
    console.error("SimpleSplit Error: Failed to store file");
  }
};

export const getStoredFile = (): TestFileType | undefined => {
  const fileString = window.localStorage.getItem(LOCAL_STORAGE_FILE);
  if (!fileString) {
    return undefined;
  }
  try {
    const parsedFile = JSON.parse(fileString) as TestFileType;
    return parsedFile;
  } catch (e) {
    console.error("SimpleSplit Error: Failed to parse file");
    return undefined;
  }
};
