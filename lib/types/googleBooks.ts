// Google Books API response types
export interface GoogleBooksVolume {
  kind: string
  id: string
  etag: string
  selfLink: string
  volumeInfo: VolumeInfo
  saleInfo?: SaleInfo
  accessInfo?: AccessInfo
}

export interface VolumeInfo {
  title: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  industryIdentifiers?: IndustryIdentifier[]
  readingModes?: ReadingModes
  pageCount?: number
  printType?: string
  categories?: string[]
  averageRating?: number
  ratingsCount?: number
  maturityRating?: string
  allowAnonLogging?: boolean
  contentVersion?: string
  panelizationSummary?: PanelizationSummary
  imageLinks?: ImageLinks
  language?: string
  previewLink?: string
  infoLink?: string
  canonicalVolumeLink?: string
}

export interface IndustryIdentifier {
  type: string // "ISBN_10" | "ISBN_13" | "ISSN" | "OTHER"
  identifier: string
}

export interface ImageLinks {
  smallThumbnail?: string
  thumbnail?: string
  small?: string
  medium?: string
  large?: string
  extraLarge?: string
}

export interface ReadingModes {
  text: boolean
  image: boolean
}

export interface PanelizationSummary {
  containsEpubBubbles: boolean
  containsImageBubbles: boolean
}

export interface SaleInfo {
  country: string
  saleability: string
  isEbook: boolean
  listPrice?: Price
  retailPrice?: Price
  buyLink?: string
  offers?: Offer[]
}

export interface Price {
  amount: number
  currencyCode: string
}

export interface Offer {
  finskyOfferType: number
  listPrice: Price
  retailPrice: Price
}

export interface AccessInfo {
  country: string
  viewability: string
  embeddable: boolean
  publicDomain: boolean
  textToSpeechPermission: string
  epub: EpubInfo
  pdf: PdfInfo
  webReaderLink: string
  accessViewStatus: string
  quoteSharingAllowed: boolean
}

export interface EpubInfo {
  isAvailable: boolean
  acsTokenLink?: string
}

export interface PdfInfo {
  isAvailable: boolean
  acsTokenLink?: string
}

export interface GoogleBooksResponse {
  kind: string
  totalItems: number
  items?: GoogleBooksVolume[]
}

// Processed book data for our application
export interface ProcessedBookData {
  id: string
  title: string
  authors: string[]
  author: string // Joined authors for form compatibility
  publisher?: string
  publishedDate?: string
  published_year?: number
  description?: string
  pageCount?: number
  total_pages?: number // For form compatibility
  categories?: string[]
  genre?: string // Joined categories for form compatibility
  imageLinks?: ImageLinks
  cover_url?: string // Selected optimal image URL
  isbn10?: string
  isbn13?: string
  isbn?: string // Primary ISBN for form compatibility
  averageRating?: number
  ratingsCount?: number
}