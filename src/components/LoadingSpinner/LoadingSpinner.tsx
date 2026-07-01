import { Flex, Button, Text } from '@radix-ui/themes'
import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  label?: string
  onCancel?: () => void
}

export function LoadingSpinner({ label = 'Loading…', onCancel }: LoadingSpinnerProps) {
  return (
    <Flex direction="column" align="center" justify="center" gap="4" className={styles.wrapper}>
      <div className={styles.spinner} role="status" aria-label={label} />
      <Text size="3" color="gray">
        {label}
      </Text>
      {onCancel && (
        <Button variant="outline" color="red" size="2" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </Flex>
  )
}
