import md5 from "crypto-js/md5";
import React from "react";
import styled from "styled-components/macro";

import { CommonProps } from "../shared";

const StyledImg = styled.img`
  border-radius: 50%;
`;

export function Avatar({
  className,
  email,
  size,
}: {
  size: number;
  email: string;
} & CommonProps) {
  return (
    <StyledImg
      alt="Avatar"
      className={className}
      height={size}
      src={getAvatarUrl(email)}
      width={size}
    />
  );
}

function getAvatarUrl(email: string) {
  // see https://en.gravatar.com/site/implement/hash/
  return `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}`;
}
