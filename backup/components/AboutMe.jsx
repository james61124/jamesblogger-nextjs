import { motion } from "framer-motion";

export default function AboutMe() {
  return (
    <section id="about" className="bg-white py-24 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* 👤 文字區域 */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            About Me
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            I am a passionate developer specializing in building modern web
            applications. With a strong foundation in algorithms, data
            structures, and cutting-edge frameworks, I strive to create
            intuitive and high-performance user experiences.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              Contact Me
            </button>
            <button className="px-6 py-3 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              View My Work
            </button>
          </div>
        </motion.div>

        {/* 🖼️ 圖片區域 */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src="/images/profile.jpg"
            alt="Profile"
            className="rounded-3xl w-full max-w-md shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
