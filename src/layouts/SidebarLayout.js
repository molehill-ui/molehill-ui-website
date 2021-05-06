import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, forwardRef, useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import clsx from 'clsx'

export const SidebarContext = createContext()

const NavItem = forwardRef(({ href, children, isActive, isPublished, fallbackHref }, ref) => {
  return (
    <li ref={ref}>
      <Link href={isPublished ? href : fallbackHref}>
        <a
          css={{
            color: isActive ? 'blue-500' : 'gray-500',
            display: 'block',
            position: 'relative',
            px: 3,
            py: 2,
            transition: 'colors 0.2s ease-in-out',
          }}
        >
          <span
            css={{
              bg: 'blue-50',
              borderRadius: 'md',
              opacity: isActive ? 1 : 0,
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          />
          <span css={{ position: 'relative' }}>{children}</span>
        </a>
      </Link>
    </li>
  )
})

function Nav({ nav, children, fallbackHref }) {
  const router = useRouter()
  const activeItemRef = useRef()
  const scrollRef = useRef()

  useIsomorphicLayoutEffect(() => {
    if (activeItemRef.current) {
      const scrollRect = scrollRef.current.getBoundingClientRect()
      const activeItemRect = activeItemRef.current.getBoundingClientRect()

      const top = activeItemRef.current.offsetTop
      const bottom = top - scrollRect.height + activeItemRect.height

      if (scrollRef.current.scrollTop > top || scrollRef.current.scrollTop < bottom) {
        scrollRef.current.scrollTop =
          activeItemRef.current.offsetTop - scrollRect.height / 2 + activeItemRect.height / 2
      }
    }
  }, [router.pathname])

  return (
    <nav id="nav" ref={scrollRef}>
      <div
        css={{
          fontSize: 'base',
          fontWeight: 'medium',
          overflowY: 'auto',
          pb: 10,
          px: 1,
          pt: 6,
          sm: { px: 3 },
          lg: { fontSize: 'sm', pb: 14, pt: 10 },
          xl: { px: 5 },
        }}
      >
        <ul>
          {children}
          {nav &&
            Object.keys(nav)
              .map((category) => {
                let publishedItems = nav[category]
                if (publishedItems.length === 0 && !fallbackHref) return null
                return (
                  <li key={category} css={{ mb: 8 }}>
                    <h5
                      css={{
                        color: 'gray-700',
                        fontSize: 'sm',
                        fontWeight: 'bold',
                        px: 3,
                        mb: 3,
                        textTransform: 'uppercase',
                        lg: {
                          fontSize: 'xs',
                        },
                      }}
                    >
                      {category}
                    </h5>
                    <ul>
                      {(fallbackHref ? nav[category] : publishedItems).map((item, i) => (
                        <NavItem
                          key={i}
                          href={item.href}
                          isActive={item.href === router.pathname}
                          ref={item.href === router.pathname ? activeItemRef : undefined}
                          isPublished={item.published !== false}
                          fallbackHref={fallbackHref}
                        >
                          {item.shortTitle || item.title}
                        </NavItem>
                      ))}
                    </ul>
                  </li>
                )
              })
              .filter(Boolean)}
        </ul>
      </div>
    </nav>
  )
}

export function SidebarLayout({ children, navIsOpen, setNavIsOpen, nav, sidebar, fallbackHref }) {
  return (
    <SidebarContext.Provider value={{ nav, navIsOpen, setNavIsOpen }}>
      <div css={{ width: '100%', mx: 'auto' }}>
        <div css={{ lg: { display: 'flex' } }}>
          <div
            css={{
              bg: 'white',
              display: 'fixed',
              flex: 'none',
              height: '100%',
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              width: '100%',
              lg: {
                display: 'block',
                position: 'static',
                height: 'auto',
                overflowY: 'visible',
                pt: 0,
                width: '15rem',
              },
              xl: {
                width: '18rem',
              },
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              css={{
                bg: 'white',
                height: '100%',
                mr: 24,
                overflowY: 'auto',
                lg: {
                  bg: 'transparent',
                  display: 'block',
                  height: 'auto',
                  mr: 0,
                  overflow: 'hidden',
                  position: 'relative',
                  top: '4.5rem',
                },
              }}
            >
              <Nav nav={nav} fallbackHref={fallbackHref}>
                {sidebar}
              </Nav>
            </div>
          </div>
          <div
            css={{
              display: 'flex',
              mt: 16,
              minWidth: 0,
              width: '100%',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
