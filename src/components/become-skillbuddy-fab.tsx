import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function BecomeSkillBuddyFAB() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: [1, 1.05, 1],
      }}
      transition={{
        opacity: { duration: 0.5, delay: 0.8, ease: "easeOut" },
        y: { duration: 0.5, delay: 0.8, ease: "easeOut" },
        scale: {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      whileHover={{
        scale: 1.08,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-[9999] max-[480px]:bottom-4 max-[480px]:right-4"
    >
      <Link
        to="/register"
        search={{ role: "provider" }}
        className="flex items-center gap-2 rounded-full bg-[#2D7A5F] px-6 py-3.5 text-white font-medium shadow-lg transition-colors hover:bg-[#236B4F] max-[480px]:px-4 max-[480px]:py-3"
      >
        <Star className="h-5 w-5 fill-white" />
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Become a SkillBuddy</span>
        <span className="sm:hidden">Become a Pro</span>
      </Link>
    </motion.div>
  );
}
