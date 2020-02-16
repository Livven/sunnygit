import { ITreeNode, Tree } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";

import { Ref, Repo } from "../git";
import { CommonProps } from "../shared";

type PartialPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Props = {
  repo: Repo;
  selectedRefName?: string;
  onSelection: (ref: Ref) => void;
} & CommonProps;

export { SidebarWrapper as Sidebar };

function SidebarWrapper(props: PartialPartial<Props, "repo">) {
  return props.repo ? (
    <Sidebar {...props} repo={props.repo} />
  ) : (
    <div className={props.className} />
  );
}

function Sidebar({ className, onSelection, repo, selectedRefName }: Props) {
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set()
  );
  useEffect(() => setExpandedNodeIds(new Set(["branches"])), [repo.path]);

  const treeNodes: ITreeNode<Ref>[] = [
    {
      id: "branches",
      label: "Branches",
      icon: "git-branch",
      hasCaret: true,
      isExpanded: expandedNodeIds.has("branches"),
      childNodes: createChildNodes(repo.branches, selectedRefName),
    },
    {
      id: "remotes",
      label: "Remotes",
      icon: "globe-network",
      hasCaret: true,
      isExpanded: expandedNodeIds.has("remotes"),
      childNodes: createChildNodes(repo.remotes, selectedRefName),
    },
    {
      id: "tags",
      label: "Tags",
      icon: "tag",
      hasCaret: true,
      isExpanded: expandedNodeIds.has("tags"),
      childNodes: createChildNodes(repo.tags, selectedRefName),
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
      }}
      onNodeCollapse={node => {
        expandedNodeIds.delete(node.id.toString());
        setExpandedNodeIds(new Set(expandedNodeIds));
      }}
      onNodeExpand={node => {
        expandedNodeIds.add(node.id.toString());
        setExpandedNodeIds(new Set(expandedNodeIds));
      }}
    />
  );
}

function createChildNodes(refs: Ref[], selectedRefName?: string) {
  return refs?.map(
    ref =>
      ({
        id: ref.name,
        label: ref.shorthand,
        nodeData: ref,
        isSelected: ref.name === selectedRefName,
      } as ITreeNode<Ref>)
  );
}
