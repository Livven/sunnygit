import { Tag } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components/macro";

import { Commit } from "../git";
import {
  backgroundColor,
  CommonProps,
  hoverBackgroundColor,
  itemGapStyle,
  listItemBorderColor,
  selectedBackgroundColor,
  smartRelativeDate,
} from "../shared";
import { Avatar } from "./Avatar";

const Container = styled.div<{ isSelected: boolean }>`
  padding: 10px 12px;
  white-space: nowrap;
  background: ${({ isSelected }) =>
    isSelected ? selectedBackgroundColor : backgroundColor};
  border-bottom: 1px solid ${listItemBorderColor};
  user-select: none;

  :hover {
    background: ${hoverBackgroundColor};
  }
`;

const Row = styled.div`
  ${itemGapStyle}

  > * {
    overflow: hidden;
  }
`;

const MetaRow = styled(Row)`
  display: flex;
  align-items: center;
  padding-bottom: 2px;
  font-size: 90%;
`;

const TitleRow = styled(Row)`
  display: flex;
`;

const Photo = styled(Avatar)`
  flex-shrink: 0;
`;

const Name = styled.span`
  text-overflow: ellipsis;
`;

const Date = styled.span`
  flex-shrink: 0;
`;

const Title = styled.span`
  flex-grow: 1;
  text-overflow: ellipsis;
`;

const Sha = styled.code`
  flex-shrink: 0;
  opacity: 0.6;
`;

const Dummy = styled(Tag)`
  flex-grow: 1;
  width: 0;
  min-width: 0;
  margin: 0;
  padding: 0;
  opacity: 0;
`;

export function CommitItem({
  className,
  commit,
  isSelected,
  onSelected,
}: {
  commit: Commit;
  isSelected: boolean;
  onSelected: () => void;
} & CommonProps) {
  return (
    <Container
      className={className}
      isSelected={isSelected}
      onClick={() => onSelected()}
    >
      <MetaRow>
        <Photo email={commit.author.email} size={16} />
        <Name>{commit.author.name}</Name>
        {commit.refs.map(ref => (
          <Tag key={ref.name} minimal>
            {ref.shorthand}
          </Tag>
        ))}
        {/* achieves a consistent height for all items even if they don't have a ref */}
        <Dummy />
        <Date>{smartRelativeDate(commit.author.time)}</Date>
      </MetaRow>
      <TitleRow>
        <Title>{commit.messageTitle}</Title>
        <Sha title={commit.sha}>{commit.sha.substr(0, 3)}</Sha>
      </TitleRow>
    </Container>
  );
}
