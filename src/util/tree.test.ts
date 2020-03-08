import {
  flatListToTree,
  TreeListNode,
  TreeNode,
  treeToNestedList,
} from "./tree";

const flatList = [
  "file",
  "file2",
  "folder/file",
  "folder/file2",
  "folder2/file",
  "folder/subfolder/file",
  "folder/subfolder/file2",
  "folder/subfolder2/file",
  "folder2/subfolder/file",
];

const split = (item: string) => item.split("/");

const tree: TreeNode<string> = {
  path: "",
  children: {
    file: {
      path: "file",
      value: "file",
      children: {},
    },
    file2: {
      path: "file2",
      value: "file2",
      children: {},
    },
    folder: {
      path: "folder",
      children: {
        file: {
          path: "folder/file",
          value: "folder/file",
          children: {},
        },
        file2: {
          path: "folder/file2",
          value: "folder/file2",
          children: {},
        },
        subfolder: {
          path: "folder/subfolder",
          children: {
            file: {
              path: "folder/subfolder/file",
              value: "folder/subfolder/file",
              children: {},
            },
            file2: {
              path: "folder/subfolder/file2",
              value: "folder/subfolder/file2",
              children: {},
            },
          },
        },
        subfolder2: {
          path: "folder/subfolder2",
          children: {
            file: {
              path: "folder/subfolder2/file",
              value: "folder/subfolder2/file",
              children: {},
            },
          },
        },
      },
    },
    folder2: {
      path: "folder2",
      children: {
        file: {
          path: "folder2/file",
          value: "folder2/file",
          children: {},
        },
        subfolder: {
          path: "folder2/subfolder",
          children: {
            file: {
              path: "folder2/subfolder/file",
              value: "folder2/subfolder/file",
              children: {},
            },
          },
        },
      },
    },
  },
};

const nestedList: TreeListNode<string>[] = [
  {
    name: "file",
    path: "file",
    value: "file",
    children: [],
  },
  {
    name: "file2",
    path: "file2",
    value: "file2",
    children: [],
  },
  {
    name: "folder",
    path: "folder",
    children: [
      {
        name: "file",
        path: "folder/file",
        value: "folder/file",
        children: [],
      },
      {
        name: "file2",
        path: "folder/file2",
        value: "folder/file2",
        children: [],
      },
      {
        name: "subfolder",
        path: "folder/subfolder",
        children: [
          {
            name: "file",
            path: "folder/subfolder/file",
            value: "folder/subfolder/file",
            children: [],
          },
          {
            name: "file2",
            path: "folder/subfolder/file2",
            value: "folder/subfolder/file2",
            children: [],
          },
        ],
      },
      {
        name: "subfolder2",
        path: "folder/subfolder2",
        children: [
          {
            name: "file",
            path: "folder/subfolder2/file",
            value: "folder/subfolder2/file",
            children: [],
          },
        ],
      },
    ],
  },
  {
    name: "folder2",
    path: "folder2",
    children: [
      {
        name: "file",
        path: "folder2/file",
        value: "folder2/file",
        children: [],
      },
      {
        name: "subfolder",
        path: "folder2/subfolder",
        children: [
          {
            name: "file",
            path: "folder2/subfolder/file",
            value: "folder2/subfolder/file",
            children: [],
          },
        ],
      },
    ],
  },
];

test("tree parser works", () => {
  expect(flatListToTree(flatList, split)).toEqual(tree);
});

test("tree parser handles duplicates", () => {
  expect(flatListToTree([...flatList, ...flatList], split)).toEqual(tree);
});

test("conversion to nested list works", () => {
  expect(treeToNestedList(tree)).toEqual(nestedList);
});
