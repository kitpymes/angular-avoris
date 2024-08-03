export interface HotelModel {
  id: string;
  name: string;
  image: string;
  address: string;
  stars: number;
  rate: number;
  price: number;
};

export interface HotelGetModel extends HotelModel {
  deleted: boolean;
};

export interface HotelCreateModel {
  name: string;
  image: string;
  address: string;
  stars: number;
  rate: number;
  price: number;
};

export interface HotelUpdateModel {
  id: string;
  name: string;
  image: string;
  address: string;
  stars: number;
  rate: number;
  price: number;
};

export interface HotelDeleteModel {
  ids: string[];
};

export interface HotelStore {
  items: HotelGetModel[];
};
