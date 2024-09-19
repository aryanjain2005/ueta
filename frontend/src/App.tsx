import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './pages/Navbar'
import Dealer from './pages/Dealer'
import Distributor from './pages/Distributor'
import Product from './pages/Product'
import Brand from './pages/Brand'
import Signup from './pages/Signup'
import BrandProduct from './pages/Brand_Product'
import DistributorDealer from './pages/Distributor_Dealer'
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
          <Route path="/signup" element={<Signup />} />
          <Route path="/brand_product" element={<BrandProduct />} />
          <Route path="/distributor_dealer" element={<DistributorDealer />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
