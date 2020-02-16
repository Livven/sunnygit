import React from "react";
import styled from "styled-components/macro";

import { Signature } from "../git";
import { CommonProps, longDate } from "../shared";
import { Avatar } from "./Avatar";

const PhotoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const Photo = styled(Avatar)`
  margin-right: 8px;
`;

const Name = styled.div`
  font-weight: 600;
`;

const Email = styled.div`
  font-size: 90%;
`;

export function CommitSignature({
  className,
  signature,
}: { signature: Signature } & CommonProps) {
  return (
    <div className={className}>
      <PhotoRow>
        <Photo email={signature.email} size={40} />
        <div>
          <Name>{signature.name}</Name>
          <Email>{signature.email}</Email>
        </div>
      </PhotoRow>
      <div>{longDate(signature.time)}</div>
    </div>
  );
}
