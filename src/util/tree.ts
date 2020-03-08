export interface TreeNode<T> {
  path: string;
  value?: T;
  children: {
    [name: string]: TreeNode<T>;
  };
}

export interface TreeListNode<T> {
  name: string;
  path: string;
  value?: T;
  children: TreeListNode<T>[];
}

export function nestList<T>(flatList: T[], split: (item: T) => string[]) {
  return treeToNestedList(flatListToTree(flatList, split));
}

export function flatListToTree<T>(flatList: T[], split: (item: T) => string[]) {
  const root: TreeNode<T> = {
    path: "",
    children: {},
  };
  for (const item of flatList) {
    const segments = split(item);
    let parent = root;
    for (const segment of segments) {
      parent = getChild(parent, segment);
    }
    parent.value = item;
  }
  return root;
}

export function treeToNestedList<T>(node: TreeNode<T>): TreeListNode<T>[] {
  return Object.entries(node.children).map(([name, childNode]) => {
    return {
      name,
      path: childNode.path,
      value: childNode.value,
      children: childNode ? treeToNestedList(childNode) : [],
    };
  });
}

function getChild<T>(parent: TreeNode<T>, name: string) {
  const existingNode = parent.children[name];
  if (existingNode) {
    return existingNode;
  }
  const newNode: TreeNode<T> = {
    path: `${parent.path}${parent.path ? "/" : ""}${encodeURIComponent(name)}`,
    children: {},
  };
  parent.children[name] = newNode;
  return newNode;
}
