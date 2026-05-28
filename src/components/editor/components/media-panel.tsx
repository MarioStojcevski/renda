import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { v4 as uuid } from "uuid";

import {
  defaultMediaImageStyles,
  defaultMediaStyles,
} from "../../../lib/component-defaults";
import { ACCEPT_MEDIA, useEditorUi } from "../../../providers/editor-ui";
import { useTimeline } from "../../../providers/timeline";
import type { UserMediaAsset } from "../../../types/user-media";
import PopoverComponent from "../../shared/popover";
import { rendaMediaTypes } from "../../shared/popover/utils/popover-types";

const formatDuration = (sec: number) => {
  const total = Math.max(0, Math.round(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const MediaPanel = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { userMedia, addUserMediaFiles, removeUserMedia } = useEditorUi();
  const { addComponent, addAudio, playheadFrame } = useTimeline();

  const addAssetToScene = (asset: UserMediaAsset) => {
    if (asset.kind === "audio") {
      addAudio(asset.src, playheadFrame, asset.durationSec ?? 5);
      return;
    }

    if (asset.kind === "gif") {
      addComponent({
        id: uuid(),
        type: "Gif",
        src: asset.src,
        divStyles: { ...defaultMediaStyles },
      });
      return;
    }

    addComponent({
      id: uuid(),
      type: "Image",
      animation: "",
      src: asset.src,
      name: asset.name,
      divStyles: { ...defaultMediaStyles },
      imageStyles: { ...defaultMediaImageStyles },
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    addUserMediaFiles(files);
    e.target.value = "";
  };

  return (
    <VStack align="stretch" spacing={4} h="100%">
      <Box>
        <Text fontSize="xs" fontWeight="semibold" color="text.muted" mb={2} textTransform="uppercase">
          renda
        </Text>
        <VStack align="stretch" spacing={1}>
          {rendaMediaTypes.map((type) => (
            <PopoverComponent key={type} type={type} />
          ))}
        </VStack>
        <Text fontSize="xs" color="text.muted" mt={2}>
          Use a rectangle shape for backgrounds.
        </Text>
      </Box>

      <Box flex={1} minH={0} display="flex" flexDirection="column">
        <Flex align="center" justify="space-between" mb={2}>
          <Text fontSize="xs" fontWeight="semibold" color="text.muted" textTransform="uppercase">
            Your media
          </Text>
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
              Upload PNG, SVG, JPG, GIF, or audio (MP3/WAV/OGG). Click an item to add it.
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
                  cursor="pointer"
                  transition="border-color 120ms ease, background 120ms ease"
                  _hover={{ borderColor: "accent", bg: "bg.hover" }}
                  onClick={() => addAssetToScene(asset)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addAssetToScene(asset);
                  }}
                >
                  <Box h="72px" display="flex" alignItems="center" justifyContent="center" p={1}>
                    {asset.kind === "audio" ? (
                      <Flex direction="column" align="center" justify="center" gap={1}>
                        <Text fontSize="2xl" lineHeight={1} color="accent">
                          ♪
                        </Text>
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
      </Box>
    </VStack>
  );
};

export default MediaPanel;
