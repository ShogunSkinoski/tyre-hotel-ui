export interface CustomerProps{
    plate: string;
    date: string;
    name: string;
    phone: string;
  }


export interface TireListComponentProps {
    customerProps: CustomerProps[];
  }

export interface Tire{
    location: string;
    brand: string;
    size: string;
    season: string;
    count: number;
}
export interface TireListOfCustomer{
    tires: Tire[];
  }