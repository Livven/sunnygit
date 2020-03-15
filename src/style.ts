import { Colors } from "@blueprintjs/core";
import _ from "lodash";
import { createGlobalStyle, css } from "styled-components/macro";

// from https://tailwindcss.com/docs/box-shadow
const shadowSmValue = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
const shadowInnerValue = "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)";

const blueprintOverrides = css`
  .bp3-button {
    transition: all 0.1s;

    &.bp3-small {
      font-size: 85%;
    }

    :not(.bp3-minimal):not([class*="bp3-intent-"]) {
      background: ${Colors.WHITE};
      border: 1px solid ${Colors.LIGHT_GRAY1};
      box-shadow: ${shadowSmValue};

      :hover {
        background: ${Colors.LIGHT_GRAY5};
        box-shadow: ${shadowSmValue};
      }

      :active,
      &.bp3-active {
        background: ${Colors.LIGHT_GRAY5};
        box-shadow: ${shadowSmValue}, ${shadowInnerValue};
      }
    }
  }

  .bp3-popover {
    border-radius: 0;

    .bp3-menu {
      padding: 6px 0;
      border-radius: 0;

      .bp3-menu-item {
        padding: 6px 12px;
        border-radius: 0;

        &:hover {
          cursor: default;
        }
      }
    }
  }

  ${_.range(20).map(
    (i) => css`
      .bp3-tree-node-content-${i} {
        padding-left: ${i * 12}px;
      }
    `
  )}
`;

const antOverrides = css`
  .ant-popover,
  .ant-popover-inner-content {
    color: unset;
  }

  .ant-form-item-label > label::after {
    margin-right: 10px;
    content: "";
  }
`;

const reactCollapseAnimation = css`
  /* specify our own animation https://github.com/nkbt/react-collapse/tree/9931dea16d25aaf55138219f689ef651b05211f5#1-change-in-behaviour */
  .ReactCollapse--collapse {
    transition: height 200ms;
  }

  /* use dummy padding to contain child margins to avoid jumpy behavior https://github.com/nkbt/react-collapse/tree/9931dea16d25aaf55138219f689ef651b05211f5#behaviour-notes */
  .ReactCollapse--content {
    padding: 0.1px 0;
  }
`;

// do not put styles here directly as prettier does not recognize template literals tagged with `createGlobalStyle`, only `css`
export const GlobalStyle = createGlobalStyle`
  ${blueprintOverrides}
  ${antOverrides}
  ${reactCollapseAnimation}
`;
