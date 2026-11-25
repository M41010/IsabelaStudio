import {ActivityIcon} from '@sanity/icons/Activity'
import {BookIcon} from '@sanity/icons/Book'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {HomeIcon} from '@sanity/icons/Home'
import {LockIcon} from '@sanity/icons/Lock'
import {ProjectsIcon} from '@sanity/icons/Projects'
import {StackCompactIcon} from '@sanity/icons/StackCompact'
import {StarIcon} from '@sanity/icons/Star'
import {SunIcon} from '@sanity/icons/Sun'
import {UserIcon} from '@sanity/icons/User'
import type {StructureResolver} from 'sanity/structure'
import {LINES} from './schemas/documents/collection'
import {FIXED_PAGES, type FixedPageId} from './schemas/documents/page'

export const COLLECTION_BY_LINE_TEMPLATE = 'collection-by-line'

const PAGE_ICONS: Record<FixedPageId, typeof DocumentTextIcon> = {
  about: UserIcon,
  bespoke: ProjectsIcon,
  'legal-notice': LockIcon,
  privacy: LockIcon,
  cookies: LockIcon,
}

const LINE_ICONS: Record<(typeof LINES)[number]['value'], typeof DocumentTextIcon> = {
  'pret-a-porter': StarIcon,
  flamenca: SunIcon,
}

const BY_YEAR = [
  {field: 'year', direction: 'desc' as const},
  {field: 'title.es', direction: 'asc' as const},
]

/** Barra lateral del Studio, en español y en el orden en que Teresita piensa la web. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem().singleton('homePage').title('Inicio').icon(HomeIcon),

      S.divider(),

      S.listItem()
        .id('collections')
        .title('Colecciones')
        .icon(BookIcon)
        .child(
          S.list()
            .id('collections-by-line')
            .title('Colecciones')
            .items([
              ...LINES.map((line) =>
                S.listItem()
                  .id(`collections-${line.value}`)
                  .title(line.title)
                  .icon(LINE_ICONS[line.value])
                  .child(
                    S.documentList()
                      .id(`collections-${line.value}-list`)
                      .title(line.title)
                      .schemaType('collection')
                      .apiVersion('2026-11-01')
                      .filter('_type == "collection" && line == $line')
                      .params({line: line.value})
                      .defaultOrdering(BY_YEAR)
                      // «Crear nuevo» desde aquí ya marca la línea.
                      .initialValueTemplates([
                        S.initialValueTemplateItem(COLLECTION_BY_LINE_TEMPLATE, {line: line.value}),
                      ]),
                  ),
              ),
              S.divider(),
              S.listItem()
                .id('collections-all')
                .title('Todas')
                .icon(StackCompactIcon)
                .child(S.documentTypeList('collection').title('Todas las colecciones').defaultOrdering(BY_YEAR)),
            ]),
        ),

      S.listItem()
        .id('pages')
        .title('Páginas')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .id('pages-list')
            .title('Páginas')
            .items(FIXED_PAGES.map((p) => S.listItem().singleton(p.id).title(p.title).icon(PAGE_ICONS[p.id]))),
        ),

      S.documentTypeListItem('pressItem')
        .title('Prensa')
        .icon(ActivityIcon)
        .child(
          S.documentTypeList('pressItem')
            .title('Prensa')
            .defaultOrdering([{field: 'date', direction: 'desc'}]),
        ),

      S.divider(),

      S.listItem().singleton('siteSettings').title('Ajustes').icon(CogIcon),
    ])
