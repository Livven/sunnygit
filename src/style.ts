import { Colors } from "@blueprintjs/core";
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
`;

// do not put styles here directly as prettier does not recognize template literals tagged with `createGlobalStyle`, only `css`
export const GlobalStyle = createGlobalStyle`${blueprintOverrides}`;
