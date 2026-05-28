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

const ACCEPT_MEDIA = "image/png,image/svg+xml,image/jpeg,image/webp,image/gif";

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
    const added: UserMediaAsset[] = list.map((file) => ({
      id: uuid(),
      src: URL.createObjectURL(file),
      name: file.name,
      kind: file.type === "image/gif" ? "gif" : "image",
      createdAt: Date.now(),
    }));
    setUserMedia((prev) => [...added, ...prev]);
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

export { ACCEPT_MEDIA };
