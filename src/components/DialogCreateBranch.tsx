import { Checkbox, Form, Input } from "antd";
import React, { useState } from "react";

import { Commit } from "../git";
import { useGit } from "../GitContext";
import { CommitTeaser } from "./CommitTeaser";
import { ClippedFormItem, Dialog } from "./Dialog";

export function CreateBranchDialog({
  commit,
  isOpen,
  onClose,
}: {
  commit: Commit;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { gitClient, refreshRepo } = useGit();
  const [name, setName] = useState("");
  const [checkoutAfterwards, setCheckoutAfterwards] = useState(false);

  return (
    <Dialog
      isOpen={isOpen}
      submitLabel="Create Branch"
      title="New Branch"
      onClose={onClose}
      onSubmit={async () => {
        await gitClient.createBranch(commit.sha, name);
        await refreshRepo();
      }}
    >
      <ClippedFormItem label="Commit">
        <CommitTeaser commit={commit} previewPlacement="bottomLeft" />
      </ClippedFormItem>
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input
          autoFocus
          placeholder="Branch name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Checkbox
          checked={checkoutAfterwards}
          onChange={(e) => setCheckoutAfterwards(e.target.checked)}
        >
          Checkout branch after creation
        </Checkbox>
      </Form.Item>
    </Dialog>
  );
}
