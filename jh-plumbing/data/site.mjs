// JH Plumbing & Heating Gas Services: every fact and word of copy lives here.
// build.mjs turns this into static HTML. Nothing in this file is invented: items the client
// still has to confirm are marked `confirm: true` and listed in docs/CONTENT-CHECKLIST.md.

export const site = {
  name: 'JH Plumbing & Heating Gas Services',
  short: 'JH Plumbing & Heating',
  owner: 'Jim',
  domain: 'https://www.jh-plumbing.co.uk', // from the van artwork. confirm: true
  phone: '07980 309332',
  phoneTel: '+447980309332',
  whatsapp: '447980309332', // confirm: true (assumes this mobile has WhatsApp)
  street: '73 Colne Dr',
  town: 'Romford',
  postcode: 'RM3 9LA',
  geo: { lat: 51.6058, lng: 0.2386 }, // approximate, confirm: true
  rating: '4.9',
  reviewCount: 203,
  reviewsUrl: 'https://www.google.com/maps/search/?api=1&query=JH+Plumbing+%26+Heating+Gas+Services+73+Colne+Dr+Romford+RM3+9LA',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=73+Colne+Dr+Romford+RM3+9LA',
  gasSafeCheck: 'https://www.gassaferegister.co.uk/check-an-engineer/',
  gasSafeNo: '', // confirm: true. When filled in, it is shown on the Gas Safe medallion and in the footer.
  // Opening hours are an assumption: Google shows "Closes 12 am". confirm: true
  hours: { open: 7, close: 24, label: 'Daily, until midnight' },
  plausibleDomain: '', // set to enable privacy-friendly analytics (see docs/LAUNCH-CHECKLIST.md)
  formEndpoint: 'https://formspree.io/f/YOUR_FORM_ID', // replace at launch (see docs)
};
export const addressLine = `${site.street}, ${site.town} ${site.postcode}`;

// ----- Services (quote-led: no prices anywhere) -----
// icon ids match the sprite in build.mjs
export const services = [
  {
    slug: 'boiler-servicing', icon: 'boiler', title: 'Boiler servicing',
    blurb: 'A proper service, explained as it happens. Your boiler checked, cleaned and signed off.',
    h1: ['Boiler servicing,', 'done properly.'],
    intro: 'Most boiler breakdowns start months earlier as something small nobody noticed. A yearly service finds it first. Jim checks, cleans and tests the boiler, tells you what he found in plain English, and leaves the paperwork with you.',
    includes: ['Visual check of the boiler, flue and pipework', 'Gas pressure and combustion checks', 'Safety devices tested', 'Pressure, controls and radiators looked at', 'A clear write-up for your records', 'Honest advice if something is wearing out'],
    signs: ['It is more than a year since the last service', 'Rumbling, banging or error codes', 'Radiators colder than they were', 'You have moved in and never seen a service record'],
    faqs: [['How long does a service take?', 'Usually around an hour for a standard boiler. Older or awkwardly fitted boilers can take a little longer, and Jim will say so before he starts.'], ['What if something needs replacing?', 'You are told what, why and what it costs before anything is done. Nothing gets fitted without your say-so.']],
    reviewTags: ['service'], related: ['boiler-repairs', 'gas-safety-certificates'],
    meta: 'Boiler servicing in Romford and Havering by a Gas Safe registered engineer. Clear explanations, tidy work, free quotes. Call 07980 309332.',
  },
  {
    slug: 'boiler-repairs', icon: 'boiler', title: 'Boiler repairs',
    blurb: 'Hot water and heating back, often the same day. Parts sourced, fault found, fixed.',
    h1: ['No heating?', 'Hot water back today.'],
    intro: 'When the boiler stops, the house stops. Call or WhatsApp us and Jim will talk it through first, because some faults can be sorted from your hallway. If he needs to come out, he will tell you when. Often that is the same day.',
    includes: ['Fault diagnosis, not guesswork', 'Parts sourced at a fair price', 'Pressure, ignition, pump and valve faults', 'Flue and ventilation problems', 'Advice on whether repair still makes sense', 'Boilers including Vaillant and Baxi'],
    signs: ['No heating or no hot water', 'Pressure keeps dropping', 'Error code on the display', 'Leaking from the boiler', 'Rumbling, whistling or banging'],
    faqs: [['Can you fix it the same day?', 'Often, yes. It depends on the fault and whether the part is easy to find. Jim will give you an honest answer on the phone.'], ['Is it worth repairing or should I replace?', 'He will tell you, even if the answer is the cheaper one. Try the repair-or-replace check on this page, or just ask.']],
    reviewTags: ['boiler-repair', 'emergency'], related: ['boiler-installation', 'boiler-servicing'], quiz: true,
    meta: 'Boiler repairs in Romford, often same day. Gas Safe registered engineer who explains the fault before fixing it. Free quotes, call 07980 309332.',
  },
  {
    slug: 'boiler-installation', icon: 'cylinder', title: 'New boilers & conversions',
    blurb: 'The right boiler for your home, not the priciest. Fitted neatly, old one taken away.',
    h1: ['The right boiler,', 'not the priciest one.'],
    intro: 'A new boiler is a big decision, so you get a straight answer: whether you need one at all, which type suits the house, and a fixed quote in writing. Fitting is tidy, the old boiler is removed, and you are shown how everything works before Jim leaves.',
    includes: ['Combi, system and regular boilers', 'Conversions from old systems', 'New pipework and controls where needed', 'Old boiler and unneeded parts removed', 'Smart thermostat fitting', 'A written quote before anything starts'],
    signs: ['Your boiler keeps failing', 'Parts are hard to find', 'Heating bills creeping up', 'You are converting or extending'],
    faqs: [['How quickly can a boiler be fitted?', 'One customer had a new boiler in less than 24 hours after getting in touch. It depends on the job and stock, and Jim will give you a realistic date.'], ['Do you offer finance?', 'Ask when you call. We will not promise something we have not confirmed.']],
    reviewTags: ['new-boiler'], related: ['boiler-repairs', 'radiators-and-heating'], quiz: true,
    meta: 'New boiler fitting and conversions in Romford. Honest advice on combi or system, tidy installation, written quote. Call 07980 309332.',
  },
  {
    slug: 'gas-safety-certificates', icon: 'stopcock', title: 'Landlord gas safety certificates',
    blurb: 'Annual gas safety checks and certificates for landlords, done thoroughly with paperwork supplied.',
    h1: ['Landlord gas safety,', 'sorted and signed off.'],
    intro: 'If you let a property with gas appliances, you need a gas safety check every year. Jim carries these out for landlords and homeowners, leaves you proper paperwork, and flags anything that needs attention before it becomes a tenant complaint.',
    includes: ['Gas appliance and flue checks', 'Gas Safe certificate with supporting paperwork', 'Clear list of any defects', 'Repairs quoted separately and fairly', 'Reminders-friendly records for next year'],
    signs: ['Your certificate is about to expire', 'You have just bought a rental', 'A new tenant is moving in', 'You are unsure what is covered'],
    faqs: [['How often is a gas safety check needed?', 'Every 12 months for rented homes. Book a few weeks before the expiry date so there is time to fix anything found.'], ['Do you do tenanted properties?', 'Yes. Call to arrange access and Jim will work around the tenant.']],
    reviewTags: ['landlord'], related: ['boiler-servicing', 'boiler-repairs'],
    meta: 'Landlord gas safety certificates in Romford and Havering from a Gas Safe registered engineer. Thorough checks, proper paperwork. Free quotes.',
  },
  {
    slug: 'radiators-and-heating', icon: 'radiator', title: 'Radiators & heating',
    blurb: 'New radiators, power flushing, valves and smart thermostats. Warm rooms, even heat.',
    h1: ['Warm in every room,', 'not just by the boiler.'],
    intro: 'Cold spots, noisy pipes and slow heat-up usually have a simple cause. Jim fits new and designer radiators, power flushes tired systems, replaces valves and installs smart thermostats, and leaves the house as he found it.',
    includes: ['Radiator replacement, including designer radiators', 'Power flushing', 'Thermostatic valves and controls', 'Smart thermostat fitting', 'Balancing and bleeding', 'System checks before winter'],
    signs: ['Radiators cold at the bottom or top', 'Heating takes ages to warm up', 'Rust-coloured water', 'You want a smart thermostat'],
    faqs: [['What is a power flush?', 'A deep clean of the heating system to clear sludge and blockages. It is worth doing when radiators have cold patches or the system is slow.'], ['Can you fit a designer radiator?', 'Yes. Customers have had them fitted, with the valve, to a high standard.']],
    reviewTags: ['radiators'], related: ['boiler-servicing', 'boiler-installation'],
    meta: 'Radiator fitting, power flushing and smart thermostats in Romford. Tidy, honest, fairly quoted. Call 07980 309332.',
  },
  {
    slug: 'leaks-and-emergencies', icon: 'leak', title: 'Leaks & emergency call-outs',
    blurb: 'Burst pipe? Water where it should not be? Call now. Jim is often there within the hour.',
    h1: ['Water where it should not be?', 'Call now.'],
    intro: 'Leaks do not wait for office hours and neither does Jim. Turn the water off at the stopcock if you can, then call. Several customers have had him with them in 15 to 30 minutes. He fixes the leak, then puts the cupboards back and clears up.',
    includes: ['Leaking and burst pipes', 'Under-sink and appliance leaks', 'Leaking boilers and radiators', 'Cracked tanks and cylinders', 'Evenings, weekends and bank holidays', 'Honest fixed price before the work starts'],
    signs: ['Water through a ceiling', 'A pipe spraying or dripping', 'A damp patch growing', 'Water bill suddenly high'],
    faqs: [['What should I do first?', 'Turn off the water at the stopcock, switch off the boiler if the leak is near it, catch drips with a bowl or towels, and keep electrics away from water. Our emergency page walks through each step.'], ['Do you work evenings and weekends?', 'Yes. Customers have called on New Year’s Day and Easter weekend. Call and Jim will tell you when he can be there.']],
    reviewTags: ['emergency', 'leak'], related: ['taps-toilets-showers', 'boiler-repairs'],
    meta: 'Emergency plumber in Romford for leaks and burst pipes. Often there within the hour, evenings and weekends. Call 07980 309332.',
  },
  {
    slug: 'taps-toilets-showers', icon: 'tap', title: 'Taps, toilets & showers',
    blurb: 'Dripping tap, running toilet, weak shower? Repaired or replaced, neatly and quickly.',
    h1: ['Small jobs,', 'big difference.'],
    intro: 'A dripping tap or a shower that has gone weak is not an emergency, but it is wearing. Jim repairs or replaces taps, toilets, showers and basins, and customers say he turns up on time, does it without fuss and tells them what to buy if they ask.',
    includes: ['Tap repair and replacement', 'Toilet repair and replacement', 'Shower repair and fitting', 'Basins, valves and isolation valves', 'Advice on what to buy', 'No mess left behind'],
    signs: ['A tap that will not stop dripping', 'A toilet that keeps running', 'Shower pressure has dropped', 'Water under the sink'],
    faqs: [['Can I buy the tap myself?', 'Yes, or Jim can advise on a good one. Many customers have had him guide them on what to choose.'], ['Will you fit appliances too?', 'Yes. Washing machines, dishwashers, cookers and ovens are fitted and tested.']],
    reviewTags: ['taps', 'toilet', 'shower', 'appliance'], related: ['bathrooms-and-kitchens', 'leaks-and-emergencies'],
    meta: 'Tap, toilet and shower repair and fitting in Romford. Neat, on time, fairly quoted. Call 07980 309332.',
  },
  {
    slug: 'bathrooms-and-kitchens', icon: 'shower', title: 'Bathrooms & kitchens',
    blurb: 'Plumbing for new bathrooms, cloakrooms and kitchens. Reliable, clean and tidy.',
    h1: ['A bathroom you will', 'enjoy for years.'],
    intro: 'From a small cloakroom refit to a full new bathroom or kitchen, Jim handles the plumbing and heating side and keeps the project moving. Customers describe him as reliable, never late and clean and tidy. You can leave him to it while you are out.',
    includes: ['Bathroom and cloakroom fitting', 'Kitchen plumbing', 'Pipework and drainage changes', 'Showers, basins, toilets and baths', 'Radiators and heated towel rails', 'A written quote after a free visit'],
    signs: ['Planning a new bathroom or kitchen', 'Moving the sink or appliances', 'Drainage that needs relocating', 'An old suite at the end of its life'],
    faqs: [['Do you do the tiling?', 'Ask when you call. Jim will tell you plainly what he does and what to have a specialist for.'], ['Will you quote for the whole job?', 'Yes. A free visit, then a written quote so you know where you stand.']],
    reviewTags: ['bathroom', 'drainage'], related: ['taps-toilets-showers', 'radiators-and-heating'],
    meta: 'Bathroom and kitchen plumbing in Romford. Clean, tidy and reliable with written quotes. Call 07980 309332.',
  },
];

// ----- Towns (each with its own copy, not duplicated) -----
export const towns = [
  { slug: 'romford', name: 'Romford', x: 52, y: 52, near: true, area: 'RM1, RM2, RM7',
    lead: 'Romford is home turf. Jim is based on Colne Drive, so a boiler breakdown near the town centre or the station is a short drive away.',
    body: 'Between the market town centre and the quieter streets either side of it, the housing is a mix of Victorian terraces, interwar semis and newer flats. That means everything from old lead and galvanised pipework to modern sealed systems. Customers here tend to ring about heating that has stopped, boilers that need a yearly service and leaks that cannot wait.',
    tip: 'Landlords with flats near the centre often book gas safety checks and boiler servicing together to save a second visit.' },
  { slug: 'harold-hill', name: 'Harold Hill', x: 72, y: 36, near: true, area: 'RM3',
    lead: 'We are based in RM3, so Harold Hill, Harold Wood and the streets around them are as local as it gets.',
    body: 'Much of this area was built after the war, and many homes have had their heating updated more than once. That makes it common to find mixed pipework, older radiators and boilers that were fitted around awkward corners. Jim is used to working with all of it, and used to explaining it simply.',
    tip: 'If your boiler is tucked away in an airing cupboard or a tight kitchen run, mention it when you call. It helps Jim bring the right parts.' },
  { slug: 'gidea-park', name: 'Gidea Park', x: 56, y: 66, near: true, area: 'RM2',
    lead: 'Gidea Park is a short hop from base, and its characterful homes deserve careful work.',
    body: 'Many houses in Gidea Park are larger, older and more individual, with extended kitchens and loft conversions on top of original pipework. Heating upgrades, designer radiators and bathroom refits are typical requests, where tidy workmanship and respect for the property matter most.',
    tip: 'Planning a refit? Book a free visit first, so the plumbing is planned around your design rather than squeezed in at the end.' },
  { slug: 'collier-row', name: 'Collier Row', x: 30, y: 34, near: true, area: 'RM5',
    lead: 'Collier Row sits just up the road, so boiler repairs and leaks here can often be seen to quickly.',
    body: 'Collier Row has plenty of 1930s and 1950s semis, which are well suited to combi conversions and new radiator runs. Families here call for boiler servicing before winter, tap and shower repairs, and the occasional emergency when something fails on a weekend.',
    tip: 'A yearly service is the cheapest way to avoid an out-of-hours breakdown in January.' },
  { slug: 'hornchurch', name: 'Hornchurch', x: 68, y: 80, near: false, area: 'RM11, RM12',
    lead: 'Hornchurch and Elm Park are comfortably within reach for repairs, servicing and larger projects.',
    body: 'From period properties near the town centre to rows of family homes further out, Hornchurch calls on Jim for boiler replacements, bathroom plumbing and landlord gas safety checks. For planned work he will agree a day that suits you, and for urgent faults he will tell you honestly how soon he can get there.',
    tip: 'For planned jobs, a morning slot is usually easy to arrange. Ask when you call.' },
  { slug: 'upminster', name: 'Upminster', x: 83, y: 55, near: false, area: 'RM14',
    lead: 'Upminster customers get the same careful service: clear quotes, neat work and no unnecessary extras.',
    body: 'Larger family homes and detached properties here often have bigger heating systems, more bathrooms and more radiators to look after. Servicing, power flushing and system upgrades are frequent requests, and Jim is glad to talk through options before you commit to anything.',
    tip: 'With more radiators to balance, a power flush can make a visible difference to how evenly the house heats.' },
  { slug: 'rainham', name: 'Rainham', x: 82, y: 92, near: false, area: 'RM13',
    lead: 'Rainham is covered for emergencies, repairs, servicing and new installations.',
    body: 'Rainham mixes new-build developments with older streets, so one week it is a modern combi that needs a check and the next it is a leaking pipe in an older house. Whatever the age of the system, the approach is the same: find the real fault, explain it and price it fairly.',
    tip: 'If you have a new-build boiler under warranty, call us anyway. Jim will say if the manufacturer should be involved first.' },
  { slug: 'dagenham', name: 'Dagenham', x: 32, y: 86, near: false, area: 'RM8, RM9, RM10',
    lead: 'We cover Dagenham for boiler work, leaks, bathrooms and landlord gas safety.',
    body: 'Many Dagenham homes are interwar cottages and terraces with decades of repairs behind them. That is where Jim’s habit of looking properly before quoting really matters, because awkward boiler positions and mixed pipework are the norm rather than the exception.',
    tip: 'Photos help. WhatsApp a picture of the boiler or leak and Jim can often tell what he needs to bring.' },
  { slug: 'brentwood', name: 'Brentwood', x: 74, y: 12, near: false, area: 'CM13, CM14, CM15',
    lead: 'Brentwood is within our wider area for planned work, servicing and installations.',
    body: 'For bigger planned jobs like a boiler replacement or bathroom, distance is rarely an issue: Jim agrees a day that suits you and comes properly equipped. For urgent leaks, call first so he can tell you realistically how soon he can attend.',
    tip: 'Planning a boiler replacement? Ask for a visit and written quote so you can compare like for like.' },
];

// ----- Problem Finder (hotspots in the house cutaway) -----
export const problems = [
  { room: 'kitchen', label: 'Dripping tap', service: 'taps-toilets-showers', likely: 'Usually a worn washer or cartridge. Sometimes the tap itself has had its day.', check: 'The tap body, the cartridge and the isolation valve underneath.', speed: 'Often within a day or two.' },
  { room: 'kitchen', label: 'Leak under the sink', service: 'leaks-and-emergencies', likely: 'A loose compression joint, a failed waste connection or a pipe that has corroded.', check: 'Every joint under the sink, the supply pipes and the appliance connections.', speed: 'Often same day. Turn off the water first.' },
  { room: 'kitchen', label: 'Slow or blocked drain', service: 'bathrooms-and-kitchens', likely: 'A partial blockage, or a waste pipe that was laid with too little fall.', check: 'Traps, waste runs and where the pipe joins the main drain.', speed: 'Depends on the cause. Call and Jim will advise.' },
  { room: 'bathroom', label: 'Running toilet', service: 'taps-toilets-showers', likely: 'A worn flush valve or float, quick to fix and wasteful if left.', check: 'Cistern fittings, supply valve and the pan connection.', speed: 'Often within a day or two.' },
  { room: 'bathroom', label: 'Weak shower', service: 'taps-toilets-showers', likely: 'Limescale in the head or cartridge, a failing valve or low system pressure.', check: 'Shower head, mixer valve and supply pressure.', speed: 'Often within a day or two.' },
  { room: 'bathroom', label: 'Planning a new bathroom', service: 'bathrooms-and-kitchens', likely: 'You are planning ahead. A free visit is the right first step.', check: 'Pipe runs, drainage, space and how everything will connect.', speed: 'Free visit, then a written quote.' },
  { room: 'boiler', label: 'No heating or hot water', service: 'boiler-repairs', likely: 'Often a failed part, a pressure fault or a blocked condensate pipe.', check: 'Error codes, pressure, ignition, pump and condensate pipe.', speed: 'Often same day. Call so Jim can talk it through.' },
  { room: 'boiler', label: 'Low pressure', service: 'boiler-repairs', likely: 'A small leak somewhere in the system, or a failing expansion vessel.', check: 'Pressure gauge, filling loop, expansion vessel and visible pipework.', speed: 'Often within a day.' },
  { room: 'boiler', label: 'Boiler service due', service: 'boiler-servicing', likely: 'Time for a yearly check to keep it safe and efficient.', check: 'Burner, flue, safety devices, pressure and controls.', speed: 'Usually booked within the week.' },
  { room: 'cylinder', label: 'Radiators cold', service: 'radiators-and-heating', likely: 'Trapped air, sludge, a stuck valve or a system that needs balancing.', check: 'Each radiator, valves and the pump.', speed: 'Often within a day or two.' },
  { room: 'loft', label: 'Cracked or leaking tank', service: 'leaks-and-emergencies', likely: 'An old cold-water tank that has cracked, or a failing float valve.', check: 'Tank, overflow, float valve and pipework.', speed: 'Urgent. Call now. Turn off the water at the stopcock.' },
  { room: 'garden', label: 'Outside tap', service: 'leaks-and-emergencies', likely: 'A frozen or split tap or pipe. Fitting an outside tap is also straightforward.', check: 'The tap, the supply pipe and whether it has been isolated for winter.', speed: 'Often within a few days.' },
  { room: 'drain', label: 'Drainage problem', service: 'bathrooms-and-kitchens', likely: 'A blockage or a pipe that needs relocating. One customer could not use her sink, dishwasher or washing machine until Jim relocated the drainage.', check: 'Waste runs, falls and connections to the drain.', speed: 'Call and Jim will advise.' },
];

// ----- Real Google reviews, verbatim (first name only). Excerpts are complete sentences from the review. -----
export const reviews = [
  { n: 'Terence', t: 'Jim is an absolute saviour!! Don’t hesitate to give him a call. Our boiler was on the blink and he tried to help us over the phone first.', tag: 'Boiler repair', k: ['boiler-repair'] },
  { n: 'Alex', t: 'Jim answered on New Year’s Day after our heating packed up. Was there the next morning as agreed and fixed the issue immediately.', tag: 'Emergency', k: ['emergency'] },
  { n: 'Brandon', t: 'Jim made it out to my house in 20mins after being told of an emergency which caused me to have to turn off water to the whole property. His prices were fair , fixed and his work Great.', tag: 'Emergency leak', k: ['emergency', 'leak'] },
  { n: 'Merrell-Ann', t: 'Pipe in the kitchen started leaking terribly within a few minutes, spraying water everywhere. Despite finishing work for the evening, Jim came out and fixed it for us within 15 minutes of us calling. Friendly, efficient and great service recieved.', tag: 'Leak', k: ['leak', 'emergency'] },
  { n: 'Kathy', t: 'I had a leaking pipe and this plumber was recommended to me. He came promptly to inspect the damage and returned on arrangement to fix the problem quickly and effectively. He put all my cupboard and doors back and cleaned up after this messy job. Highly recommended.', tag: 'Leak', k: ['leak'] },
  { n: 'Tracey', t: 'My elderly mother needed emergency plumbing assistance. Jim arrived at hers within 30minutes and sorted the problem. Kept us informed along the way and we were reassured and pleased with the work undertaken.', tag: 'Emergency', k: ['emergency'] },
  { n: 'Darren', t: 'Great company Jim came out on Easter weekend to a lady I care for that is eighty and had no heating or hot water he was at the house in twenty minutes.', tag: 'Emergency', k: ['emergency', 'boiler-repair'] },
  { n: 'Adobea', t: 'Brilliant service!! Arrived within the hour was able to sort out the heating quickly and efficiently. Very professional would definitely recommend and use again.', tag: 'Heating repair', k: ['emergency', 'boiler-repair'] },
  { n: 'Linda', t: 'Brilliant service.. I needed a plumber straight away and Jim was able to be there in half hour, fixed the problem and was a very reasonable price. Will use again.', tag: 'Emergency', k: ['emergency'] },
  { n: 'Mandy', t: 'Called Jim very early as no heating or hot water. He advised he would be with me in 3 hours time. He was early. After looking into the problem, he found the fault. Went to get the part needed. Fixed the issue.', tag: 'Boiler repair', k: ['boiler-repair', 'emergency'] },
  { n: 'Natalie', t: 'Our Baxi boiler packed up out of the blue, called Jim who went out of his way to squeeze us in between jobs and found the problem. He found the parts at the best price and came back to install them the same day. Boiler is now back in action and I’m extremely thankful how quickly he was able to get it sorted!', tag: 'Boiler repair', k: ['boiler-repair'] },
  { n: 'Pamela', t: 'Can’t recommend Jim more! He’s been wonderful in dealing with some major boiler issues we had. Had a number of different people come out and no one could help; but Jim fixed it the same day! He’s friendly and easy to communicate with.', tag: 'Boiler repair', k: ['boiler-repair'] },
  { n: 'Chelsey', t: 'Used JH Plumbing for a call out for my boiler not working, came out the same day, good price and did a great job. Will be using again! Thanks.', tag: 'Boiler repair', k: ['boiler-repair'] },
  { n: 'Laura', t: 'Jim was able to attend really quickly to solve pressure issues with our boiler and know exactly what the problem was before he’d even arrived. Very knowledgeable and competitively priced.', tag: 'Boiler pressure', k: ['boiler-repair'] },
  { n: 'Kemi', t: 'I had a great experience with Jim. He quickly diagnosed an issue with my flue that had been improperly installed and fixed it efficiently.', tag: 'Flue', k: ['boiler-repair'] },
  { n: 'Martin', t: 'Jim was recommended to us by a valiant rep, when he came he diagnosed our problem which was different to the recommendation by the valiant rep, in doing so he actually saved me money.', tag: 'Boiler repair', k: ['boiler-repair'] },
  { n: 'Josh', t: 'Jim serviced our boiler and did an excellent job. He was able to accommodate us quickly, arrived punctually and thoroughly completed the service at a good price. I would definitely recommend him!', tag: 'Boiler service', k: ['service'] },
  { n: 'Katherine', t: 'Jim offered to come round the very next day when I thought I had a problem with the boiler. It was due a service anyway. Jim was very thorough, efficient and friendly - I felt reassured that my boiler was in good working order.', tag: 'Boiler service', k: ['service'] },
  { n: 'Dan', t: 'Needed boiler service and had a hot water issue, Jim was clear and honest with his charges and came round on Saturday morning, turned up on time, and did a thorough and professional job.', tag: 'Boiler service', k: ['service'] },
  { n: 'Harry', t: 'We found Jim reliable, knowledgeable and fantastic value, he explained step by step what he was doing and why, a boiler service and repair of a washroom tap was carried out speedily and efficiently with no mess and payment was accepted via bank transfer with all supporting paperwork supplied for our records, highly recommended.', tag: 'Boiler service', k: ['service', 'taps'] },
  { n: 'Rob', t: 'Brilliant customer experience and boiler repair and service. Jim was very reliable and willing to give advice even before attending, I highly recommend him.', tag: 'Boiler repair', k: ['service', 'boiler-repair'] },
  { n: 'Ethel', t: 'Jim is an absolute professional! I cannot recommend him enough. He installed a new boiler for me less than 24 hours after contacting him.', tag: 'New boiler', k: ['new-boiler'] },
  { n: 'Laura', t: 'Excellent service! Helped us out with the installation of a new combi boiler. Jim is very professional and very friendly! Highly recommend him', tag: 'New boiler', k: ['new-boiler'] },
  { n: 'Pauline', t: 'Jim replaced our old non combi boiler with a new Vaillant combi boiler. A great job with new pipe work and removal of everything no longer needed. He altered the plumbing for our washing machine and dishwasher and fitted a great gadget for turning the water off. Very clean and tidy job. Highly recommend for all your plumbing needs.', tag: 'New boiler', k: ['new-boiler'] },
  { n: 'Samantha', t: 'Highly recommend. Installed brand new boiler, no mess all clean and tidy. Efficient and reasonably priced.', tag: 'New boiler', k: ['new-boiler'] },
  { n: 'Brenda', t: 'Had new boiler fitted. Very reliable, great price and lovely guy. Great workmanship, great service and would highly recommend.', tag: 'New boiler', k: ['new-boiler'] },
  { n: 'Tovizi', t: 'Excellent service, my boiler was replaced fast and smooth, excellent work, highly recommended', tag: 'New boiler', k: ['new-boiler'] },
  { n: 'Daniel', t: 'Could not recommend enough. Used Jim for 2 of my rental properties, 1 for boiler replacement and one smaller heating repair. Very professional and at a fair price. Both tenants gave me very positive feedback on his work.', tag: 'Landlord', k: ['landlord', 'new-boiler'] },
  { n: 'David', t: 'Jim is very efficient , reliable and straightforward. Has done servicing and certificates for me for a number of years and always cooperative to come for a repair. I highly recommend him.', tag: 'Gas certificates', k: ['landlord', 'service'] },
  { n: 'Neil', t: 'Another great job by Jim of JH Plumbing. Fitted a new radiator and bathroom taps today without any fuss.', tag: 'Radiator & taps', k: ['radiators', 'taps'] },
  { n: 'M', t: 'Jim did a great job fitting 2 new radiators. He was professional, clean, friendly and more than competitively priced. I would definitely recommend.', tag: 'Radiators', k: ['radiators'] },
  { n: 'Andy', t: 'Jim promptly diagnosed heating fault to partially blocked pipe . Remedy was a power flush which he carried out immediately. Problem cured, done efficiently and no mess. Heating system now working well. Well done Jim', tag: 'Power flush', k: ['radiators'] },
  { n: 'Rohit', t: 'Jim fitted a new smart thermostat for me. Very efficient and gave a reasonable price. Will definitely be contacting him again in future', tag: 'Smart thermostat', k: ['radiators'] },
  { n: 'Nadjib', t: 'I highly recommend Jim for his services. I needed a toilet replaced and he did an excellent job. He is kind, timely, professional, and has a work ethic that’s hard to come by.', tag: 'Toilet', k: ['toilet'] },
  { n: 'Winston', t: 'Jim from JH Plumbing, was friendly, turned up on time, repaired my shower, sorting out any problems encountered efficiently.', tag: 'Shower', k: ['shower'] },
  { n: 'Gaynor', t: 'Had this gentleman come out to me very efficiently to fix my shower. He was friendly and professional and done a fabulous job. Highly recommend.', tag: 'Shower', k: ['shower'] },
  { n: 'Daniel', t: 'JH Plumbing & Heating came out at short notice to install a freestanding washing machine into a tricky slot where an inbuilt washing machine previously occupied. Did a great job. Also gave some free advice on my boiler.', tag: 'Appliance fitting', k: ['appliance'] },
  { n: 'Samantha', t: 'Jim recently fitted a water tank in my loft after it cracked. He responded to my messages almost instantly each time, gave a very reasonable quote, and had the job done very quickly.', tag: 'Loft tank', k: ['leak'] },
  { n: 'Ruth', t: 'Jim was polite and efficient. I am very pleased with my new kitchen drain pipes. Before he relocated the drainage I could not use my sink, dishwasher or washing machine.', tag: 'Drainage', k: ['drainage'] },
  { n: 'Terry', t: 'Jim at jh plumbing did a great job fitting a new kitchen and a new bathroom. Very reliable and clean and tidy worker. Never late always turned up when he said he would.', tag: 'Kitchen & bathroom', k: ['bathroom'] },
  { n: 'Aneesh', t: 'Really happy with the job! Very clean and very good customer service. Left the place as clean if not cleaner than it was when he came in.', tag: 'Tidy work', k: ['bathroom', 'taps'] },
  { n: 'Brandon', t: 'Jim did a great job fixing my water inflow pipes and also gave great advice for other problems around my house. Would definitely call him back for more plumbing work!', tag: 'Pipework', k: ['leak'] },
  { n: 'Daniel', t: 'Really helpful and honest guy, used a couple of times now and costs always explained up front. Would definately recommend, never any missed appointments and just gets on with the work as expected.', tag: 'Honest pricing', k: ['service'] },
  { n: 'Deborah', t: 'Excellent service. Jim, the plumber was first class. DID NOT OVERCHARGE. A rarity these days. If you wish for a great job at a reasonable price call JH plumbing and Heating', tag: 'Honest pricing', k: ['service'] },
  { n: 'Mark', t: 'Have used the company for a number of years. Totally reliable and attends as agreed. Work is of a high standard and everything is explained where needed. No unseen costs and charges are very reasonable. No mess, no fuss and a good customer experience.', tag: 'Boiler & heating', k: ['service'] },
  { n: 'Sally', t: 'We’ve called Jim on numerous occasions from an emergency boiler replacement to leaky taps. He always responds in good time and gives you honest & trusted advice. Would recommend him in a heartbeat.', tag: 'Repeat customer', k: ['taps', 'new-boiler'] },
  { n: 'Jeanne', t: 'Jim has carried out work for me on many occasions. He’s always flexible when possible, trustworthy and very professional. Quality of work is excellent.', tag: 'Repeat customer', k: ['service'] },
  { n: 'Christopher', t: 'First time I have used JH Plumbing and Heating. They responded within half an hour of calling them and the Engineer was excellent and extremely helpful.', tag: 'Call-out', k: ['emergency', 'appliance'] },
];

export const featured = reviews[0];
export const homeReviewIdx = [1, 2, 6, 10, 15, 20, 21, 25, 27, 29, 35, 38, 40, 41];

// ----- FAQ (home + FAQPage schema) -----
export const faqs = [
  ['Do you really come out the same day?', 'Often, yes. Customers describe Jim arriving within 15 to 30 minutes for leaks and the same day for boiler faults. It depends on the job and the day, so call and he will give you an honest time.'],
  ['Are you Gas Safe registered?', 'Yes. You can check any gas engineer on the official Gas Safe Register, and you should. We link to it from this site.'],
  ['Do I get a quote before work starts?', 'Always. Quotes are free and agreed before the job begins. If a bigger job needs a visit first, that is free too, and the quote comes in writing.'],
  ['Which boilers do you work on?', 'Customers have had Vaillant and Baxi boilers repaired, serviced and replaced, among others. Tell us the make and age when you call.'],
  ['Will you make a mess?', 'No. Customers mention cupboards put back, work areas cleaned and old parts taken away. That is how Jim works.'],
  ['What areas do you cover?', 'Romford and the surrounding Havering and Essex area, including Harold Hill, Gidea Park, Collier Row, Hornchurch, Upminster, Rainham, Dagenham and Brentwood. Not sure? Ask.'],
  ['Can I WhatsApp a photo for a quote?', 'Yes. WhatsApp us a photo of the problem and we will reply as soon as we can during opening hours.'],
];

// ----- Journal (starter guides: written cautiously, safety first) -----
export const journal = [
  { slug: 'how-to-find-your-stopcock', title: 'How to find your stopcock', desc: 'Where to look, how to turn it off and why you should do it today, before you need it.', read: 3,
    body: [
      ['h', 'Why it matters'], ['p', 'The stopcock is the tap that shuts off the water supply to your whole home. When a pipe bursts, turning it off quickly limits the damage. Find it now, while nothing is wrong.'],
      ['h', 'Where to look'], ['ul', ['Under the kitchen sink is the most common spot', 'In a cupboard near the front door, or under the stairs', 'In a utility room or downstairs toilet', 'In older homes, in the cellar, or outside in a pavement box (this one may belong to the water company)']],
      ['h', 'How to turn it off'], ['p', 'Turn it clockwise until it stops. If it is stiff, do not force it with tools. Try both hands. Once it is off, open the cold tap in the kitchen to drain the pipes.'],
      ['h', 'Test it now'], ['p', 'Turn it off and on once a year so it does not seize. If it will not move, or it drips when turned, that is worth a call. A seized or leaking stopcock is a job to sort before a leak, not during one.'],
      ['h', 'If water is already flowing'], ['p', 'Turn off the stopcock, switch off the boiler if the leak is near it, keep electrics away from water, and call us on 07980 309332.'],
    ] },
  { slug: 'why-is-my-boiler-pressure-dropping', title: 'Why is my boiler pressure dropping?', desc: 'The common causes of falling boiler pressure, what you can check safely and when to call.', read: 4,
    body: [
      ['h', 'What is normal'], ['p', 'Most sealed-system boilers sit at around 1 to 1.5 bar when the heating is cold. Check your boiler’s manual for the exact figure. A small drop over many months can be normal. Needing to top it up every week is not.'],
      ['h', 'Common causes'], ['ul', ['A small leak somewhere in the system, often a radiator valve or joint', 'You recently bled the radiators, which lets pressure out', 'A failing expansion vessel', 'A faulty pressure relief valve that is quietly letting water out']],
      ['h', 'What you can check'], ['ul', ['Look for damp patches, drips or staining around radiators, valves and pipes', 'Look at the outside pipe where the pressure relief valve discharges. Persistent dripping is a clue', 'Check the pressure gauge and compare it with the manual']],
      ['h', 'Repressurising'], ['p', 'Many boilers have a filling loop you can use to top up pressure. Follow your manual, and only do it when the system is cold. If you are not confident, do not guess.'],
      ['h', 'When to call'], ['p', 'If the pressure keeps dropping, call. A repeating loss means water is going somewhere, and finding where is a proper diagnostic job. Jim will talk it through on the phone first.'],
    ] },
  { slug: 'how-to-bleed-a-radiator', title: 'How to bleed a radiator', desc: 'A simple, safe way to release trapped air and get radiators warm at the top again.', read: 3,
    body: [
      ['h', 'When to do it'], ['p', 'If the bottom of a radiator is warm but the top stays cool, trapped air is the likely cause. Bleeding lets it out so hot water can fill the whole radiator.'],
      ['h', 'What you need'], ['ul', ['A radiator key (cheap and widely available)', 'A cloth or small bowl', 'Heating turned off and the radiator cool']],
      ['h', 'Steps'], ['ul', ['Turn the heating off and wait for the radiators to cool', 'Place the cloth under the bleed valve at the top corner', 'Turn the key slowly anticlockwise a quarter turn. You should hear air hissing out', 'Close the valve as soon as water starts to appear', 'Check the boiler pressure and top it up if it has dropped']],
      ['h', 'If it does not help'], ['p', 'If radiators are cold at the bottom, or the problem comes back, the cause is more likely sludge or a stuck valve. That may call for a power flush or new valves.'],
    ] },
  { slug: 'frozen-pipes-what-to-do', title: 'Frozen pipes: what to do', desc: 'How to spot a frozen pipe, thaw it safely and avoid a burst when it melts.', read: 3,
    body: [
      ['h', 'Signs'], ['p', 'No water from a tap in cold weather, or a boiler showing a fault with the condensate pipe, can mean a frozen pipe. Look at pipes in lofts, outhouses and along outside walls.'],
      ['h', 'What to do'], ['ul', ['Turn off the water at the stopcock', 'Open the affected tap so water can flow when it thaws', 'Warm the pipe gently with a hairdryer on a low setting or a hot water bottle, working from the tap end back', 'Never use a naked flame or a heat gun']],
      ['h', 'Once thawed'], ['p', 'Check the pipe for splits or leaks before turning the water back on slowly. A burst often appears only after the ice melts.'],
      ['h', 'Prevention'], ['p', 'Insulate exposed pipes, fix dripping taps and, if you leave the house empty, keep the heating on low. For an outside tap, isolate and drain it before winter.'],
      ['h', 'Need help?'], ['p', 'If a pipe has split or you are unsure, call 07980 309332 and turn off the stopcock while you wait.'],
    ] },
  { slug: 'combi-vs-system-boiler', title: 'Combi vs system boiler', desc: 'A plain-English comparison to help you choose the right type of boiler for your home.', read: 4,
    body: [
      ['h', 'Combi'], ['p', 'A combination boiler heats water directly from the mains when you turn on a tap, so there is no hot water tank. It suits smaller homes with one or two bathrooms and saves space.'],
      ['h', 'System'], ['p', 'A system boiler heats a stored hot water cylinder. It can supply several taps or showers at once, which suits larger households and homes with more bathrooms.'],
      ['h', 'How to choose'], ['ul', ['Number of bathrooms and people', 'Mains water pressure and flow', 'Space for a cylinder', 'How you use hot water at peak times']],
      ['h', 'The honest answer'], ['p', 'There is no best boiler, only the right one for your home. Jim will look at your house, ask how you use hot water and recommend what fits, even if it is not the most expensive option.'],
    ] },
  { slug: 'what-a-boiler-service-includes', title: 'What a boiler service actually includes', desc: 'What should happen on a boiler service visit, and what you should get at the end of it.', read: 3,
    body: [
      ['h', 'Why servicing matters'], ['p', 'A yearly service keeps your boiler safe and efficient and catches small problems before they become breakdowns. Some manufacturer warranties also expect it.'],
      ['h', 'What should happen'], ['ul', ['The boiler is inspected and its casing removed to check inside', 'Burner, heat exchanger and key components are cleaned where needed', 'Gas pressure, flue and combustion are checked', 'Safety devices are tested', 'Pressure, controls and visible pipework are checked']],
      ['h', 'What you should get'], ['p', 'A clear explanation of what was found, written confirmation for your records and honest advice on anything that is wearing out.'],
      ['h', 'Book yours'], ['p', 'Ask us for a free quote. Customers tell us they appreciate that Jim explains each step.'],
    ] },
];

export const steps = [
  ['Call or WhatsApp', 'Tell us what is wrong. Jim often talks it through first and sometimes solves it on the phone.'],
  ['A clear quote', 'Free, agreed before any work starts. Bigger jobs get a free visit and a written quote.'],
  ['Work done properly', 'On time, with the area protected, and everything explained as it happens.'],
  ['Left spotless', 'Cupboards back, area cleaned, old parts away, and you shown how it all works.'],
];

export const tidy = [
  ['Area protected', 'Floors and furniture covered before work starts.'],
  ['Cupboards put back', 'Doors and contents returned, as customers have noted.'],
  ['Old parts taken away', 'Removed and disposed of properly, not left in the garden.'],
  ['Wiped and cleared', 'Work area left as clean as it was found, if not cleaner.'],
  ['Explained before leaving', 'You are shown what was done and how to use it.'],
];

export const banner = { on: false, text: 'Cold snap coming? Check your outside tap and exposed pipes.', href: '/journal/frozen-pipes-what-to-do/' };

// ----- Case files: each one is taken from what a real customer wrote in their Google review -----
export const cases = [
  { slug: 'kitchen-leak', job: 'Leaks', icon: 'leak', title: 'A pipe spraying water in the kitchen', problem: 'A kitchen pipe started leaking badly within minutes, spraying water everywhere, after the working day had finished.', did: 'Jim came out in the evening and fixed it.', time: 'Fixed within 15 minutes of the call', who: 'Merrell-Ann', quote: 'Despite finishing work for the evening, Jim came out and fixed it for us within 15 minutes of us calling.' },
  { slug: 'baxi-same-day', job: 'Boilers', icon: 'boiler', title: 'Baxi boiler stopped out of the blue', problem: 'A Baxi boiler packed up with no warning.', did: 'Jim squeezed them in between jobs, found the fault, sourced the parts at the best price and came back to fit them.', time: 'Fixed the same day', who: 'Natalie', quote: 'He found the parts at the best price and came back to install them the same day.' },
  { slug: 'kitchen-drainage', job: 'Drainage', icon: 'drain', title: 'A sink that could not be used', problem: 'The customer could not use her sink, dishwasher or washing machine because of the way the drainage ran.', did: 'Jim relocated the drainage and fitted new kitchen drain pipes.', time: 'Completed to the customer\u2019s satisfaction', who: 'Ruth', quote: 'I am very pleased with my new kitchen drain pipes. Before he relocated the drainage I could not use my sink, dishwasher or washing machine.' },
  { slug: 'cracked-loft-tank', job: 'Leaks', icon: 'cylinder', title: 'A cracked tank in the loft', problem: 'A water tank in the loft had cracked.', did: 'Jim answered messages almost instantly, gave a reasonable quote and fitted a replacement tank.', time: 'Done very quickly, as the customer put it', who: 'Samantha', quote: 'He responded to my messages almost instantly each time, gave a very reasonable quote, and had the job done very quickly.' },
  { slug: 'flue-fault', job: 'Boilers', icon: 'boiler', title: 'A flue that had been fitted badly', problem: 'A flue had been improperly installed by someone else.', did: 'Jim diagnosed it quickly, fixed it and walked the customer through the problem and the solution.', time: 'Diagnosed and fixed efficiently', who: 'Kemi', quote: 'He took the time to walk me through everything, explaining the problem and the solution clearly.' },
  { slug: 'blocked-system', job: 'Heating', icon: 'radiator', title: 'A heating fault from a blocked pipe', problem: 'The heating had a fault caused by a partially blocked pipe.', did: 'Jim diagnosed it promptly and carried out a power flush straight away.', time: 'Same visit', who: 'Andy', quote: 'Problem cured, done efficiently and no mess. Heating system now working well.' },
  { slug: 'rental-boiler', job: 'Landlord', icon: 'stopcock', title: 'Two rental properties, two jobs', problem: 'A landlord needed a boiler replaced in one rental and a heating repair in another.', did: 'Jim carried out both jobs at a fair price and the tenants were happy with the work.', time: 'Both jobs completed', who: 'Daniel', quote: 'Both tenants gave me very positive feedback on his work.' },
];
