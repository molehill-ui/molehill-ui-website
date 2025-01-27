import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, forwardRef, useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'

export const SidebarContext = createContext()

const NavItem = forwardRef(({ href, children, isActive, isPublished, fallbackHref }, ref) => {
  return (
    <li ref={ref}>
      <Link href={isPublished ? href : fallbackHref}>
        <a
          css={{
            color: isActive ? 'blue-500' : 'gray-500',
            cursor: 'pointer',
            display: 'block',
            position: 'relative',
            px: 3,
            py: 2,
            transition: 'color 0.2s ease-in-out',
            '&:hover': {
              color: isActive ? 'blue-500' : 'black',
            },
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
          pt: 10,
          px: 1,
          sm: { px: 3 },
          lg: { fontSize: 'sm', pb: 14 },
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
      <div css={{ display: 'grid', gridTemplateColumns: '20rem 1fr', mt: 14 }}>
        <Nav nav={nav} fallbackHref={fallbackHref}>
          {sidebar}
        </Nav>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}
