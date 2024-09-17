import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './pages/Navbar'
import Dealer from './pages/Dealer'
import Distributor from './pages/Distributor'
import Product from './pages/Product'
import Brand from './pages/Brand'
import './App.css'

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/distributor" element={<Distributor />} />
          <Route path="/dealer" element={<Dealer />} />
          <Route path="/product" element={<Product />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
