/* Teteman View Hotel — all editable content lives here.
   Change a value, save, refresh the browser. */
window.TETEMAN = {
  name: "Teteman View Hotel",
  tagline: "Hospitality with heart and soul...",
  phone: "0245467920",            // shown on the site and used for tel: links
  whatsapp: "233245467920",       // international format, no + or spaces
  plusCode: "MWPG+9G3, Accra, Ghana",
  logo: {
    dark: "images/logo/logo.png",
    light: "images/logo/logo-light.png"
  },

  rooms: [
    {
      id: "economy", name: "Economy Room", price: 250,
      img: "images/rooms/economy-1.jpg",
      gallery: ["images/rooms/economy-1.jpg","images/rooms/economy-2.jpg","images/rooms/economy-3.jpg"],
      blurb: "A comfortable room for a restful stay in Accra.",
      details: ["Flat-screen television", "Work desk", "Telephone", "Free Wi-Fi", "Hot and cold water", "Private bathroom", "Air conditioning", "Refrigerator", "Wardrobe", "Room service"]
    },
    {
      id: "standard", name: "Standard Room", price: 400,
      img: "images/rooms/standard-1.jpg",
      gallery: ["images/rooms/standard-1.jpg","images/rooms/standard-2.jpg","images/rooms/standard-3.jpg","images/rooms/standard-4.jpg","images/rooms/standard-5.jpg","images/rooms/standard-6.jpg","images/rooms/standard-7.jpg"],
      blurb: "A comfortable room for a restful stay in Accra.",
      details: ["Flat-screen television", "Work desk", "Telephone", "Free Wi-Fi", "Hot and cold water", "Private bathroom", "Air conditioning", "Refrigerator", "Wardrobe", "Room service"]
    },
    {
      id: "executive", name: "Executive Room", price: 500,
      img: "images/rooms/executive-1.jpg",
      gallery: ["images/rooms/executive-1.jpg","images/rooms/executive-2.jpg","images/rooms/executive-3.jpg","images/rooms/executive-4.jpg","images/rooms/executive-5.jpg","images/rooms/executive-6.jpg"],
      blurb: "Our top room category, for guests who want the most from their stay.",
      details: ["Flat-screen television", "Work desk", "Telephone", "Free Wi-Fi", "Hot and cold water", "Private bathroom", "Air conditioning", "Refrigerator", "Wardrobe", "Room service"]
    }
  ],

  amenities: [
    { icon: "wifi", name: "Free Wi-Fi", text: "Available for guests." },
    { icon: "ac", name: "Air conditioning", text: "Available in the rooms." },
    { icon: "tv", name: "Flat-screen television", text: "Available in the rooms." },
    { icon: "restaurant", name: "Restaurant", text: "Dining is available at the hotel." },
    { icon: "reception", name: "Reception", text: "Reception area at the hotel." },
    { icon: "service", name: "Room service", text: "Available for guests." }
  ],
  reviews: [],

  // Drop the actual supplied hotel photos into the matching folders and update these paths.
  gallery: [
    { cat: "oti", src: "images/branches/oti-1.jpg", alt: "Teteman View Hotel branch in Teteman, Oti Region", shape: "wide" },
    { cat: "oti", src: "images/branches/oti-2.jpg", alt: "Side exterior view of the Teteman View Hotel branch in Teteman, Oti Region", shape: "wide" },
    { cat: "exterior", src: "images/hotel/exterior.jpg", alt: "Teteman View Hotel exterior", shape: "wide" },
    { cat: "exterior", src: "images/hotel/hero.jpg", alt: "Teteman View Hotel entrance exterior", shape: "wide" },
    { cat: "economy", src: "images/rooms/economy-1.jpg", alt: "Economy room bed", shape: "tall" },
    { cat: "economy", src: "images/rooms/economy-2.jpg", alt: "Economy room work desk", shape: "sq" },
    { cat: "economy", src: "images/rooms/economy-3.jpg", alt: "Economy room bathroom", shape: "wide" },
    { cat: "standard", src: "images/rooms/standard-1.jpg", alt: "Standard room desk and bed", shape: "wide" },
    { cat: "standard", src: "images/rooms/standard-2.jpg", alt: "Standard room desk and bed", shape: "wide" },
    { cat: "standard", src: "images/rooms/standard-3.jpg", alt: "Standard room bed", shape: "tall" },
    { cat: "standard", src: "images/rooms/standard-4.jpg", alt: "Standard room bed", shape: "wide" },
    { cat: "standard", src: "images/rooms/standard-5.jpg", alt: "Standard room wardrobe and work area", shape: "sq" },
    { cat: "standard", src: "images/rooms/standard-6.jpg", alt: "Standard room bed", shape: "tall" },
    { cat: "bathrooms", src: "images/rooms/standard-7.jpg", alt: "Standard room bathroom", shape: "wide" },
    { cat: "executive", src: "images/rooms/executive-1.jpg", alt: "Executive room desk and bed", shape: "wide" },
    { cat: "executive", src: "images/rooms/executive-2.jpg", alt: "Executive room bed", shape: "tall" },
    { cat: "executive", src: "images/rooms/executive-3.jpg", alt: "Executive room desk", shape: "sq" },
    { cat: "executive", src: "images/rooms/executive-4.jpg", alt: "Executive room seating and work area", shape: "wide" },
    { cat: "executive", src: "images/rooms/executive-5.jpg", alt: "Executive room bathroom", shape: "wide" },
    { cat: "executive", src: "images/rooms/executive-6.jpg", alt: "Executive room bed and curtains", shape: "tall" },
    { cat: "bathrooms", src: "images/rooms/executive-5.jpg", alt: "Hotel bathroom", shape: "wide" },
    { cat: "reception", src: "images/hotel/reception-1.jpg", alt: "Teteman View Hotel reception wall and television", shape: "tall" },
    { cat: "reception", src: "images/hotel/reception-2.jpg", alt: "Teteman View Hotel reception desk", shape: "wide" },
    { cat: "interior", src: "images/hotel/stairs-1.jpg", alt: "Interior staircase at Teteman View Hotel", shape: "tall" },
    { cat: "interior", src: "images/hotel/relaxation-1.jpg", alt: "Table and chairs inside Teteman View Hotel", shape: "wide" },
    { cat: "restaurant", src: "images/dining/restaurant-1.jpg", alt: "Teteman View Hotel Chop Bar exterior sign", shape: "wide" },
    { cat: "restaurant", src: "images/dining/restaurant-2.jpg", alt: "Teteman View Hotel restaurant exterior", shape: "wide" },
    { cat: "restaurant", src: "images/dining/restaurant-3.jpg", alt: "Teteman View Hotel restaurant dining area", shape: "wide" },
    { cat: "restaurant", src: "images/dining/restaurant-4.jpg", alt: "Teteman View Hotel restaurant seating", shape: "wide" },
    { cat: "restaurant", src: "images/dining/restaurant-5.jpg", alt: "Teteman View Hotel restaurant interior", shape: "wide" },
    { cat: "restaurant", src: "images/dining/restaurant-6.jpg", alt: "Teteman View Hotel restaurant serving area", shape: "wide" }
  ]
};
