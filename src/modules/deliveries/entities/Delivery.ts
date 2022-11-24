import crypto from 'crypto';

export class Delivery {
  id: string;

  item_name: string;
  location: string;
  id_customer: string;
  id_deliveryman?: string;

  created_at: Date;
  end_at?: Date;

  constructor() {
    if (!this.id) {
      this.id = crypto.randomUUID();
      this.created_at = new Date();
    }
  }
}
