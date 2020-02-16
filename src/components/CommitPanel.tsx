import { Tab, Tabs } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components/macro";

import { Commit } from "../git";
import { backgroundColor, borderColor, CommonProps } from "../shared";
import { CommitMeta } from "./CommitMeta";

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
  grid-row: 1;
  grid-column: 1 / 3;
  padding: 0 16px;

  /* styled(Tab) breaks the tab functionality */
  .bp3-tab {
    line-height: 40px;
  }
`;

const LeftPane = styled.div`
  grid-row: 2;
  grid-column: 1;
`;

const StyledCommitMeta = styled(CommitMeta)`
  grid-row: 2;
  grid-column: 2;
`;

export function CommitPanel({
  className,
  commit,
}: {
  commit?: Commit;
} & CommonProps) {
  return commit ? (
    <Container className={className}>
      <Header>
        <Tabs>
          <Tab id="diff" title="Changes" />
          <Tab id="tree" title="File Tree" />
        </Tabs>
      </Header>
      <LeftPane />
      <StyledCommitMeta commit={commit} />
    </Container>
  ) : (
    <div className={className} />
  );
}
