import { AppProps } from 'next/app'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import { StatisticsProvider } from '@/hooks/useStatistics'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StatisticsProvider>
      <div className="wireframe">
        <Header />
        <div className="main-content">
          <main className="content-area">
            <Component {...pageProps} />
          </main>
          <Sidebar />
        </div>
      </div>
    </StatisticsProvider>
  )
}

export default MyApp
