"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { q } from "framer-motion/client";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 rounded-lg overflow-hidden w-full">
      <motion.button
        onClick={onClick}
        className="w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center hover:cursor-pointer"
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
      question: "What is this chatbot, and how can it help me?",
      answer:
        "Our AI-powered mental health chatbot provides 24/7 emotional support, self-help resources, and the option to connect with professional therapists. It helps users manage stress, anxiety, and depression through guided conversations and personalized recommendations.",
    },
    {
      question: "Is this chatbot a replacement for therapy?",
      answer:
        "No, the chatbot is designed to provide support and guidance but is not a substitute for professional therapy. If needed, we offer the option to connect with licensed therapists.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Yes! We use end-to-end encryption and secure storage to protect your data. Your conversations are private and not shared with anyone unless you explicitly request professional support.",
    },
    {
      question: "Can I talk to a real therapist through this platform?",
      answer:
        "Yes! We offer a Human-in-the-Loop option where you can connect with licensed mental health professionals for deeper support.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 w-full">
      <h2 className="text-3xl text-black font-bold text-left mb-8">FAQs</h2>

      {faqData.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(index === openIndex ? null : index)}
        />
      ))}
    </div>
  );
};

export default FAQ;
