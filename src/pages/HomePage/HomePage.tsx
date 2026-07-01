import { useState, useRef } from 'react'
import { Box, Button, Callout, Card, Flex, Heading, Text, TextField } from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Header } from '../../components/Header/Header'
import { ImageUpload } from '../../components/ImageUpload/ImageUpload'
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner'
import { ResultsDisplay } from '../../components/ResultsDisplay/ResultsDisplay'
import { generatePaintByNumbers } from '../../services/api'
import { ApiError, type GenerateResponse } from '../../types/api'
import styles from './HomePage.module.css'

type PageState = 'idle' | 'loading' | 'result' | 'error'

const MAX_COLORS_ALLOWED = 64
const MIN_COLORS_ALLOWED = 1

export function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [colorCount, setColorCount] = useState<string>('')
  const [pageState, setPageState] = useState<PageState>('idle')
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const colorCountNum = parseInt(colorCount, 10)
  const isColorCountValid =
    !isNaN(colorCountNum) &&
    colorCountNum >= MIN_COLORS_ALLOWED &&
    colorCountNum <= MAX_COLORS_ALLOWED
  const canSubmit = !!file && isColorCountValid && pageState !== 'loading'

  const handleSubmit = async () => {
    if (!file) return
    const controller = new AbortController()
    abortControllerRef.current = controller
    setPageState('loading')
    setErrorMessage(null)
    try {
      const data = await generatePaintByNumbers(file, colorCountNum, null, controller.signal)
      
      // Convert the original file to base64
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        const base64Data = base64.split(',')[1]
        setResult({ ...data, original_image: base64Data })
        setPageState('result')
      }
      reader.readAsDataURL(file)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // cancelled by user — return to idle silently
        return
      }
      if (err instanceof ApiError) {
        setErrorMessage(`Error ${err.status}: ${err.message}`)
      } else {
        setErrorMessage('Something went wrong. Please try again.')
      }
      setPageState('error')
    } finally {
      abortControllerRef.current = null
    }
  }

  const handleCancel = () => {
    abortControllerRef.current?.abort()
    handleReset()
  }

  const handleReset = () => {
    setFile(null)
    setColorCount('')
    setResult(null)
    setErrorMessage(null)
    setPageState('idle')
  }

  if (pageState === 'result' && result) {
    return (
      <Box className={styles.page}>
        <Header />
        <Box className={styles.resultsMain}>
          <ResultsDisplay result={result} onReset={handleReset} />
        </Box>
      </Box>
    )
  }

  return (
    <Box className={styles.page}>
      <Header />
      <Flex className={styles.main} align="center" justify="center">
        {pageState === 'loading' ? (
          <LoadingSpinner label="Generating your paint by numbers…" onCancel={handleCancel} />
        ) : (
          <Box className={styles.formWrapper}>
            <Card size="4">
              <Flex direction="column" gap="6">
                <Flex direction="column" gap="1" align="center">
                  <Heading size="7" align="center">
                    Create Paint by Numbers
                  </Heading>
                  <Text size="2" color="gray" align="center">
                    Upload a photo and choose how many colors to extract
                  </Text>
                </Flex>

                <ImageUpload onFileChange={setFile} />

                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="medium" htmlFor="color-count">
                    Number of dominant colors
                  </Text>
                  <TextField.Root
                    id="color-count"
                    type="number"
                    min={MIN_COLORS_ALLOWED}
                    max={MAX_COLORS_ALLOWED}
                    placeholder="e.g. 7"
                    value={colorCount}
                    onChange={(e) => setColorCount(e.target.value)}
                  />
                  <Text size="1" color="gray">
                    Enter a value between {MIN_COLORS_ALLOWED} and {MAX_COLORS_ALLOWED}
                  </Text>
                </Flex>

                {pageState === 'error' && errorMessage && (
                  <Callout.Root color="red" role="alert">
                    <Callout.Icon>
                      <ExclamationTriangleIcon />
                    </Callout.Icon>
                    <Callout.Text>{errorMessage}</Callout.Text>
                  </Callout.Root>
                )}

                <Button size="3" disabled={!canSubmit} onClick={handleSubmit}>
                  Generate Paint by Numbers
                </Button>
              </Flex>
            </Card>
          </Box>
        )}
      </Flex>
    </Box>
  )
}
