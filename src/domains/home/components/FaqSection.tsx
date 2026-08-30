"use client";

import { faqs } from "@/lib/data/faq";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section id="faq" className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900">
      <div className="it-container px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Answers to the questions we hear most from individuals and small
              business owners.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-slate-900 dark:text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
