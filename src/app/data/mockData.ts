// Mock data for experiences, destinations, and last-minute deals

export interface Experience {
  id: string;
  title: string;
  location: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
  date: Date;
  duration: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  bestFor: string[];
  averageCost: string;
}

export interface LastMinuteDeal {
  id: string;
  destination: string;
  country: string;
  departureDate: Date;
  returnDate: Date;
  price: number;
  originalPrice: number;
  imageUrl: string;
  flightIncluded: boolean;
  hotelIncluded: boolean;
  discount: number;
}

export interface ItineraryDay {
  day: number;
  date: Date;
  activities: {
    time: string;
    title: string;
    description: string;
    location: string;
    cost: number;
  }[];
}

export interface Itinerary {
  id: string;
  destination: string;
  country: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  budget: number;
  interests: string[];
  days: ItineraryDay[];
}

export const generateExperiences = (startDate: Date, endDate: Date): Experience[] => {
  const experiences: Experience[] = [
    {
      id: "exp1",
      title: "Historic City Walking Tour",
      location: "Rome, Italy",
      category: "Culture",
      price: 45,
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
      date: new Date(startDate),
      duration: "3 hours",
    },
    {
      id: "exp2",
      title: "Sunset Wine Tasting",
      location: "Tuscany, Italy",
      category: "Food & Drink",
      price: 85,
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
      date: new Date(startDate.getTime() + 86400000),
      duration: "4 hours",
    },
    {
      id: "exp3",
      title: "Mountain Hiking Adventure",
      location: "Swiss Alps, Switzerland",
      category: "Adventure",
      price: 120,
      rating: 4.7,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      date: new Date(startDate.getTime() + 172800000),
      duration: "Full day",
    },
    {
      id: "exp4",
      title: "Cooking Class Experience",
      location: "Barcelona, Spain",
      category: "Food & Drink",
      price: 75,
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
      date: new Date(startDate),
      duration: "3 hours",
    },
    {
      id: "exp5",
      title: "Museum & Art Gallery Tour",
      location: "Paris, France",
      category: "Culture",
      price: 55,
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
      date: new Date(startDate.getTime() + 86400000),
      duration: "5 hours",
    },
    {
      id: "exp6",
      title: "Kayaking & Coastal Exploration",
      location: "Algarve, Portugal",
      category: "Adventure",
      price: 65,
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
      date: new Date(startDate.getTime() + 259200000),
      duration: "4 hours",
    },
  ];

  return experiences;
};

export const destinations: Destination[] = [
  {
    id: "dest1",
    name: "Paris",
    country: "France",
    description: "The City of Light offers romantic ambiance, world-class museums, and exquisite cuisine.",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    bestFor: ["Culture", "Romance", "Food"],
    averageCost: "$150-250/day",
  },
  {
    id: "dest2",
    name: "Tokyo",
    country: "Japan",
    description: "A fascinating blend of ancient tradition and cutting-edge technology.",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    bestFor: ["Culture", "Food", "Technology"],
    averageCost: "$120-200/day",
  },
  {
    id: "dest3",
    name: "Barcelona",
    country: "Spain",
    description: "Vibrant architecture, beaches, and a thriving food scene.",
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
    bestFor: ["Beach", "Culture", "Nightlife"],
    averageCost: "$100-180/day",
  },
  {
    id: "dest4",
    name: "Bali",
    country: "Indonesia",
    description: "Tropical paradise with stunning beaches, temples, and wellness retreats.",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    bestFor: ["Beach", "Relaxation", "Adventure"],
    averageCost: "$50-100/day",
  },
  {
    id: "dest5",
    name: "New York",
    country: "United States",
    description: "The city that never sleeps, offering endless entertainment and cultural experiences.",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    bestFor: ["Culture", "Shopping", "Food"],
    averageCost: "$200-350/day",
  },
  {
    id: "dest6",
    name: "Santorini",
    country: "Greece",
    description: "Breathtaking sunsets, white-washed buildings, and crystal-clear waters.",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
    bestFor: ["Romance", "Beach", "Relaxation"],
    averageCost: "$130-220/day",
  },
];

export const generateLastMinuteDeals = (): LastMinuteDeal[] => {
  const today = new Date();
  
  return [
    {
      id: "deal1",
      destination: "Lisbon",
      country: "Portugal",
      departureDate: new Date(today.getTime() + 3 * 86400000),
      returnDate: new Date(today.getTime() + 7 * 86400000),
      price: 599,
      originalPrice: 899,
      imageUrl: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a",
      flightIncluded: true,
      hotelIncluded: true,
      discount: 33,
    },
    {
      id: "deal2",
      destination: "Prague",
      country: "Czech Republic",
      departureDate: new Date(today.getTime() + 5 * 86400000),
      returnDate: new Date(today.getTime() + 9 * 86400000),
      price: 449,
      originalPrice: 699,
      imageUrl: "https://images.unsplash.com/photo-1541849546-216549ae216d",
      flightIncluded: true,
      hotelIncluded: true,
      discount: 36,
    },
    {
      id: "deal3",
      destination: "Amsterdam",
      country: "Netherlands",
      departureDate: new Date(today.getTime() + 2 * 86400000),
      returnDate: new Date(today.getTime() + 6 * 86400000),
      price: 529,
      originalPrice: 799,
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4",
      flightIncluded: true,
      hotelIncluded: false,
      discount: 34,
    },
    {
      id: "deal4",
      destination: "Reykjavik",
      country: "Iceland",
      departureDate: new Date(today.getTime() + 7 * 86400000),
      returnDate: new Date(today.getTime() + 11 * 86400000),
      price: 699,
      originalPrice: 1099,
      imageUrl: "https://images.unsplash.com/photo-1504829857797-ddff29c27927",
      flightIncluded: true,
      hotelIncluded: true,
      discount: 36,
    },
    {
      id: "deal5",
      destination: "Dublin",
      country: "Ireland",
      departureDate: new Date(today.getTime() + 4 * 86400000),
      returnDate: new Date(today.getTime() + 8 * 86400000),
      price: 479,
      originalPrice: 749,
      imageUrl: "https://images.unsplash.com/photo-1549918864-48ac978761a4",
      flightIncluded: true,
      hotelIncluded: true,
      discount: 36,
    },
    {
      id: "deal6",
      destination: "Copenhagen",
      country: "Denmark",
      departureDate: new Date(today.getTime() + 6 * 86400000),
      returnDate: new Date(today.getTime() + 10 * 86400000),
      price: 559,
      originalPrice: 849,
      imageUrl: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc",
      flightIncluded: true,
      hotelIncluded: false,
      discount: 34,
    },
  ];
};

export const generateAIItinerary = (
  destination: string,
  startDate: Date,
  days: number,
  budget: number,
  interests: string[]
): Itinerary => {
  const itineraryDays: ItineraryDay[] = [];
  
  // Sample itinerary for Paris
  if (destination.toLowerCase().includes("paris")) {
    for (let i = 0; i < days; i++) {
      const dayDate = new Date(startDate.getTime() + i * 86400000);
      
      if (i === 0) {
        itineraryDays.push({
          day: i + 1,
          date: dayDate,
          activities: [
            {
              time: "9:00 AM",
              title: "Arrival & Hotel Check-in",
              description: "Settle into your accommodation in the heart of Paris",
              location: "Le Marais District",
              cost: 0,
            },
            {
              time: "12:00 PM",
              title: "Lunch at Traditional Bistro",
              description: "Experience authentic French cuisine at a local favorite",
              location: "Chez Janou",
              cost: 35,
            },
            {
              time: "2:00 PM",
              title: "Louvre Museum Visit",
              description: "Explore the world's largest art museum and see the Mona Lisa",
              location: "Louvre Museum",
              cost: 17,
            },
            {
              time: "6:30 PM",
              title: "Seine River Cruise",
              description: "Enjoy a scenic evening cruise along the Seine",
              location: "Pont Neuf",
              cost: 15,
            },
          ],
        });
      } else if (i === 1) {
        itineraryDays.push({
          day: i + 1,
          date: dayDate,
          activities: [
            {
              time: "8:00 AM",
              title: "Breakfast at Café",
              description: "Start your day with croissants and coffee",
              location: "Café de Flore",
              cost: 18,
            },
            {
              time: "10:00 AM",
              title: "Eiffel Tower Visit",
              description: "Ascend the iconic Eiffel Tower for panoramic city views",
              location: "Eiffel Tower",
              cost: 26,
            },
            {
              time: "1:00 PM",
              title: "Picnic at Champ de Mars",
              description: "Enjoy local delicacies with a view of the Eiffel Tower",
              location: "Champ de Mars",
              cost: 25,
            },
            {
              time: "3:30 PM",
              title: "Versailles Palace Tour",
              description: "Explore the opulent palace and gardens of Versailles",
              location: "Palace of Versailles",
              cost: 27,
            },
          ],
        });
      } else if (i === 2) {
        itineraryDays.push({
          day: i + 1,
          date: dayDate,
          activities: [
            {
              time: "9:30 AM",
              title: "Montmartre Walking Tour",
              description: "Discover the artistic neighborhood and Sacré-Cœur Basilica",
              location: "Montmartre",
              cost: 0,
            },
            {
              time: "12:30 PM",
              title: "Lunch at Crêperie",
              description: "Savor authentic French crêpes",
              location: "Montmartre",
              cost: 22,
            },
            {
              time: "3:00 PM",
              title: "Shopping on Champs-Élysées",
              description: "Browse luxury boutiques and shops",
              location: "Avenue des Champs-Élysées",
              cost: 100,
            },
            {
              time: "7:00 PM",
              title: "Dinner at Michelin Restaurant",
              description: "Indulge in fine French dining",
              location: "Le Cinq",
              cost: 150,
            },
          ],
        });
      } else {
        itineraryDays.push({
          day: i + 1,
          date: dayDate,
          activities: [
            {
              time: "10:00 AM",
              title: "Local Market Visit",
              description: "Experience a traditional Parisian market",
              location: "Marché Bastille",
              cost: 30,
            },
            {
              time: "1:00 PM",
              title: "Museum d'Orsay",
              description: "Admire Impressionist masterpieces",
              location: "Musée d'Orsay",
              cost: 16,
            },
            {
              time: "4:00 PM",
              title: "Latin Quarter Exploration",
              description: "Wander through historic streets and bookshops",
              location: "Latin Quarter",
              cost: 0,
            },
            {
              time: "7:30 PM",
              title: "Evening at Opera",
              description: "Attend a performance at Palais Garnier",
              location: "Palais Garnier",
              cost: 85,
            },
          ],
        });
      }
    }
  } else {
    // Generic itinerary for other destinations
    for (let i = 0; i < days; i++) {
      const dayDate = new Date(startDate.getTime() + i * 86400000);
      itineraryDays.push({
        day: i + 1,
        date: dayDate,
        activities: [
          {
            time: "9:00 AM",
            title: "Morning Activity",
            description: `Explore the highlights of ${destination}`,
            location: destination,
            cost: 30,
          },
          {
            time: "1:00 PM",
            title: "Lunch",
            description: "Try local cuisine",
            location: destination,
            cost: 25,
          },
          {
            time: "3:00 PM",
            title: "Afternoon Adventure",
            description: "Visit popular attractions",
            location: destination,
            cost: 40,
          },
          {
            time: "7:00 PM",
            title: "Dinner",
            description: "Dine at a recommended restaurant",
            location: destination,
            cost: 50,
          },
        ],
      });
    }
  }

  const totalCost = itineraryDays.reduce(
    (sum, day) => sum + day.activities.reduce((daySum, activity) => daySum + activity.cost, 0),
    0
  );

  return {
    id: `itinerary-${Date.now()}`,
    destination,
    country: destination.toLowerCase().includes("paris") ? "France" : "Unknown",
    startDate,
    endDate: new Date(startDate.getTime() + (days - 1) * 86400000),
    totalDays: days,
    budget: totalCost,
    interests,
    days: itineraryDays,
  };
};
