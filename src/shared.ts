import { Colors } from "@blueprintjs/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { css } from "styled-components/macro";

dayjs.extend(relativeTime);

export const backgroundColor = Colors.WHITE;
export const hoverBackgroundColor = Colors.LIGHT_GRAY4;
export const selectedBackgroundColor = Colors.LIGHT_GRAY3;
export const borderColor = Colors.LIGHT_GRAY3;
export const listItemBorderColor = Colors.LIGHT_GRAY4;

export const itemGapStyle = css`
  > * + * {
    margin-left: 6px;
  }
`;

export type CommonProps = { className?: string };

export function longDate(unixTimeSeconds: number) {
  return dayjs.unix(unixTimeSeconds).format("dddd, D MMMM YYYY, HH:mm");
}

export function smartRelativeDate(unixTimeSeconds: number) {
  const now = dayjs();
  const date = dayjs.unix(unixTimeSeconds);

  // 21 is the cutoff for "hours" rather than "days" ago https://day.js.org/docs/en/plugin/relative-time
  if (now.diff(date, "hour") < 21) {
    return date.from(now);
  }

  const format = `ddd, D MMM${now.diff(date, "month") < 11 ? "" : " YYYY"}`;
  return date.format(format);
}
