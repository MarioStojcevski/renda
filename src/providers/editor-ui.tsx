import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { v4 as uuid } from "uuid";

import type { UserMediaAsset } from "../types/user-media";

export type PanelId = "media" | "inspector" | "timeline";

export type PanelVisibility = Record<PanelId, boolean>;

const DEFAULT_PANELS: PanelVisibility = {
  media: true,
  inspector: true,
  timeline: true,
};

const ACCEPT_IMAGE = "image/png,image/svg+xml,image/jpeg,image/webp,image/gif";
const ACCEPT_AUDIO = "audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm,audio/aac,audio/flac,audio/x-m4a,audio/mp4";
const ACCEPT_MEDIA = `${ACCEPT_IMAGE},${ACCEPT_AUDIO}`;

const classifyFile = (file: File): UserMediaAsset["kind"] | null => {
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type === "image/gif") return "gif";
  if (file.type.startsWith("image/")) return "image";
  return null;
};

const probeAudioDuration = (src: string): Promise<number | undefined> =>
  new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = "metadata";
    const cleanup = () => {
      audio.removeEventListener("loadedmetadata", onLoad);
      audio.removeEventListener("error", onError);
    };
    const onLoad = () => {
      cleanup();
      resolve(Number.isFinite(audio.duration) ? audio.duration : undefined);
    };
    const onError = () => {
      cleanup();
      resolve(undefined);
    };
    audio.addEventListener("loadedmetadata", onLoad);
    audio.addEventListener("error", onError);
    audio.src = src;
  });

type EditorUiContextValue = {
  panels: PanelVisibility;
  setPanelVisible: (id: PanelId, visible: boolean) => void;
  togglePanel: (id: PanelId) => void;
  userMedia: UserMediaAsset[];
  addUserMediaFiles: (files: FileList | File[]) => UserMediaAsset[];
  removeUserMedia: (id: string) => void;
};

const EditorUiContext = createContext<EditorUiContextValue | undefined>(undefined);

export const EditorUiProvider = ({ children }: { children: ReactNode }) => {
  const [panels, setPanels] = useState<PanelVisibility>(DEFAULT_PANELS);
  const [userMedia, setUserMedia] = useState<UserMediaAsset[]>([]);

  const setPanelVisible = useCallback((id: PanelId, visible: boolean) => {
    setPanels((prev) => ({ ...prev, [id]: visible }));
  }, []);

  const togglePanel = useCallback((id: PanelId) => {
    setPanels((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const addUserMediaFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files);
    const added: UserMediaAsset[] = [];
    for (const file of list) {
      const kind = classifyFile(file);
      if (!kind) continue;
      added.push({
        id: uuid(),
        src: URL.createObjectURL(file),
        name: file.name,
        kind,
        createdAt: Date.now(),
      });
    }
    if (added.length === 0) return added;

    setUserMedia((prev) => [...added, ...prev]);

    for (const asset of added) {
      if (asset.kind !== "audio") continue;
      probeAudioDuration(asset.src).then((durationSec) => {
        if (durationSec == null) return;
        setUserMedia((prev) =>
          prev.map((a) => (a.id === asset.id ? { ...a, durationSec } : a))
        );
      });
    }

    return added;
  }, []);

  const removeUserMedia = useCallback((id: string) => {
    setUserMedia((prev) => {
      const item = prev.find((a) => a.id === id);
      if (item?.src.startsWith("blob:")) URL.revokeObjectURL(item.src);
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  const value = useMemo(
    () => ({
      panels,
      setPanelVisible,
      togglePanel,
      userMedia,
      addUserMediaFiles,
      removeUserMedia,
    }),
    [panels, setPanelVisible, togglePanel, userMedia, addUserMediaFiles, removeUserMedia]
  );

  return (
    <EditorUiContext.Provider value={value}>{children}</EditorUiContext.Provider>
  );
};

export const useEditorUi = () => {
  const ctx = useContext(EditorUiContext);
  if (!ctx) {
    throw new Error("useEditorUi must be used within EditorUiProvider");
  }
  return ctx;
};

export { ACCEPT_AUDIO, ACCEPT_IMAGE, ACCEPT_MEDIA };
