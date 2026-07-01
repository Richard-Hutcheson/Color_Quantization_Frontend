import { ApiError, type GenerateResponse } from '../types/api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export async function generatePaintByNumbers(
  image: File,
  colorCount: number,
  paletteJson: string | null = null,
  signal?: AbortSignal,
): Promise<GenerateResponse> {
  const formData = new FormData()
  formData.append('image', image)
  formData.append('color_count', String(colorCount))
  if (paletteJson !== null) {
    formData.append('palette_json', paletteJson)
  }

  const response = await fetch(`${BASE_URL}/api/images`, {
    method: 'POST',
    body: formData,
    signal,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const body = await response.json()
      if (typeof body?.detail === 'string') message = body.detail
      else if (typeof body?.message === 'string') message = body.message
    } catch {
      // ignore parse errors; keep the generic message
    }
    throw new ApiError(response.status, message)
  }

  return response.json() as Promise<GenerateResponse>
}
