import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useCallback, useRef } from "react";
import { v4 as uuid } from "uuid";

import {
  defaultMediaImageStyles,
  defaultMediaStyles,
} from "@renda/shared/lib/component-defaults";
import { secondsToFrames } from "@renda/shared/lib/timeline-math";
import { ACCEPT_MEDIA, useEditorUi } from "../../../providers/editor-ui";
import { useTimeline } from "../../../providers/timeline";
import type { UserMediaAsset } from "@renda/shared/types/user-media";
import GifForm from "../../shared/popover/components/gif-form";
import ShapeForm from "../../shared/popover/components/shape-form";
import TextForm from "../../shared/popover/components/text-form";

const formatDuration = (sec: number) => {
  const total = Math.max(0, Math.round(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const MediaPanel = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { userMedia, addUserMediaFiles, removeUserMedia } = useEditorUi();
  const { timeline, addComponent, playheadFrame } = useTimeline();

  const addAssetToScene = (asset: UserMediaAsset) => {
    const videoLane = timeline.lanes.find((l) => l.type === "video");
    const audioLane = timeline.lanes.find((l) => l.type === "audio");
    const durationFrames = secondsToFrames(asset.durationSec ?? 5);

    if (asset.kind === "audio") {
      if (!audioLane) return;
      addComponent({
        id: uuid(),
        type: "Video",
        src: asset.src,
        animation: "",
        startFrame: playheadFrame,
        duration: durationFrames,
        divStyles: { ...defaultMediaStyles },
      }, audioLane.id);
      return;
    }

    if (!videoLane) return;

    if (asset.kind === "gif") {
      addComponent({
        id: uuid(),
        type: "Gif",
        src: asset.src,
        startFrame: playheadFrame,
        duration: durationFrames,
        divStyles: { ...defaultMediaStyles },
      }, videoLane.id);
      return;
    }

    addComponent({
      id: uuid(),
      type: "Image",
      animation: "",
      src: asset.src,
      name: asset.name,
      startFrame: playheadFrame,
      duration: durationFrames,
      divStyles: { ...defaultMediaStyles },
      imageStyles: { ...defaultMediaImageStyles },
    }, videoLane.id);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    addUserMediaFiles(files);
    e.target.value = "";
  };

  const handleDragStart = useCallback(
    (e: React.DragEvent, asset: UserMediaAsset) => {
      e.dataTransfer.setData("application/json", JSON.stringify(asset));
      e.dataTransfer.effectAllowed = "copy";
    },
    []
  );

  const tabSx = {
    fontSize: "xs",
    fontWeight: "medium",
    color: "text.muted",
    _selected: { color: "teal.300", borderColor: "teal.300" },
    py: 1,
    px: 2,
  };

  return (
    <Tabs variant="line" size="sm" h="100%" display="flex" flexDirection="column" colorScheme="teal">
      <TabList borderBottom="1px solid" borderColor="border.subtle" flexShrink={0}>
        <Tab sx={tabSx}>Add</Tab>
        <Tab sx={tabSx}>User</Tab>
        <Tab sx={tabSx}>Stock</Tab>
      </TabList>

      <TabPanels flex={1} minH={0} overflowY="auto">
        <TabPanel p={0} pt={2}>
          <Accordion allowToggle reduceMotion>
            <AccordionItem border="none">
              <AccordionButton px={2} py={2} borderRadius="control" _hover={{ bg: "bg.hover" }}>
                <Box flex={1} textAlign="left" fontSize="sm">
                  Text
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={2} pb={3}>
                <TextForm />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none">
              <AccordionButton px={2} py={2} borderRadius="control" _hover={{ bg: "bg.hover" }}>
                <Box flex={1} textAlign="left" fontSize="sm">
                  Shape
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={2} pb={3}>
                <ShapeForm />
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none">
              <AccordionButton px={2} py={2} borderRadius="control" _hover={{ bg: "bg.hover" }}>
                <Box flex={1} textAlign="left" fontSize="sm">
                  GIF
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={2} pb={3}>
                <GifForm />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </TabPanel>

        <TabPanel p={0} pt={2} h="100%" display="flex" flexDirection="column">
          <Flex align="center" justify="space-between" mb={2} flexShrink={0}>
            <Button size="xs" variant="outline" onClick={() => fileRef.current?.click()}>
              Upload
            </Button>
            <Input
              ref={fileRef}
              type="file"
              accept={ACCEPT_MEDIA}
              multiple
              display="none"
              onChange={handleUpload}
            />
          </Flex>

          {userMedia.length === 0 ? (
            <Flex
              flex={1}
              align="center"
              justify="center"
              border="1px dashed"
              borderColor="border.subtle"
              borderRadius="md"
              p={4}
            >
              <Text fontSize="xs" color="text.muted" textAlign="center">
                Upload PNG, SVG, JPG, GIF, or audio. Click an item to add it at the playhead.
              </Text>
            </Flex>
          ) : (
            <Box flex={1} overflowY="auto" pr={1}>
              <SimpleGrid columns={2} spacing={2}>
                {userMedia.map((asset) => (
                  <Box
                    key={asset.id}
                    position="relative"
                    role="button"
                    tabIndex={0}
                    borderRadius="control"
                    border="1px solid"
                    borderColor="border.subtle"
                    bg="bg.subtle"
                    overflow="hidden"
                    cursor="grab"
                    draggable
                    transition="border-color 120ms ease, background 120ms ease"
                    _hover={{ borderColor: "accent", bg: "bg.hover" }}
                    onClick={() => addAssetToScene(asset)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addAssetToScene(asset);
                    }}
                    onDragStart={(e) => handleDragStart(e, asset)}
                    title={asset.name}
                  >
                    <Box h="72px" display="flex" alignItems="center" justifyContent="center" p={1}>
                      {asset.kind === "audio" ? (
                        <Flex direction="column" align="center" justify="center" gap={1}>
                          <Text fontSize="2xl" lineHeight={1} color="accent">♪</Text>
                          {asset.durationSec != null && (
                            <Text fontSize="10px" color="text.muted" sx={{ fontVariantNumeric: "tabular-nums" }}>
                              {formatDuration(asset.durationSec)}
                            </Text>
                          )}
                        </Flex>
                      ) : (
                        <Image
                          src={asset.src}
                          alt={asset.name}
                          maxH="100%"
                          maxW="100%"
                          objectFit="contain"
                        />
                      )}
                    </Box>
                    <Text fontSize="10px" px={2} py={1} noOfLines={1} color="text.muted">
                      {asset.name}
                    </Text>
                    <IconButton
                      aria-label="Remove from library"
                      icon={<CloseIcon boxSize={2} />}
                      size="xs"
                      variant="ghost"
                      position="absolute"
                      top={0}
                      right={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUserMedia(asset.id);
                      }}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </TabPanel>

        <TabPanel p={0} pt={2}>
          <Flex
            flex={1}
            align="center"
            justify="center"
            border="1px dashed"
            borderColor="border.subtle"
            borderRadius="md"
            p={4}
            minH="120px"
          >
            <Text fontSize="xs" color="text.muted" textAlign="center">
              Stock media library coming soon.
            </Text>
          </Flex>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default MediaPanel;
