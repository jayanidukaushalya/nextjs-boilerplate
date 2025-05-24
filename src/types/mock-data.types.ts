import { IBaseEntity, IBaseParams } from '.';

export interface IBrand {
  id: string;
  name: string;
}

export interface ICategory {
  id: string;
  name: string;
}

export interface IProduct extends IBaseEntity {
  id: string;
  name: string;
  brand: IBrand;
  category: ICategory;
  price: string;
  image: string;
}

export interface IProductParams extends IBaseParams {
  brands?: string;
  categories?: string;
}
