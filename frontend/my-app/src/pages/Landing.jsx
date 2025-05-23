// src/pages/Landing.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  BarChart3,
  Activity,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Landing() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const toggleFaq = (i) => setActiveFaq(activeFaq === i ? null : i);

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
      icon: <BarChart3 className="w-10 h-10 text-purple-600 mx-auto" />,
      title: "Деректерді визуализациялау",
      text: "Күрделі деректерді түсінікті әрі тартымды түрде бейнелеу. Интерактивті диаграммалар мен кестелер арқылы аналитикалық мәліметтерді нақты ұсыну.",
      bg: "from-purple-100 to-purple-50",
      color: "text-purple-800",
    },
    {
      icon: <Sun className="w-10 h-10 text-blue-600 mx-auto" />,
      title: "Интуитивті интерфейс",
      text: "Қолданушыға ыңғайлы навигация, адаптивті дизайн және заманауи визуалды стиль жұмысты жеңіл етеді.",
      bg: "from-blue-100 to-blue-50",
      color: "text-blue-800",
    },
    {
      icon: <Activity className="w-10 h-10 text-green-600 mx-auto" />,
      title: "Нақты уақыттағы мониторинг",
      text: "Жабдықтарыңыздың жұмыс жағдайын кез келген уақытта қадағалаңыз – температура, хэшрейт және қуат тұтыну.",
      bg: "from-green-100 to-green-50",
      color: "text-green-800",
    },
    {
      icon: <FileText className="w-10 h-10 text-yellow-600 mx-auto" />,
      title: "Файлдарды экспорттау",
      text: "Бір ғана батырма арқылы құжаттарды бірнеше форматта жүктей аласыз: CSV, PNG.",
      bg: "from-yellow-100 to-yellow-50",
      color: "text-yellow-800",
    },
  ];

  const processSteps = [
    {
      title: "Жабдық мониторингі",
      text: "Жабдықтардың жұмыс жағдайын мониторингтеу арқылы жүйенің тиімділігін қадағалаңыз.",
    },
    {
      title: "Деректерді талдау",
      text: "Жиналған деректерді талдау және графиктер арқылы нәтижелерді визуализациялау.",
    },
    {
      title: "Есептерді генерациялау",
      text: "Аналитикалық нәтижелерді PDF, Excel немесе CSV форматында экспорттаңыз.",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-500 to-blue-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="antialiased scroll-smooth font-sans text-gray-900">
      {/* HERO */}
      <div className="relative bg-gradient-to-tr from-purple-600 to-blue-500 text-white">
        {/* лёгкая тёмная наложка */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <header className="relative max-w-6xl mx-auto p-6 flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            BCD Company
          </h1>
          <nav className="space-x-4 text-base">
            <Link
              to="/login"
              className="hover:underline transition-colors duration-200"
            >
              Кіру
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-white text-purple-600 rounded-md font-medium hover:bg-gray-100 transition"
            >
              Тіркелу
            </Link>
          </nav>
        </header>

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-extrabold leading-snug drop-shadow"
          >
            Деректерді басқарудың заманауи шешімі
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-4 text-base md:text-lg text-purple-200 leading-relaxed max-w-2xl mx-auto"
          >
            Бір ортада деректерді жинау, өңдеу және визуалдау.
          </motion.p>
        </div>
      </div>

      {/* FEATURES */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8">
            Негізгі мүмкіндіктер
          </h3>
          <div className="grid gap-8 md:grid-cols-4">
            {features.map(({ icon, title, text, bg, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`p-6 bg-gradient-to-br ${bg} rounded-lg shadow-sm hover:shadow-md transition`}
              >
                {React.cloneElement(icon, {
                  className: `w-10 h-10 mx-auto ${color}`,
                })}
                <h4 className="mt-4 text-lg font-medium text-gray-900">
                  {title}
                </h4>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-8">
            Процесс қалай жұмыс істейді?
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {processSteps.map(({ title, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center px-4"
              >
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <h4 className="text-lg font-medium mb-2">{title}</h4>
                <div className="w-8 h-0.5 bg-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-8">
            Жиі қойылатын сұрақтар
          </h3>
          <div className="space-y-3">
            {faqData.map(({ question, answer }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-800 font-medium text-sm">
                      {question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: activeFaq === i ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 py-3 bg-gray-50 text-gray-700 text-sm leading-relaxed"
                    >
                      {answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm">
        <div className="max-w-4xl mx-auto px-6 space-y-1">
          <p>Email: info@bcdcompany.kz | Телефон: +7 777 777 77 77</p>
        </div>
      </footer>

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
