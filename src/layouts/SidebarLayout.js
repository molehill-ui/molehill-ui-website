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
          className={clsx('px-3 py-2 transition-colors duration-200 relative block', {
            'text-cyan-700': isActive,
            'hover:text-gray-900 text-gray-500': !isActive && isPublished,
            'text-gray-400': !isActive && !isPublished,
          })}
        >
          <span
            className={clsx('rounded-md absolute inset-0 bg-cyan-50', {
              'opacity-0': !isActive,
            })}
          />
          <span className="relative">{children}</span>
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
                  <li key={category} className="mt-8">
                    <h5
                      className={clsx(
                        'px-3 mb-3 lg:mb-3 uppercase tracking-wide font-semibold text-sm lg:text-xs',
                        {
                          'text-gray-900': publishedItems.length > 0,
                          'text-gray-400': publishedItems.length === 0,
                        }
                      )}
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
            }}
            className={clsx(
              'fixed z-40 inset-0 flex-none h-full bg-black bg-opacity-25 w-full lg:bg-white lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-60 xl:w-72 lg:block'
            )}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="h-full overflow-y-auto scrolling-touch lg:h-auto lg:block lg:relative lg:sticky lg:bg-transparent overflow-hidden lg:top-18 bg-white mr-24 lg:mr-0"
            >
              <div className="hidden lg:block h-12 pointer-events-none absolute inset-x-0 z-10 bg-gradient-to-b from-white" />
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
