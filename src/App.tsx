import "electron";
import "./App.css";

import git from "nodegit";
import React, { useEffect, useState } from "react";

import logo from "./logo.svg";

const App = () => {
  const [repoPath, setRepoPath] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const repo = await git.Repository.open(repoPath);
        const commit = await repo.getHeadCommit();
        setMessage(commit.message());
      } catch (error) {
        setMessage(error.toString());
      }
    })();
  }, [repoPath]);
  return (
    <div
      className="App"
      onDragOver={e => e.preventDefault()}
      onDrop={e => setRepoPath(e.dataTransfer.files[0].path)}
    >
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload. Message: {message}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
