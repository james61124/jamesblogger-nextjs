'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import Link from 'next/link';

export default function MainPage() {
  const { scrollY } = useScroll();

  // 根據滾動產生視差效果
  const backgroundY = useTransform(scrollY, [0, 300], [0, -150]);

  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const experiences = [
    { title: 'R&D Software Engineer', company: 'BlockChain Security', duration: '2024/12 - Present' },
    { title: 'Software Engineer', company: 'ASML Global Headquarter', duration: '2024/06 - 2024/12' },
    { title: 'R&D Intern', company: 'iForensics Digital Inc.', duration: '2023/06 - 2024/06' },
  ];

  const education = [
    { degree: 'B.S. in Computer Science', school: 'National Yang Ming Chiao Tung University', duration: '2020 - 2024' },
    { degree: 'Senior High School', school: 'Kaohsiung Municipal Kaohsiung Senior High School', duration: '2017 - 2020' },
  ];

  // 監聽視窗變化，動態更新 isMobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {/* Main Cover Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* 背景圖片 + 視差效果 */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/Guitar.JPEG')", opacity: 0.5 }}
        />

        <div className="absolute inset-0 bg-black/60 mix-blend-overlay" />

        {/* 內容區域 */}
        <div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 mt-12"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.h1
            className={`font-extrabold text-white drop-shadow-lg ${isMobile ? 'text-4xl' : 'text-7xl'}`}
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            James Blogger
          </motion.h1>

          <motion.p
            className={`mt-7 text-white ${isMobile ? 'text-sm' : 'text-lg'} opacity-80`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Exploring Life & Sharing Tech Insights
          </motion.p>

          <Link href="#about-me">
            <motion.button
              className="mt-8 px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-full shadow-xl hover:bg-blue-500 transition-transform transform hover:scale-105"
              whileHover={{ scale: 1.1 }}
            >
              About Me
            </motion.button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <Link href="#about-me">
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <svg
              className="w-6 h-6 text-white animate-bounce"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </Link>
      </div>

      {/* About Me Section */}
      <section id="about-me" className="max-w-5xl mx-auto py-16 px-6 sm:px-12">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[{ title: 'Work Experience', icon: FaBriefcase, items: experiences, color: 'bg-blue-600' },
            { title: 'Education', icon: FaGraduationCap, items: education, color: 'bg-green-600' }].map((section, i) => (
            <motion.div
              key={i}
              className="bg-white shadow-lg rounded-2xl p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 text-gray-900">
                <section.icon className="text-3xl" />
                <h3 className="text-2xl font-semibold">{section.title}</h3>
              </div>
              <div className="relative border-l border-gray-300 mt-4 pl-6">
                {section.items.map((item, index) => (
                  <motion.div
                    key={index}
                    className="mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className={`absolute -left-3 w-6 h-6 ${section.color} rounded-full`} />
                    <h4 className="text-lg font-semibold">{item.title || item.degree}</h4>
                    <p className="text-sm">{item.company || item.school}</p>
                    <p className="text-sm text-gray-500">{item.duration}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}


// 'use client';

// import ReactFlow from 'reactflow';
// import 'reactflow/dist/style.css';
// import { useCallback, useState } from 'react';
// import { Dialog } from '@headlessui/react';
// import { motion } from 'framer-motion';

// const initialNodes = [
//   {
//     id: '1',
//     position: { x: 100, y: 100 },
//     data: { label: 'Array & Strings' },
//     type: 'default',
//   },
//   {
//     id: '2',
//     position: { x: 100, y: 150 },
//     data: { label: 'Linked List' },
//     type: 'default',
//   },
//   {
//     id: '3',
//     position: { x: 100, y: 200 },
//     data: { label: 'Two Pointers' },
//     type: 'default',
//   },
// ];

// const initialEdges = [
//   {
//     id: 'e1-2',
//     source: '1',
//     target: '2',
//     type: 'straight', // ✅ 使用直線
//   },
//   {
//     id: 'e2-3',
//     source: '2',
//     target: '3',
//     type: 'straight',
//   },
// ];

// export default function MainPage() {
//   const [selectedNode, setSelectedNode] = useState(null);

//   const onNodeClick = useCallback((_, node) => {
//     setSelectedNode(node.data.label);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-rose-50 to-sky-50 py-12 px-4">
//       <div className="max-w-5xl mx-auto border rounded-2xl shadow bg-white p-4">
//         <div style={{ width: '100%', height: '500px' }}>
//           <ReactFlow
//             nodes={initialNodes}
//             edges={initialEdges}
//             onNodeClick={onNodeClick}
//             fitView
//             zoomOnScroll={false}
//             panOnScroll={false}
//             panOnDrag={false}
//             zoomOnPinch={false}
//             nodesDraggable={false}
//             nodesConnectable={false}
//             elementsSelectable={false}
//           />
//         </div>
//       </div>

//       <Dialog open={!!selectedNode} onClose={() => setSelectedNode(null)} className="relative z-50">
//         <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <Dialog.Panel
//             as={motion.div}
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
//           >
//             <Dialog.Title className="text-xl font-semibold mb-2">
//               {selectedNode}
//             </Dialog.Title>
//             <Dialog.Description className="text-gray-600">
//               這是 {selectedNode} 的文章內容，未來可以串 markdown、Notion、CMS。
//             </Dialog.Description>
//           </Dialog.Panel>
//         </div>
//       </Dialog>
//     </div>
//   );
// }


// 'use client';
// import ReactFlow, { Background } from 'reactflow';
// import 'reactflow/dist/style.css';
// import { CustomNode } from './CustomNode';
// import CustomDashedEdge from './CustomEdge';

// const nodeTypes = { custom: CustomNode };
// const edgeTypes = { dashed: CustomDashedEdge };

// const nodes = [
//   {
//     id: '1',
//     type: 'custom',
//     position: { x: 400, y: 0 }, // 第一個 node 在上
//     data: { label: 'Introduction', type: 'main' },
//   },
//   {
//     id: '2',
//     type: 'custom',
//     position: { x: 400, y: 100 }, // 第二個 node 在下面
//     data: { label: 'Performance vs Scalability', type: 'sub' },
//   },
//   {
//     id: '3',
//     type: 'custom',
//     position: { x: 400, y: 200 }, // 再下一層
//     data: { label: 'Availability vs Consistency', type: 'sub' },
//   },
// ];

// const edges = [
//   {
//     id: 'e1-2',
//     source: '1',
//     target: '2',
//     type: 'default', // 預設線，不用自定義
//   },
//   {
//     id: 'e2-3',
//     source: '2',
//     target: '3',
//     type: 'default',
//   },
// ];



// export default function MainPage() {
//   return (
//     <div className="w-full h-screen">
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         nodeTypes={nodeTypes}
//         edgeTypes={edgeTypes}
//         fitView
//         zoomOnScroll
//         panOnDrag
//         nodesDraggable={false}
//         nodesConnectable={false}
//         elementsSelectable={false}

//         minZoom={0.2} // 可以調整最小 zoom 比例
//         maxZoom={2}
//         className="w-full h-full"
//       >
//         <Background color="#f0f0f0" />
//       </ReactFlow>
//     </div>
//   );
// }