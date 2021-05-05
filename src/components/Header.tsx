import Link from 'next/link'

export function Header({ navIsOpen, onNavToggle }) {
  return (
    <header
      css={{
        bg: 'white',
        display: 'flex',
        position: 'fixed',
        py: 4,
        px: 8,
        top: 0,
        zIndex: 1000,
        width: '100%',
      }}
    >
      <Link href="/">
        <a css={{ color: 'black', fontWeight: 'bold' }}>MoleHill UI</a>
      </Link>
    </header>
  )
}
