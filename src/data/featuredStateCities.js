// Featured cities per state — shown with rich cards on the state page.
// Only top immigrant-community hubs are listed; other cities use standard cards.
const BASE_FEATURED_CITIES = {
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
    Plano: {
      emoji: "🏢",
      tagline: "North Dallas tech suburb · Family-friendly immigrant hub",
      description:
        "One of DFW's strongest South Asian and East Asian suburbs, with major corporate campuses, excellent schools, and quick access to Dallas, Frisco, and Irving.",
      places: [
        { name: "Arbor Hills Nature Preserve", address: "6701 W Parker Rd, Plano, TX 75093", description: "A 200-acre preserve with paved trails, prairie views, creek crossings, and a lookout tower - a local favorite for evening walks." },
        { name: "Historic Downtown Plano Arts District", address: "998 E 15th St, Plano, TX 75074", description: "A compact, walkable downtown with murals, local restaurants, live music, and preserved brick storefronts." },
        { name: "Legacy West", address: "5908 Headquarters Dr, Plano, TX 75024", description: "A polished dining and shopping district near major corporate campuses, especially lively on weekends." },
        { name: "Oak Point Park and Nature Preserve", address: "5901 Los Rios Blvd, Plano, TX 75074", description: "Plano's largest park, with lake views, trails, kayaking, and Go Ape treetop adventures." },
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
    "San Diego": {
      emoji: "🌊",
      tagline: "Coastal biotech hub · Beaches, parks, and family weekends",
      description:
        "A major life-sciences and university market with year-round outdoor living, strong Asian and Mexican communities, and easy beach access.",
      places: [
        { name: "Balboa Park", address: "1549 El Prado, San Diego, CA 92101", description: "A landmark cultural park with gardens, Spanish Colonial architecture, museums, and the San Diego Zoo next door." },
        { name: "San Diego Zoo", address: "2920 Zoo Dr, San Diego, CA 92101", description: "One of the world's best-known zoos, with lush habitats, pandas, safari-style exhibits, and a full family-day itinerary." },
        { name: "La Jolla Cove", address: "1100 Coast Blvd, La Jolla, CA 92037", description: "A postcard-perfect cove for sea caves, tide pools, sea lions, kayaking, and dramatic sunset views." },
        { name: "USS Midway Museum", address: "910 N Harbor Dr, San Diego, CA 92101", description: "A massive aircraft carrier museum on the waterfront, with flight decks, restored aircraft, and immersive naval history." },
      ],
    },
    Irvine: {
      emoji: "🌳",
      tagline: "Orange County tech suburb · Clean, planned, and family-first",
      description:
        "A top choice for families and professionals near UC Irvine, medical campuses, tech employers, beaches, and strong Asian communities.",
      places: [
        { name: "Irvine Spectrum Center", address: "670 Spectrum Center Dr, Irvine, CA 92618", description: "Open-air shopping, dining, entertainment, a giant wheel, and an easy weekend gathering spot." },
        { name: "Bommer Canyon", address: "Bommer Canyon Trail, Irvine, CA 92603", description: "Peaceful canyon trails through preserved open space with coastal hills, wildflowers, and quiet morning hikes." },
        { name: "Great Park", address: "8000 Great Park Blvd, Irvine, CA 92618", description: "A large public park with sports fields, gardens, art, a carousel, and the iconic orange balloon." },
        { name: "William R. Mason Regional Park", address: "18712 University Dr, Irvine, CA 92612", description: "A calm green park with lake paths, picnic areas, playgrounds, and shaded family-friendly walking loops." },
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
    Cary: {
      emoji: "🌲",
      tagline: "Triangle suburb · Schools, parks, and global families",
      description:
        "A fast-growing Research Triangle suburb with strong Indian, Chinese, and Korean communities, polished parks, and easy access to Raleigh and RTP.",
      places: [
        { name: "Downtown Cary Park", address: "327 S Academy St, Cary, NC 27511", description: "A beautifully designed central park with gardens, play areas, public art, food kiosks, and year-round events." },
        { name: "Koka Booth Amphitheatre", address: "8003 Regency Pkwy, Cary, NC 27518", description: "A lakeside outdoor venue for concerts, movies, cultural festivals, and the popular Chinese Lantern Festival." },
        { name: "Hemlock Bluffs Nature Preserve", address: "2616 Kildaire Farm Rd, Cary, NC 27518", description: "Quiet wooded trails around rare Eastern Hemlock trees, boardwalks, and nature exhibits." },
        { name: "Fred G. Bond Metro Park", address: "801 High House Rd, Cary, NC 27513", description: "A large community park with a lake, boathouse, trails, picnic shelters, and a family-friendly playground." },
      ],
    },
    Greensboro: {
      emoji: "🏛️",
      tagline: "Piedmont city · Civil-rights history and universities",
      description:
        "A central North Carolina city with universities, healthcare jobs, growing immigrant communities, and easy access to the Triangle and Charlotte.",
      places: [
        { name: "International Civil Rights Center & Museum", address: "134 S Elm St, Greensboro, NC 27401", description: "A powerful museum inside the former Woolworth's where the 1960 Greensboro sit-ins helped transform American civil rights history." },
        { name: "Greensboro Science Center", address: "4301 Lawndale Dr, Greensboro, NC 27455", description: "Aquarium, zoo, science museum, and treetop adventure in one campus - a strong family day trip." },
        { name: "Tanger Family Bicentennial Garden", address: "1105 Hobbs Rd, Greensboro, NC 27410", description: "A polished public garden with sculpture, seasonal flowers, bridges, and peaceful walking paths." },
        { name: "LeBauer Park", address: "208 N Davie St, Greensboro, NC 27401", description: "A lively downtown park with public art, lawns, performances, and quick access to restaurants and cultural venues." },
      ],
    },
  },
  Florida: {
    Miami: {
      emoji: "🌴",
      tagline: "Gateway city · Beaches, Latin culture, and global finance",
      description:
        "A deeply international metro with strong Latin American, Caribbean, South Asian, and tech communities, plus year-round waterfront living.",
      places: [
        { name: "Vizcaya Museum & Gardens", address: "3251 S Miami Ave, Miami, FL 33129", description: "A waterfront Italian-style estate with formal gardens, bay views, and one of Miami's most elegant historic interiors." },
        { name: "Wynwood Walls", address: "2516 NW 2nd Ave, Miami, FL 33127", description: "A colorful outdoor street-art district with murals, galleries, cafes, and a lively creative scene." },
        { name: "Little Havana", address: "SW 8th St, Miami, FL 33135", description: "The cultural heart of Cuban Miami, known for Calle Ocho, music, coffee windows, domino parks, and local food." },
        { name: "South Beach and Ocean Drive", address: "Ocean Dr, Miami Beach, FL 33139", description: "Iconic Art Deco architecture, wide sand, nightlife, and the classic Miami Beach postcard experience." },
      ],
    },
    Orlando: {
      emoji: "🎢",
      tagline: "Theme-park capital · Family trips and growing tech",
      description:
        "A major family destination with theme parks, hospitality jobs, healthcare, universities, and fast-growing immigrant communities.",
      places: [
        { name: "Walt Disney World Resort", address: "Walt Disney World Resort, Orlando, FL 32830", description: "The region's defining destination, with Magic Kingdom, EPCOT, Hollywood Studios, Animal Kingdom, resorts, and dining." },
        { name: "Universal Orlando Resort", address: "6000 Universal Blvd, Orlando, FL 32819", description: "Major thrill rides, movie worlds, CityWalk, and some of Florida's most popular entertainment districts." },
        { name: "Lake Eola Park", address: "512 E Washington St, Orlando, FL 32801", description: "Downtown Orlando's signature lakefront park with swan boats, skyline views, walking paths, and weekend markets." },
        { name: "Leu Gardens", address: "1920 N Forest Ave, Orlando, FL 32803", description: "Fifty acres of tropical and subtropical gardens wrapped around a historic home just north of downtown." },
      ],
    },
    Tampa: {
      emoji: "🌅",
      tagline: "Gulf Coast hub · Healthcare, finance, and waterfront weekends",
      description:
        "A fast-growing metro with strong healthcare and finance employers, immigrant neighborhoods, beaches nearby, and a revitalized downtown waterfront.",
      places: [
        { name: "Tampa Riverwalk", address: "Tampa Riverwalk, Tampa, FL 33602", description: "A walkable waterfront spine connecting parks, museums, restaurants, Amalie Arena, and downtown views." },
        { name: "The Florida Aquarium", address: "701 Channelside Dr, Tampa, FL 33602", description: "A major family attraction with Gulf habitats, touch tanks, wetlands exhibits, and conservation programming." },
        { name: "Ybor City Historic District", address: "1600 E 8th Ave, Tampa, FL 33605", description: "A historic cigar-making neighborhood with brick streets, Cuban and Spanish heritage, restaurants, and nightlife." },
        { name: "Busch Gardens Tampa Bay", address: "10165 McKinley Dr, Tampa, FL 33612", description: "A large theme park mixing roller coasters, animal habitats, live shows, and family attractions." },
      ],
    },
    Jacksonville: {
      emoji: "🌉",
      tagline: "River city · Beaches, logistics, and family space",
      description:
        "Florida's largest city by area, with strong healthcare, logistics, military, and finance sectors plus coastal neighborhoods and riverfront parks.",
      places: [
        { name: "Jacksonville Zoo and Gardens", address: "370 Zoo Pkwy, Jacksonville, FL 32218", description: "A spacious zoo and garden campus with riverfront habitats, a strong jaguar exhibit, and family-friendly paths." },
        { name: "Cummer Museum of Art & Gardens", address: "829 Riverside Ave, Jacksonville, FL 32204", description: "A respected art museum with riverfront gardens, European works, and a peaceful Riverside setting." },
        { name: "Riverside Arts Market", address: "715 Riverside Ave, Jacksonville, FL 32204", description: "A lively Saturday market under the Fuller Warren Bridge with food vendors, artists, music, and river views." },
        { name: "Jacksonville Beach Pier", address: "503 1st St N, Jacksonville Beach, FL 32250", description: "A classic beach outing with fishing, surf views, casual restaurants, and Atlantic Ocean sunrise walks." },
      ],
    },
    "Fort Lauderdale": {
      emoji: "⛵",
      tagline: "Canal city · Beaches, boats, and South Florida access",
      description:
        "A polished coastal city with international communities, easy Miami access, airport convenience, and relaxed beach living.",
      places: [
        { name: "Las Olas Boulevard", address: "Las Olas Blvd, Fort Lauderdale, FL 33301", description: "The city's main dining, shopping, gallery, and nightlife corridor stretching toward the beach." },
        { name: "Fort Lauderdale Beach", address: "1100 Seabreeze Blvd, Fort Lauderdale, FL 33316", description: "A broad, clean Atlantic beach with a wave-wall promenade, cafes, hotels, and water views." },
        { name: "Bonnet House Museum & Gardens", address: "900 N Birch Rd, Fort Lauderdale, FL 33304", description: "A historic artist's estate with tropical gardens, orchids, coastal habitat, and preserved early-Florida character." },
        { name: "Hugh Taylor Birch State Park", address: "3109 E Sunrise Blvd, Fort Lauderdale, FL 33304", description: "A green coastal park for biking, kayaking, trails, lagoon views, and quiet shade near the beach." },
      ],
    },
  },
  "District of Columbia": {
    Washington: {
      emoji: "🏛️",
      tagline: "Capital city · Museums, monuments, and global networks",
      description:
        "A data-ready entry for DC if the app adds it as a region later; current routes do not list DC as a state yet.",
      places: [
        { name: "National Mall", address: "National Mall, Washington, DC 20024", description: "America's central civic landscape, lined with major Smithsonian museums, memorials, lawns, and iconic views." },
        { name: "Smithsonian National Museum of Natural History", address: "10th St. & Constitution Ave. NW, Washington, DC 20560", description: "A free Smithsonian favorite with gems, fossils, ocean exhibits, and deep natural-history collections." },
        { name: "Lincoln Memorial", address: "2 Lincoln Memorial Cir NW, Washington, DC 20002", description: "A powerful monument overlooking the Reflecting Pool, especially memorable at sunset and after dark." },
        { name: "Georgetown Waterfront Park", address: "3303 Water St NW, Washington, DC 20007", description: "A relaxed Potomac River park near restaurants, bridges, walking paths, and historic Georgetown streets." },
      ],
    },
  },
  Virginia: {
    Arlington: {
      emoji: "🛤️",
      tagline: "DC-adjacent hub · Metro access and global professionals",
      description:
        "A dense, transit-friendly Northern Virginia city with federal, consulting, tech, and defense jobs plus easy DC access.",
      places: [
        { name: "Arlington National Cemetery", address: "Arlington National Cemetery, Arlington, VA 22211", description: "A solemn national landmark with rolling hills, memorials, the Tomb of the Unknown Soldier, and sweeping DC views." },
        { name: "The Pentagon Memorial", address: "1 N Rotary Rd, Arlington, VA 22202", description: "A quiet outdoor memorial honoring the 184 lives lost at the Pentagon on September 11, 2001." },
        { name: "Mount Vernon Trail", address: "Mount Vernon Trail, Arlington, VA 22202", description: "A scenic Potomac-side trail for biking and walking with skyline views, airport overlooks, and access to DC bridges." },
        { name: "Theodore Roosevelt Island", address: "Theodore Roosevelt Island, Washington, DC 20037", description: "A wooded island preserve reached from Arlington, with trails, marsh boardwalks, and a quiet presidential memorial." },
      ],
    },
    Alexandria: {
      emoji: "⚓",
      tagline: "Old Town charm · Waterfront and DC access",
      description:
        "A historic Potomac River city popular with professionals and families who want walkable neighborhoods near Washington, DC.",
      places: [
        { name: "Old Town Alexandria", address: "King St, Alexandria, VA 22314", description: "Brick sidewalks, preserved townhouses, boutiques, restaurants, and a free trolley along King Street." },
        { name: "Torpedo Factory Art Center", address: "105 N Union St, Alexandria, VA 22314", description: "A former munitions factory turned working artist studio complex on the waterfront." },
        { name: "Alexandria Waterfront", address: "1 Prince St, Alexandria, VA 22314", description: "A scenic riverfront promenade with parks, dining, public art, boat tours, and sunset views." },
        { name: "George Washington's Mount Vernon", address: "3200 Mount Vernon Memorial Hwy, Mount Vernon, VA 22121", description: "George Washington's riverside estate with restored rooms, gardens, museum galleries, and Potomac views." },
      ],
    },
    Richmond: {
      emoji: "🌊",
      tagline: "Capital city · History, river trails, and creative neighborhoods",
      description:
        "Virginia's capital combines healthcare, finance, universities, and a growing arts and food scene along the James River.",
      places: [
        { name: "Virginia Museum of Fine Arts", address: "200 N Arthur Ashe Blvd, Richmond, VA 23220", description: "A major free art museum with Faberge, global collections, sculpture gardens, and rotating exhibitions." },
        { name: "Maymont", address: "1700 Hampton St, Richmond, VA 23220", description: "A 100-acre estate with gardens, wildlife habitats, a historic mansion, and rolling lawns." },
        { name: "Belle Isle", address: "Belle Isle, Richmond, VA 23225", description: "A James River island with pedestrian bridge access, skyline views, rocks, ruins, and trails." },
        { name: "Lewis Ginter Botanical Garden", address: "1800 Lakeside Ave, Richmond, VA 23228", description: "A polished botanical garden with a conservatory, children's garden, seasonal lights, and peaceful walking paths." },
      ],
    },
    "Virginia Beach": {
      emoji: "🏖️",
      tagline: "Oceanfront city · Military, healthcare, and family beaches",
      description:
        "A large coastal city with military families, healthcare jobs, suburban neighborhoods, and the state's best-known beach scene.",
      places: [
        { name: "Virginia Beach Boardwalk", address: "Virginia Beach Boardwalk, Virginia Beach, VA 23451", description: "A three-mile oceanfront boardwalk with beaches, biking, restaurants, public art, and the Neptune statue." },
        { name: "First Landing State Park", address: "2500 Shore Dr, Virginia Beach, VA 23451", description: "A coastal park with dunes, cypress swamps, bay beaches, and wooded hiking trails." },
        { name: "Military Aviation Museum", address: "1341 Princess Anne Rd, Virginia Beach, VA 23457", description: "A large collection of restored World War I and II aircraft, many still flight-capable." },
        { name: "Cape Henry Lighthouse", address: "583 Atlantic Ave, Fort Story, VA 23459", description: "A historic lighthouse near the first landing site of English colonists, with Atlantic and Chesapeake Bay views." },
      ],
    },
    Fairfax: {
      emoji: "🏘️",
      tagline: "Northern Virginia suburb · Schools, jobs, and community",
      description:
        "A central NoVA base for families near federal contracting, tech employers, George Mason University, and strong immigrant networks.",
      places: [
        { name: "George Mason University Center for the Arts", address: "4373 Mason Pond Dr, Fairfax, VA 22030", description: "A major regional venue for concerts, dance, theater, and cultural performances." },
        { name: "EagleBank Arena", address: "4500 Patriot Cir, Fairfax, VA 22030", description: "A large arena for concerts, sports, graduations, and community events on the George Mason campus." },
        { name: "Historic Fairfax Courthouse", address: "4000 Chain Bridge Rd, Fairfax, VA 22030", description: "A preserved courthouse complex anchoring Old Town Fairfax's historic core." },
        { name: "Daniels Run Park", address: "Old Lee Hwy, Fairfax, VA 22030", description: "A local wooded greenway with shaded trails, creek crossings, and easy neighborhood access." },
      ],
    },
  },
  Maryland: {
    Baltimore: {
      emoji: "⚓",
      tagline: "Harbor city · Healthcare, universities, and historic neighborhoods",
      description:
        "Maryland's largest city, anchored by Johns Hopkins, University of Maryland, port jobs, museums, and a distinctive waterfront identity.",
      places: [
        { name: "Inner Harbor", address: "Inner Harbor, Baltimore, MD 21202", description: "Baltimore's central waterfront district with promenades, ships, museums, restaurants, and skyline views." },
        { name: "National Aquarium", address: "501 E Pratt St, Baltimore, MD 21202", description: "A major aquarium with tropical rain forest, Atlantic coral reef, shark, dolphin, and jellyfish exhibits." },
        { name: "Fort McHenry National Monument", address: "2400 E Fort Ave, Baltimore, MD 21230", description: "The harbor fort that inspired the national anthem, with lawns, water views, and historic exhibits." },
        { name: "Fells Point", address: "Fells Point, Baltimore, MD 21231", description: "A cobblestone waterfront neighborhood with pubs, restaurants, shops, and preserved maritime character." },
      ],
    },
    Rockville: {
      emoji: "🚆",
      tagline: "Montgomery County hub · Metro access and global food",
      description:
        "A diverse DC-area suburb with strong Asian and South Asian communities, biotech jobs, Metro access, and family-friendly neighborhoods.",
      places: [
        { name: "Rockville Town Square", address: "131 Gibbs St, Rockville, MD 20850", description: "A walkable dining, shopping, library, and event district in the heart of Rockville." },
        { name: "Glenview Mansion", address: "603 Edmonston Dr, Rockville, MD 20851", description: "A historic mansion and civic arts venue set in Rockville Civic Center Park." },
        { name: "Rock Creek Regional Park", address: "6700 Needwood Rd, Derwood, MD 20855", description: "A large park with Lake Needwood, trails, boating, picnic areas, and wooded escapes." },
        { name: "F. Scott Fitzgerald Theatre", address: "603 Edmonston Dr, Rockville, MD 20851", description: "A local performing-arts venue for theater, music, dance, and community productions." },
      ],
    },
    "Silver Spring": {
      emoji: "🎬",
      tagline: "Urban suburb · Dining, transit, and cultural venues",
      description:
        "A diverse, transit-rich community just north of DC with strong Ethiopian, Latin, South Asian, and African immigrant presence.",
      places: [
        { name: "Downtown Silver Spring", address: "916 Ellsworth Dr, Silver Spring, MD 20910", description: "A lively downtown district with restaurants, concerts, public plazas, shops, and Metro access." },
        { name: "AFI Silver Theatre and Cultural Center", address: "8633 Colesville Rd, Silver Spring, MD 20910", description: "A restored Art Deco theater showing classic, international, independent, and festival films." },
        { name: "Sligo Creek Trail", address: "Sligo Creek Trail, Silver Spring, MD 20910", description: "A popular greenway for biking, running, and shaded walks through neighborhood parks." },
        { name: "Brookside Gardens", address: "1800 Glenallan Ave, Wheaton, MD 20902", description: "A nearby public garden with conservatories, seasonal displays, ponds, and quiet walking paths." },
      ],
    },
    Columbia: {
      emoji: "🌳",
      tagline: "Planned community · Parks, lakes, and central Maryland access",
      description:
        "A diverse Howard County community with strong schools, lakes, trails, and quick access to Baltimore and Washington.",
      places: [
        { name: "Lake Kittamaqundi", address: "10221 Wincopin Cir, Columbia, MD 21044", description: "A central lakefront with paths, restaurants, public art, and relaxed evening walks." },
        { name: "Merriweather Post Pavilion", address: "10475 Little Patuxent Pkwy, Columbia, MD 21044", description: "A beloved outdoor concert venue surrounded by Symphony Woods and downtown redevelopment." },
        { name: "Robinson Nature Center", address: "6692 Cedar Ln, Columbia, MD 21044", description: "A nature education center with trails, exhibits, planetarium programming, and wooded grounds." },
        { name: "Blandair Regional Park", address: "5750 Oakland Mills Rd, Columbia, MD 21045", description: "A large sports and recreation park with playgrounds, trails, fields, and family amenities." },
      ],
    },
    Bethesda: {
      emoji: "🏥",
      tagline: "NIH corridor · Dining, medicine, and DC proximity",
      description:
        "A high-demand suburb near NIH, Walter Reed, biotech employers, Metro, restaurants, and the DC line.",
      places: [
        { name: "Bethesda Row", address: "Bethesda Row, Bethesda, MD 20814", description: "A polished walkable district with restaurants, boutiques, cafes, and evening street life." },
        { name: "Strathmore", address: "5301 Tuckerman Ln, North Bethesda, MD 20852", description: "A major performing-arts center for classical, jazz, pop, dance, and cultural events." },
        { name: "Capital Crescent Trail", address: "Capital Crescent Trail, Bethesda, MD 20814", description: "A popular rail-trail connecting Bethesda with Georgetown, used for biking, running, and commuting." },
        { name: "Cabin John Regional Park", address: "7400 Tuckerman Ln, Bethesda, MD 20817", description: "A family-friendly regional park with trails, playgrounds, tennis, picnic areas, and a miniature train." },
      ],
    },
  },
  "New York": {
    "New York City": {
      emoji: "🗽",
      tagline: "Global capital · Immigrant neighborhoods and endless landmarks",
      description:
        "The country's densest immigrant gateway, with world-class transit, finance, tech, healthcare, food, culture, and neighborhood communities.",
      places: [
        { name: "Central Park", address: "Central Park, New York, NY 10024", description: "The city's great green landmark, with lakes, lawns, bridges, museums, playgrounds, and year-round walking routes." },
        { name: "The Metropolitan Museum of Art", address: "1000 5th Ave, New York, NY 10028", description: "One of the world's major art museums, spanning ancient civilizations, European masters, American art, fashion, and global collections." },
        { name: "Statue of Liberty and Ellis Island", address: "Statue of Liberty National Monument, New York, NY 10004", description: "The classic immigration-history visit, pairing the harbor landmark with Ellis Island's moving museum." },
        { name: "High Line", address: "Gansevoort St, New York, NY 10014", description: "An elevated park built on a former rail line, with gardens, art, Hudson River views, and Chelsea access." },
      ],
    },
    Buffalo: {
      emoji: "❄️",
      tagline: "Great Lakes city · Architecture, universities, and Niagara access",
      description:
        "A resurgent western New York city with healthcare, university, engineering, and cross-border connections near Niagara Falls.",
      places: [
        { name: "Canalside", address: "44 Prime St, Buffalo, NY 14202", description: "A revived waterfront district with boardwalks, events, skating, kayaking, food, and lakefront views." },
        { name: "Buffalo AKG Art Museum", address: "1285 Elmwood Ave, Buffalo, NY 14222", description: "A major modern and contemporary art museum with a strong campus in Delaware Park." },
        { name: "Frank Lloyd Wright's Martin House", address: "125 Jewett Pkwy, Buffalo, NY 14214", description: "A restored Prairie School masterpiece designed by Frank Lloyd Wright." },
        { name: "Niagara Falls State Park", address: "332 Prospect St, Niagara Falls, NY 14303", description: "America's oldest state park and the essential nearby day trip for waterfall views and boat tours." },
      ],
    },
    Rochester: {
      emoji: "📷",
      tagline: "Finger Lakes city · Universities, medicine, and family culture",
      description:
        "A university and healthcare hub near the Finger Lakes, with a strong festival calendar and family-friendly museums.",
      places: [
        { name: "The Strong National Museum of Play", address: "1 Manhattan Square Dr, Rochester, NY 14607", description: "A standout interactive museum dedicated to play, games, toys, and childhood history." },
        { name: "George Eastman Museum", address: "900 East Ave, Rochester, NY 14607", description: "A photography and film museum at the historic home of Kodak founder George Eastman." },
        { name: "Highland Park", address: "180 Reservoir Ave, Rochester, NY 14620", description: "A landmark park famous for lilacs, rolling paths, gardens, and spring festival crowds." },
        { name: "Seabreeze Amusement Park", address: "4600 Culver Rd, Rochester, NY 14622", description: "A classic lakefront amusement park with rides, water attractions, and family nostalgia." },
      ],
    },
    Albany: {
      emoji: "🏛️",
      tagline: "State capital · Government, universities, and Hudson Valley access",
      description:
        "New York's capital city, with government work, universities, healthcare, and quick access to the Hudson Valley and Adirondacks.",
      places: [
        { name: "New York State Capitol", address: "State St. and Washington Ave, Albany, NY 12224", description: "A grand 19th-century capitol with striking stonework, historic chambers, and guided tours." },
        { name: "Empire State Plaza", address: "Empire State Plaza, Albany, NY 12242", description: "A dramatic government complex with public art, reflecting pools, events, and skyline-defining architecture." },
        { name: "Washington Park", address: "Washington Park, Albany, NY 12203", description: "A historic urban park with a lake, paths, seasonal tulips, and neighborhood character." },
        { name: "USS Slater", address: "141 Broadway, Albany, NY 12202", description: "A restored World War II destroyer escort museum ship on the Hudson River." },
      ],
    },
  },
  Colorado: {
    Denver: {
      emoji: "⛰️",
      tagline: "Mile High City · Tech, outdoors, and airport access",
      description:
        "A major Mountain West hub with tech, healthcare, aerospace, finance, and quick access to the Front Range outdoors.",
      places: [
        { name: "Denver Union Station", address: "1701 Wynkoop St, Denver, CO 80202", description: "A restored rail landmark turned dining, transit, and hotel hub in the heart of LoDo." },
        { name: "Denver Art Museum", address: "100 W 14th Ave Pkwy, Denver, CO 80204", description: "A major art museum known for Indigenous arts, global collections, bold architecture, and rotating exhibitions." },
        { name: "Red Rocks Park and Amphitheatre", address: "18300 W Alameda Pkwy, Morrison, CO 80465", description: "A world-famous outdoor amphitheatre set between red sandstone formations, also open for hikes and daytime visits." },
        { name: "City Park", address: "2001 Colorado Blvd, Denver, CO 80205", description: "A large urban park with skyline and mountain views, lake paths, the zoo, and the science museum nearby." },
      ],
    },
    Boulder: {
      emoji: "🥾",
      tagline: "University town · Trails, startups, and mountain views",
      description:
        "A compact university and startup city at the base of the Flatirons, popular for outdoor life and research careers.",
      places: [
        { name: "Flatirons Vista", address: "Flatirons Vista Trailhead, Boulder, CO 80303", description: "Classic Boulder views of the Flatirons with open-space trails for hiking, running, and photography." },
        { name: "Pearl Street Mall", address: "Pearl St, Boulder, CO 80302", description: "A pedestrian downtown corridor with street performers, restaurants, shops, bookstores, and local energy." },
        { name: "Chautauqua Park", address: "900 Baseline Rd, Boulder, CO 80302", description: "A historic park and trailhead below the Flatirons with picnic areas, cottages, and mountain access." },
        { name: "Boulder Dushanbe Teahouse", address: "1770 13th St, Boulder, CO 80302", description: "A hand-carved Tajik teahouse and local landmark near downtown and Boulder Creek." },
      ],
    },
    "Colorado Springs": {
      emoji: "🏔️",
      tagline: "Pikes Peak base · Military, aerospace, and family outdoors",
      description:
        "A scenic Front Range city with major military and aerospace employers, affordable neighborhoods, and dramatic red-rock landscapes.",
      places: [
        { name: "Garden of the Gods", address: "1805 N 30th St, Colorado Springs, CO 80904", description: "A free city park filled with towering red sandstone formations, paved paths, hiking trails, and mountain views." },
        { name: "Pikes Peak", address: "Pikes Peak, Cascade, CO 80809", description: "A famous 14,000-foot summit reachable by highway or cog railway, with sweeping views across the Rockies and plains." },
        { name: "United States Air Force Academy", address: "2304 Cadet Dr, Air Force Academy, CO 80840", description: "A striking campus known for the Cadet Chapel, visitor center, mountain setting, and military history." },
        { name: "Cheyenne Mountain Zoo", address: "4250 Cheyenne Mountain Zoo Rd, Colorado Springs, CO 80906", description: "A mountainside zoo with giraffe feeding, chairlift views, and strong family appeal." },
      ],
    },
    "Fort Collins": {
      emoji: "🚲",
      tagline: "College city · Bikes, breweries, and foothills",
      description:
        "Home to Colorado State University, clean neighborhoods, a strong outdoor culture, and an approachable cost profile for the Front Range.",
      places: [
        { name: "Old Town Fort Collins", address: "Old Town Square, Fort Collins, CO 80524", description: "A lively historic downtown with patios, shops, public art, music, and preserved storefronts." },
        { name: "Horsetooth Reservoir", address: "Horsetooth Reservoir, Fort Collins, CO 80526", description: "A scenic foothills reservoir for hiking, boating, paddleboarding, and sunset views." },
        { name: "The Gardens on Spring Creek", address: "2145 Centre Ave, Fort Collins, CO 80526", description: "A botanic garden with themed outdoor spaces, butterfly house, and family-friendly programs." },
        { name: "Cache la Poudre River Trail", address: "Cache la Poudre River Trail, Fort Collins, CO 80524", description: "A paved riverside trail for biking and walking through parks, natural areas, and downtown connections." },
      ],
    },
  },
  Arizona: {
    Phoenix: {
      emoji: "🌵",
      tagline: "Valley hub · Healthcare, semiconductors, and desert hikes",
      description:
        "A fast-growing metro with major healthcare, finance, semiconductor, and logistics employers spread across the Valley.",
      places: [
        { name: "Desert Botanical Garden", address: "1201 N Galvin Pkwy, Phoenix, AZ 85008", description: "A beautiful desert garden with cactus collections, trails, art installations, and sunset color." },
        { name: "Musical Instrument Museum", address: "4725 E Mayo Blvd, Phoenix, AZ 85050", description: "A globally focused museum with instruments and music traditions from nearly every part of the world." },
        { name: "Papago Park", address: "625 N Galvin Pkwy, Phoenix, AZ 85008", description: "A red-rock park with easy hikes, Hole-in-the-Rock views, lagoons, and nearby zoo access." },
        { name: "Heard Museum", address: "2301 N Central Ave, Phoenix, AZ 85004", description: "A respected museum centered on American Indian art, culture, and history." },
      ],
    },
    Tucson: {
      emoji: "🌄",
      tagline: "Sonoran city · University, astronomy, and desert culture",
      description:
        "A University of Arizona city with aerospace, optics, healthcare, and a strong sense of desert identity.",
      places: [
        { name: "Saguaro National Park", address: "Saguaro National Park, Tucson, AZ 85730", description: "A signature national park protecting forests of giant saguaro cacti on both sides of Tucson." },
        { name: "Arizona-Sonora Desert Museum", address: "2021 N Kinney Rd, Tucson, AZ 85743", description: "A blend of zoo, botanical garden, aquarium, and natural-history museum focused on the Sonoran Desert." },
        { name: "Mission San Xavier del Bac", address: "1950 W San Xavier Rd, Tucson, AZ 85746", description: "An 18th-century Spanish mission known for ornate interiors and white desert architecture." },
        { name: "Sabino Canyon Recreation Area", address: "5700 N Sabino Canyon Rd, Tucson, AZ 85750", description: "A canyon recreation area with tram access, hiking, creek crossings, and dramatic mountain scenery." },
      ],
    },
    Scottsdale: {
      emoji: "🏜️",
      tagline: "Resort city · Old Town, golf, and desert design",
      description:
        "A polished Phoenix-area city known for resorts, healthcare, galleries, restaurants, and desert recreation.",
      places: [
        { name: "Old Town Scottsdale", address: "Old Town Scottsdale, Scottsdale, AZ 85251", description: "A walkable district with galleries, restaurants, public art, Western heritage, and nightlife." },
        { name: "Taliesin West", address: "12621 N Frank Lloyd Wright Blvd, Scottsdale, AZ 85259", description: "Frank Lloyd Wright's desert home and studio, now a major architecture landmark and tour site." },
        { name: "McDowell Sonoran Preserve", address: "18333 N Thompson Peak Pkwy, Scottsdale, AZ 85255", description: "A vast desert preserve with scenic trails, cactus landscapes, and mountain viewpoints." },
        { name: "Scottsdale Museum of Contemporary Art", address: "7374 E 2nd St, Scottsdale, AZ 85251", description: "A compact contemporary art, architecture, and design museum in the civic center district." },
      ],
    },
    Tempe: {
      emoji: "🎓",
      tagline: "ASU city · Lakefront, students, and startups",
      description:
        "A central Valley city anchored by Arizona State University, light rail, startup energy, and outdoor access.",
      places: [
        { name: "Tempe Town Lake", address: "Tempe Town Lake, Tempe, AZ 85281", description: "A central lakefront for walking, paddling, rowing, festivals, skyline views, and sunset strolls." },
        { name: "Mill Avenue District", address: "Mill Ave, Tempe, AZ 85281", description: "A lively dining, nightlife, and shopping corridor next to ASU and downtown Tempe." },
        { name: "Hayden Butte Preserve", address: "E Rio Salado Pkwy, Tempe, AZ 85281", description: "A short desert hike with petroglyphs, city views, and a quick climb above downtown." },
        { name: "ASU Art Museum", address: "51 E 10th St, Tempe, AZ 85281", description: "A university art museum with contemporary exhibits, ceramics, and global perspectives." },
      ],
    },
  },
  Washington: {
    Seattle: {
      emoji: "🌲",
      tagline: "Pacific Northwest tech capital · Water, mountains, and culture",
      description:
        "A major tech, healthcare, retail, and university hub with strong Asian and South Asian communities across the metro.",
      places: [
        { name: "Pike Place Market", address: "85 Pike St, Seattle, WA 98101", description: "Seattle's famous public market with fishmongers, flowers, food stalls, crafts, and Elliott Bay views." },
        { name: "Space Needle", address: "400 Broad St, Seattle, WA 98109", description: "The city's signature observation tower with sweeping views of downtown, Puget Sound, and the mountains." },
        { name: "Chihuly Garden and Glass", address: "305 Harrison St, Seattle, WA 98109", description: "A vivid glass-art museum and garden next to Seattle Center and the Space Needle." },
        { name: "Discovery Park", address: "3801 Discovery Park Blvd, Seattle, WA 98199", description: "Seattle's largest park, with forest trails, meadows, bluffs, beaches, and lighthouse views." },
      ],
    },
    Bellevue: {
      emoji: "🏙️",
      tagline: "Eastside tech center · Polished urban-suburban living",
      description:
        "A major Eastside employment center near Microsoft, Amazon offices, high-rise housing, schools, and strong immigrant communities.",
      places: [
        { name: "Bellevue Downtown Park", address: "10201 NE 4th St, Bellevue, WA 98004", description: "A central green loop with lawns, a waterfall, skyline views, and easy access to downtown dining." },
        { name: "Bellevue Botanical Garden", address: "12001 Main St, Bellevue, WA 98005", description: "A free botanical garden with woodland trails, seasonal lights, native plants, and quiet paths." },
        { name: "Meydenbauer Bay Park", address: "9899 Lake Washington Blvd NE, Bellevue, WA 98004", description: "A lakefront park with beach access, paths, boating views, and a polished waterfront setting." },
        { name: "The Bellevue Collection", address: "575 Bellevue Square, Bellevue, WA 98004", description: "A major shopping, dining, hotel, and entertainment complex in downtown Bellevue." },
      ],
    },
    Redmond: {
      emoji: "💻",
      tagline: "Microsoft city · Trails, parks, and Eastside families",
      description:
        "A key Eastside tech city with Microsoft, strong South Asian communities, trail networks, and quieter family neighborhoods.",
      places: [
        { name: "Marymoor Park", address: "6046 West Lake Sammamish Pkwy NE, Redmond, WA 98052", description: "A huge regional park with trails, sports fields, concerts, dog areas, climbing, and lake access nearby." },
        { name: "Downtown Redmond Park", address: "16101 NE Redmond Way, Redmond, WA 98052", description: "A modern urban park with lawns, playgrounds, paths, and quick access to restaurants." },
        { name: "Sammamish River Trail", address: "Sammamish River Trail, Redmond, WA 98052", description: "A popular paved biking and walking trail linking Redmond, Woodinville, and regional parks." },
        { name: "Redmond Town Center", address: "7525 166th Ave NE, Redmond, WA 98052", description: "An open-air shopping and dining center with community events and easy downtown access." },
      ],
    },
    Tacoma: {
      emoji: "🌉",
      tagline: "South Sound city · Museums, port jobs, and waterfront views",
      description:
        "A more affordable Puget Sound city with museums, university campuses, port employment, and access to Mount Rainier.",
      places: [
        { name: "Museum of Glass", address: "1801 Dock St, Tacoma, WA 98402", description: "A waterfront glass-art museum with live hot-shop demonstrations and striking architecture." },
        { name: "Point Defiance Park", address: "5400 N Pearl St, Tacoma, WA 98407", description: "A massive park with zoo, aquarium, gardens, forest trails, beaches, and Puget Sound views." },
        { name: "LeMay - America's Car Museum", address: "2702 E D St, Tacoma, WA 98421", description: "A large car museum with classic, performance, and historic vehicles in a dramatic building." },
        { name: "Ruston Way Waterfront", address: "Ruston Way, Tacoma, WA 98402", description: "A scenic waterfront strip with paths, restaurants, parks, and views across Commencement Bay." },
      ],
    },
  },
  Georgia: {
    Atlanta: {
      emoji: "🍑",
      tagline: "Southeast capital · Tech, film, healthcare, and culture",
      description:
        "A major Southeast metro with strong South Asian, Korean, Chinese, and Latin communities plus fast-growing tech and healthcare sectors.",
      places: [
        { name: "Georgia Aquarium", address: "225 Baker St NW, Atlanta, GA 30313", description: "One of the world's largest aquariums, with whale sharks, belugas, sea lions, and immersive ocean exhibits." },
        { name: "Atlanta BeltLine Eastside Trail", address: "Atlanta BeltLine Eastside Trail, Atlanta, GA 30307", description: "A popular urban trail linking parks, murals, restaurants, markets, and neighborhoods." },
        { name: "Martin Luther King Jr. National Historical Park", address: "450 Auburn Ave NE, Atlanta, GA 30312", description: "A moving historic district preserving Dr. King's birth home area, Ebenezer Baptist Church, and civil-rights landmarks." },
        { name: "Piedmont Park", address: "1320 Monroe Dr NE, Atlanta, GA 30306", description: "Atlanta's central green space with skyline views, lawns, trails, festivals, and access to the botanical garden." },
      ],
    },
    Savannah: {
      emoji: "🌿",
      tagline: "Historic port city · Squares, riverfront, and coastal charm",
      description:
        "A beautiful coastal city with port jobs, tourism, universities, historic architecture, and a distinctive walkable downtown.",
      places: [
        { name: "Forsyth Park", address: "2 W Gaston St, Savannah, GA 31401", description: "Savannah's signature park, known for its fountain, moss-draped oaks, lawns, and shaded walking paths." },
        { name: "Savannah Historic District", address: "Savannah Historic District, Savannah, GA 31401", description: "A walkable grid of historic squares, homes, churches, museums, and atmospheric streets." },
        { name: "River Street", address: "River St, Savannah, GA 31401", description: "A cobblestone waterfront district with shops, restaurants, river views, and preserved warehouse buildings." },
        { name: "Bonaventure Cemetery", address: "330 Bonaventure Rd, Savannah, GA 31404", description: "A hauntingly beautiful cemetery with sculptures, live oaks, and Southern Gothic atmosphere." },
      ],
    },
    Alpharetta: {
      emoji: "🎶",
      tagline: "North Atlanta suburb · Tech offices and polished weekends",
      description:
        "A major North Fulton suburb popular with immigrant families, tech workers, and professionals seeking schools, parks, and restaurants.",
      places: [
        { name: "Avalon", address: "400 Avalon Blvd, Alpharetta, GA 30009", description: "A polished open-air district with dining, shopping, events, cinema, and weekend energy." },
        { name: "Downtown Alpharetta", address: "2 Park Plaza, Alpharetta, GA 30009", description: "A walkable downtown with restaurants, public art, local shops, and community events." },
        { name: "Ameris Bank Amphitheatre", address: "2200 Encore Pkwy, Alpharetta, GA 30009", description: "A major outdoor concert venue drawing national touring acts through spring, summer, and fall." },
        { name: "Big Creek Greenway", address: "Big Creek Greenway, Alpharetta, GA 30005", description: "A paved trail through wooded wetlands, popular for biking, running, and family walks." },
      ],
    },
    Duluth: {
      emoji: "🥢",
      tagline: "Gwinnett hub · Korean, South Asian, and family communities",
      description:
        "A diverse northeast Atlanta suburb known for Korean restaurants, South Asian businesses, community events, and family neighborhoods.",
      places: [
        { name: "Duluth Town Green", address: "3167 Main St, Duluth, GA 30096", description: "A central gathering space for concerts, festivals, food events, and downtown community life." },
        { name: "Gas South District", address: "6400 Sugarloaf Pkwy, Duluth, GA 30097", description: "A major arena, convention, and performing-arts complex hosting concerts, sports, expos, and cultural shows." },
        { name: "Shorty Howell Park", address: "2750 Pleasant Hill Rd, Duluth, GA 30096", description: "A large local park with trails, fields, playgrounds, a lake, and picnic areas." },
        { name: "Southeastern Railway Museum", address: "3595 Buford Hwy, Duluth, GA 30096", description: "Georgia's official transportation history museum, with vintage trains, buses, and family-friendly exhibits." },
      ],
    },
  },
  Tennessee: {
    Nashville: {
      emoji: "🎸",
      tagline: "Music City · Healthcare, universities, and creative growth",
      description:
        "A booming metro anchored by healthcare, universities, music, tech growth, and increasingly diverse immigrant communities.",
      places: [
        { name: "Country Music Hall of Fame and Museum", address: "222 Rep. John Lewis Way S, Nashville, TN 37203", description: "A major museum tracing country music history through recordings, instruments, costumes, and stories." },
        { name: "Centennial Park and The Parthenon", address: "2500 West End Ave, Nashville, TN 37203", description: "A large city park centered on a full-scale Parthenon replica and lake paths." },
        { name: "Ryman Auditorium", address: "116 5th Ave N, Nashville, TN 37219", description: "A legendary music venue known as the Mother Church of Country Music, with tours and concerts." },
        { name: "John Seigenthaler Pedestrian Bridge", address: "Nashville, TN 37213", description: "A downtown bridge with one of the best skyline views over the Cumberland River." },
      ],
    },
    Memphis: {
      emoji: "🎷",
      tagline: "Blues city · Logistics, medicine, and river history",
      description:
        "A Mississippi River hub with FedEx, healthcare, music heritage, barbecue, civil-rights history, and logistics careers.",
      places: [
        { name: "Graceland", address: "3764 Elvis Presley Blvd, Memphis, TN 38116", description: "Elvis Presley's famous home and museum complex, one of the most visited music landmarks in the country." },
        { name: "National Civil Rights Museum", address: "450 Mulberry St, Memphis, TN 38103", description: "A powerful museum at the Lorraine Motel, tracing the American civil-rights movement." },
        { name: "Beale Street", address: "Beale St, Memphis, TN 38103", description: "A historic music district known for blues clubs, neon lights, restaurants, and live performances." },
        { name: "Shelby Farms Park", address: "6903 Great View Dr N, Memphis, TN 38134", description: "One of the country's largest urban parks, with lakes, trails, playgrounds, bison, and wide-open recreation." },
      ],
    },
    Knoxville: {
      emoji: "🏞️",
      tagline: "Smokies gateway · University town and outdoor base",
      description:
        "A University of Tennessee city with healthcare, research, affordability, riverfront parks, and quick access to the Great Smoky Mountains.",
      places: [
        { name: "Market Square", address: "Market Square, Knoxville, TN 37902", description: "A lively downtown square with restaurants, events, shops, patios, and local festivals." },
        { name: "World's Fair Park", address: "525 Worlds Fair Park Dr, Knoxville, TN 37916", description: "A downtown park built from the 1982 World's Fair grounds, centered around the Sunsphere." },
        { name: "Ijams Nature Center", address: "2915 Island Home Ave, Knoxville, TN 37920", description: "A large urban nature center with trails, quarry views, climbing, paddling, and family programs." },
        { name: "Great Smoky Mountains National Park", address: "Great Smoky Mountains National Park, Gatlinburg, TN 37738", description: "America's most visited national park, close enough for day trips to mountain roads, hikes, and scenic overlooks." },
      ],
    },
    Chattanooga: {
      emoji: "🚋",
      tagline: "River city · Trails, startups, and mountain scenery",
      description:
        "A scenic city on the Tennessee River with outdoor access, fiber-backed startup culture, healthcare, and a growing downtown.",
      places: [
        { name: "Tennessee Aquarium", address: "1 Broad St, Chattanooga, TN 37402", description: "A standout riverfront aquarium with freshwater and ocean buildings, IMAX, and strong family appeal." },
        { name: "Lookout Mountain", address: "Lookout Mountain, Chattanooga, TN 37409", description: "A scenic mountain area with overlooks, trails, and classic attractions above the city." },
        { name: "Walnut Street Bridge", address: "1 Walnut St, Chattanooga, TN 37403", description: "A pedestrian bridge connecting downtown with North Shore restaurants, parks, and river views." },
        { name: "Coolidge Park", address: "150 River St, Chattanooga, TN 37405", description: "A riverfront park with lawns, a historic carousel, splash fountain, and bridge access." },
      ],
    },
  },
  Massachusetts: {
    Boston: {
      emoji: "🦞",
      tagline: "New England capital · Biotech, universities, and history",
      description:
        "A global education, healthcare, biotech, finance, and research hub with dense transit and deep immigrant neighborhoods.",
      places: [
        { name: "Freedom Trail", address: "Freedom Trail, Boston, MA 02108", description: "A 2.5-mile historic walking route linking Boston Common, Faneuil Hall, Paul Revere House, Old North Church, and more." },
        { name: "Museum of Fine Arts, Boston", address: "465 Huntington Ave, Boston, MA 02115", description: "One of the country's major art museums, with global collections, special exhibitions, and a large campus." },
        { name: "Boston Public Garden", address: "4 Charles St, Boston, MA 02116", description: "A classic city garden with lagoon views, swan boats, monuments, and seasonal flowers." },
        { name: "New England Aquarium", address: "1 Central Wharf, Boston, MA 02110", description: "A waterfront aquarium with a central ocean tank, penguins, harbor views, and whale-watch departures nearby." },
      ],
    },
    Cambridge: {
      emoji: "🎓",
      tagline: "University city · Harvard, MIT, and innovation",
      description:
        "A dense, walkable city anchored by Harvard, MIT, biotech, startups, transit, bookstores, and global student communities.",
      places: [
        { name: "Harvard Square", address: "Harvard Square, Cambridge, MA 02138", description: "A historic university district with bookstores, cafes, theaters, street life, and easy campus access." },
        { name: "Harvard Art Museums", address: "32 Quincy St, Cambridge, MA 02138", description: "Three Harvard collections under one roof, with European, Asian, Islamic, and modern art." },
        { name: "MIT Museum", address: "314 Main St, Cambridge, MA 02142", description: "A science, technology, robotics, design, and innovation museum in Kendall Square." },
        { name: "Charles River Esplanade", address: "Charles River Esplanade, Boston, MA 02116", description: "A riverside greenway for walks, biking, skyline views, and relaxed evenings near Cambridge and Boston." },
      ],
    },
    Worcester: {
      emoji: "🏙️",
      tagline: "Central Mass hub · Medicine, colleges, and affordability",
      description:
        "A growing Central Massachusetts city with hospitals, universities, biotech, commuter access, and a lower cost than Boston.",
      places: [
        { name: "Worcester Art Museum", address: "55 Salisbury St, Worcester, MA 01609", description: "A respected art museum with armor, mosaics, European works, American art, and rotating exhibitions." },
        { name: "EcoTarium", address: "222 Harrington Way, Worcester, MA 01604", description: "A family-friendly science and nature museum with exhibits, trails, wildlife, and planetarium programming." },
        { name: "Polar Park", address: "100 Madison St, Worcester, MA 01608", description: "A modern downtown baseball park and home of the Worcester Red Sox." },
        { name: "Tower Hill Botanic Garden", address: "11 French Dr, Boylston, MA 01505", description: "A nearby garden campus with trails, conservatories, views, and seasonal displays." },
      ],
    },
    Lowell: {
      emoji: "🏭",
      tagline: "Merrimack Valley city · Mills, universities, and immigrant roots",
      description:
        "A historic mill city with UMass Lowell, healthcare, engineering, Cambodian and South Asian communities, and commuter access.",
      places: [
        { name: "Lowell National Historical Park", address: "246 Market St, Lowell, MA 01852", description: "A national park interpreting America's textile-mill history through canals, museums, preserved mills, and tours." },
        { name: "Boott Cotton Mills Museum", address: "115 John St, Lowell, MA 01852", description: "A preserved textile mill museum with working looms and exhibits on labor, immigration, and industry." },
        { name: "Lowell-Dracut-Tyngsboro State Forest", address: "Trotting Park Rd, Lowell, MA 01854", description: "A wooded escape for trails, biking, ponds, and quiet outdoor time near the city." },
        { name: "Tsongas Center", address: "300 Arcand Dr, Lowell, MA 01852", description: "A university arena for hockey, concerts, graduations, and community events." },
      ],
    },
  },
};

const ADDITIONAL_PLACES = {
  Texas: {
    Houston: [
      { name: "The Menil Collection", address: "1533 Sul Ross St, Houston, TX 77006", description: "A calm, free art museum campus in Montrose with modern art, surrealism, antiquities, and quiet green lawns." },
    ],
    Dallas: [
      { name: "Dallas Museum of Art", address: "1717 N Harwood St, Dallas, TX 75201", description: "A major downtown art museum in the Arts District with global collections, free general admission, and family programs." },
    ],
    Austin: [
      { name: "Lady Bird Lake Hike and Bike Trail", address: "Ann and Roy Butler Hike and Bike Trail, Austin, TX 78704", description: "Austin's signature urban loop for skyline views, kayaking, running, biking, and relaxed evenings by the water." },
    ],
    "San Antonio": [
      { name: "Japanese Tea Garden", address: "3853 N St Mary's St, San Antonio, TX 78212", description: "A free historic garden with stone bridges, koi ponds, waterfalls, and shaded paths near Brackenridge Park." },
    ],
    "Fort Worth": [
      { name: "Modern Art Museum of Fort Worth", address: "3200 Darnell St, Fort Worth, TX 76107", description: "A striking Tadao Ando-designed museum with postwar and contemporary art reflected in serene pools." },
    ],
    Plano: [
      { name: "Heritage Farmstead Museum", address: "1900 W 15th St, Plano, TX 75075", description: "A preserved Blackland Prairie farmstead with historic buildings, animals, and family-friendly local history." },
      { name: "The Boardwalk at Granite Park", address: "5880 State Hwy 121, Plano, TX 75024", description: "A relaxed waterfront dining district with patios, trails, and easy evening hangouts near Legacy and Frisco." },
    ],
  },
  California: {
    "San Jose": [
      { name: "Municipal Rose Garden", address: "1649 Naglee Ave, San Jose, CA 95126", description: "A peaceful neighborhood landmark with thousands of rose bushes, lawns, and easy picnic space." },
    ],
    "Los Angeles": [
      { name: "Santa Monica Pier", address: "200 Santa Monica Pier, Santa Monica, CA 90401", description: "A classic Southern California stop with ocean views, rides, street performers, and an easy beach walk." },
    ],
    "San Francisco": [
      { name: "Palace of Fine Arts", address: "3601 Lyon St, San Francisco, CA 94123", description: "A grand domed landmark with lagoon paths, architecture, and one of the city's most photogenic settings." },
    ],
    Fremont: [
      { name: "Coyote Hills Regional Park", address: "8000 Patterson Ranch Rd, Fremont, CA 94555", description: "Bayfront hills, marsh trails, wildlife viewing, and sweeping views across the South Bay." },
    ],
    "San Diego": [
      { name: "Cabrillo National Monument", address: "1800 Cabrillo Memorial Dr, San Diego, CA 92106", description: "A coastal national monument with tide pools, lighthouse views, military history, and sweeping bay panoramas." },
      { name: "Coronado Beach", address: "Coronado Beach, Coronado, CA 92118", description: "A broad, sparkling beach near Hotel del Coronado, ideal for family walks, sunsets, and classic San Diego views." },
    ],
    Irvine: [
      { name: "Crystal Cove State Park", address: "8471 N Coast Hwy, Laguna Beach, CA 92651", description: "A nearby coastal park with tide pools, bluff trails, historic cottages, and some of Orange County's best ocean scenery." },
      { name: "San Joaquin Wildlife Sanctuary", address: "5 Riparian View, Irvine, CA 92612", description: "A quiet wetland preserve with flat trails, birdwatching, ponds, and peaceful views close to the city." },
    ],
  },
  "North Carolina": {
    Raleigh: [
      { name: "Marbles Kids Museum", address: "201 E Hargett St, Raleigh, NC 27601", description: "A hands-on downtown children's museum with creative play zones, exhibits, and an IMAX theater next door." },
    ],
    Charlotte: [
      { name: "Discovery Place Science", address: "301 N Tryon St, Charlotte, NC 28202", description: "A hands-on science museum in Uptown with experiments, live demos, an aquarium area, and family-friendly exhibits." },
    ],
    Durham: [
      { name: "Eno River State Park", address: "6101 Cole Mill Rd, Durham, NC 27705", description: "A wooded river park with trails, swimming holes, suspension bridges, and a quiet escape from the Triangle." },
    ],
    Cary: [
      { name: "Page-Walker Arts & History Center", address: "119 Ambassador Loop, Cary, NC 27513", description: "A restored 1868 hotel turned arts and history center near downtown Cary and the park." },
      { name: "Cary Arts Center", address: "101 Dry Ave, Cary, NC 27511", description: "A community arts venue with performances, galleries, classes, and a historic school-building setting." },
    ],
    Greensboro: [
      { name: "Guilford Courthouse National Military Park", address: "2332 New Garden Rd, Greensboro, NC 27410", description: "A Revolutionary War battlefield with walking trails, monuments, and a visitor center." },
      { name: "Bog Garden at Benjamin Park", address: "1101 Hobbs Rd, Greensboro, NC 27410", description: "A quiet wetland garden with elevated boardwalks, streams, birds, and shaded paths." },
    ],
  },
  Florida: {
    Miami: [
      { name: "Perez Art Museum Miami", address: "1103 Biscayne Blvd, Miami, FL 33132", description: "A waterfront contemporary art museum with hanging gardens, bay views, and strong Latin American collections." },
      { name: "Fairchild Tropical Botanic Garden", address: "10901 Old Cutler Rd, Coral Gables, FL 33156", description: "A lush tropical garden with palms, orchids, rainforest paths, butterflies, and peaceful family walks." },
    ],
    Orlando: [
      { name: "Kennedy Space Center Visitor Complex", address: "Space Commerce Way, Merritt Island, FL 32953", description: "A top day trip from Orlando with rockets, shuttle exhibits, launch history, and astronaut experiences." },
      { name: "ICON Park", address: "8375 International Dr, Orlando, FL 32819", description: "An International Drive entertainment district with The Wheel, restaurants, museums, and evening lights." },
    ],
    Tampa: [
      { name: "ZooTampa at Lowry Park", address: "1101 W Sligh Ave, Tampa, FL 33604", description: "A popular family zoo with Florida wildlife, primates, big cats, manatees, rides, and shaded paths." },
      { name: "Tampa Museum of Art", address: "120 W Gasparilla Plaza, Tampa, FL 33602", description: "A riverfront museum with classical antiquities, modern art, photography, and downtown views." },
    ],
    Jacksonville: [
      { name: "MOSH - Museum of Science & History", address: "1025 Museum Cir, Jacksonville, FL 32207", description: "A family-friendly science and local-history museum on the Southbank Riverwalk." },
      { name: "Kathryn Abbey Hanna Park", address: "500 Wonderwood Dr, Jacksonville, FL 32233", description: "A coastal park with beach access, wooded trails, camping, lakes, and mountain-bike paths." },
    ],
    "Fort Lauderdale": [
      { name: "Museum of Discovery and Science", address: "401 SW 2nd St, Fort Lauderdale, FL 33312", description: "A hands-on science museum with aviation, ecology, otters, weather exhibits, and an IMAX theater." },
      { name: "Riverwalk Fort Lauderdale", address: "888 E Las Olas Blvd, Fort Lauderdale, FL 33301", description: "A landscaped downtown walkway along the New River, linking parks, arts venues, restaurants, and boats." },
    ],
  },
  "District of Columbia": {
    Washington: [
      { name: "National Air and Space Museum", address: "600 Independence Ave SW, Washington, DC 20560", description: "A Smithsonian favorite with aircraft, spacecraft, aviation history, and hands-on discovery for all ages." },
      { name: "National Gallery of Art", address: "Constitution Ave NW, Washington, DC 20565", description: "A free world-class art museum with East and West buildings, sculpture garden, and masterpieces across centuries." },
    ],
  },
  Virginia: {
    Arlington: [
      { name: "US Marine Corps War Memorial", address: "Arlington Blvd and Meade St, Arlington, VA 22209", description: "The famous Iwo Jima memorial with wide views toward the National Mall and evening monument lights." },
      { name: "Gravelly Point", address: "George Washington Memorial Pkwy, Arlington, VA 22202", description: "A Potomac-side park where planes fly dramatically overhead on approach to Reagan National Airport." },
    ],
    Alexandria: [
      { name: "Carlyle House Historic Park", address: "121 N Fairfax St, Alexandria, VA 22314", description: "An 18th-century Georgian mansion and garden that anchors Old Town's colonial history." },
      { name: "Huntley Meadows Park", address: "3701 Lockheed Blvd, Alexandria, VA 22306", description: "A large wetland preserve with boardwalks, wildlife, photography spots, and peaceful trails." },
    ],
    Richmond: [
      { name: "Virginia State Capitol", address: "1000 Bank St, Richmond, VA 23218", description: "A Thomas Jefferson-designed capitol with historic chambers, grounds, and guided tours." },
      { name: "Hollywood Cemetery", address: "412 S Cherry St, Richmond, VA 23220", description: "A dramatic garden cemetery overlooking the James River, known for history, sculpture, and skyline views." },
    ],
    "Virginia Beach": [
      { name: "Virginia Aquarium & Marine Science Center", address: "717 General Booth Blvd, Virginia Beach, VA 23451", description: "Marine exhibits, sea turtles, sharks, marsh trails, boat trips, and a strong rainy-day family option." },
      { name: "Back Bay National Wildlife Refuge", address: "4005 Sandpiper Rd, Virginia Beach, VA 23456", description: "Protected dunes, marshes, beaches, and wildlife habitat at the quieter southern end of Virginia Beach." },
    ],
    Fairfax: [
      { name: "Wolf Trap National Park for the Performing Arts", address: "1551 Trap Rd, Vienna, VA 22182", description: "A nearby national park dedicated to live performance, with concerts, lawn seating, and wooded grounds." },
      { name: "Meadowlark Botanical Gardens", address: "9750 Meadowlark Gardens Ct, Vienna, VA 22182", description: "A scenic garden with lakes, walking paths, gazebos, native plants, and seasonal light displays." },
    ],
  },
  Maryland: {
    Baltimore: [
      { name: "American Visionary Art Museum", address: "800 Key Hwy, Baltimore, MD 21230", description: "A distinctive museum celebrating self-taught artists, bold installations, mosaics, and playful architecture." },
      { name: "The Walters Art Museum", address: "600 N Charles St, Baltimore, MD 21201", description: "A free museum with global art, armor, manuscripts, Asian collections, and elegant historic galleries." },
    ],
    Rockville: [
      { name: "Beall-Dawson Museum", address: "103 W Montgomery Ave, Rockville, MD 20850", description: "A local-history museum in a preserved 19th-century home near Rockville Town Center." },
      { name: "Croydon Creek Nature Center", address: "852 Avery Rd, Rockville, MD 20851", description: "A small nature center with trails, wildlife exhibits, and wooded family walks." },
    ],
    "Silver Spring": [
      { name: "National Museum of Health and Medicine", address: "2500 Linden Ln, Silver Spring, MD 20910", description: "A fascinating medical-history museum with military medicine, anatomy, and pathology collections." },
      { name: "Wheaton Regional Park", address: "2000 Shorefield Rd, Wheaton, MD 20902", description: "A large nearby park with trails, gardens, playgrounds, train rides, and picnic areas." },
    ],
    Columbia: [
      { name: "The Mall in Columbia", address: "10300 Little Patuxent Pkwy, Columbia, MD 21044", description: "A central shopping and dining destination beside Columbia's lakefront and downtown district." },
      { name: "Lake Elkhorn Park", address: "7200 Dockside Ln, Columbia, MD 21045", description: "A neighborhood favorite with a lake loop trail, boardwalks, playgrounds, and peaceful water views." },
    ],
    Bethesda: [
      { name: "Glen Echo Park", address: "7300 Macarthur Blvd, Glen Echo, MD 20812", description: "A historic arts and culture park with classes, galleries, performances, and a restored carousel." },
      { name: "Bethesda Trolley Trail", address: "Bethesda Trolley Trail, Bethesda, MD 20814", description: "A useful walking and biking path linking Bethesda, North Bethesda, and neighborhood parks." },
    ],
  },
  "New York": {
    "New York City": [
      { name: "Times Square", address: "Times Square, New York, NY 10036", description: "A bright, high-energy Manhattan landmark for first-time visitors, theater nights, photos, and late-evening crowds." },
      { name: "Brooklyn Bridge", address: "Brooklyn Bridge, New York, NY 10038", description: "A classic walk between Manhattan and Brooklyn with skyline, river, and harbor views." },
    ],
    Buffalo: [
      { name: "Buffalo City Hall Observation Deck", address: "65 Niagara Square, Buffalo, NY 14202", description: "A free Art Deco landmark with an observation deck and wide views over downtown, Lake Erie, and Canada." },
      { name: "Buffalo and Erie County Botanical Gardens", address: "2655 South Park Ave, Buffalo, NY 14218", description: "A Victorian glass conservatory with tropical plants, seasonal displays, and peaceful indoor gardens." },
    ],
    Rochester: [
      { name: "Susan B. Anthony Museum & House", address: "17 Madison St, Rochester, NY 14608", description: "The preserved home of the voting-rights leader, with tours focused on reform, suffrage, and local history." },
      { name: "Ontario Beach Park", address: "50 Beach Ave, Rochester, NY 14612", description: "A Lake Ontario beach park with pier walks, a historic carousel, summer events, and sunset views." },
    ],
    Albany: [
      { name: "Albany Institute of History & Art", address: "125 Washington Ave, Albany, NY 12210", description: "One of the country's oldest museums, focused on Hudson Valley art, history, and regional culture." },
      { name: "The Egg", address: "Empire State Plaza, Albany, NY 12220", description: "Albany's distinctive performing-arts venue, instantly recognizable for its sculptural modern shape." },
    ],
  },
  Colorado: {
    Denver: [
      { name: "Denver Botanic Gardens", address: "1007 York St, Denver, CO 80206", description: "A beautiful urban garden campus with themed landscapes, conservatory spaces, art, and seasonal displays." },
      { name: "Meow Wolf Denver", address: "1338 1st St, Denver, CO 80204", description: "A large immersive art experience with surreal rooms, hidden stories, and interactive installations." },
    ],
    Boulder: [
      { name: "Boulder Creek Path", address: "Boulder Creek Path, Boulder, CO 80302", description: "A beloved creekside route for biking, walking, tubing access, and easy downtown-to-nature transitions." },
      { name: "Fiske Planetarium", address: "2414 Regent Dr, Boulder, CO 80309", description: "A University of Colorado planetarium with astronomy shows, laser programs, and science events." },
    ],
    "Colorado Springs": [
      { name: "Seven Falls", address: "1045 Lower Gold Camp Rd, Colorado Springs, CO 80905", description: "A dramatic series of waterfalls in a box canyon, reached by stairs and viewing platforms." },
      { name: "U.S. Olympic & Paralympic Museum", address: "200 S Sierra Madre St, Colorado Springs, CO 80903", description: "A modern museum celebrating Olympic and Paralympic athletes through immersive exhibits." },
    ],
    "Fort Collins": [
      { name: "New Belgium Brewing Company", address: "500 Linden St, Fort Collins, CO 80524", description: "A well-known brewery campus with tours, a lively patio, food trucks, and bike-friendly culture." },
      { name: "Fort Collins Museum of Discovery", address: "408 Mason Ct, Fort Collins, CO 80524", description: "A hands-on museum blending science, music, local history, and family-friendly exhibits." },
    ],
  },
  Arizona: {
    Phoenix: [
      { name: "Camelback Mountain Echo Canyon Trailhead", address: "4925 E McDonald Dr, Phoenix, AZ 85018", description: "A challenging local hike with big city and desert views; best for prepared hikers in cooler hours." },
      { name: "Phoenix Art Museum", address: "1625 N Central Ave, Phoenix, AZ 85004", description: "The Southwest's largest art museum, with American, Asian, Latin American, fashion, and modern collections." },
    ],
    Tucson: [
      { name: "Pima Air & Space Museum", address: "6000 E Valencia Rd, Tucson, AZ 85756", description: "One of the world's largest aviation museums, with hundreds of aircraft across indoor and outdoor exhibits." },
      { name: "Mount Lemmon Scenic Byway", address: "Catalina Hwy, Tucson, AZ 85749", description: "A spectacular drive from desert cactus to pine forest, with overlooks, trails, and cooler mountain air." },
    ],
    Scottsdale: [
      { name: "Scottsdale Fashion Square", address: "7014 E Camelback Rd, Scottsdale, AZ 85251", description: "Arizona's largest upscale shopping center, with restaurants, luxury stores, and easy Old Town access." },
      { name: "Butterfly Wonderland", address: "9500 E Via de Ventura, Scottsdale, AZ 85256", description: "A family-friendly indoor rainforest atrium filled with thousands of butterflies." },
    ],
    Tempe: [
      { name: "ASU Gammage", address: "1200 S Forest Ave, Tempe, AZ 85281", description: "A Frank Lloyd Wright-designed performing-arts venue hosting Broadway tours, concerts, and university events." },
      { name: "Tempe Center for the Arts", address: "700 W Rio Salado Pkwy, Tempe, AZ 85281", description: "A lakeside arts venue for theater, music, dance, exhibitions, and sunset views over Tempe Town Lake." },
    ],
  },
  Washington: {
    Seattle: [
      { name: "Museum of Pop Culture", address: "325 5th Ave N, Seattle, WA 98109", description: "A colorful museum focused on music, film, games, sci-fi, fantasy, and pop-culture storytelling." },
      { name: "Kerry Park", address: "211 W Highland Dr, Seattle, WA 98119", description: "A small Queen Anne viewpoint with the classic Space Needle, downtown, Elliott Bay, and Mount Rainier skyline view." },
    ],
    Bellevue: [
      { name: "Mercer Slough Nature Park", address: "2102 Bellevue Way SE, Bellevue, WA 98004", description: "A large wetland park with boardwalks, trails, canoe routes, and a quiet escape close to downtown." },
      { name: "KidsQuest Children's Museum", address: "1116 108th Ave NE, Bellevue, WA 98004", description: "An interactive children's museum with water play, science, art, and climbing exhibits." },
    ],
    Redmond: [
      { name: "Microsoft Visitor Center", address: "15010 NE 36th St, Redmond, WA 98052", description: "A tech-focused visitor space on Microsoft's campus with company history, products, and interactive displays." },
      { name: "Farrel-McWhirter Farm Park", address: "19545 NE Redmond Rd, Redmond, WA 98053", description: "A working farm park with animals, forest trails, picnic areas, and family programs." },
    ],
    Tacoma: [
      { name: "Washington State History Museum", address: "1911 Pacific Ave, Tacoma, WA 98402", description: "A museum tracing Washington's people, landscapes, railroads, and regional stories." },
      { name: "Tacoma Art Museum", address: "1701 Pacific Ave, Tacoma, WA 98402", description: "A downtown museum known for Northwest art, Western American art, glass, and rotating exhibitions." },
    ],
  },
  Georgia: {
    Atlanta: [
      { name: "World of Coca-Cola", address: "121 Baker St NW, Atlanta, GA 30313", description: "A downtown museum experience about Coca-Cola history, pop culture, bottling, and global soda tastings." },
      { name: "Atlanta Botanical Garden", address: "1345 Piedmont Ave NE, Atlanta, GA 30309", description: "A lush garden beside Piedmont Park with canopy walks, orchids, sculptures, and seasonal lights." },
    ],
    Savannah: [
      { name: "Wormsloe State Historic Site", address: "7601 Skidaway Rd, Savannah, GA 31406", description: "A famous live-oak avenue leading to colonial-era tabby ruins and coastal Georgia history." },
      { name: "Telfair Museums", address: "207 W York St, Savannah, GA 31401", description: "A trio of art and history museums including the Telfair Academy, Owens-Thomas House, and Jepson Center." },
    ],
    Alpharetta: [
      { name: "Wills Park", address: "11925 Wills Rd, Alpharetta, GA 30009", description: "A large community park with trails, playgrounds, sports fields, equestrian areas, and picnic spots." },
      { name: "Alpharetta Walk of Memories", address: "2 Park Plaza, Alpharetta, GA 30009", description: "A downtown memorial honoring U.S. service members, paired well with a walk through Alpharetta City Center." },
    ],
    Duluth: [
      { name: "McDaniel Farm Park", address: "3251 McDaniel Rd, Duluth, GA 30096", description: "A preserved historic farm and park with trails, fields, restored buildings, and quiet wooded paths." },
      { name: "Bunten Road Park", address: "3180 Bunten Rd, Duluth, GA 30096", description: "A family park with sports fields, trails, playgrounds, and community recreation space." },
    ],
  },
  Tennessee: {
    Nashville: [
      { name: "Grand Ole Opry", address: "600 Opry Mills Dr, Nashville, TN 37214", description: "A legendary live-music venue and radio show central to Nashville's music identity." },
      { name: "Cheekwood Estate & Gardens", address: "1200 Forrest Park Dr, Nashville, TN 37205", description: "A historic estate with art exhibitions, botanical gardens, seasonal lights, and family programs." },
    ],
    Memphis: [
      { name: "Sun Studio", address: "706 Union Ave, Memphis, TN 38103", description: "The historic recording studio associated with Elvis, Johnny Cash, B.B. King, and early rock and roll." },
      { name: "Memphis Botanic Garden", address: "750 Cherry Rd, Memphis, TN 38117", description: "A 96-acre garden with themed spaces, a children's garden, lakes, and seasonal displays." },
    ],
    Knoxville: [
      { name: "Zoo Knoxville", address: "3500 Knoxville Zoo Dr, Knoxville, TN 37914", description: "A family-friendly zoo known for red pandas, reptiles, animal encounters, and shaded walking paths." },
      { name: "Tennessee Theatre", address: "604 S Gay St, Knoxville, TN 37902", description: "A beautifully restored 1928 movie palace hosting concerts, Broadway shows, film screenings, and community events." },
    ],
    Chattanooga: [
      { name: "Ruby Falls", address: "1720 S Scenic Hwy, Chattanooga, TN 37409", description: "An underground waterfall inside Lookout Mountain, reached by guided cave tours." },
      { name: "Rock City Gardens", address: "1400 Patten Rd, Lookout Mountain, GA 30750", description: "A classic Lookout Mountain attraction with rock formations, gardens, views, and the famous seven-state overlook." },
    ],
  },
  Massachusetts: {
    Boston: [
      { name: "Faneuil Hall Marketplace", address: "4 S Market St, Boston, MA 02109", description: "A historic marketplace and gathering spot near Quincy Market, street performers, food halls, and the Freedom Trail." },
      { name: "Isabella Stewart Gardner Museum", address: "25 Evans Way, Boston, MA 02115", description: "A Venetian-style palace museum with intimate galleries, courtyard gardens, and an unforgettable atmosphere." },
    ],
    Cambridge: [
      { name: "Mount Auburn Cemetery", address: "580 Mount Auburn St, Cambridge, MA 02138", description: "A beautiful garden cemetery and arboretum with historic monuments, birding, and views from Washington Tower." },
      { name: "Fresh Pond Reservation", address: "250 Fresh Pond Pkwy, Cambridge, MA 02138", description: "A quiet loop trail around Cambridge's reservoir, popular for walks, runs, and dog-friendly outings." },
    ],
    Worcester: [
      { name: "Mechanics Hall", address: "321 Main St, Worcester, MA 01608", description: "A beautifully restored 19th-century concert hall known for acoustics, architecture, and civic events." },
      { name: "Green Hill Park", address: "50 Skyline Dr, Worcester, MA 01605", description: "Worcester's largest park, with trails, ponds, picnic areas, playgrounds, and a small farm." },
    ],
    Lowell: [
      { name: "Whistler House Museum of Art", address: "243 Worthen St, Lowell, MA 01852", description: "The birthplace of artist James McNeill Whistler, now a museum focused on regional and historic art." },
      { name: "Boarding House Park", address: "40 French St, Lowell, MA 01852", description: "An outdoor downtown venue connected to Lowell's festival scene and national park district." },
    ],
  },
};

function withAdditionalPlaces(baseCities) {
  return Object.fromEntries(
    Object.entries(baseCities).map(([stateName, cities]) => [
      stateName,
      Object.fromEntries(
        Object.entries(cities).map(([cityName, city]) => {
          const extras = ADDITIONAL_PLACES[stateName]?.[cityName] || [];
          return [cityName, { ...city, places: [...(city.places || []), ...extras].slice(0, 10) }];
        })
      ),
    ])
  );
}

export const FEATURED_CITIES = withAdditionalPlaces(BASE_FEATURED_CITIES);
