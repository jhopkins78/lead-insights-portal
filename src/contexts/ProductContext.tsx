
import React, { createContext, useState, ReactNode, useEffect } from 'react';

type ProductId = "lead-commander" | "samaritan-ai" | "startup-advisor" | "retail-advisor";

interface ProductContextType {
  selectedProduct: ProductId;
  setSelectedProduct: (product: ProductId) => void;
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
  const [selectedProduct, setSelectedProduct] = useState<ProductId>("lead-commander");

  return (
    <ProductContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
