// src/pages/Landing.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun,
  BarChart3,
  Zap,
  FileText,
  ChevronUp,
  Briefcase,
  GraduationCap,
  Building,
  HelpCircle,
  ChevronDown,
  Star,
} from "lucide-react";

export default function Landing() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);

    const timer = setTimeout(() => setLoading(false), 1500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "Бұл жүйені қалай қолдануға болады?",
      answer:
        "Тіркелген соң, жеке кабинетке кіріп, деректерді жүктеп, аналитика мен есептерді қолдана аласыз.",
    },
    {
      question: "Менің деректерім сақтала ма?",
      answer: "Иә. Барлық деректер қауіпсіз серверлерде шифрланып сақталады.",
    },
    {
      question: "Есептерді қалай жүктеуге болады?",
      answer:
        "Нәтижелерді PDF, Excel немесе CSV форматында бір батырмамен экспорттай аласыз.",
    },
  ];

  const features = [
    {
      icon: <BarChart3 className="w-12 h-12 text-purple-600 mx-auto" />,
      title: "Деректерді визуализациялау",
      text: "Күрделі деректерді түсінікті әрі тартымды түрде бейнелеу. Интерактивті диаграммалар мен кестелер арқылы аналитикалық мәліметтерді нақты ұсыну.",
      delay: 0.1,
    },
    {
      icon: <Sun className="w-12 h-12 text-purple-600 mx-auto" />,
      title: "Интуитивті интерфейс",
      text: "Қолданушыға ыңғайлы навигация, адаптивті дизайн және заманауи визуалды стиль жұмысты жеңіл етеді.",
      delay: 0.2,
    },
    {
      icon: <Zap className="w-12 h-12 text-purple-600 mx-auto" />,
      title: "Жылдам өңдеу",
      text: "Деректерді лезде өңдейді және нәтижелерді бір сәтте ұсынады. Уақыт үнемдеу — бұл жай артықшылық емес, ол тиімділіктің кепілі.",
      delay: 0.3,
    },
    {
      icon: <FileText className="w-12 h-12 text-purple-600 mx-auto" />,
      title: "Файлдарды экспорттау",
      text: "Бір ғана батырма арқылы құжаттарды бірнеше форматта жүктей аласыз: PDF, Excel, CSV.",
      delay: 0.4,
    },
  ];

  const audiences = [
    {
      icon: <Briefcase className="w-12 h-12 mx-auto text-purple-600 mb-4" />,
      title: "Бизнес және сарапшыларға",
      text: "Талдау жасау және шешім қабылдау үшін кәсіби құралдар.",
    },
    {
      icon: (
        <GraduationCap className="w-12 h-12 mx-auto text-purple-600 mb-4" />
      ),
      title: "Университеттер мен студенттерге",
      text: "Ғылыми жобалар мен оқу процесіне арналған қолдау.",
    },
    {
      icon: <Building className="w-12 h-12 mx-auto text-purple-600 mb-4" />,
      title: "Деректермен жұмыс істейтін ұйымдарға",
      text: "Деректерді сақтау, өңдеу және талдау процесін оңтайландыру.",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <svg
            className="w-16 h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white font-sans min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="flex justify-between items-center p-8 max-w-7xl w-full mx-auto z-10">
        <div className="text-2xl font-bold">Дипломдық жоба</div>
        <nav className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-white hover:text-gray-200 text-base px-4 py-2 rounded-md transition"
          >
            Кіру
          </Link>
          <Link
            to="/register"
            className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
          >
            Тіркелу
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center text-center flex-1 px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
        >
          Деректерді басқарудың заманауи шешімі
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mb-12"
        >
          Біз сіздің бизнесіңізді дамытуға көмектесетін интуитивті және қауіпсіз
          платформа ұсынамыз. Барлық аналитика мен визуализация бір жерде.
        </motion.p>
      </main>

      {/* Features */}
      <section className="bg-white text-gray-800 py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-16"
          >
            Негізгі мүмкіндіктер
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-12">
            {features.map((f, i) => (
              <FeatureCard
                key={i}
                icon={f.icon}
                title={f.title}
                text={f.text}
                delay={f.delay}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="bg-white text-gray-800 py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-16"
          >
            Кімдерге арналған?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {audiences.map((a, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="bg-purple-50 p-8 rounded-xl shadow-md"
              >
                {a.icon}
                <h3 className="text-xl font-semibold mb-2">{a.title}</h3>
                <p className="text-gray-600">{a.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 text-gray-800 py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-16"
          >
            Қолданушылар пікірі
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Айбек М.",
                role: "Бизнес аналитик",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                text: "Жүйе арқылы деректермен жұмыс істеу әлдеқайда оңай болды. Интерфейсі интуитивті және тез үйренуге болады.",
              },
              {
                name: "Жанна К.",
                role: "Маркетинг маманы",
                image:
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
                text: "Мен визуализация құралдарын жақсы көремін! Барлық ақпарат қолжетімді және анық.",
              },
              {
                name: "Санжар Т.",
                role: "Деректер инженері",
                image:
                  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
                text: "Барлық мәлімет нақты, құрылымды және интерактивті түрде ұсынылады.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, delay: 0.2 * i }}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="text-sm text-purple-600">{t.role}</p>

                <div className="flex justify-center mb-3 mt-3">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400 stroke-yellow-400 mx-0.5"
                    />
                  ))}
                </div>

                <p className="text-gray-600">{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 text-gray-800 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-12"
          >
            Жиі қойылатын сұрақтар
          </motion.h2>

          <div className="space-y-4 text-left">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border rounded-lg bg-white shadow hover:shadow-md transition cursor-pointer"
              >
                <div
                  className="flex items-center justify-between p-4"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    <h3 className="font-medium text-lg">{faq.question}</h3>
                  </div>
                  {activeFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                {activeFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 text-gray-700 overflow-hidden"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 text-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-white text-lg mb-4">Байланыс</h4>
            <p>Email: info@example.com</p>
            <p>Телефон: +7 777 777 77 77</p>
          </div>
          <div>
            <h4 className="text-white text-lg mb-4">Әлеуметтік желілер</h4>
            <p>Telegram | WhatsApp | LinkedIn</p>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-tr from-purple-100 to-purple-50 rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
    >
      {icon}
      <h3 className="text-xl font-semibold mb-3 mt-4">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </motion.div>
  );
}
