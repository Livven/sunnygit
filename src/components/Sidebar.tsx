import { ITreeNode, Tree } from "@blueprintjs/core";
import _ from "lodash";
import React, { useEffect } from "react";
import { SetOptional } from "type-fest";

import { Ref, Repo } from "../git";
import { CommonProps } from "../shared";
import { nestList, TreeListNode } from "../util/tree";
import { useTreeExpansion } from "../util/treeHook";

const refIcon: Record<Ref["type"], ITreeNode["icon"]> = {
  branch: "git-branch",
  remote: "git-branch",
  tag: "tag",
  other: undefined,
};

type Props = {
  repo: Repo;
  selectedRefName?: string;
  onSelection: (ref: Ref) => void;
} & CommonProps;

export { SidebarWrapper as Sidebar };

function SidebarWrapper(props: SetOptional<Props, "repo">) {
  return props.repo ? (
    <Sidebar {...props} repo={props.repo} />
  ) : (
    <div className={props.className} />
  );
}

function Sidebar({ className, onSelection, repo, selectedRefName }: Props) {
  const { isExpanded, resetExpansions, toggleExpansion } = useTreeExpansion(
    false
  );
  useEffect(() => resetExpansions(["branches", "remotes"]), [
    repo.path,
    resetExpansions,
  ]);

  const treeNodes: ITreeNode<Ref>[] = [
    {
      id: "branches",
      label: "Branches",
      hasCaret: true,
      isExpanded: isExpanded("branches"),
      childNodes: convertRefs(repo.branches),
    },
    {
      id: "remotes",
      label: "Remotes",
      hasCaret: true,
      isExpanded: isExpanded("remotes"),
      childNodes: convertRefs(repo.remotes, "globe-network"),
    },
    {
      id: "tags",
      label: "Tags",
      hasCaret: true,
      isExpanded: isExpanded("tags"),
      childNodes: convertRefs(repo.tags),
    },
  ];

  return (
    <Tree
      className={className}
      contents={treeNodes}
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

  function convertRefs(refs: Ref[], icon?: ITreeNode["icon"]) {
    const tree = nestList(refs, ref => ref.name.split("/").slice(2));
    return convertTree(tree, icon);
  }

  function convertTree(
    tree: TreeListNode<Ref>[],
    icon?: ITreeNode["icon"]
  ): ITreeNode<Ref>[] {
    const converted = tree.map(node => convertTreeNode(node, icon));
    return _.sortBy(converted, [item => item.childNodes, item => item.id]);
  }

  function convertTreeNode(
    node: TreeListNode<Ref>,
    icon?: ITreeNode["icon"]
  ): ITreeNode<Ref> {
    const ref = node.value;
    return {
      id: node.path,
      label: <span title={ref?.name}>{node.name}</span>,
      ...(ref
        ? {
            icon: refIcon[ref.type],
            isSelected: ref.name === selectedRefName,
            nodeData: ref,
          }
        : {
            icon: icon || "folder-close",
            isExpanded: isExpanded(node.path),
            childNodes: convertTree(node.children),
          }),
    };
  }
}
