import { Header } from '@/components/Header'
import Head from 'next/head'

export default function Home() {
  return (
    <div className="space-y-20 sm:space-y-32 md:space-y-40 lg:space-y-44 overflow-hidden">
      <Head>
        <meta key="twitter:title" name="twitter:title" content="MoleHill UI" />
        <meta key="og:title" property="og:title" content="MoleHill UI" />
        <title>MoleHill UI</title>
      </Head>
      <Header />
    </div>
  )
}
