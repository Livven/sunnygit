import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components/macro";

import { CommitList } from "./components/CommitList";
import { CommitPanel } from "./components/CommitPanel";
import { Sidebar } from "./components/Sidebar";
import { getRepoDetails, GitClient, Ref, Repo } from "./git";
import { GitProvider } from "./GitContext";
import { backgroundColor, borderColor, useRerender } from "./shared";

const Container = styled.div`
  display: grid;
  grid: auto 1fr / 250px 350px 1fr;
  grid-gap: 1px;
  height: 100vh;
  background: ${borderColor};

  > * {
    overflow: auto;
    background: ${backgroundColor};
  }
`;

const Toolbar = styled.div`
  grid-row: 1;
  grid-column: 1 / 4;
  height: 40px;
  background: ${backgroundColor};
`;

const StyledSidebar = styled(Sidebar)`
  grid-row: 2;
`;

const StyledCommitList = styled(CommitList)`
  grid-row: 2;
  grid-column: 2;
`;

const StyledCommitPanel = styled(CommitPanel)`
  grid-row: 2;
  grid-column: 3;
`;

function App() {
  const [repoPath, setRepoPath] = useState("");
  const gitClient = useMemo(() => new GitClient(repoPath), [repoPath]);
  // this might rather be an async memo?
  const [repo, setRepo] = useState<Repo>();

  const [selectedRef, setSelectedRef] = useState<Ref>();
  const [desiredCommitSha, setDesiredCommitSha] = useState<string>();

  // on repo refresh, deselect commit if it no longer exists
  const selectedCommit = useMemo(
    () => repo?.commits.find((commit) => commit.sha === desiredCommitSha),
    [repo, desiredCommitSha]
  );

  const commitRerender = useRerender();

  const refreshRepo = useCallback(async () => {
    setRepo(await getRepoDetails(repoPath));
  }, [repoPath]);

  useEffect(() => {
    (async () => {
      setSelectedRef(undefined);
      setDesiredCommitSha(undefined);
      await refreshRepo();
    })();
  }, [refreshRepo]);

  useEffect(() => {
    window.addEventListener("focus", refreshRepo);
    return () => window.removeEventListener("focus", refreshRepo);
  }, [refreshRepo]);

  return (
    <GitProvider value={{ gitClient, refreshRepo }}>
      <Container
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const path = e.dataTransfer.files[0]?.path;
          if (path) {
            setRepoPath(path);
          }
        }}
      >
        <Toolbar />
        <StyledSidebar
          repo={repo}
          selectedRefName={selectedRef?.name}
          onSelection={(ref) => {
            setSelectedRef(ref);
            // TODO handle annotated tags (where ref.target is not a commit SHA)
            setDesiredCommitSha(ref.target);
          }}
        />
        <StyledCommitList
          commits={repo?.commits}
          selectedCommitSha={selectedCommit?.sha}
          onSelection={(commit) => {
            setDesiredCommitSha(commit.sha);
            if (commit.sha !== selectedRef?.target) {
              setSelectedRef(undefined);
            }
            commitRerender.trigger();
          }}
        />
        <StyledCommitPanel
          commit={selectedCommit}
          triggerRerender={commitRerender.value}
        />
      </Container>
    </GitProvider>
  );
}

export default App;
