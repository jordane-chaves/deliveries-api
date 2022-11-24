export interface ICreateDeliveryDTO {
  item_name: string;
  location: string;
  id_customer: string;
  end_at?: Date;
  id?: string;
}
