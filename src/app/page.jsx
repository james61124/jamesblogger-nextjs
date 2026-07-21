// // app/page.jsx
// import MainPage from "../components/MainPage";

// export default function Home() {
//   return <MainPage />;
// }

// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import Hero from '../components/Hero';
// import Journey from '../components/Journey';

// export default function MainPage() {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <main className="overflow-x-hidden bg-[#f4efe6]">
//       <Hero hovered={hovered} setHovered={setHovered} />

//       <Journey />
//     </main>
//   );
// }

"use client";

import Hero from "../components/Hero";
import Journey from "../components/Journey";

export default function Home() {
  return (
    <main>
      <Hero />
      <Journey />
    </main>
  );
}

