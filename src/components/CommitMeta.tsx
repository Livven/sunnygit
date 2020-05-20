import { Tag } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components/macro";

import { Commit } from "../git";
import { CommonProps, itemGapStyle, longDate } from "../shared";
import { CommitSignature } from "./CommitSignature";

const Container = styled.div`
  padding: 0 16px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 125%;
`;

const Header = styled.h6`
  margin: 16px 0 8px;
  font-weight: bold;
  font-size: 80%;
  text-transform: uppercase;
  opacity: 0.4;
`;

const Body = styled.pre`
  margin: 0;
  white-space: pre-line;
`;

export function CommitMeta({
  className,
  commit,
}: { commit: Commit } & CommonProps) {
  const sameAuthor =
    commit.author.name === commit.committer.name &&
    commit.author.email === commit.committer.email;
  const sameTime =
    commit.author.time === commit.committer.time &&
    commit.author.offset === commit.committer.offset;

  return (
    <Container className={className}>
      <Title>{commit.messageTitle}</Title>
      <Header>Author</Header>
      <CommitSignature signature={commit.author} />
      {!(sameAuthor && sameTime) && (
        <>
          <Header>{sameAuthor ? "Committed" : "Committer"}</Header>
          {sameAuthor ? (
            longDate(commit.committer.time)
          ) : (
            <CommitSignature signature={commit.committer} />
          )}
        </>
      )}
      {!!commit.refs.length && (
        <>
          <Header>Refs</Header>
          <div css={itemGapStyle}>
            {commit.refs.map((ref) => (
              <Tag key={ref.name} minimal>
                {ref.shorthand}
              </Tag>
            ))}
          </div>
        </>
      )}
      <Header>Hash</Header>
      <code>{commit.sha}</code>
      {commit.messageBody && (
        <>
          <Header>Message</Header>
          <Body>{commit.messageBody}</Body>
        </>
      )}
    </Container>
  );
}
