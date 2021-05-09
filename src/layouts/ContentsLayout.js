import { useState, useEffect, createContext, Fragment, useCallback, useContext } from 'react'
import { usePrevNext } from '@/hooks/usePrevNext'
import Link from 'next/link'
import { SidebarLayout, SidebarContext } from '@/layouts/SidebarLayout'
import { PageHeader } from '@/components/PageHeader'

export const ContentsContext = createContext()

function TableOfContents({ tableOfContents, currentSection }) {
  let sidebarContext = useContext(SidebarContext)
  let isMainNav = Boolean(sidebarContext)

  function closeNav() {
    if (isMainNav) {
      sidebarContext.setNavIsOpen(false)
    }
  }

  return (
    <>
      <h5
        css={{
          color: 'gray-900',
          fontSize: 'sm',
          fontWeight: 'semibold',
          letterSpacing: 'wide',
          mb: 3,
          textTransform: 'uppercase',
          lg: {
            fontSize: 'xs',
          },
        }}
      >
        On this page
      </h5>
      <ul
        css={{
          color: 'gray-500',
          fontWeigh: 'medium',
          overflowX: 'hidden',
        }}
      >
        {tableOfContents.map((section) => {
          let sectionIsActive =
            currentSection === section.slug ||
            section.children.findIndex(({ slug }) => slug === currentSection) > -1

          return (
            <Fragment key={section.slug}>
              <li>
                <a
                  href={`#${section.slug}`}
                  onClick={closeNav}
                  css={{
                    color: sectionIsActive && 'gray-900',
                    display: 'block',
                    py: 2,
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': {
                      color: 'gray-900',
                    },
                  }}
                >
                  {section.title}
                </a>
              </li>
              {section.children.map((subsection) => {
                let subsectionIsActive = currentSection === subsection.slug

                return (
                  <li
                    key={subsection.slug}
                    css={{
                      ml: isMainNav ? 4 : 2,
                    }}
                  >
                    <a
                      href={`#${subsection.slug}`}
                      onClick={closeNav}
                      css={{
                        color: subsectionIsActive && 'gray-900',
                        display: 'block',
                        py: 2,
                        transition: 'color 0.2s ease-in-out',
                        '&:hover': {
                          color: 'gray-900',
                        },
                      }}
                    >
                      {subsection.title}
                    </a>
                  </li>
                )
              })}
            </Fragment>
          )
        })}
      </ul>
    </>
  )
}

function useTableOfContents(tableOfContents) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.slug)
  let [headings, setHeadings] = useState([])

  const registerHeading = useCallback((id, top) => {
    setHeadings((headings) => [...headings.filter((h) => id !== h.id), { id, top }])
  }, [])

  const unregisterHeading = useCallback((id) => {
    setHeadings((headings) => headings.filter((h) => id !== h.id))
  }, [])

  useEffect(() => {
    if (tableOfContents.length === 0 || headings.length === 0) return
    function onScroll() {
      let y = window.pageYOffset
      let windowHeight = window.innerHeight
      let sortedHeadings = headings.concat([]).sort((a, b) => a.top - b.top)
      if (y <= 0) {
        setCurrentSection(sortedHeadings[0].id)
        return
      }
      if (y + windowHeight >= document.body.scrollHeight) {
        setCurrentSection(sortedHeadings[sortedHeadings.length - 1].id)
        return
      }
      const middle = y + windowHeight / 2
      let current = sortedHeadings[0].id
      for (let i = 0; i < sortedHeadings.length; i++) {
        if (middle >= sortedHeadings[i].top) {
          current = sortedHeadings[i].id
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [headings, tableOfContents])

  return { currentSection, registerHeading, unregisterHeading }
}

export function ContentsLayoutOuter({ children, layoutProps, ...props }) {
  const { currentSection, registerHeading, unregisterHeading } = useTableOfContents(
    layoutProps.tableOfContents
  )

  return (
    <SidebarLayout
      sidebar={
        <div className="mb-8">
          <TableOfContents
            tableOfContents={layoutProps.tableOfContents}
            currentSection={currentSection}
          />
        </div>
      }
      {...props}
    >
      <ContentsContext.Provider value={{ registerHeading, unregisterHeading }}>
        {children}
      </ContentsContext.Provider>
    </SidebarLayout>
  )
}

export function ContentsLayout({ children, meta, classes, tableOfContents }) {
  const toc = [
    ...(classes
      ? [{ title: 'Default class reference', slug: 'class-reference', children: [] }]
      : []),
    ...tableOfContents,
  ]

  const { currentSection, registerHeading, unregisterHeading } = useTableOfContents(toc)
  let { prev, next } = usePrevNext()

  return (
    <div
      id={meta.containerId}
      css={{
        display: 'flex',
        width: '100%',
      }}
    >
      <div
        css={{
          flex: 'auto',
          minWidth: 0,
          pb: 24,
          pt: 10,
          px: 4,
          sm: {
            px: 6,
          },
          lg: {
            pb: 16,
          },
          xl: {
            px: 8,
          },
        }}
      >
        <PageHeader
          title={meta.title}
          description={meta.description}
          badge={{ key: 'Tailwind CSS version', value: meta.featureVersion }}
          border={!classes && meta.headerSeparator !== false}
        />
        <ContentsContext.Provider value={{ registerHeading, unregisterHeading }}>
          <div>{children}</div>
        </ContentsContext.Provider>
        {(prev || next) && (
          <>
            <hr
              css={{
                border: '1px solid',
                borderColor: 'gray-200',
                mt: 10,
                mb: 4,
              }}
            />
            <div
              css={{
                display: 'flex',
                lineHeight: 6,
                fontWeight: 'medium',
              }}
            >
              {prev && (
                <Link href={prev.href}>
                  <a
                    css={{
                      cursor: 'pointer',
                      display: 'flex',
                      mr: 8,
                      transition: 'color 0.2s ease-in-out',
                      '&:hover': {
                        color: 'gray-900',
                      },
                    }}
                  >
                    <span aria-hidden="true" css={{ mr: 2 }}>
                      ←
                    </span>
                    {prev.shortTitle || prev.title}
                  </a>
                </Link>
              )}
              {next && (
                <Link href={next.href}>
                  <a
                    css={{
                      cursor: 'pointer',
                      display: 'flex',
                      textAlign: 'right',
                      ml: 'auto',
                      transition: 'color 0.2s ease-in-out',
                      '&:hover': {
                        color: 'gray-900',
                      },
                    }}
                  >
                    {next.shortTitle || next.title}
                    <span aria-hidden="true" css={{ ml: 2 }}>
                      →
                    </span>
                  </a>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
      <div
        css={{
          flex: 'none',
          pl: 8,
          mr: 8,
          width: '16rem',
          xl: {
            display: 'block',
            fontSize: 'sm',
          },
        }}
      >
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            position: 'fixed',
            pt: 10,
            pb: 6,
          }}
        >
          {toc.length > 0 && (
            <div css={{ mb: 8 }}>
              <TableOfContents tableOfContents={toc} currentSection={currentSection} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
