import { DocumentationLayout } from '@/layouts/DocumentationLayout'

export default function DocsLandingPage() {
  return (
    <div
      css={{
        px: 4,
        pt: 10,
        pb: 16,
        sm: {
          px: 6,
        },
        xl: {
          px: 8,
        },
      }}
    >
      <h1
        css={{
          color: 'gray-900',
          fontSize: '5xl',
          fontWeight: 'extrabold',
          lineHeight: 'none',
          letterSpacing: 'tight',
          mb: 4,
        }}
      >
        Getting started with MoleHill UI
      </h1>
      <p
        css={{
          color: 'gray-500',
          fontSize: '2xl',
          letterSpacing: 'tight',
          mb: 10,
        }}
      >
        Building mountains out of mole hills.
      </p>
    </div>
  )
}

DocsLandingPage.layoutProps = {
  meta: {
    title: 'Documentation',
  },
  Layout: DocumentationLayout,
}
