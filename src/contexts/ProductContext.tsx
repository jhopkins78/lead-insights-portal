
import React, { createContext, useState, ReactNode, useEffect } from 'react';

type Product = "lead-commander" | "samaritan-ai" | "startup-advisor" | "retail-insights";

interface ProductContextType {
  selectedProduct: Product;
  setSelectedProduct: (product: Product) => void;
}

const defaultContext: ProductContextType = {
  selectedProduct: "lead-commander",
  setSelectedProduct: () => {},
};

export const ProductContext = createContext<ProductContextType>(defaultContext);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>("lead-commander");

  return (
    <ProductContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
