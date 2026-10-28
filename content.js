/* =========================================================
   ✏️  EDIT YOUR PAGE HERE
   ---------------------------------------------------------
   This is the only file you need to touch to change your
   games, songs, hobbies and the texts that drop down.

   Rules:
   • Keep the "quotes" around text and the commas at the end.
   • To ADD something: copy a whole { ... }, block and paste it
     where you want it. To REMOVE: delete the whole block.
   • The order here is the order on the page (numbers update
     automatically).
   • text: "" (empty) → no dropdown / no + button.
   • Emojis work everywhere. 💜
   ========================================================= */

window.SITE = {

  /* ---------- 🎮 Favorite games ----------
     title  → game name
     icon   → emoji shown on the card
     color  → card glow color (any hex color, e.g. "#ff3df2")
     tags   → little labels, as many as you want
     link   → Steam (or any) page – the button says "View on Steam"
              for Steam links, otherwise "Visit website"
     text   → your dropdown text ("" for none)            */
  games: [
    {
      title: "Dead by Daylight",
      icon: "🔪",
      color: "#b3122e",
      tags: ["Horror", "Multiplayer"],
      link: "https://store.steampowered.com/app/381210/Dead_by_Daylight/",
      text: "It all started the day someone gifted me this game. Fast forward: 1000+ hours, 500€+ spent and every single killer unlocked. Yes, I'm a killer main, so survivors, start running. 🔪 There's always something new to try, builds and playstyles to perfect, and lots of different people to meet (and hook).",
    },
    {
      title: "Minecraft",
      icon: "⛏️",
      color: "#3dbf5a",
      tags: ["Sandbox", "Survival", "Modded"],
      link: "https://www.minecraft.net",
      text: "I've spent so much time in this game: over a year of real time on servers and in vanilla and modded singleplayer! I've built so many things and created so many worlds and lores. It's an amazing game to relax and build, and if something isn't cool anymore, you just tear it down and rebuild it, just like that. ⛏️",
    },
    {
      title: "Borderlands 3",
      icon: "💥",
      color: "#f5a300",
      tags: ["Looter Shooter", "Co-op"],
      link: "https://store.steampowered.com/app/397540/Borderlands_3/",
      text: "I've played through this one multiple times, with a different character and build every run. Loot, shoot, repeat, and somehow it never gets old. 💥",
    },
    {
      title: "Palworld",
      icon: "🐉",
      color: "#4cc9f0",
      tags: ["Survival", "Creatures"],
      link: "https://store.steampowered.com/app/1623730/Palworld/",
      text: "So many cute Pals to collect… and, well, put to work. 😇 It's the perfect game to just relax and explore, because you can tweak everything so it never gets too hard. And there's always something to do.",
    },
    {
      title: "Cyberpunk 2077",
      icon: "🌃",
      color: "#fcee0a",
      tags: ["Open World", "RPG"],
      link: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
      text: "Night City has an amazing story and a world I love getting lost in. Sneak through quietly, run and gun, or hack everything to death: every mission plays out your way. Choom, everything's possible. 🌃",
    },
  ],

  /* ---------- 🎧 Favorite songs ----------
     title   → shown in the list
     spotify → paste the Spotify share link of the song
               (Spotify → ••• → Share → Copy song link)     */
  songs: [
    {
      title: "S&M",
      spotify: "https://open.spotify.com/track/0C4ejWmOTMv8vuYj85mf8m",
    },
    {
      title: "Mafia — Remix",
      spotify: "https://open.spotify.com/track/3rkSjkhFvhRt4BZKXq99d4",
    },
    {
      title: "Bow Down",
      spotify: "https://open.spotify.com/track/3jJTrW9rTO5V0RuLNmCp2h",
    },
    {
      title: "Cool on the Internet",
      spotify: "https://open.spotify.com/track/6HMxF1RJilVOcdRmxfobya",
    },
    {
      title: "Dirty Vibe",
      spotify: "https://open.spotify.com/track/0WUIGqyq3zUo8BXchrGu1x",
    },
  ],

  /* ---------- ✨ Hobbies & interests ----------
     icon / title / short → what the box shows
     text                 → your dropdown text ("" for none)
     terminal             → optional typing lines (makes the box wide) */
  hobbies: [
    {
      icon: "🎵",
      title: "Music",
      short: "Exploring all kinds of genres and discovering new tunes.",
      text: "Music makes everything better: anywhere, anytime. It makes me feel all kinds of things, and I usually pick songs that match whatever mood I'm in. With ADHD and autism, music helps me feel and understand my emotions so much better.",
    },
    {
      icon: "📚",
      title: "Manga & Books",
      short: "Diving into captivating stories and adventures.",
      text: "I read all kinds of manga, but let's be honest: it's mostly romance. 💕 Outside of manga, I'm all about fantasy and dark romance books.",
    },
    {
      icon: "🏃",
      title: "Sport",
      short: "Staying active and fit through all sorts of activities.",
      text: "I walk around 200 km every month. Yes, really. 🚶‍♀️ Add some home workouts and I feel pretty great. Why so much walking? I just love being outside: city streets, parks, nature, all of it.",
    },
    {
      icon: "🎭",
      title: "Roleplay",
      short: "Imaginative, immersive role-playing scenarios.",
      text: "Roleplay lets me dive into any world my mind can come up with, and the best part is building it together with other people. When a story really grabs me, I'll happily spend hours working out my characters.",
    },
    {
      icon: "🎨",
      title: "Drawing",
      short: "Creating art and expressing myself through illustrations.",
      text: "Nothing beats watching a blank page turn into a piece of art. I draw a bit of everything: text art, realistic stuff, pure fantasy and sometimes complete nonsense. 🎨",
    },
    {
      icon: "🎮",
      title: "Gaming",
      short: "Breathtaking worlds full of color — or dark and horrifying ones?",
      text: "Gaming is a huge part of my life. With ADHD and autism my mind can get pretty chaotic, and games help me sort it out. A beautiful world, a great story or a sandbox where I can build anything: count me in.",
    },
    {
      icon: "💻",
      title: "Programming",
      short: "Learning, experimenting with code and building my own tools on the side.",
      text: "I kind of stumbled into programming, and even with AI as my sidekick it's a ton of fun. Discord bots, websites, game mods: if I need something, I can just build it myself. 💻",
      terminal: ["npm run build-something-cool", "git commit -m \"it works, somehow\"", "console.log(\"hello, galaxy\")"],
    },
  ],

  /* ---------- 💞 Small boxes in "About me" ----------
     label → small heading, value → bold line, text → dropdown */
  aboutBoxes: [
    {
      icon: "💞",
      label: "Relationship",
      value: "Heart belongs to someone",
      text: "Since I found the love of my life, I'm happier than ever. She and our little girl are everything I need (well, them and gaming 😄). No matter how bad a day gets, they always make me smile.",
    },
    {
      icon: "🎮",
      label: "Gaming alias",
      value: "★☆ SinisterGirl ☆★",
      text: "I wanted a name that's unique and a little twisted, and so SinisterGirl was born. I'm into dark stuff like dark romance, so it fits perfectly. And honestly? It matches my chaotic energy too. 😈",
    },
  ],

  /* ---------- 🎲 Random fact box ----------
     One line per fact. Every click shows a different one.
     Add, change or delete lines as you like.             */
  funFacts: [
    "I walk around 200 km every month. My shoes have officially filed a complaint. 👟",
    "1000+ hours in Dead by Daylight and every single killer unlocked. My wallet is still recovering. 🔪",
    "Killer main. If you hear a heartbeat, it's probably me. 💓",
    "My Minecraft playtime adds up to over a year of real time. Time well spent? Absolutely. ⛏️",
    "I can spend hours creating one roleplay character. Their backstory is probably longer than this website.",
    "Dark romance is my favorite book genre. Red flags? Only between book covers, thank you. 🖤",
    "My music always matches my mood, so my playlist is basically a mood ring with headphones. 🎧",
    "I've played through Borderlands 3 multiple times. Loot goblin? Guilty as charged. 💥",
    "I build my own Discord bots, websites and game mods, with a little help from my AI sidekick. 💻",
    "In winter I sleep in onesies. I have a Stitch one and a cat one, and yes, both are adorable. 🐱",
    "ADHD + autism = a free lifetime subscription to chaotic energy. ⚡",
    "Total horror fan. Jump scares? I have them for breakfast. 👻",
    "I love making new friends. Maybe you're next? 👀💜",
    "Don't judge me for who I am. It gets you nothing, and I'll be over here having fun anyway. 💅",
    "Total K-pop fan, especially when it's girl groups being absolute baddies. 💅🎤",
    "Some people think I look like a psycho sometimes. Don't worry, I'm not. …Or am I? o.O 🔪",
    "I listen to almost every genre out there. If the mood fits, it's on the playlist. 🎶",
    "In summer I love wearing revealing clothes. Not for you, but for my own body confidence. So hands off, you jerk! 😤✨",
  ],

  /* ---------- 🖼️ Galleries ----------
     Just drop pictures into the folders below in your GitHub repo:
       gallery/art/          → "My art"
       gallery/screenshots/  → "Game screenshots"
     The page finds them automatically. Nothing to edit here.
     (Add another { ... } block + folder for a new gallery.)

     github: only fill in if your pictures don't show up
             (user = your GitHub name, repo = repository name). */
  gallery: {
    github: { user: "", repo: "" },
    sections: [
      { title: "My art", icon: "🎨", folder: "gallery/art" },
      { title: "Game screenshots", icon: "🎮", folder: "gallery/screenshots" },
    ],
  },
};
