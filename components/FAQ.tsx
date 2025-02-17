"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <motion.button
        onClick={onClick}
        className="w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
        initial={false}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.3 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 text-gray-600">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What services do you offer?",
      answer:
        "We offer a wide range of services including web development, mobile app development, and digital marketing solutions. Our team specializes in creating custom solutions tailored to your specific needs.",
    },
    {
      question: "How long does it take to complete a project?",
      answer:
        "Project timelines vary depending on the scope and complexity. Typically, small projects take 2-4 weeks, while larger projects can take 2-6 months. We'll provide a detailed timeline during our initial consultation.",
    },
    {
      question: "What is your pricing structure?",
      answer:
        "Our pricing is project-based and depends on your specific requirements. We offer competitive rates and flexible payment plans. Contact us for a detailed quote tailored to your needs.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-3xl text-black font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>

      {faqData.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
};

export default FAQ;
