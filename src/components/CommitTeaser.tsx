import { Popover } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import React from "react";
import styled, { css } from "styled-components/macro";

import { Commit } from "../git";
import { Avatar } from "./Avatar";
import { CommitMeta } from "./CommitMeta";

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  * + * {
    margin-left: 6px;
  }
`;

const MessageTitle = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export function CommitTeaser({
  commit,
  previewPlacement,
}: {
  commit: Commit;
  previewPlacement?: TooltipPlacement;
}) {
  return (
    <Popover
      content={
        <CommitMeta
          commit={commit}
          css={css`
            width: 400px;
          `}
        />
      }
      placement={previewPlacement}
    >
      <Wrapper>
        <Avatar email={commit.author.email} size={16} />
        <MessageTitle>{commit.messageTitle}</MessageTitle>
      </Wrapper>
    </Popover>
  );
}
