export interface SuccessStory {
  id: string
  name: string
  age: number | null
  school: string | null
  university: string | null
  role: string | null
  story: string
  achievement: string
  image: string | null
  order: number
}

export interface HistoryMilestone {
  year: string
  title: string
  description: string
  icon?: string
}

export interface GalleryImage {
  src: string
  album?: string
}
