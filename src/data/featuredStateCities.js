// Featured cities per state — shown with rich cards on the state page.
// Only top immigrant-community hubs are listed; other cities use standard cards.
export const FEATURED_CITIES = {
  Texas: {
    Houston: {
      emoji: "🚀",
      tagline: "Space City · Largest South Asian hub in Texas",
      description:
        "Home to 180,000+ South Asians — one of the densest concentrations in the US. Major Hindu temple corridor, Energy Corridor tech jobs, and a thriving desi food scene in Harwin / Hillcroft.",
      places: [
        { name: "Space Center Houston", address: "1601 NASA Pkwy, Houston, TX 77058", description: "NASA's official visitor center — walk through mission control, touch real moon rocks, and see full-size rockets up close." },
        { name: "Hermann Park & Museum District", address: "6001 Fannin St, Houston, TX 77030", description: "A 445-acre urban oasis home to the Houston Museum of Natural Science, the Houston Zoo, and the Miller Outdoor Theatre." },
        { name: "Buffalo Bayou Park", address: "105 Sabine St, Houston, TX 77007", description: "Stunning 160-acre park along the bayou with trails, kayaking, public art, and the iconic Eleanor Tinsley lawn at sunset." },
        { name: "Houston Museum of Natural Science", address: "5555 Hermann Park Dr, Houston, TX 77030", description: "World-class exhibits on dinosaurs, gems, ancient Egypt, and a giant-screen IMAX theater — endlessly engaging for families." },
        { name: "Kemah Boardwalk", address: "215 Kipp Ave, Kemah, TX 77565", description: "A lively waterfront amusement park 30 minutes from downtown with rides, seafood, and spectacular Galveston Bay views." },
      ],
    },
    Dallas: {
      emoji: "🌆",
      tagline: "DFW Metroplex · H-1B & IT powerhouse",
      description:
        "Plano and Irving host major Indian tech campuses (TCS, Infosys, Cognizant). 150,000+ South Asians call DFW home, with strong temple and cultural associations.",
      places: [
        { name: "Sixth Floor Museum at Dealey Plaza", address: "411 Elm St, Dallas, TX 75202", description: "Housed in the former Texas School Book Depository, this museum chronicles the life and assassination of President Kennedy." },
        { name: "Dallas Arboretum & Botanical Garden", address: "8525 Garland Rd, Dallas, TX 75218", description: "66 acres of stunning seasonal gardens on the shores of White Rock Lake — breathtaking in spring bloom." },
        { name: "Klyde Warren Park", address: "2012 Woodall Rodgers Fwy, Dallas, TX 75201", description: "A vibrant 5-acre deck park built over a freeway, hosting food trucks, yoga, live music, and family events year-round." },
        { name: "Perot Museum of Nature and Science", address: "2201 N Field St, Dallas, TX 75201", description: "Dramatic 180,000 sq ft museum with hands-on science, energy, and technology exhibits — a must for kids and adults alike." },
        { name: "Deep Ellum", address: "Deep Ellum, Dallas, TX 75226", description: "Dallas's most creative neighborhood — legendary live music venues, street art murals, craft breweries, and eclectic food." },
      ],
    },
    Austin: {
      emoji: "🎸",
      tagline: "Tech Capital · Fast-growing immigrant hub",
      description:
        "Explosive Tech growth driven by Samsung, Tesla, Apple, and hundreds of startups. Known for its welcoming startup culture and growing desi community in Round Rock / Cedar Park.",
      places: [
        { name: "Barton Springs Pool", address: "2201 Barton Springs Rd, Austin, TX 78746", description: "A natural spring-fed swimming pool in Zilker Park — refreshingly cold at 68°F year-round, beloved by locals and visitors alike." },
        { name: "South Congress Avenue (SoCo)", address: "South Congress Ave, Austin, TX 78704", description: "Austin's most iconic street — lined with indie boutiques, food trailers, live music bars, and quirky Texas charm." },
        { name: "Blanton Museum of Art", address: "200 E Martin Luther King Jr Blvd, Austin, TX 78712", description: "The largest university art museum in the US with a world-class permanent collection and striking outdoor Ellsworth Kelly chapel." },
        { name: "Mount Bonnell", address: "3800 Mount Bonnell Rd, Austin, TX 78731", description: "The highest point in Austin — a short hike rewards you with stunning panoramic views of Lake Austin and the Hill Country." },
        { name: "6th Street Entertainment District", address: "6th St, Austin, TX 78701", description: "The beating heart of Austin nightlife — 'Live Music Capital of the World' with wall-to-wall venues, rooftop bars, and live Texas blues." },
      ],
    },
    "San Antonio": {
      emoji: "🌮",
      tagline: "Military City · Diverse immigrant communities",
      description:
        "Large Mexican-American community and a growing South Asian presence near the Medical Center. Affordable cost of living and strong family networks.",
      places: [
        { name: "The Alamo", address: "300 Alamo Plaza, San Antonio, TX 78205", description: "Texas's most visited landmark and a UNESCO World Heritage Site — the 1836 battle here defined Texas independence." },
        { name: "San Antonio River Walk", address: "849 E Commerce St, San Antonio, TX 78205", description: "A stunning 15-mile network of walkways along the San Antonio River lined with restaurants, shops, and vibrant nightlife below street level." },
        { name: "San Antonio Missions National Historical Park", address: "6701 San Jose Dr, San Antonio, TX 78214", description: "A UNESCO World Heritage Site comprising four 18th-century Spanish colonial missions — the largest collection in North America." },
        { name: "Natural Bridge Caverns", address: "26495 Natural Bridge Caverns Rd, San Antonio, TX 78266", description: "Texas's largest known natural caverns — a surreal underground world of stalactites and stalagmites formed over 140 million years." },
        { name: "Pearl Brewery District", address: "303 Pearl Pkwy, San Antonio, TX 78215", description: "A beautifully restored historic brewery turned into San Antonio's trendiest hub for artisan food, markets, boutiques, and rooftop bars." },
      ],
    },
    "Fort Worth": {
      emoji: "🤠",
      tagline: "Emerging suburb · Affordable DFW alternative",
      description:
        "Growing South Asian community with several Hindu temples and halal restaurants. More affordable than Dallas proper while still within the DFW job market.",
      places: [
        { name: "Fort Worth Stockyards National Historic District", address: "130 E Exchange Ave, Fort Worth, TX 76164", description: "Step back into the Wild West — daily cattle drives, rodeos, honky-tonk bars, and the world's largest honky-tonk, Billy Bob's Texas." },
        { name: "Kimbell Art Museum", address: "3333 Camp Bowie Blvd, Fort Worth, TX 76107", description: "One of the finest art museums in America, housed in a Kahn-designed masterpiece, with Michelangelo, Caravaggio, and Picasso in permanent collection." },
        { name: "Sundance Square", address: "420 Main St, Fort Worth, TX 76102", description: "Fort Worth's lively downtown entertainment district — 35 blocks of walkable restaurants, shops, live music, and open-air plazas." },
        { name: "Fort Worth Botanic Garden", address: "3220 Botanic Garden Blvd, Fort Worth, TX 76107", description: "Texas's oldest botanic garden featuring 23 specialty gardens including a serene Japanese Garden — a peaceful escape in the city." },
        { name: "Fort Worth Zoo", address: "1989 Colonial Pkwy, Fort Worth, TX 76110", description: "Consistently ranked among the top 5 zoos in the US — 7,000 animals across 64 immersive acres, wonderful for families." },
      ],
    },
  },
  California: {
    "San Jose": {
      emoji: "💻",
      tagline: "Silicon Valley · Largest Indian tech hub in the US",
      description:
        "Core of Silicon Valley — the highest concentration of Indian H-1B workers in the country. Strong Gujarati, Punjabi, and Telugu communities across Fremont, Milpitas, and Sunnyvale.",
      places: [
        { name: "Winchester Mystery House", address: "525 S Winchester Blvd, San Jose, CA 95128", description: "An eerie Victorian mansion built continuously for 38 years by the Winchester rifle heiress — staircases to nowhere, doors to walls." },
        { name: "Tech Interactive (The Tech Museum)", address: "201 S Market St, San Jose, CA 95113", description: "Hands-on science and technology museum in the heart of downtown — perfect for curious minds of all ages." },
        { name: "Santana Row", address: "334 Santana Row, San Jose, CA 95128", description: "San Jose's premier open-air lifestyle destination with upscale dining, boutique shopping, and a vibrant European-style street scene." },
        { name: "Rosicrucian Egyptian Museum", address: "1660 Park Ave, San Jose, CA 95191", description: "The largest collection of Egyptian artifacts on exhibit in western North America — mummies, sarcophagi, and full-scale tomb replicas." },
        { name: "Alum Rock Park", address: "16240 Alum Rock Ave, San Jose, CA 95127", description: "San Jose's oldest municipal park with mineral springs, rugged trails, and sweeping valley views — a beloved weekend escape." },
      ],
    },
    "Los Angeles": {
      emoji: "🎬",
      tagline: "Entertainment Capital · Most diverse city in the US",
      description:
        "Massive South Asian, Korean, Chinese, and Mexican communities. Artesia (Little India) is the go-to hub for desi groceries, restaurants, and cultural events.",
      places: [
        { name: "Griffith Observatory", address: "2800 E Observatory Rd, Los Angeles, CA 90027", description: "Iconic hilltop observatory with free public telescopes, stunning LA skyline views, and the best spot to watch the sunset over the city." },
        { name: "The Getty Center", address: "1200 Getty Center Dr, Los Angeles, CA 90049", description: "World-class art museum with free admission (parking fee), set on a dramatic hilltop with sweeping views of the LA Basin." },
        { name: "Venice Beach Boardwalk", address: "1800 Ocean Front Walk, Venice, CA 90291", description: "LA's most colorful stretch of coast — street performers, muscle beach, skate park, and the vibrant pulse of Southern California beach culture." },
        { name: "The Broad Museum", address: "221 S Grand Ave, Los Angeles, CA 90012", description: "Stunning contemporary art museum with works by Koons, Basquiat, and Cindy Sherman — the Infinity Mirrored Room is unmissable." },
        { name: "Olvera Street & El Pueblo", address: "845 N Alameda St, Los Angeles, CA 90012", description: "The birthplace of Los Angeles — a lively Mexican marketplace where the city began in 1781, filled with crafts, street food, and mariachi music." },
      ],
    },
    "San Francisco": {
      emoji: "🌉",
      tagline: "Tech & Finance hub · Cosmopolitan immigrant culture",
      description:
        "Strong South Asian and Filipino communities. The Mission District and Tenderloin host vibrant immigrant neighborhoods. High cost of living offset by premium tech salaries.",
      places: [
        { name: "Golden Gate Bridge", address: "Golden Gate Bridge, San Francisco, CA 94129", description: "The most photographed bridge in the world — walk or bike across for breathtaking views of the bay, Marin headlands, and the city skyline." },
        { name: "Alcatraz Island", address: "Alcatraz Island, San Francisco, CA 94133", description: "America's most notorious former federal penitentiary — haunting audio tours bring the stories of its most infamous inmates to life." },
        { name: "Fisherman's Wharf & Pier 39", address: "Pier 39, San Francisco, CA 94133", description: "SF's iconic waterfront — sourdough clam chowder bowls, sea lions, street performers, and sweeping views of the bay." },
        { name: "Golden Gate Park", address: "501 Stanyan St, San Francisco, CA 94117", description: "1,017 acres of urban green space bigger than Central Park — home to world-class museums, botanical gardens, and the famous bison paddock." },
        { name: "Mission Dolores Park", address: "Dolores St & 19th St, San Francisco, CA 94114", description: "The beating heart of SF's vibrant Mission District — locals gather here on sunny days with incredible city and bay views as backdrop." },
      ],
    },
    Fremont: {
      emoji: "🏡",
      tagline: "Little Kabul · South Asian suburb of choice",
      description:
        "The city with the highest percentage of South Asians in the US. Packed with Indian grocery stores, temples, and cultural organizations — a community within a community.",
      places: [
        { name: "Lake Elizabeth / Central Park", address: "40000 Paseo Padre Pkwy, Fremont, CA 94538", description: "Fremont's gorgeous 450-acre park with a lake for kayaking and paddleboating, walking trails, playgrounds, and weekend concerts." },
        { name: "Mission San Jose", address: "43300 Mission Blvd, Fremont, CA 94539", description: "One of California's 21 original Spanish missions, dating to 1797 — a beautifully restored church with a small museum on early California life." },
        { name: "Ardenwood Historic Farm", address: "34600 Ardenwood Blvd, Fremont, CA 94555", description: "A living-history Victorian-era farm with steam train rides, farm animals, and seasonal harvest festivals — a wonderful family day out." },
        { name: "Niles Canyon Railway", address: "37001 Mission Blvd, Fremont, CA 94536", description: "Vintage steam and diesel trains running through the scenic Niles Canyon — a beloved SF Bay Area heritage railroad experience." },
        { name: "Don Edwards SF Bay National Wildlife Refuge", address: "1 Marshlands Rd, Fremont, CA 94555", description: "The first urban national wildlife refuge in the US — stunning salt marsh scenery with abundant shorebirds, harbor seals, and bay views." },
      ],
    },
  },
  "North Carolina": {
    Raleigh: {
      emoji: "🔬",
      tagline: "Research Triangle · Fast-growing tech corridor",
      description:
        "Part of the Research Triangle (Raleigh–Durham–Chapel Hill). Major employers: SAS, Red Hat, Cisco. Large and growing South Asian community with multiple Hindu temples and cultural events.",
      places: [
        { name: "North Carolina Museum of Natural Sciences", address: "11 W Jones St, Raleigh, NC 27601", description: "The largest natural history museum in the Southeast — free admission, live animals, and a stunning 4-story Nature Research Center." },
        { name: "North Carolina State Capitol", address: "1 E Edenton St, Raleigh, NC 27601", description: "A magnificent Greek Revival capitol building (1840) at the heart of downtown — free tours reveal beautifully preserved 19th-century interiors." },
        { name: "Pullen Park", address: "520 Ashe Ave, Raleigh, NC 27606", description: "One of the oldest public parks in the Southeast with a historic 1911 carousel, paddle boats, a train, and beautiful greenspace." },
        { name: "William B. Umstead State Park", address: "8801 Glenwood Ave, Raleigh, NC 27617", description: "5,000 acres of pristine forest just minutes from downtown — miles of hiking and biking trails, three serene lakes, and abundant wildlife." },
        { name: "North Carolina Museum of Art", address: "2110 Blue Ridge Rd, Raleigh, NC 27607", description: "Outstanding art museum with a stunning 164-acre park filled with large-scale outdoor sculptures — free park, nominal museum admission." },
      ],
    },
    Charlotte: {
      emoji: "🏦",
      tagline: "Finance hub · Rapidly diversifying city",
      description:
        "Banking capital of the South (Bank of America HQ). Growing Indian, Chinese, and Korean communities. South Park and Ballantyne corridors have the highest immigrant populations.",
      places: [
        { name: "NASCAR Hall of Fame", address: "400 E Martin Luther King Jr Blvd, Charlotte, NC 28202", description: "A world-class interactive museum celebrating America's most popular motorsport — race simulators, championship cars, and racing legends." },
        { name: "U.S. National Whitewater Center", address: "5000 Whitewater Center Pkwy, Charlotte, NC 28214", description: "The world's largest artificial whitewater river with rafting, kayaking, rock climbing, zip lines, and mountain biking trails." },
        { name: "Freedom Park", address: "1900 East Blvd, Charlotte, NC 28203", description: "Charlotte's most beloved urban park — a scenic pond, walking trails, playgrounds, and the home of the Charlotte Nature Museum." },
        { name: "Carowinds", address: "14523 Carowinds Blvd, Charlotte, NC 28273", description: "Major theme and water park straddling the NC/SC border — thrill rides, family attractions, and live entertainment for all ages." },
        { name: "The Mint Museum", address: "500 S Tryon St, Charlotte, NC 28202", description: "One of the Southeast's premier art museums housed in a striking downtown building — exceptional craft, design, and fine art collections." },
      ],
    },
    Durham: {
      emoji: "🎓",
      tagline: "Duke City · Academic & biotech center",
      description:
        "Home to Duke University and a thriving biotech cluster. International students often settle here post-graduation — strong South Asian and Chinese communities.",
      places: [
        { name: "Duke University Campus & Chapel", address: "Chapel Dr, Durham, NC 27708", description: "One of America's most beautiful campuses — the stunning Gothic Duke Chapel towers over stone quadrangles, gargoyles, and pristine gardens." },
        { name: "Sarah P. Duke Gardens", address: "420 Anderson St, Durham, NC 27708", description: "55 acres of breathtaking formal and naturalistic gardens on the Duke campus — five distinct garden areas with year-round blooms." },
        { name: "American Tobacco Campus", address: "318 Blackwell St, Durham, NC 27701", description: "A beautifully renovated 19th-century tobacco factory now filled with restaurants, shops, offices, and an outdoor amphitheater by the creek." },
        { name: "Museum of Life and Science", address: "433 Murray Ave, Durham, NC 27704", description: "An engaging science museum with live butterfly house, dinosaur trail, lemur exhibits, and outdoor adventure areas — perfect for families." },
        { name: "Durham Bulls Athletic Park", address: "409 Blackwell St, Durham, NC 27701", description: "Home of the famous Durham Bulls minor league team — the Ballpark that inspired the film 'Bull Durham,' with a lively, affordable game-day atmosphere." },
      ],
    },
  },
};
