var mongoose = require('mongoose');
var request = require('request');
var Activity = require('../models/activity');

var databaseUri = require('../config/db')('development');
mongoose.connect(databaseUri);

Activity.collection.drop();

// request.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&rankby=distance&types=food&key=AIzaSyBxg_NOJq_YykM0AbVF77W70ZFMrtDEIuw", function(err, res) {
//   var results = JSON.parse(res.body).results;
//   // console.log(results);
//   results.forEach(function(result) {
//     if(result.rating >= 4) {
//       Activity.create({
//         name: result.name, 
//         categories: ["Food"],
//         description: "",
//         lat: result.geometry.location.lat,
//         lng: result.geometry.location.lng,
//         location: result.vicinity
//       });
//     }
//   })
// });

Activity.create([
  { 
    name: "Tate Modern",
    categories: ["Musuem"],
    description: "Tate Modern is a modern art gallery located in London. It is Britain's national gallery of international modern art and forms part of the Tate group.",
    photo: "http://images.tate.org.uk/sites/default/files/images/newtatemodernsouthview.jpg",
    lat: 51.507669,    
    lng: -0.099388,
    postcode: "SE1 9TG",
    location: "Bankside, London"
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
  { 
    name: "The Bottle Shop",
    categories: ["Beer", "Shopping"],
    description: "One of London’s best bottle shops, with loads of great events and rare beers from all over the world.",
    photo: "http://c8.alamy.com/comp/G1MFN0/people-outside-the-bottle-shop-in-druid-street-near-maltby-street-G1MFN0.jpg",
    lat: 51.498675, 
    lng: -0.073205,
    postcode: "SE1 2HH",
    location: "128 Druid St, London"
  }, 
  { 
    name: "Mother Kelly’s",
    categories: ["Beer", "Bars"],
    description: "Under railway arches, this industrial bar and shop with a patio offers draft and bottled beers.",
    photo: "http://beerlens.com/wp-content/uploads/2014/12/MotherKellys02.jpg",
    lat: 51.528505, 
    lng: -0.056231,
    postcode: "E2 9LE",
    location: "251 Paradise Row, London"
  },
  { 
    name: "Hop Burns and Black",
    categories: ["Beer", "Bars", "Shopping"],
    description: "Craft beer, hot sauce and records - together at last. Shop and tasting room",
    photo: "http://www.beerguideldn.com/images/hopburnsblack/sized/2015-10-31%2016.20.37.jpg",
    lat: 51.462107, 
    lng: -0.069670,
    postcode: "SE22 9AX",
    location: "38 E Dulwich Rd, London"
  },
  { 
    name: "Bermondsey Beer Mile",
    categories: ["Beer", "Breweries"],
    description: "With Kernel Brewery, Brew By Numbers, Partizan Brewing, FourPure, and Ansbach and Hobday all located in arches beneath the same stretch of railway, the beer mile is a great way to see Bermondsey and get your local beer fix.",
    photo: "http://thecitylane.com/wp-content/uploads/2015/03/bermondseybeermile.jpg",
    lat: 51.498163, 
    lng: -0.071997,
    postcode: "SE16 3RA",
    location: "Enid Street, London"
  },
  { 
    name: "Wellcome Collection",
    categories: ["Science", "Museums"],
    description: "19th-century collector Henry Wellcome's medical antiquities, plus hi-tech modern displays and art.",
    photo: "http://www.travelsupermarket.com/blog/wp-content/uploads/2012/06/Wellcome-Trust-Image.jpg",
    lat: 51.529995, 
    lng: -0.133775,
    postcode: "NW1 2BE",
    location: "183 Euston Rd, London"
  },
  { 
    name: "Borough Market",
    categories: ["Food", "Shopping", "Beer"],
    description: "Borough Market is a wholesale and retail food market in Southwark, Central London, England. It is one of the largest and oldest food markets in London. In 2014, it celebrated its 1,000th birthday.",
    photo: "http://www.bloglmn.com/wp-content/uploads/Borough-Market-Credit-Simon-Rawles2.jpg",
    lat: 51.509430,  
    lng: -0.090559,
    postcode: "SE1 1TL",
    location: "8 Southwark Street, London"
  }

], function(err, activities) {
  console.log(activities);
  mongoose.connection.close();
})