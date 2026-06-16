import { Box, Flex, Text } from '@radix-ui/themes'
import styles from './Header.module.css'

export function Header() {
  return (
    <Box asChild>
      <header className={styles.header}>
        <Flex align="center" px="5" height="100%">
          <Text size="5" weight="bold" className={styles.brand}>
            Painterly
          </Text>
        </Flex>
      </header>
    </Box>
  )
}
