export type UIArtifact = {
  documentId: string;
  content: string;
  kind: "text";
  title: string;
  status: "idle" | "loading" | "error" | "ready";
  isVisible: boolean;
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};
