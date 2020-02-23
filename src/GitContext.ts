import React, { useContext } from "react";

import { GitClient } from "./git";

const GitContext = React.createContext<GitClient | undefined>(undefined);

export const GitProvider = GitContext.Provider;

export function useGitClient() {
  const gitClient = useContext(GitContext);
  if (!gitClient) {
    throw new Error();
  }
  return gitClient;
}
