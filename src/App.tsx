import { useState } from 'react'
import { ButtonPage, CheckBoxPage } from './pages'
import './style.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1)

  const switchPage = (targetPage: 1 | 2) => {
    if (currentPage === targetPage) return
    if (document.startViewTransition) {
      document.startViewTransition(() => setCurrentPage(targetPage))
    } else {
      setCurrentPage(targetPage)
    }
  }

  return (
    <div className="app-shell">
      {/* Навігація між сторінками */}
      <nav>
        <a
          className={currentPage === 1 ? 'active' : ''}
          onClick={() => switchPage(1)}
        >
          Button
        </a>
        <a
          className={currentPage === 2 ? 'active' : ''}
          onClick={() => switchPage(2)}
        >
          CheckBox
        </a>
      </nav>

      <main className="content">
        {currentPage === 1 ? <ButtonPage /> : <CheckBoxPage />}
      </main>
    </div>
  )
}
