import React, { useEffect, useRef } from "react";
import Measure from "react-measure";
import { FixedSizeList } from "react-window";

import { Commit } from "../git";
import { CommonProps } from "../shared";
import { CommitItem } from "./CommitItem";

// TODO calculate this value dynamically somehow
const commitItemHeight = 60.6;

export function CommitList({
  className,
  commits,
  onSelection,
  selectedCommitSha,
}: {
  commits?: Commit[];
  selectedCommitSha?: string;
  onSelection: (commit: Commit) => void;
} & CommonProps) {
  const listRef = useRef<FixedSizeList>(null);
  // TODO also scroll when same item is selected again e.g. via branch in sidebar
  useEffect(() => {
    const index = commits?.findIndex(
      commit => commit.sha === selectedCommitSha
    );
    if (index != null && index > -1) {
      listRef.current?.scrollToItem(index, "smart");
    } else {
      listRef.current?.scrollTo(0);
    }
  }, [commits, selectedCommitSha]);

  return commits ? (
    <Measure bounds>
      {({ contentRect, measureRef }) => (
        <div ref={measureRef} className={className}>
          <FixedSizeList
            ref={listRef}
            height={contentRect.bounds?.height || 0}
            itemCount={commits.length}
            itemKey={i => commits[i].sha}
            itemSize={commitItemHeight}
            overscanCount={4}
            width={contentRect.bounds?.width || 0}
          >
            {({ index, style }) => {
              const commit = commits[index];
              return (
                <div style={style}>
                  <CommitItem
                    commit={commit}
                    isSelected={commit.sha === selectedCommitSha}
                    onSelected={() => onSelection(commit)}
                  />
                </div>
              );
            }}
          </FixedSizeList>
        </div>
      )}
    </Measure>
  ) : (
    <div className={className} />
  );
}
