/**
 * @file buildExtensions.js
 * @description Tiptap 拡張を mode / enabledExtensions に応じて組み立てる
 */

import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

/** @type {readonly string[]} custom / pro で扱う拡張キー（順序は登録順の参考） */
export const WYSIWYG_EXTENSION_KEYS = Object.freeze([
  "link",
  "underline",
  "textAlign",
  "highlight",
  "placeholder",
  "image",
  "table",
  "taskList",
  "textStyle",
  "color",
]);

const ALLOWED = new Set(WYSIWYG_EXTENSION_KEYS);

/**
 * @param {object} opts
 * @param {Set<string>} opts.enabledSet
 * @param {string} opts.placeholder
 * @returns {import('@tiptap/core').Extension[]}
 */
function buildExtraExtensions({ enabledSet, placeholder }) {
  /** @type {import('@tiptap/core').Extension[]} */
  const extensions = [];

  if (enabledSet.has("link")) {
    extensions.push(
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
    );
  }
  if (enabledSet.has("underline")) {
    extensions.push(Underline);
  }
  if (enabledSet.has("textAlign")) {
    extensions.push(
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    );
  }
  if (enabledSet.has("highlight")) {
    extensions.push(Highlight.configure({ multicolor: true }));
  }
  if (enabledSet.has("placeholder")) {
    extensions.push(
      Placeholder.configure({
        placeholder: placeholder ?? "",
      }),
    );
  }
  if (enabledSet.has("image")) {
    extensions.push(Image.configure({ inline: true }));
  }
  if (enabledSet.has("table")) {
    extensions.push(
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    );
  }
  if (enabledSet.has("taskList")) {
    extensions.push(TaskList, TaskItem.configure({ nested: true }));
  }
  // Color は TextStyle に依存するため順序を守る
  if (enabledSet.has("textStyle") || enabledSet.has("color")) {
    extensions.push(TextStyle);
  }
  if (enabledSet.has("color")) {
    extensions.push(Color);
  }

  return extensions;
}

/**
 * @param {object} options
 * @param {'std'|'pro'|'custom'} [options.mode='std']
 * @param {string[]} [options.enabledExtensions=[]]
 * @param {string} [options.placeholder='']
 * @returns {import('@tiptap/core').AnyExtension[]}
 */
export function getExtensions({
  mode = "std",
  enabledExtensions = [],
  placeholder = "",
} = {}) {
  const starter = StarterKit.configure({});
  const base = [starter];

  if (mode === "std") {
    return base;
  }

  if (mode === "pro") {
    const enabledSet = new Set(WYSIWYG_EXTENSION_KEYS);
    return [...base, ...buildExtraExtensions({ enabledSet, placeholder })];
  }

  if (mode === "custom") {
    const enabledSet = new Set(
      enabledExtensions.filter((k) => typeof k === "string" && ALLOWED.has(k)),
    );
    return [...base, ...buildExtraExtensions({ enabledSet, placeholder })];
  }

  return base;
}

/**
 * useMemo 用: 依存を安定化するキー
 * @param {'std'|'pro'|'custom'} mode
 * @param {string[]} enabledExtensions
 * @param {string} placeholder
 */
export function getExtensionsDependencyKey(mode, enabledExtensions, placeholder) {
  const sorted = [...(enabledExtensions || [])].filter((k) => ALLOWED.has(k)).sort();
  return `${mode}|${sorted.join(",")}|${placeholder ?? ""}`;
}
