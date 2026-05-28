import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { findUnrenderableAssets } from "../../lib/render-validation";
import type { VideoComposition } from "../../types/video-composition";

type RenderPhase = "idle" | "running" | "success" | "error";

type ProgressState = {
  message: string;
  percent: number;
  phase: string;
};

type Props = {
  isOpen: boolean;
  timeline: VideoComposition;
  onClose: () => void;
};

const initialProgress: ProgressState = {
  message: "Preparing…",
  percent: 0,
  phase: "starting",
};

const downloadFile = async (downloadUrl: string, fileName: string) => {
  const res = await fetch(downloadUrl);
  if (!res.ok) {
    throw new Error("Could not download rendered video.");
  }
  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("video")) {
    throw new Error("Server did not return a video file.");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const RenderDialog = ({ isOpen, timeline, onClose }: Props) => {
  const [phase, setPhase] = useState<RenderPhase>("idle");
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [error, setError] = useState<string | null>(null);
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPhase("idle");
    setProgress(initialProgress);
    setError(null);
    setSavedPath(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const blobAssets = findUnrenderableAssets(timeline);
    if (blobAssets.length > 0) {
      setPhase("error");
      setError(
        "This project uses uploaded media stored only in the browser. Copy files into public/ or use built-in assets before rendering."
      );
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setPhase("running");
    setError(null);
    setSavedPath(null);
    setProgress(initialProgress);

    const run = async () => {
      try {
        const res = await fetch("/api/render", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(timeline),
          signal: controller.signal,
        });

        const contentType = res.headers.get("Content-Type") ?? "";

        if (!res.ok && contentType.includes("json")) {
          const body = await res.json();
          throw new Error(body.error ?? "Render failed");
        }

        if (!contentType.includes("ndjson")) {
          throw new Error("Unexpected response from render server. Restart the dev server.");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream from render server.");

        const decoder = new TextDecoder();
        let buffer = "";
        let complete: { downloadUrl: string; fileName: string; relativePath: string } | null =
          null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line) as {
              type: string;
              message?: string;
              percent?: number;
              phase?: string;
              downloadUrl?: string;
              fileName?: string;
              relativePath?: string;
            };

            if (event.type === "error") {
              throw new Error(event.message ?? "Render failed");
            }

            if (event.type === "progress" || event.type === "phase") {
              setProgress((prev) => ({
                message: event.message ?? prev.message,
                percent: event.percent ?? prev.percent,
                phase: event.phase ?? prev.phase,
              }));
            }

            if (event.type === "complete" && event.downloadUrl && event.fileName) {
              complete = {
                downloadUrl: event.downloadUrl,
                fileName: event.fileName,
                relativePath: event.relativePath ?? `out/${event.fileName}`,
              };
            }
          }
        }

        if (!complete) {
          throw new Error("Render finished without a video file.");
        }

        setProgress({ message: "Downloading…", percent: 100, phase: "done" });
        await downloadFile(complete.downloadUrl, complete.fileName);

        setSavedPath(complete.relativePath);
        setPhase("success");
        setProgress({ message: "Done", percent: 100, phase: "done" });
      } catch (err) {
        if (controller.signal.aborted) return;
        setPhase("error");
        setError(err instanceof Error ? err.message : "Render failed");
      }
    };

    void run();

    return () => {
      controller.abort();
    };
  }, [isOpen, timeline]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={phase !== "running"}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg="bg.elevated" borderColor="border.subtle" borderWidth="1px">
        <ModalHeader fontSize="md">Rendering video</ModalHeader>
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontSize="sm" color="text.secondary" mb={2}>
                {progress.message}
              </Text>
              <Progress
                value={progress.percent}
                size="sm"
                colorScheme="brand"
                borderRadius="full"
                isIndeterminate={phase === "running" && progress.percent === 0}
              />
            </Box>

            {phase === "success" && savedPath && (
              <Alert status="success" borderRadius="md" fontSize="sm">
                <AlertIcon />
                <AlertDescription>
                  MP4 saved to <strong>{savedPath}</strong> and downloaded to your computer.
                </AlertDescription>
              </Alert>
            )}

            {phase === "error" && error && (
              <Alert status="error" borderRadius="md" fontSize="sm">
                <AlertIcon />
                <AlertDescription whiteSpace="pre-wrap">{error}</AlertDescription>
              </Alert>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          {phase === "success" || phase === "error" ? (
            <Button size="sm" onClick={handleClose}>
              Close
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClose}
              isDisabled={phase !== "running"}
            >
              {phase === "running" ? "Cancel" : "Close"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RenderDialog;
