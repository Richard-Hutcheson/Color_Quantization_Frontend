import { useState } from 'react'
import { Box, Button, Card, Flex, Heading, Text, TextField } from '@radix-ui/themes'
import { Header } from '../../components/Header/Header'
import { ImageUpload } from '../../components/ImageUpload/ImageUpload'
import styles from './HomePage.module.css'

export function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [colorCount, setColorCount] = useState<string>('')

  const colorCountNum = parseInt(colorCount, 10)
  const isColorCountValid = !isNaN(colorCountNum) && colorCountNum >= 1 && colorCountNum <= 20
  const canSubmit = !!file && isColorCountValid

  const handleSubmit = () => {
    // TODO: call backend API with `file` and `colorCountNum`
    console.log({ file, colorCount: colorCountNum })
  }

  return (
    <Box className={styles.page}>
      <Header />
      <Flex className={styles.main} align="center" justify="center">
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
                  min="1"
                  max="20"
                  placeholder="e.g. 5"
                  value={colorCount}
                  onChange={(e) => setColorCount(e.target.value)}
                />
                <Text size="1" color="gray">
                  Enter a value between 1 and 20
                </Text>
              </Flex>

              <Button size="3" disabled={!canSubmit} onClick={handleSubmit}>
                Generate Paint by Numbers
              </Button>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </Box>
  )
}
