"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/moving-border";
import { LinkData } from "../types/directus";

interface InteractiveContentProps {
  links: LinkData[];
  appearanceSettings?: {
    gradient_color_1: string;
    gradient_color_2: string;
    gradient_opacity: number;
    gradient_thickness: number;
    button_bg_color: string;
    text_color: string;
    font_family: string;
  };
}

export default function InteractiveContent({ links, appearanceSettings }: InteractiveContentProps) {
  const gradientColor1 = appearanceSettings?.gradient_color_1 || "#ec4899";
  const gradientColor2 = appearanceSettings?.gradient_color_2 || "#8b5cf6";
  const gradientOpacity = appearanceSettings?.gradient_opacity || 0.9;
  const gradientThickness = appearanceSettings?.gradient_thickness || 32;
  const buttonBgColor = appearanceSettings?.button_bg_color || "#020617";
  const textColor = appearanceSettings?.text_color || "#ffffff";
  const fontFamily = appearanceSettings?.font_family || "Inter";

  return (
    <div className="b mt-4">
      {links.map((link, index) => {
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-4"
          >
            <Button
              borderRadius="1.75rem"
              className="text-xl"
              gradientColor1={gradientColor1}
              gradientColor2={gradientColor2}
              gradientOpacity={gradientOpacity}
              gradientThickness={gradientThickness}
              buttonBgColor={buttonBgColor}
              textColor={textColor}
              fontFamily={fontFamily}
            >
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
        );
      })}
    </div>
  );
}