import _ from "lodash";
import git from "nodegit";
import path from "path";

type Unpacked<T> = T extends (...args: any[]) => Promise<(infer U)[]>
  ? U
  : T extends (...args: any[]) => Promise<infer U>
  ? U
  : T extends (...args: any[]) => (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<(infer U)[]>
  ? U
  : T extends Promise<infer U>
  ? U
  : T extends (infer U)[]
  ? U
  : T;

// use these inferred types for now for faster iteration
export type Repo = Unpacked<typeof getRepoDetails>;
export type Commit = Unpacked<typeof getCommits>;
export type Ref = Unpacked<typeof convertRef>;
export type Signature = Unpacked<typeof convertSignature>;
export type Diff = Unpacked<typeof getDiffs>;
export type Patch = Unpacked<typeof getPatch>;

export class GitClient {
  readonly repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
  }

  async getDiffs(commitSha: string) {
    const repo = await git.Repository.open(this.repoPath);
    const commit = await repo.getCommit(commitSha);
    return await getDiffs(commit);
  }
}

export async function getRepoDetails(repoPath: string) {
  const absoluteRepoPath = path.resolve(repoPath);
  const repo = await git.Repository.open(repoPath);

  // weirdly enough sometimes references seem to be duplicated
  const rawRefs = await Promise.all(
    (await repo.getReferences()).map(async ref => await convertRef(ref))
  );
  const refs = _.uniqBy(rawRefs, ref => ref.name);

  // TODO make this typesafe, e.g. https://twitter.com/SeaRyanC/status/1179816663199277056
  const refsByType = _.groupBy(refs, ref => ref.type);
  return {
    path: absoluteRepoPath,
    branches: refsByType["branch"] || [],
    remotes: refsByType["remote"] || [],
    tags: refsByType["tag"] || [],
    commits: await getCommits(repo, refs),
  };
}

async function getCommits(repo: git.Repository, refs: Ref[]) {
  const walker = repo.createRevWalk();
  walker.sorting(git.Revwalk.SORT.TIME);
  for (const ref of refs) {
    walker.pushRef(ref.name);
  }
  const commitToRefs = _.groupBy(refs, ref => ref.target);
  const result = [];
  while (true) {
    try {
      const commitId = await walker.next();
      const commit = await convertCommit(await repo.getCommit(commitId));
      result.push({ ...commit, refs: commitToRefs[commitId.tostrS()] || [] });
    } catch (error) {
      if (error.errno === git.Error.CODE.ITEROVER) {
        return result;
      }
      throw error;
    }
  }
}

function convertRef(ref: git.Reference) {
  const type = ref.isBranch()
    ? "branch"
    : ref.isRemote()
    ? "remote"
    : ref.isTag()
    ? "tag"
    : "other";
  return {
    name: ref.name(),
    shorthand: ref.shorthand(),
    type,
    target: ref.target().tostrS(),
  } as const;
}

function convertCommit(commit: git.Commit) {
  const message = commit.message();
  const [messageTitle, messageBody] = splitFirst(message, "\n").map(text =>
    text.trim()
  );
  return {
    sha: commit.sha(),
    originalMessage: message,
    messageTitle,
    messageBody,
    author: convertSignature(commit.author()),
    committer: convertSignature(commit.committer()),
  };
}

function convertSignature(signature: git.Signature) {
  const when = signature.when();
  return {
    name: signature.name(),
    email: signature.email(),
    time: when.time(),
    offset: when.offset(),
  };
}

async function getDiffs(commit: git.Commit) {
  const parents = await commit.getParents();
  const diffs =
    parents.length > 0
      ? await Promise.all(
          parents.map(async parent => await getDiff(commit, parent))
        )
      : [await getDiff(commit)];
  return diffs;
}

async function getDiff(commit: git.Commit, parent?: git.Commit) {
  const tree = await commit.getTree();
  const parentTree = await parent?.getTree();
  const diff = await tree.diff(parentTree);

  await diff.findSimilar();
  const patches = await Promise.all(
    (await diff.patches()).map(
      async patch => await getPatch(patch, tree, parentTree)
    )
  );
  return {
    parent: parent?.sha(),
    patches,
  };
}

async function getPatch(
  patch: git.ConvenientPatch,
  tree: git.Tree,
  parentTree: git.Tree | undefined
) {
  const oldFile =
    !patch.isAdded() && parentTree
      ? await getEntry(parentTree, patch.oldFile().path())
      : undefined;

  const newFilePath = patch.newFile().path();
  const newFile = !patch.isDeleted()
    ? await getEntry(tree, newFilePath)
    : undefined;

  return {
    path: newFilePath,
    newFile,
    oldFile,
    type: patch.isAdded()
      ? "added"
      : patch.isConflicted()
      ? "conflicted"
      : patch.isCopied()
      ? "copied"
      : patch.isDeleted()
      ? "deleted"
      : patch.isIgnored()
      ? "ignored"
      : patch.isModified()
      ? "modified"
      : patch.isRenamed()
      ? "renamed"
      : patch.isTypeChange()
      ? "typechange"
      : patch.isUnmodified()
      ? "unmodified"
      : patch.isUnreadable()
      ? "unreadable"
      : patch.isUntracked()
      ? "untracked"
      : undefined,
  } as const;
}

async function getEntry(tree: git.Tree, path: string) {
  const entry = await tree.getEntry(path);
  const blob = await entry.getBlob();
  const isBinary = !!blob.isBinary();
  return {
    path: entry.path(),
    isBinary,
    size: blob.rawsize(),
    content: isBinary ? undefined : blob.content().toString(),
  };
}

function splitFirst(source: string, separator: string) {
  const index = source.indexOf(separator);
  if (index < 0) {
    return [source, ""] as const;
  }
  return [source.substr(0, index), source.substr(index)] as const;
}
