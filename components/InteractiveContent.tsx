"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/moving-border";
import { LinkData } from "../types/directus";

interface InteractiveContentProps {
  links: LinkData[];
}

export default function InteractiveContent({ links }: InteractiveContentProps) {
  return (
    <div className="b mt-4">
      {links.map((link, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="mb-4"
        >
          <Button
            borderRadius="1.75rem"
            className="bg-gray-900 dark:bg-slate-900 text-white dark:text-white text-xl"
          >
            {/* HIER IST DIE ÄNDERUNG */}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full flex items-center justify-center"
            >
              {link.title}
            </a>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}