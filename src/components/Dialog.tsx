import { Button, Form, Modal } from "antd";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components/macro";

const labelWidth = "100px";

const ModalWithForm = styled(Modal)`
  .ant-row {
    flex-wrap: nowrap;

    .ant-form-item-label {
      flex-shrink: 0;
      width: ${labelWidth};
    }

    .ant-form-item-control {
      flex-grow: 1;

      :first-child {
        /* if there is no label, leave the space empty */
        margin-left: ${labelWidth};
      }
    }
  }
`;

export function Dialog({
  children,
  isOpen,
  onClose,
  onSubmit,
  submitLabel,
  title,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  submitLabel: string;
  title: string;
}) {
  return (
    <ModalWithForm
      destroyOnClose
      footer={null}
      title={title}
      visible={isOpen}
      onCancel={onClose}
    >
      <Form
        onFinish={async () => {
          await onSubmit();
          onClose();
        }}
      >
        {children}
        <Form.Item
          css={css`
            * + * {
              margin-left: 8px;
            }
          `}
        >
          <Button htmlType="submit" type="primary">
            {submitLabel}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Form.Item>
      </Form>
    </ModalWithForm>
  );
}

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);

  // change key to reset dialog state when opening it
  // this also avoids issues with antd clearing some form values (e.g. named input form items) without updating the corresponding state variables
  const [key, setKey] = useState(() => Math.random());
  useEffect(() => {
    if (isOpen) {
      setKey(Math.random());
    }
  }, [isOpen]);

  return {
    props: {
      key,
      isOpen,
      onClose: () => setIsOpen(false),
    },
    open: () => setIsOpen(true),
  };
}

// this cannot be set for all form items as it would e.g. cut off box shadows otherwise
export const ClippedFormItem = styled(Form.Item)`
  .ant-form-item-control {
    overflow: hidden;
  }
`;
