import { useCallback, useRef, useState } from 'react'
import { Flex, IconButton, Text } from '@radix-ui/themes'
import { Cross2Icon, UploadIcon } from '@radix-ui/react-icons'
import styles from './ImageUpload.module.css'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

interface ImageUploadProps {
  onFileChange: (file: File | null) => void
}

export function ImageUpload({ onFileChange }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (incoming: File) => {
      if (!ACCEPTED_TYPES.includes(incoming.type)) {
        setError('Only JPG and PNG files are supported.')
        return
      }
      setError(null)
      setFile(incoming)
      onFileChange(incoming)
    },
    [onFileChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFile(dropped)
    },
    [handleFile],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleRemove = () => {
    setFile(null)
    setError(null)
    onFileChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const dropzoneClass = [
    styles.dropzone,
    isDragging ? styles.dragging : '',
    file ? styles.hasFile : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Flex direction="column" gap="2">
      <div
        className={dropzoneClass}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className={styles.hiddenInput}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
        <Flex direction="column" align="center" gap="2">
          <UploadIcon className={styles.uploadIcon} width="28" height="28" />
          <Text size="3" weight="medium">
            {isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}
          </Text>
          <Text size="2" color="gray">
            JPG or PNG
          </Text>
        </Flex>
      </div>

      {error && (
        <Text size="2" color="red">
          {error}
        </Text>
      )}

      {file && (
        <Flex align="center" gap="2" className={styles.fileChip}>
          <Text size="2" className={styles.fileName} title={file.name}>
            {file.name}
          </Text>
          <IconButton
            size="1"
            variant="ghost"
            color="gray"
            onClick={handleRemove}
            aria-label="Remove file"
          >
            <Cross2Icon />
          </IconButton>
        </Flex>
      )}
    </Flex>
  )
}
