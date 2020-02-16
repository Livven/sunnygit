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
export type Ref = Unpacked<typeof getRef>;
export type Signature = Unpacked<typeof getSignature>;

export async function getRepoDetails(repoPath: string) {
  const absoluteRepoPath = path.resolve(repoPath);
  const repo = await git.Repository.open(repoPath);

  // weirdly enough sometimes references seem to be duplicated
  const rawRefs = await Promise.all(
    (await repo.getReferences()).map(async ref => await getRef(ref))
  );
  const refs = _.uniqBy(rawRefs, ref => ref.name);

  // TODO make this typesafe, e.g. https://twitter.com/SeaRyanC/status/1179816663199277056
  const refsByType = _.groupBy(refs, ref => ref.type);
  return {
    path: absoluteRepoPath,
    branches: refsByType["branch"],
    remotes: refsByType["remote"],
    tags: refsByType["tag"],
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
      const commit = await getCommit(await repo.getCommit(commitId));
      result.push({ ...commit, refs: commitToRefs[commitId] || [] });
    } catch (error) {
      if (error.errno === git.Error.CODE.ITEROVER) {
        return result;
      }
      throw error;
    }
  }
}

async function getRef(ref: git.Reference) {
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
  };
}

async function getCommit(commit: git.Commit) {
  const message = commit.message();
  const [messageTitle, messageBody] = splitFirst(message, "\n").map(text =>
    text.trim()
  );
  return {
    sha: commit.sha(),
    originalMessage: message,
    messageTitle,
    messageBody,
    author: getSignature(commit.author()),
    committer: getSignature(commit.committer()),
  };
}

function getSignature(signature: git.Signature) {
  const when = signature.when();
  return {
    name: signature.name(),
    email: signature.email(),
    time: when.time(),
    offset: when.offset(),
  };
}

function splitFirst(source: string, separator: string) {
  const index = source.indexOf(separator);
  if (index < 0) {
    return [source, ""] as const;
  }
  return [source.substr(0, index), source.substr(index)] as const;
}
