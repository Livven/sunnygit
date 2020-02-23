import { Icon, ITreeNode, Tree } from "@blueprintjs/core";
import React from "react";

import { Diff, Patch } from "../git";
import { CommonProps } from "../shared";

const patchTypeIcon: Partial<Record<
  NonNullable<Patch["type"]> | "",
  ITreeNode["icon"]
>> = {
  added: "plus",
  copied: "duplicate",
  deleted: "minus",
  modified: "edit",
  renamed: "arrow-right",
};

export function CommitDiffList({
  className,
  diffs,
  onSelection,
  selectedFile,
}: {
  diffs: Diff[];
  selectedFile: string | undefined;
  onSelection: (patch?: Patch) => void;
} & CommonProps) {
  return (
    <Tree
      className={className}
      // TODO allow switching between diffs (e.g. for merge commits)
      contents={diffs[0]?.patches.map(patch => {
        const oldPath = patch.oldFile?.path;
        const newPath = patch.newFile?.path;
        const pathBeforeRename =
          oldPath && newPath && oldPath !== newPath ? oldPath : undefined;
        return {
          id: patch.path,
          label: <span title={patch.path}>{patch.path}</span>,
          icon: (
            <span title={pathBeforeRename}>
              <Icon
                className="bp3-tree-node-icon"
                icon={patchTypeIcon[patch.type || ""] || "help"}
              />
            </span>
          ),
          nodeData: patch,
          isSelected: patch.path === selectedFile,
        };
      })}
      onNodeClick={node => onSelection(node.nodeData)}
    />
  );
}
