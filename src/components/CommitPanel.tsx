import { Button, ButtonGroup, Tab, Tabs } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components/macro";

import { Commit, Diff, Patch } from "../git";
import { useGit } from "../GitContext";
import {
  backgroundColor,
  borderColor,
  CommonProps,
  useRerender,
} from "../shared";
import { Avatar } from "./Avatar";
import { CommitDiffList } from "./CommitDiffList";
import { CommitMeta } from "./CommitMeta";
import { DiffMode, FileDiffView } from "./FileDiffView";

const Container = styled.div`
  display: grid;
  grid-gap: 1px;
  grid-template: auto 1fr / 250px 1fr;
  background: ${borderColor} !important;

  > * {
    overflow: auto;
    background: ${backgroundColor};
  }
`;

const Header = styled.div`
  display: flex;
  grid-row: 1;
  grid-column: 1 / 3;
  align-items: center;
  padding-right: 12px;
  /* match space between tabs */
  padding-left: 20px;

  > * + * {
    margin-left: 10px;
  }

  > * {
    flex-shrink: 0;
  }

  /* using a styled component for Tab breaks the functionality, and for Tabs it results in a type error */
  .bp3-tab {
    line-height: 40px;
  }
`;

const CommitInfoButton = styled(Button)`
  flex-grow: 1;
  flex-shrink: 1;

  .bp3-button-text {
    overflow: hidden;
    /* avoid text being cut off at the bottom due to overflow: hidden */
    line-height: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const Left = styled.div`
  grid-row: 2;
  grid-column: 1;
`;

const Right = styled.div`
  grid-row: 2;
  grid-column: 2;
  /* hide scrollbars outside monaco editor */
  overflow: hidden;
`;

export function CommitPanel({
  className,
  commit,
  triggerRerender,
}: {
  commit?: Commit;
} & CommonProps) {
  const { gitClient } = useGit();
  const [diffs, setDiffs] = useState<Diff[]>();
  const [patch, setPatch] = useState<Patch>();
  const patchRerender = useRerender();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (commit) {
        const diffs = await gitClient.getDiffs(commit.sha);
        if (!cancelled) {
          setDiffs(diffs);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [commit, gitClient]);

  const commitSha = commit?.sha;
  useEffect(() => setPatch(undefined), [commitSha, triggerRerender]);

  const [diffMode, setDiffMode] = useState<DiffMode>("inline");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(true);

  return commit ? (
    <Container className={className}>
      <Header>
        <Tabs>
          <Tab id="diff" title="Changes" />
          <Tab id="tree" title="File Tree" />
        </Tabs>
        {patch && (
          <>
            <CommitInfoButton
              icon={<Avatar email={commit.author.email} size={16} />}
              minimal
              onClick={() => setPatch(undefined)}
            >
              {commit.messageTitle}
            </CommitInfoButton>
            <Button
              active={!ignoreWhitespace}
              small
              text="Whitespace"
              title={`${
                ignoreWhitespace ? "Show" : "Ignore"
              } leading/trailing whitespace differences`}
              onClick={() => setIgnoreWhitespace((prev) => !prev)}
            />
            <ButtonGroup>
              {([
                { id: "inline", label: "Inline" },
                { id: "split", label: "Split" },
              ] as const).map(({ id, label }) => (
                <Button
                  key={id}
                  active={diffMode === id}
                  small
                  text={label}
                  onClick={() => setDiffMode(id)}
                />
              ))}
            </ButtonGroup>
          </>
        )}
      </Header>
      <Left>
        {diffs && (
          <CommitDiffList
            diffs={diffs}
            selectedFile={patch?.path}
            onSelection={(patch) => {
              setPatch(patch);
              patchRerender.trigger();
            }}
          />
        )}
      </Left>
      <Right>
        {patch ? (
          <FileDiffView
            ignoreTrimWhitespace={ignoreWhitespace}
            mode={diffMode}
            patch={patch}
            triggerRerender={patchRerender.value}
          />
        ) : (
          <CommitMeta
            commit={commit}
            css={css`
              padding: 12px 16px;
            `}
          />
        )}
      </Right>
    </Container>
  ) : (
    <div className={className} />
  );
}
