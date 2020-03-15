import React, { useContext } from "react";

import { GitClient } from "./git";

const GitContext = React.createContext<
  | {
      gitClient: GitClient;
      refreshRepo: () => void;
    }
  | undefined
>(undefined);

export const GitProvider = GitContext.Provider;

export function useGit() {
  const context = useContext(GitContext);
  if (!context) {
    throw new Error();
  }
  return context;
}
