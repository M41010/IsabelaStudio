import {editorialBlocks} from './blocks'
import {collection} from './documents/collection'
import {homePage} from './documents/homePage'
import {page} from './documents/page'
import {pressItem} from './documents/pressItem'
import {siteSettings} from './documents/siteSettings'
import {accessibleImage} from './objects/accessibleImage'
import {localeRichText, localeString, localeText} from './objects/locale'
import {seo} from './objects/seo'
import {video} from './objects/video'

export const schemaTypes = [
  // Objetos
  localeString,
  localeText,
  localeRichText,
  accessibleImage,
  seo,
  video,
  // Bloques
  ...editorialBlocks,
  // Documentos
  homePage,
  collection,
  page,
  pressItem,
  siteSettings,
]
