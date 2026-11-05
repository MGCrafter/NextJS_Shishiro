"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/moving-border";
import { AppearanceSettings, LinkData } from "../types/directus";

interface InteractiveContentProps {
  links: LinkData[];
  appearanceSettings?: AppearanceSettings;
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
            key={link.id ?? index}
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-4"
          >
            <Button
              as="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              borderRadius="1.75rem"
              containerClassName="block"
              className="text-xl"
              gradientColor1={gradientColor1}
              gradientColor2={gradientColor2}
              gradientOpacity={gradientOpacity}
              gradientThickness={gradientThickness}
              buttonBgColor={buttonBgColor}
              textColor={textColor}
              fontFamily={fontFamily}
            >
              {link.title}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
