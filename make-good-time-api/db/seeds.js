var mongoose = require('mongoose');
var Activity = require('../models/activity');

var databaseUri = require('../config/db')('development');
mongoose.connect(databaseUri);

Activity.collection.drop();

Activity.create([
  {
    name: "High Bar",
    categories: ["Bars", "Entertainment"],
    description: "The best bar rated by London Bar Insitution",
    photo: "http://d2cd7s18nw3zcy.cloudfront.net/files/hotel/buddha-bar-hotel-budapest-klotild-palace/dining/Lounge/BarMixer.jpg",
    lat: 51.9,
    lng: 31.6,
    postcode: "SW7 4XQ",
    location: "3a Cromwell Road, London"
  },
  { 
    name: "Low Bar",
    categories: ["Bars", "Entertainment"],
    description: "The cheapest bar rated by London Bar Insitution",
    photo: "https://affotd.files.wordpress.com/2011/03/swimming-pool-bar1.jpg",
    lat: 53,
    lng: 33,
    postcode: "SW7 4XX",
    location: "3a Cromwell Road, London"
  },
  { 
    name: "The Fox",
    categories: ["Bars", "Beer", "Outdoor Activities"],
    description: "This spacious pub has a great selection of local craft beers on draught. Be sure to head up to the rooftop patio if you visit on a fine day!",
    photo: "http://img01.beerintheevening.com/7a/7a4fc0bf5911b00dc946a389c7761f85.jpg",
    lat: 51.540805,
    lng: -0.076285,
    postcode: "E8 4DA",
    location: "372 Kingsland Road, London"
  },
  { 
    name: "Howling Hops Brewery",
    categories: ["Beer", "Bars"],
    description: "Visit Howling Hops brewery in Hackney Wick for some of the freshest beer in town, poured directly from big stainles steel bright tanks behind the bar. If you ask nicely, they might let you take a peek at the brewing equipment on-site.",
    photo: "http://www.leytonstoner.london/wp-content/uploads/sites/19/2015/06/IMG_8159.jpg",
    lat: 51.543012,
    lng: -0.022537,
    postcode: "E9 5EN",
    location: "Unit 9A Queen's Yard, White Post Ln, London"
  },
  { 
    name: "Clapton Craft",
    categories: ["Beer"],
    description: "Grab some beers for takeaway at this local bottle shop with a great selection. The fresh-filled flagons are great for sharing in nearby Hackney Downs or Clapton Square with friends.",
    photo: "http://www.claptoncraft.co.uk/images/slider_4.jpg",
    lat: 51.554570,
    lng: -0.051920,
    postcode: "E5 0NP",
    location: "97 Lower Clapton Rd, London"
  },
  { 
    name: "Greenwich Observatory",
    categories: ["Science", "Museums"],
    description: "The Royal Observatory, Greenwich is an observatory situated on a hill in Greenwich Park, overlooking the River Thames. It played a major role in the history of astronomy and navigation, and is best known as the location of the prime meridian.",
    photo: "http://www.claptoncraft.co.uk/images/slider_4.jpg",
    lat: 51.477030,
    lng: -0.000516,
    postcode: "SE10 8XJ",
    location: "Blackheath Ave, London"
  },
  { 
    name: "Old Operating Theatre Museum",
    categories: ["Science", "Museums"],
    description: "The Old Operating Theatre Museum and Herb Garret is a museum of surgical history and one of the oldest surviving operating theatres.",
    photo: "http://www.telegraph.co.uk/content/dam/Travel/leadAssets/21/08/operating620_2108553a-large.jpg",
    lat: 51.505276, 
    lng: -0.088558,
    postcode: "SE1 9RY",
    location: "9a St Thomas St, London"
  },

  { 
    name: "Hackney Marshes Nature Reserve",
    categories: ["Science", "Outdoor Activities"],
    description: "Hackney Marshes is an area of grassland on the western bank of the River Lea in the London Borough of Hackney. It was incorporated into the Lee Valley Park in 1967.",
    photo: "https://www.teignbridge.gov.uk/media/images/i/7/Hackney_Reeds_1.jpg",
    lat: 51.557443,  
    lng: -0.030848,
    postcode: "E9 5P",
    location: "Homerton Rd, London"
  },

  { 
    name: "Hunterian Museum",
    categories: ["Science", "Museums"],
    description: "The Royal College of Surgeons houses this museum, displaying the grisly history of surgery and medicine with gruesome instruments and preserved specimens. It's wonderful!",
    photo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Main_Hall,_the_Hunterian_Museum,_Glasgow..JPG",
    lat: 51.515593,   
    lng: -0.115964,
    postcode: "WC2A 3PE",
    location: "35-43 Lincoln's Inn Fields, London"
  },
  { 
    name: "London Zoo",
    categories: ["Science", "Outdoor Activities"],
    description: "London Zoo is the world's oldest scientific zoo. It was opened in London on April 27, 1828, and was originally intended to be used as a collection for scientific study. It was eventually opened to the public in 1847.",
    photo: "http://www.london4vacations.com/wp-content/uploads/img/London-Zoo-Zoological-Society-of-London1.jpg",
    lat: 51.535464,    
    lng: -0.153371,
    postcode: "NW1 4RY",
    location: "26 Outer Circle, Regents Park, London"
  },

], function(err, activities) {
  console.log(activities);
  mongoose.connection.close();
})