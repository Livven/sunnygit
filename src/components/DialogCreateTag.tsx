import { Form, Input, Radio } from "antd";
import React, { useState } from "react";
import { UnmountClosed } from "react-collapse";

import { Commit } from "../git";
import { useGit } from "../GitContext";
import { CommitTeaser } from "./CommitTeaser";
import { ClippedFormItem, Dialog } from "./Dialog";

export function CreateTagDialog({
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
  const [annotated, setAnnotated] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <Dialog
      isOpen={isOpen}
      submitLabel="Create Tag"
      title="New Tag"
      onClose={onClose}
      onSubmit={async () => {
        await gitClient.createTag(commit.sha, name, { annotated, message });
        await refreshRepo();
      }}
    >
      <ClippedFormItem label="Commit">
        <CommitTeaser commit={commit} previewPlacement="bottomLeft" />
      </ClippedFormItem>
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input
          autoFocus
          placeholder="Tag name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Type">
        <Radio.Group
          value={annotated}
          onChange={(e) => setAnnotated(e.target.value)}
        >
          <Radio.Button value={false}>Lightweight</Radio.Button>
          <Radio.Button value={true}>Annotated</Radio.Button>
        </Radio.Group>
      </Form.Item>
      {/* use UnmountClosed to always trigger autofocus */}
      <UnmountClosed isOpened={annotated}>
        <Form.Item label="Message">
          <Input.TextArea
            autoFocus
            autoSize={{ minRows: 4, maxRows: 12 }}
            placeholder="An annotated tag includes the creation date, name and email of the tagger and, optionally, a message."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Item>
      </UnmountClosed>
    </Dialog>
  );
}
