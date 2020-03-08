import { Icon, ITreeNode, Tree } from "@blueprintjs/core";
import _ from "lodash";
import React, { useEffect, useMemo } from "react";

import { Diff, Patch } from "../git";
import { CommonProps } from "../shared";
import { nestList, TreeListNode } from "../util/tree";
import { useTreeExpansion } from "../util/treeHook";

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
  const patches = diffs[0]?.patches;
  const tree = useMemo(
    () => nestList(patches, patch => patch.path.split("/")),
    [patches]
  );
  const { isExpanded, resetExpansions, toggleExpansion } = useTreeExpansion(
    true
  );
  useEffect(() => resetExpansions(), [tree, resetExpansions]);

  return (
    <Tree
      className={className}
      // TODO allow switching between diffs (e.g. for merge commits)
      contents={convertTree(tree)}
      onNodeClick={node => {
        if (node.nodeData) {
          onSelection(node.nodeData);
        }
        if (node.childNodes) {
          toggleExpansion(node.id.toString());
        }
      }}
      onNodeCollapse={node => toggleExpansion(node.id.toString(), false)}
      onNodeExpand={node => toggleExpansion(node.id.toString(), true)}
    />
  );

  function convertTree(tree: TreeListNode<Patch>[]) {
    const converted = tree.map(item => convertTreeNode(item));
    return _.sortBy(converted, [item => item.childNodes, item => item.id]);
  }

  function convertTreeNode(node: TreeListNode<Patch>): ITreeNode<Patch> {
    const patch = node.value;
    const shared = {
      id: node.path,
      label: <span title={patch?.path}>{node.name}</span>,
    };

    if (!patch) {
      return {
        ...shared,
        icon: "folder-close",
        isExpanded: isExpanded(node.path),
        childNodes: convertTree(node.children),
      };
    }

    const oldPath = patch.oldFile?.path;
    const newPath = patch.newFile?.path;
    const pathBeforeRename =
      oldPath && newPath && oldPath !== newPath ? oldPath : undefined;
    return {
      ...shared,
      icon: (
        <span title={pathBeforeRename}>
          <Icon
            className="bp3-tree-node-icon"
            icon={patchTypeIcon[patch.type || ""] || "help"}
          />
        </span>
      ),
      isSelected: patch.path === selectedFile,
      nodeData: patch,
    };
  }
}
