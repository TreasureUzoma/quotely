import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onboardingSlides as slides } from "@/data/onboarding-slides";

export const Route = createFileRoute("/onboarding/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const prevIndex = useRef<number>(0);
  const currentSlide = slides[currentIndex];

  useEffect(() => {
    if (prevIndex.current !== currentIndex) {
      setDirection(currentIndex > prevIndex.current ? 1 : -1);
      prevIndex.current = currentIndex;
      setHasAnimated(true);
    }
  }, [currentIndex]);

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-[#F9F9F9] py-10 px-4 overflow-hidden">
      <div />
      <div className="relative w-full max-w-md flex justify-center items-center text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide.id}
            initial={
              hasAnimated ? { opacity: 0, x: direction > 0 ? 50 : -50 } : false
            }
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center w-full"
          >
            <h1 className="text-2xl font-bold mb-3">{currentSlide.title}</h1>
            <p className="text-base font-normal mb-8">{currentSlide.text}</p>
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-[70%] h-auto max-h-[350px] object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-8 space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-primary w-5" : "bg-[#ddd] w-2.5"
            }`}
          />
        ))}
      </div>
      <Button
        className="w-full max-w-md mt-6"
        onClick={() => {
          if (currentIndex < slides.length - 1) {
            setCurrentIndex((i) => i + 1);
          } else {
            alert("Onboarding complete!");
          }
        }}
      >
        {currentIndex < slides.length - 1 ? "Next" : "Get Started"}
      </Button>
    </div>
  );
}
