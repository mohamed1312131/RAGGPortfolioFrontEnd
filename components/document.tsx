import { memo } from "react";
import { FileIcon, LoaderIcon, MessageIcon, PencilEditIcon } from "./icons";

// Simple type since ArtifactKind is removed
type SimpleKind = "text" | "code" | "sheet";

const getActionText = (
  type: "create" | "update" | "request-suggestions",
  tense: "present" | "past"
) => {
  switch (type) {
    case "create":
      return tense === "present" ? "Creating" : "Created";
    case "update":
      return tense === "present" ? "Updating" : "Updated";
    case "request-suggestions":
      return tense === "present"
        ? "Adding suggestions"
        : "Added suggestions to";
    default:
      return null;
  }
};

type DocumentToolResultProps = {
  type: "create" | "update" | "request-suggestions";
  result: { id: string; title: string; kind: SimpleKind };
  isReadonly: boolean;
};

function PureDocumentToolResult({
  type,
  result,
  isReadonly,
}: DocumentToolResultProps) {
  return (
    <button
      className="flex w-fit cursor-pointer flex-row items-start gap-3 rounded-xl border bg-background px-3 py-2"
      onClick={() => {
        // Artifacts removed - just show a message
        console.log(`Document tool result clicked: ${result.title}`);
      }}
      type="button"
    >
      <div className="mt-1 text-muted-foreground">
        {type === "create" ? (
          <FileIcon />
        ) : type === "update" ? (
          <PencilEditIcon />
        ) : type === "request-suggestions" ? (
          <MessageIcon />
        ) : null}
      </div>
      <div className="text-left">
        {`${getActionText(type, "past")} "${result.title}"`}
      </div>
    </button>
  );
}

export const DocumentToolResult = memo(PureDocumentToolResult, () => true);

type DocumentToolCallProps = {
  type: "create" | "update" | "request-suggestions";
  args:
    | { title: string; kind: SimpleKind } // for create
    | { id: string; description: string } // for update
    | { documentId: string }; // for request-suggestions
  isReadonly: boolean;
};

function PureDocumentToolCall({
  type,
  args,
  isReadonly,
}: DocumentToolCallProps) {
  return (
    <button
      className="cursor pointer flex w-fit flex-row items-start justify-between gap-3 rounded-xl border px-3 py-2"
      onClick={() => {
        // Artifacts removed - just show a message
        console.log(`Document tool call clicked: ${type}`);
      }}
      type="button"
    >
      <div className="flex flex-row items-start gap-3">
        <div className="mt-1 text-zinc-500">
          {type === "create" ? (
            <FileIcon />
          ) : type === "update" ? (
            <PencilEditIcon />
          ) : type === "request-suggestions" ? (
            <MessageIcon />
          ) : null}
        </div>

        <div className="text-left">
          {`${getActionText(type, "present")} ${
            type === "create" && "title" in args && args.title
              ? `"${args.title}"`
              : type === "update" && "description" in args
                ? `"${args.description}"`
                : type === "request-suggestions"
                  ? "for document"
                  : ""
          }`}
        </div>
      </div>

      <div className="mt-1 animate-spin">{<LoaderIcon />}</div>
    </button>
  );
}

export const DocumentToolCall = memo(PureDocumentToolCall, () => true);
