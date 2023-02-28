import React, { ReactElement } from 'react';

export interface ProductItemProps {
  id: number,
  products: IProduct[],
  deleteProduct: (id: number) => void,
  setProducts: React.Dispatch<React.SetStateAction<any>>,
  isTemplatedData?: boolean
}

export interface IProduct {
  id: number,
  name: string,
  code: string,
  amount: string,
  type: string,
  quantity?: number
}

export interface IProductToBackend {
  name: string,
  code?: string,
  type: string,
  quantity?: number,
}

export interface IProductFromBackend {
  id: number,
  name: string,
  code?: string,
  amount: string,
  type: { name: string },
  quantity?: number
}

export interface ISearchResult {
  code: null | string,
  name: string,
  key?: any
}

export interface IOrderData {
  comment?: string,
  deliveryAddress?: string,
  goods?: IProduct[] | IProductToBackend[],
  linkType?: string,
  name?: string,
  organization?: string,
  phone?: string,
  region?: string,
  supplierTypes?: string[] | undefined,
  address?: string,
  exceptionalSuppliers?: any
}

export interface IAutoComplete {
  value: string;
  onSelect: (e: string) => void;
  autoFocus?: boolean;
  allowClear?: boolean;
  children?: ReactElement;
  className?: string;
  options?: any;
  hint?: string;
}
