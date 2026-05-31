import {
  Checkbox,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";

import RenderDialog from "../render-dialog";
import { useLocation } from "react-router-dom";

import useTemplates from "../../../hooks/use-templates";
import { readProjectFile } from "@renda/shared/lib/import-project";
import { useEditorUi, type PanelId } from "../../../providers/editor-ui";
import { useTimeline } from "../../../providers/timeline";

const PANEL_LABELS: Record<PanelId, string> = {
  media: "Media",
  inspector: "Inspector",
  timeline: "Timeline",
  ai: "AI",
};

const EditorMenuBar = () => {
  const { pathname } = useLocation();
  const toast = useToast();
  const importRef = useRef<HTMLInputElement>(null);
  const { timeline, setTimeline } = useTimeline();
  const { saveTemplate } = useTemplates();
  const { panels, togglePanel } = useEditorUi();
  const [renderOpen, setRenderOpen] = useState(false);

  if (!pathname.startsWith("/editor")) return null;

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const project = await readProjectFile(file);
    e.target.value = "";
    if (!project) {
      toast({
        status: "error",
        title: "Invalid project file",
        description: "Choose a JSON file exported from renda.",
        duration: 4000,
      });
      return;
    }
    setTimeline(project);
    toast({ status: "success", title: `Imported ${file.name}`, duration: 2000 });
  };

  const handleSave = () => {
    if (!timeline.lanes.some((l) => l.components.length > 0)) {
      toast({
        status: "warning",
        title: "Add at least one component before saving.",
        duration: 2500,
      });
      return;
    }
    const name = window.prompt("Project name", "Untitled");
    if (!name) return;
    saveTemplate(name, timeline);
  };

  const handleRender = () => {
    if (!timeline.lanes.some((l) => l.components.length > 0)) {
      toast({
        status: "warning",
        title: "Add at least one component before rendering.",
        duration: 2500,
      });
      return;
    }
    setRenderOpen(true);
  };

  const menuButtonProps = {
    size: "sm" as const,
    variant: "ghost" as const,
    fontWeight: "medium" as const,
    fontSize: "sm" as const,
    rightIcon: <ChevronDownIcon boxSize={3} />,
  };

  return (
    <HStack spacing={0} ml={2}>
      <input
        ref={importRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={handleImport}
      />

      <Menu>
        <MenuButton as={Button} {...menuButtonProps}>
          File
        </MenuButton>
        <MenuList minW="200px">
          <MenuItem fontSize="sm" onClick={() => importRef.current?.click()}>
            Import project…
          </MenuItem>
          <MenuItem fontSize="sm" onClick={handleSave}>
            Save project…
          </MenuItem>
          <MenuDivider />
          <MenuItem fontSize="sm" onClick={handleRender} isDisabled={renderOpen}>
            {renderOpen ? "Rendering…" : "Render video"}
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu closeOnSelect={false}>
        <MenuButton as={Button} {...menuButtonProps}>
          View
        </MenuButton>
        <MenuList minW="200px">
          {(Object.keys(PANEL_LABELS) as PanelId[]).filter((id) => id !== "inspector").map((id) => (
            <MenuItem key={id} fontSize="sm" closeOnSelect={false}>
              <Checkbox
                size="sm"
                isChecked={panels[id]}
                onChange={() => togglePanel(id)}
                colorScheme="brand"
                isDisabled={renderOpen}
              >
                {PANEL_LABELS[id]}
              </Checkbox>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <RenderDialog
        isOpen={renderOpen}
        timeline={timeline}
        onClose={() => setRenderOpen(false)}
      />
    </HStack>
  );
};

export default EditorMenuBar;
