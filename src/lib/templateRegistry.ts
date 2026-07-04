export const templateRegistry = [
  // ✨ NEW — Featured Template
  { id: "floating-memories", title: "Floating Memories", type: "Visual Experience", desc: "Your photos float up like bubbles — pop 5 of them to unlock a heartfelt romantic proposal. Addictive & beautiful.", category: "love", price: "₹199", previewPath: "/preview/floating-memories", editPath: "/create?template=floating-memories", badge: "NEW" },
  { id: "snake-trail", title: "Snake Trail", type: "Interactive Experience", desc: "A cinematic trail of memories follows your cursor everywhere. Stunning, interactive, and unique.", category: "love", price: "₹149", previewPath: "/preview/snake-trail", editPath: "/create?template=snake-trail", badge: "POPULAR" },

  // 🎥 Interactive Story Themes
  { id: "t01", title: "Time Machine", type: "Interactive Story", desc: "Watch past memories open, leading to a future message at the end.", category: "love", price: "₹199", previewPath: "/preview/t01", editPath: "/create?template=t01" },
  { id: "t02", title: "Door Opening Reveal", type: "Interactive Story", desc: "Every image is hidden behind a different colored door.", category: "fun", price: "₹99", previewPath: "/preview/t02", editPath: "/create?template=t02" },
  { id: "t03", title: "Gift Box Reveal", type: "Interactive Story", desc: "Tap the box, it bursts open revealing an image and deep message.", category: "family", price: "Free", previewPath: "/preview/t03", editPath: "/create?template=t03" },
  { id: "t04", title: "Book Flip Story", type: "Interactive Story", desc: "A beautifully animated book flipping through the chapters of your life.", category: "love", price: "₹299", previewPath: "/preview/t04", editPath: "/create?template=t04" },
  { id: "t05", title: "Polaroid Camera", type: "Interactive Story", desc: "Click sound triggers an instant printing polaroid drop.", category: "friends", price: "₹149", previewPath: "/preview/t05", editPath: "/create?template=t05" },
  { id: "t06", title: "Cinema Screen", type: "Interactive Story", desc: "Theatre style dim lights, popcorn crunch sound, and the movie starts.", category: "love", price: "₹349", previewPath: "/preview/t06", editPath: "/create?template=t06" },
  { id: "t07", title: "Chat Story Theme", type: "Interactive Story", desc: "WhatsApp style chatting bubbles that manifest the images.", category: "fun", price: "₹149", previewPath: "/preview/t07", editPath: "/create?template=t07" },

  // 🎮 Gamified Features
  { id: "t08", title: "Scratch Card Reveal", type: "Gamified", desc: "Literally scratch the smartphone screen to reveal the confession.", category: "fun", price: "₹99", previewPath: "/preview/scratch-card", editPath: "/create?template=t08" },
  { id: "t09", title: "Treasure Hunt", type: "Gamified", desc: "Solve 3 small clues to unlock the next memory.", category: "fun", price: "₹249", previewPath: "/preview/t09", editPath: "/create?template=t09" },
  { id: "t10", title: "Lock & Key", type: "Gamified", desc: "User must enter a special date (passcode) to unlock the memory.", category: "love", price: "₹199", previewPath: "/preview/lock-key", editPath: "/create?template=t10" },
  { id: "t11", title: "Spin the Wheel", type: "Gamified", desc: "Spin a fortune wheel to load a random memory out of the pool.", category: "friends", price: "₹149", previewPath: "/preview/t11", editPath: "/create?template=t11" },
  { id: "t12", title: "Tap Fast Game", type: "Gamified", desc: "Tap meter fills up! Once full, a huge surprise pops up.", category: "fun", price: "₹99", previewPath: "/preview/t12", editPath: "/create?template=t12" },

  // 🌌 Visual Experience Themes
  { id: "t13", title: "Galaxy Love", type: "Visual Experience", desc: "Stars connect dynamically to form a constellation of your memory.", category: "love", price: "₹299", previewPath: "/preview/t13", editPath: "/create?template=t13" },
  { id: "t14", title: "Firefly Night", type: "Visual Experience", desc: "Glowing fireflies light up dark woods revealing your photos.", category: "family", price: "₹199", previewPath: "/preview/t14", editPath: "/create?template=t14" },
  { id: "t15", title: "Rain Drop Reveal", type: "Visual Experience", desc: "Raindrops wash away the blur screen showing the image.", category: "love", price: "₹149", previewPath: "/preview/t15", editPath: "/create?template=t15" },
  { id: "t16", title: "Snowfall Magic", type: "Visual Experience", desc: "Gentle snow carrying memories to the ground with acoustic music.", category: "family", price: "Free", previewPath: "/preview/t16", editPath: "/create?template=t16" },
  { id: "t17", title: "Sunset Vibe", type: "Visual Experience", desc: "Golden hour lighting with a highly romantic aesthetic.", category: "love", price: "₹199", previewPath: "/preview/t17", editPath: "/create?template=t17" },

  // 💖 Emotional Premium Themes
  { id: "t18", title: "Heartbeat Sync", type: "Emotional", desc: "Images pulse and fade in sync with an audible heartbeat.", category: "love", price: "₹299", previewPath: "/preview/t18", editPath: "/create?template=t18" },
  { id: "t19", title: "Voice Memory Overlay", type: "Emotional", desc: "Each image plays a custom recorded voice note attached to it.", category: "family", price: "₹349", previewPath: "/preview/t19", editPath: "/create?template=t19" },
  { id: "t20", title: "Things I Never Said", type: "Emotional", desc: "Deep emotional text fades in slowly before revealing the person.", category: "love", price: "₹249", previewPath: "/preview/t20", editPath: "/create?template=t20" },
  { id: "t21", title: "Promise Timeline", type: "Emotional", desc: "Showcases future commitments and bucket list goals together.", category: "love", price: "₹199", previewPath: "/preview/t21", editPath: "/create?template=t21" },

  // 😂 Fun & Viral Themes
  { id: "t22", title: "Meme Story", type: "Fun Viral", desc: "Memories presented in classic meme template formats.", category: "friends", price: "Free", previewPath: "/preview/t22", editPath: "/create?template=t22" },
  { id: "t23", title: "Roast Mode", type: "Fun Viral", desc: "Funny roasts/insults followed by a sweet photo.", category: "friends", price: "₹99", previewPath: "/preview/t23", editPath: "/create?template=t23" },
  { id: "t24", title: "Expectation vs Reality", type: "Fun Viral", desc: "Split screen showing what was planned vs what happened.", category: "fun", price: "₹149", previewPath: "/preview/t24", editPath: "/create?template=t24" },
  { id: "t25", title: "Filter Madness", type: "Fun Viral", desc: "Crazy VFX and filters applied on the reveal.", category: "fun", price: "Free", previewPath: "/preview/t25", editPath: "/create?template=t25" },

  // 💍 Couple / Dating Themes
  { id: "t26", title: "Go On Date With Me", type: "Couple", desc: "Interactive prompt to choose Coffee, Movie, Dinner, or Beach.", category: "love", price: "₹199", previewPath: "/preview/t26", editPath: "/create?template=t26" },
  { id: "t27", title: "The Long Ride", type: "Couple", desc: "A car drives on a highway to romantic songs.", category: "love", price: "₹149", previewPath: "/preview/t27", editPath: "/create?template=t27" },
  { id: "t28", title: "Love Map Journey", type: "Couple", desc: "Google Earth style zoom into locations attached with memories.", category: "love", price: "₹349", previewPath: "/preview/t28", editPath: "/create?template=t28" },
  { id: "t29", title: "First Meet Recreate", type: "Couple", desc: "Cinematic story tracing back to the Day 1.", category: "love", price: "₹299", previewPath: "/preview/t29", editPath: "/create?template=t29" },

  // 🎉 Occasion-Based & Smart Features
  { id: "t30", title: "Auto Mood Detection", type: "Smart", desc: "AI alters the background theme colors based on time of day.", category: "special", price: "₹249", previewPath: "/preview/t30", editPath: "/create?template=t30" },
  { id: "t31", title: "AI Message Generator", type: "Smart", desc: "Generates long emotional paragraphs automatically.", category: "special", price: "₹149", previewPath: "/preview/t31", editPath: "/create?template=t31" },
  { id: "t32", title: "Countdown Unlock", type: "Smart", desc: "The link literally cannot open until midnight on their birthday.", category: "family", price: "₹199", previewPath: "/preview/t32", editPath: "/create?template=t32" },
  { id: "t33", title: "Live Reaction Record", type: "Smart", desc: "Asks for camera permission to record their authentic response.", category: "special", price: "₹499", previewPath: "/preview/t33", editPath: "/create?template=t33" },

  // 🎁 Surprise Mechanics
  { id: "t34", title: "Hidden Tap Zones", type: "Mechanics", desc: "Invisible boxes that trigger mini-easter eggs.", category: "fun", price: "₹99", previewPath: "/preview/t34", editPath: "/create?template=t34" },
  { id: "t35", title: "Secret Multi-Ending", type: "Mechanics", desc: "End message changes based on which choices they clicked.", category: "love", price: "₹299", previewPath: "/preview/t35", editPath: "/create?template=t35" },
  { id: "t36", title: "Cover Image Layer", type: "Mechanics", desc: "A normal photo masks the entire experience until tapped.", category: "special", price: "₹149", previewPath: "/preview/t36", editPath: "/create?template=t36" },
];
