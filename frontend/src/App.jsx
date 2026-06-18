import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Ask from './pages/Ask'
import Search from './pages/Search'
import FAQ from './pages/FAQ'
import About from './pages/About'
import Drafts from './pages/Drafts'
import Workspace from './pages/Workspace'

export default function App() {
  return (
    <div className="ui-shell min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/search" element={<Search />} />
          <Route path="/drafts" element={<Drafts />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}