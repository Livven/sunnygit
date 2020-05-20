import * as monaco from "monaco-editor";
import React, { useEffect, useRef } from "react";
import { MonacoDiffEditor } from "react-monaco-editor";

import { Patch } from "../git";
import { CommonProps } from "../shared";

const languages = monaco.languages.getLanguages();

export type DiffMode = "inline" | "split";

export function FileDiffView({
  ignoreTrimWhitespace,
  mode,
  patch,
  triggerRerender,
}: {
  patch: Patch;
  mode: DiffMode;
  ignoreTrimWhitespace: boolean;
} & CommonProps) {
  const monacoEditor = useRef<MonacoDiffEditor>(null);

  useEffect(() => {
    setTimeout(() => {
      const editor = monacoEditor.current?.editor;
      if (editor) {
        const start = { lineNumber: 1, column: 1 };
        editor.setPosition(start);
        // seems like you can only reveal value (i.e. right-side) lines so using center gives a buffer if there are many removed lines
        // TODO figure out a way to always scroll to the very top
        editor.revealPositionInCenter(start);
      }
    });
  }, [patch, triggerRerender]);

  return (
    <MonacoDiffEditor
      ref={monacoEditor}
      language={
        // TODO do this in constant time
        languages.find(
          (language) =>
            language.filenames?.includes(patch.path) ||
            language.extensions?.some((extension) =>
              patch.path.endsWith(extension)
            )
        )?.id || "plaintext"
      }
      options={{
        renderSideBySide: mode === "split",
        ignoreTrimWhitespace,

        automaticLayout: true,
        readOnly: true,

        // when switching from a file with color decorators to another one, some decorators may remain
        // seems to be buggy so disable for now
        colorDecorators: false,
        // seems to show too much code as unused (only with JSX?)
        showUnused: false,

        // cosmetic stuff
        cursorSmoothCaretAnimation: true,
        renderWhitespace: "selection",
        roundedSelection: false,
        scrollbar: { useShadows: false },
        smoothScrolling: true,
      }}
      // ideally we want to set `undefined` if there is no file but that does not work
      // see https://github.com/microsoft/monaco-editor/issues/630
      original={patch.oldFile?.content || ""}
      value={patch.newFile?.content || ""}
    />
  );
}
