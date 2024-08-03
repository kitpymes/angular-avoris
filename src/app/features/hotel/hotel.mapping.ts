import { HotelGetModel, HotelUpdateModel } from "./hotel.model";

export const mapToHotelGetModel = (source: HotelUpdateModel, destination: HotelGetModel): void => {
  destination.id = source.id;
	destination.name = source.name;
	destination.address = source.address;
	destination.image = source.image;
	destination.price = source.price;
  destination.rate = source.rate;
  destination.stars = source.stars;
};
