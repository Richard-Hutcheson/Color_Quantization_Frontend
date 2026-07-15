import { useRef, useState } from 'react'
import { Box, Button, Dialog, Flex, Grid, Heading, Separator, Text } from '@radix-ui/themes'
import { Cross2Icon, DownloadIcon } from '@radix-ui/react-icons'
import { toPng } from 'html-to-image'
import { type Color, type GenerateResponse } from '../../types/api'
import styles from './ResultsDisplay.module.css'

interface ResultsDisplayProps {
  result: GenerateResponse
  onReset: () => void
}

function downloadBase64Image(base64: string, filename: string) {
  const link = document.createElement('a')
  link.href = `data:image/png;base64,${base64}`
  link.download = filename
  link.click()
}

interface ImageCardProps {
  title: string
  base64: string
  filename: string
  onExpand: (title: string, base64: string) => void
}

function ImageCard({ title, base64, filename, onExpand }: ImageCardProps) {
  return (
    <Flex direction="column" gap="3" className={styles.imageCard}>
      <Heading size="4">{title}</Heading>
      <button
        type="button"
        onClick={() => onExpand(title, base64)}
        className={styles.imageButton}
        aria-label={`Expand ${title}`}
      >
        <img
          src={`data:image/png;base64,${base64}`}
          alt={title}
          className={styles.resultImage}
        />
      </button>
      <Button
        variant="soft"
        size="2"
        onClick={() => downloadBase64Image(base64, filename)}
      >
        <DownloadIcon />
        Download
      </Button>
    </Flex>
  )
}

interface PaletteSwatchCardProps {
  paletteKey: string
  color: { r: number; g: number; b: number; hex: string }
  matchedColor: Color | undefined
}

function PaletteSwatchCard({ paletteKey, color, matchedColor }: PaletteSwatchCardProps) {
  const recipe = matchedColor?.recipe
  const percentageEntries = recipe ? Object.entries(recipe.percentages) : []

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Flex
          direction="column"
          align="center"
          gap="1"
          className={`${styles.swatchCard} ${styles.swatchCardClickable}`}
          title="Click for mixing instructions"
        >
          <div className={styles.swatch} style={{ backgroundColor: color.hex }} />
          <Text size="2" weight="bold">
            #{paletteKey}
          </Text>
          <Text size="1" weight="medium">
            {color.hex}
          </Text>
          <Text size="1" color="gray">
            {color.r}, {color.g}, {color.b}
          </Text>
        </Flex>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="400px">
        <Dialog.Title>Color #{paletteKey} — Mixing Instructions</Dialog.Title>
        <Dialog.Description size="2" color="gray" mb="4">
          How to mix this color from base paints
        </Dialog.Description>

        <Flex gap="4" align="center" mb="4">
          <Flex direction="column" align="center" gap="1">
            <Text size="1" color="gray">Target</Text>
            <div className={styles.dialogSwatch} style={{ backgroundColor: color.hex }} />
            <Text size="1" weight="medium">{color.hex}</Text>
            <Text size="1" color="gray">{color.r}, {color.g}, {color.b}</Text>
          </Flex>

          {recipe && (
            <>
              <Text size="4" color="gray">→</Text>
              <Flex direction="column" align="center" gap="1">
                <Text size="1" color="gray">Achieved</Text>
                <div
                  className={styles.dialogSwatch}
                  style={{ backgroundColor: recipe.achieved_color.hex }}
                />
                <Text size="1" weight="medium">{recipe.achieved_color.hex}</Text>
                <Text size="1" color="gray">
                  {recipe.achieved_color.r}, {recipe.achieved_color.g}, {recipe.achieved_color.b}
                </Text>
              </Flex>
            </>
          )}
        </Flex>

        {percentageEntries.length > 0 && (
          <>
            <Separator size="4" mb="3" />
            <Text size="2" weight="medium" mb="2" as="p">Mix ratios</Text>
            <Flex direction="column" gap="2">
              {percentageEntries.map(([paint, pct]) => (
                <Flex key={paint} justify="between" align="center">
                  <Text size="2">{paint}</Text>
                  <Flex align="center" gap="2">
                    <div className={styles.mixBar}>
                      <div
                        className={styles.mixBarFill}
                        style={{ width: `${Math.round(pct)}%` }}
                      />
                    </div>
                    <Text size="2" weight="medium" style={{ minWidth: '3ch', textAlign: 'right' }}>
                      {Math.round(pct)}%
                    </Text>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </>
        )}

        <Flex justify="end" mt="5">
          <Dialog.Close>
            <Button variant="soft">Close</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const paletteEntries = Object.entries(result.color_palette)
  const paletteRef = useRef<HTMLDivElement>(null)
  const [downloadingPalette, setDownloadingPalette] = useState(false)
  const [expandedImage, setExpandedImage] = useState<{ title: string; base64: string } | null>(null)

  // Build hex → Color lookup so each swatch can find its recipe
  const colorsByHex = new Map<string, Color>(
    result.colors.map((c) => [c.hex.toLowerCase(), c]),
  )

  const handleDownloadPalette = async () => {
    if (!paletteRef.current) return
    setDownloadingPalette(true)
    try {
      const dataUrl = await toPng(paletteRef.current, { cacheBust: true })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'color-palette-key.png'
      link.click()
    } finally {
      setDownloadingPalette(false)
    }
  }

  const handleExpandImage = (title: string, base64: string) => {
    setExpandedImage({ title, base64 })
  }

  return (
    <>
      <Box className={styles.container}>
        <Flex justify="between" align="center" mb="6">
          <Heading size="7">Your Paint by Numbers</Heading>
          <Button variant="outline" size="2" onClick={onReset}>
            Reset
          </Button>
        </Flex>

        {/* Generated images */}
        <Grid columns={{ initial: '1', sm: '3' }} gap="6" mb="8">
          {result.original_image && (
            <ImageCard
              title="Original Photo"
              base64={result.original_image}
              filename="original-photo.png"
              onExpand={handleExpandImage}
            />
          )}
          <ImageCard
            title="Filled Preview"
            base64={result.paint_by_numbers_filled_image}
            filename="paint-by-numbers-filled.png"
            onExpand={handleExpandImage}
          />
          <ImageCard
            title="Paint by Numbers Outline"
            base64={result.paint_by_numbers_image}
            filename="paint-by-numbers-outline.png"
            onExpand={handleExpandImage}
          />
        </Grid>

        {/* Color palette key */}
        {paletteEntries.length > 0 && (
          <>
            <Flex justify="between" align="center" mb="4">
              <Heading size="5">Color Palette Key ({result.color_count})</Heading>
              <Button
                variant="soft"
                size="2"
                onClick={handleDownloadPalette}
                disabled={downloadingPalette}
              >
                <DownloadIcon />
                {downloadingPalette ? 'Saving…' : 'Download Key'}
              </Button>
            </Flex>
            <Text size="1" color="gray" mb="3" as="p">
              Click any color to see mixing instructions
            </Text>
            <div ref={paletteRef} className={styles.paletteCapture}>
              <Grid columns={{ initial: '3', xs: '4', sm: '5', md: '6' }} gap="3">
                {paletteEntries.map(([key, color]) => (
                  <PaletteSwatchCard
                    key={key}
                    paletteKey={key}
                    color={color}
                    matchedColor={colorsByHex.get(color.hex.toLowerCase())}
                  />
                ))}
              </Grid>
            </div>
          </>
        )}
      </Box>

      {expandedImage && (
        <div
          className={styles.imageDialogOverlay}
          onClick={() => setExpandedImage(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setExpandedImage(null)
            }
          }}
          aria-label="Close expanded image"
        >
          <div className={styles.imageDialogContent} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.imageDialogClose}
              aria-label="Close expanded image"
              onClick={() => setExpandedImage(null)}
            >
              <Cross2Icon />
            </button>
            <img
              src={`data:image/png;base64,${expandedImage.base64}`}
              alt={expandedImage.title}
              className={styles.expandedImage}
            />
          </div>
        </div>
      )}
    </>
  )
}
