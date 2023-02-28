export interface IGoods {
  code: null | string,
  comment: string,
  id: number,
  name: string,
  price: number,
  productId: number
  quantity: number
  type: {
    name: string
  },
  isCommentVisible: boolean
}

export interface ProviderData {
  organization: string,
  name: string,
  phone: string,
  deliveryAddress: string,
  comment: string,
  uploadedFile: any,
  linkType: string,
  region: string,
  user: string
}

export interface PreviousOfferData {
  deliveryComment: string,
  deliveryDate: string,
  deliveryMaxDate: string,
  deliveryPrice: string,
  deliveryType: {
    name: string
  },
  goods: {
    price: string,
    comment?: null | string,
    offersGoods: {
      id: number
    }
  },
  name: string,
  offersCount: number,
  organization: string,
  phone: string,
  uploadedFile?: string | null
}
