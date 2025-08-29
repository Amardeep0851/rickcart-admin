"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Blockquote from "@tiptap/extension-blockquote";
import ToolBar from "./toolbar";

function Tiptap({
  description,
  onChange,
}: {
  description: string;
  onChange: (richText: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // disable default heading (we add custom)
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "font-bold",
        },
      }),
      Paragraph,
      Blockquote,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: description,
    immediatelyRender: false, // ✅ avoids SSR hydration error
    editorProps: {
      attributes: {
        class:
          "rounded-sm border-[1px] min-h-[250px] border-input bg-background disabled:cursor-not-allowed disabled:opacity-50 p-2 focus-within:outline-0 focus-within:border-[1px] focus-within:border-zinc-500 ",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-stretch min-h-[250px]">
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default Tiptap;
