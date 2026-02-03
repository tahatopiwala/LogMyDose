import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const faqs = [
  {
    question: "What can I track with LogMyDose?",
    answer:
      "LogMyDose works with any health protocol you're following. Popular uses include GLP-1 medications (Ozempic, Wegovy, Mounjaro, Zepbound), peptides (BPC-157, etc.), HRT/TRT, supplements, and more. You can create custom protocols for anything you need to track.",
  },
  {
    question: "Is LogMyDose a medical device?",
    answer:
      "No. LogMyDose is a personal tracking tool—like a digital journal for your health notes. We help you organize your data so you can share it with your healthcare provider. We don't diagnose, treat, or provide medical advice.",
  },
  {
    question: "How is this different from a spreadsheet?",
    answer:
      "LogMyDose is purpose-built for medication tracking. You get one-tap logging, organized history, pattern visualization, and exportable reports—all designed to help you have better conversations with your doctor.",
  },
  {
    question: "Can I import my existing data?",
    answer:
      "Yes! You can import from Apple Health, upload a spreadsheet (CSV/Excel), or use our quick setup to enter your history. Your past data matters.",
  },
  {
    question: "Is my data private?",
    answer:
      "Absolutely. Your data is stored securely and never shared or sold. You can export or delete your data at any time. Your health notes belong to you.",
  },
  {
    question: "Do I need to get my medication through you?",
    answer:
      "No. LogMyDose works with medications and supplements from any source—telehealth providers, your local pharmacy, clinics, compounding pharmacies, or online retailers. We're just here to help you track.",
  },
  {
    question: "Should I use this instead of talking to my doctor?",
    answer:
      "No—LogMyDose is meant to help you prepare for those conversations, not replace them. Think of it as a way to bring organized notes to your appointments. Always work with your healthcare provider for medical decisions.",
  },
  {
    question: "What if I want to cancel?",
    answer:
      "Cancel anytime with one tap—no questions asked. You can export all your data before you go. We don't believe in lock-in.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Questions? We've got answers.
          </h2>
        </FadeIn>

        <StaggerContainer className="space-y-4" staggerDelay={0.05}>
          {faqs.map((faq, index) => (
            <StaggerItem key={index}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <motion.svg
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 text-gray-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Disclaimer */}
        <FadeIn delay={0.3} className="mt-12">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <strong>Medical Disclaimer:</strong> LogMyDose is a personal
              tracking tool, not a medical device. It does not diagnose, treat, or
              provide medical advice. Always consult your healthcare provider for
              medical decisions.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
