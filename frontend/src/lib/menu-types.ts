export type MenuItem = {
  id: string;
  name: string;
  /** PKR. For `from` items this is the lowest size price shown on Foodpanda. */
  price: number;
  from: boolean;
  description: string;
  image: string | null;
  popular: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  note: string | null;
  items: MenuItem[];
};
