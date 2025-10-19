"use client";

import { useEffect, useRef } from "react";
import { useDataStream } from "./data-stream-provider";

export function DataStreamHandler() {
  const { dataStream } = useDataStream();
  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!dataStream?.length) {
      return;
    }

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    // Process deltas for basic functionality (no artifacts)
    for (const delta of newDeltas) {
      // Handle basic data stream events here if needed
      // Currently just consuming the stream
    }
  }, [dataStream]);

  return null;
}
