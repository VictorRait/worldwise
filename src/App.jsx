import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import {CitiesProvider }from "./contexts/CitiesContext";
import {AuthProvider}from "./contexts/FakeAuthContext";
import ProtectedRoute from "./contexts/ProtectedRoute";

import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

import SpinnerFullPage from "./components/SpinnerFullPage";
// import AppLayout from "./pages/AppLayout";
// import Homepage from "./pages/Homepage";
// import PageNotFound from "./pages/PageNotFound";
// import Pricing from "./pages/Pricing";
// import Product from "./pages/Product";
// import Login from "./pages/Login";
const AppLayout = lazy(() => import("./pages/AppLayout"))
const Homepage = lazy(() => import("./pages/Homepage"))
const PageNotFound = lazy(() => import("./pages/PageNotFound"))
const Pricing = lazy(() => import("./pages/Pricing"))
const Product = lazy(() => import("./pages/Product"))
const Login = lazy(() => import("./pages/Login"))






function App() {
  

  return (
    <CitiesProvider>
          <AuthProvider>
    <BrowserRouter>
    <Suspense fallback={<SpinnerFullPage/>}>
      <Routes>
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="app" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
        }>
          <Route index element={<Navigate replace to="cities" />} />
          <Route path="cities" element={<CityList  />} />
          <Route path="countries" element={<CountryList  />} />
          <Route path="form" element={<Form />} />
        <Route path="cities/:id" element={<City />} />
        </Route>
        <Route index element={<Homepage />} />
        <Route path="*" element={<PageNotFound />} />
    
        <Route path="login" element={<Login />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
        </AuthProvider>
    </CitiesProvider>
  );
}

export default App;
