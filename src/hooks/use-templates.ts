import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

import { TEMPLATES_KEY } from "../constants/local-storage";
import type { VideoComposition } from "../types/video-composition";
import {
  readFromLocalStorage,
  writeToLocalStorage,
} from "../utils/local-storage";

export type StoredTemplate = {
  id: string;
  name: string;
  description?: string;
  updatedAt: number;
  timeline: VideoComposition;
};

const readAll = (): StoredTemplate[] =>
  readFromLocalStorage<StoredTemplate[]>(TEMPLATES_KEY) ?? [];

const writeAll = (templates: StoredTemplate[]) =>
  writeToLocalStorage(TEMPLATES_KEY, templates);

const useTemplates = () => {
  const toast = useToast();
  const [templates, setTemplates] = useState<StoredTemplate[]>(() => readAll());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === TEMPLATES_KEY) setTemplates(readAll());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const refresh = useCallback(() => setTemplates(readAll()), []);

  const saveTemplate = useCallback(
    (name: string, timeline: VideoComposition, id?: string) => {
      const all = readAll();
      const now = Date.now();
      const idx = id ? all.findIndex((t) => t.id === id) : -1;

      const next: StoredTemplate = {
        id: id ?? `tpl_${now}`,
        name: name || "Untitled",
        updatedAt: now,
        timeline,
      };

      if (idx >= 0) all[idx] = { ...all[idx], ...next };
      else all.push(next);

      writeAll(all);
      setTemplates(all);

      toast.closeAll();
      toast({
        status: "success",
        title: `Saved "${next.name}"`,
        duration: 1500,
        position: "bottom-right",
      });

      return next;
    },
    [toast]
  );

  const deleteTemplate = useCallback((id: string) => {
    const all = readAll().filter((t) => t.id !== id);
    writeAll(all);
    setTemplates(all);
  }, []);

  const loadTemplate = useCallback((id: string) => {
    return readAll().find((t) => t.id === id) ?? null;
  }, []);

  return { templates, saveTemplate, deleteTemplate, loadTemplate, refresh };
};

export default useTemplates;
