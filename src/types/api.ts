export interface ColorRecipe {
  percentages: Record<string, number>
  achieved_color: {
    r: number
    g: number
    b: number
    hex: string
  }
}

export interface Color {
  r: number
  g: number
  b: number
  hex: string
  recipe: ColorRecipe
}

export interface GenerateResponse {
  color_count: number
  colors: Color[]
  paint_by_numbers_image: string
  paint_by_numbers_filled_image: string
  original_image?: string
  color_palette: Record<string, { r: number; g: number; b: number; hex: string }>
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
