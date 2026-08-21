type TableName = keyof typeof sampleData;

import { sampleData } from "../Data/sampleData";

export type SQLMode = "practice" | "challenge";

export interface SQLWorkspaceState {
  query: string;
    
  history: {
    query: string;
    time: string;
  }[];

  selectedTable: TableName;

  loading: boolean;

  result: Record<string, unknown>[];

  executionTime: number;

  rowsReturned: number;

  error: string | null;
}

export interface SQLChallengeState {
  currentChallenge: number;

  status: "idle" | "correct" | "wrong";

  completedChallenges: number[];

  queriesByChallenge: Record<number, string>;
}

const defaultPracticeState: SQLWorkspaceState = {
  query: `SELECT *
FROM customers
WHERE city = 'Delhi';`,

  history: [],

  selectedTable: "customers",

  loading: false,

  result: [],

  executionTime: 0,

  rowsReturned: 0,

  error: null,
};

const defaultChallengeState: SQLWorkspaceState = {
  query: "",

  history: [],

  selectedTable: "customers",

  loading: false,

  result: [],

  executionTime: 0,

  rowsReturned: 0,

  error: null,
};

const practiceState: SQLWorkspaceState = {
  ...defaultPracticeState,
  history: [],
  result: [],
};

const challengeState: SQLWorkspaceState = {
  ...defaultChallengeState,
  history: [],
  result: [],
};

const challengeStateMeta: SQLChallengeState = {
  currentChallenge: 0,

  status: "idle",

  completedChallenges: [],

  queriesByChallenge: {},
};

export const SQLPlaygroundStore = {
  practice: practiceState,

  challenge: challengeState,

  challengeMeta: challengeStateMeta,

  getWorkspace(mode: SQLMode) {
    return mode === "practice"
      ? this.practice
      : this.challenge;
  },

  getChallengeQuery(challengeIndex: number) {
    return (
      this.challengeMeta.queriesByChallenge[
        challengeIndex
      ] ?? ""
    );
  },

  setChallengeQuery(
    challengeIndex: number,
    query: string
  ) {
    this.challengeMeta.queriesByChallenge[
      challengeIndex
    ] = query;

    this.challenge.query = query;
  },

  setCurrentChallenge(index: number) {
    this.challengeMeta.currentChallenge = index;

    this.challenge.query =
      this.getChallengeQuery(index);

    this.challenge.result = [];
    this.challenge.rowsReturned = 0;
    this.challenge.executionTime = 0;
    this.challenge.error = null;
  },

  markChallengeCompleted(index: number) {
    if (
      !this.challengeMeta.completedChallenges.includes(
        index
      )
    ) {
      this.challengeMeta.completedChallenges.push(
        index
      );
    }
  },

  setChallengeStatus(
    status: "idle" | "correct" | "wrong"
  ) {
    this.challengeMeta.status = status;
  },

  resetChallenge() {
    this.challengeMeta.currentChallenge = 0;
    this.challengeMeta.status = "idle";
    this.challengeMeta.completedChallenges = [];
    this.challengeMeta.queriesByChallenge = {};

    Object.assign(this.challenge, {
      ...defaultChallengeState,
      history: [],
      result: [],
    });
  },
};