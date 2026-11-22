/**
 * Single source of truth for locations and categories across PizzaHub
 * Dhaka neighborhoods: Banani, Gulshan, Dhanmondi, Uttara, Mirpur, Motijheel
 */
export const DHAKA_LOCATIONS = [
  "Banani",
  "Gulshan",
  "Dhanmondi",
  "Uttara",
  "Mirpur",
  "Motijheel",
];

export const POPULAR_LOCATIONS = ["All", ...DHAKA_LOCATIONS];

export const PIZZA_CATEGORIES = [
  "All",
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export const FOOTER_CONTACT = {
  address: "Road 11, Block D, Banani, Dhaka 1213, Bangladesh",
  phone: "+880 1700-PIZZAHUB",
  email: "support@pizzahub.com",
  hours: "10:00 AM – 11:30 PM (Daily)",
};
