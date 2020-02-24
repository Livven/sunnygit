import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";

import { CommitList } from "./components/CommitList";
import { CommitPanel } from "./components/CommitPanel";
import { Sidebar } from "./components/Sidebar";
import { Commit, getRepoDetails, Ref, Repo } from "./git";
import { backgroundColor, borderColor } from "./shared";

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
  // this might rather be an async memo?
  const [repo, setRepo] = useState<Repo>();
  const [selectedRef, setSelectedRef] = useState<Ref>();
  const [selectedCommit, setSelectedCommit] = useState<Commit>();

  useEffect(() => {
    (async () => {
      setSelectedRef(undefined);
      setSelectedCommit(undefined);
      setRepo(await getRepoDetails(repoPath));
    })();
  }, [repoPath]);

  return (
    <Container
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
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
        onSelection={ref => {
          setSelectedRef(ref);
          // TODO handle annotated tags (where ref.target is not a commit SHA)
          setSelectedCommit(
            repo?.commits.find(commit => commit.sha === ref.target)
          );
        }}
      />
      <StyledCommitList
        commits={repo?.commits}
        selectedCommitSha={selectedCommit?.sha}
        onSelection={commit => {
          setSelectedCommit(commit);
          if (commit.sha !== selectedRef?.target) {
            setSelectedRef(undefined);
          }
        }}
      />
      <StyledCommitPanel commit={selectedCommit} />
    </Container>
  );
}

export default App;
