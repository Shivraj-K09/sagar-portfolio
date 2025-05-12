// Helper function to extract video ID from YouTube URL
export function extractVideoId(url: any) {
  // Handle regular YouTube URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  // Handle YouTube Shorts URLs
  const shortsRegExp = /^.*(youtube.com\/shorts\/)([^#&?]*).*/;
  const shortsMatch = url.match(shortsRegExp);

  if (shortsMatch && shortsMatch[2].length === 11) {
    return shortsMatch[2];
  }

  return null;
}

// Video project data structure
export interface VideoProject {
  id: string;
  title: string;
  category: string;
  year?: string;
  isShort?: boolean;
  thumbnailUrl?: string;
  statistics?: {
    viewCount: number;
    likeCount: number;
  };
}

// Updated portfolio projects with the provided YouTube videos
export const PORTFOLIO_PROJECTS = [
  {
    id: extractVideoId("https://www.youtube.com/watch?v=r-_40oLqawY"),
    title: "Video Project 1",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=UeNa1cJhO5s"),
    title: "Video Project 2",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=5KvmYGkMIvM"),
    title: "Video Project 3",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=HfUTAtIy0MA"),
    title: "Video Project 4",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=90nd1uhdrM4"),
    title: "Video Project 5",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=eTmvtdsHb8w"),
    title: "Video Project 6",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/KgPq-v7TjYI"),
    title: "Short Video 1",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/KGqmHB-7fFc"),
    title: "Short Video 2",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/FBmjQ6fNpas"),
    title: "Short Video 3",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/_VMyiirPCtU"),
    title: "Short Video 4",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=PjDgNbg1RtM"),
    title: "Short Video 5",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=G62QsMn1sG8"),
    title: "Video Project 7",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=0xE_PmWqqu0"),
    title: "Video Project 8",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=-W3dWXB3H_U"),
    title: "Video Project 9",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=RyOZv_eVLw4"),
    title: "Video Project 10",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=wvEVQB6r5Tg"),
    title: "Video Project 11",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=-vEtFnyz4wU"),
    title: "Video Project 12",
    category: "Video",
    isShort: false,
  },
  // Adding the two new videos
  {
    id: extractVideoId("https://www.youtube.com/watch?v=ZxKPSctpi0E"),
    title: "What if Palpatine Defeated Mace Windu Before Anakin Arrived",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=lveGVl5S06k"),
    title: "What If R2-D2 Was Reprogrammed with HK-47's Assassin Protocols",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=kU0ZwzQlSFk"),
    title: "What if Padme JOINED Anakin on Mustafar",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=iPhbUwPRHEw"),
    title: "What if Revan AND Darth Bane Awakened During The Clone Wars",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://youtube.com/shorts/co54jm8eaJg"),
    title:
      "Pahalgam Te*ror Attack 2025 | The Ideological Assault on India&apos;s Diversity ",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=Cl28FRUmxQs"),
    title: "What if Anakin Trusted Mace Windu and Stayed in the Jedi Temple",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=O5vyAsEdDSo"),
    title: "What if Anakin Skywalker Left The Jedi Order After Killing Dooku",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=TTnU_Bz2-v4"),
    title: "What if Darth Vader MASTERED Force Drain to Regenerate His Body",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/TFn9FPZ_NDg"),
    title: "US job market Nancy",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/5k01mwI-Yxc"),
    title: "ArthurHayes Bitcoin Nancy",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=aKDSDr24gCk"),
    title: "What if Palpatine Used Predator INSTEAD of Order 66",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=oGCA-yu4BwM"),
    title: "What if Revan Awakened To Train Anakin and Starkiller",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=gm56GVNYJpk"),
    title: "What If Obi-Wan DIDN'T Survive Order 66",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=8xGP_gnWIW0"),
    title: "What if The Jedi Had Visions of Anakin Burning on Mustafar",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=pmbd3ZfVFZg"),
    title: "What if Anakin Skywalker Had The Sharingan",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/WD2t-jV4gkM"),
    title:
      "Why a Major General Fasted in Kashmir During Ramadan! 🇮🇳 @MajGenYashMor",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/DaudFOjxnK0"),
    title:
      "Operation Sindoor: Symbolism, Strategy & Propaganda in India-Pakistan Conflict #indianarmy",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=u_wZIB5EjfM"),
    title: "What if The Father From Mortis SAVED Anakin on Mustafar",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=M7ir4M4VF3o"),
    title: "From ₹30 to ₹1 Crore? The Fantasy Sports Scam You Need to Know",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/hW_qDxCvGf0"),
    title: "Caleb Ad Footage",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/kiL4Z53WMt4"),
    title: "Trial",
    category: "Short",
    isShort: true,
  },
];

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
