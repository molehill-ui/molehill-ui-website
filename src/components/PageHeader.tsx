export function PageHeader({ title, description, border = true }) {
  if (!title && !description) return null

  return (
    <div
      css={{
        borderBotom: '1px solid',
        borderColor: border ? 'gray-200' : 'transparent',
        pb: 10,
      }}
    >
      <div>
        <h1
          css={{
            color: 'gray-900',
            display: 'inline-block',
            fontSize: '3xl',
            fontWeight: 'extrabold',
            letterSpacing: 'tight',
            lineHeight: 'none',
          }}
        >
          {title}
        </h1>
      </div>
      {description && <p css={{ color: 'gray-500', fontSize: 'lg', mt: 1 }}>{description}</p>}
    </div>
  )
}
