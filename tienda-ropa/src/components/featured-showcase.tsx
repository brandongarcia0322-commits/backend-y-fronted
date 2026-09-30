"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";

interface ShowcaseCard {
  id: string;
  image: string;
}

// 1. TUS 3 IMÁGENES BASE
const rawItems: ShowcaseCard[] = [
  { id: "1", image: "/foto1.jpg" }, // Foto 1
  { id: "2", image: "/foto2.jpg" }, // Foto 2
  { id: "3", image: "/foto3.jpg" }, // Foto 3
];

// Duplicamos el grupo para garantizar un colchón de renderizado fluido
const showcaseItems = [
  ...rawItems.map((item, i) => ({ ...item, uniqueId: `set1-${i}` })),
  ...rawItems.map((item, i) => ({ ...item, uniqueId: `set2-${i}` })),
  ...rawItems.map((item, i) => ({ ...item, uniqueId: `set3-${i}` })),
  ...rawItems.map((item, i) => ({ ...item, uniqueId: `set4-${i}` })),
  ...rawItems.map((item, i) => ({ ...item, uniqueId: `set5-${i}` })),
];

export default function FeaturedShowcase() {
  const x = useMotionValue(0);
  const [cardWidth, setCardWidth] = useState(0);
  const gap = 32; // Espaciado entre fotos (gap-8)

  const singleSetWidth = (cardWidth + gap) * rawItems.length;

  useEffect(() => {
    const handleResize = () => {
      const sw = window.innerWidth;
      // Formato panorámico horizontal
      const cw =
        sw >= 1024 ? Math.min(sw * 0.7, 1000) : sw >= 640 ? sw * 0.8 : sw * 0.9;
      setCardWidth(cw);

      const step = cw + gap;
      // Posicionar el set central al centro de la pantalla
      const initialTargetX = -(6 * step + cw / 2);
      x.set(initialTargetX);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [x, gap]);

  // REUBICACIÓN EN TIEMPO REAL (Evita que desaparezcan al deslizar brusco)
  useMotionValueEvent(x, "change", (latestX) => {
    if (!singleSetWidth) return;

    const step = cardWidth + gap;
    const centerPoint = -(6 * step + cardWidth / 2);
    const minX = centerPoint - singleSetWidth;
    const maxX = centerPoint + singleSetWidth;

    // Si la velocidad/inercia sobrepasa el límite, salta 1 ciclo completo invisiblemente
    if (latestX < minX) {
      x.set(latestX + singleSetWidth);
    } else if (latestX > maxX) {
      x.set(latestX - singleSetWidth);
    }
  });

  return (
<div className="relative w-screen left-1/2 -translate-x-1/2 my-10 py-6 overflow-hidden select-none bg-white">    
  <motion.div
        drag="x"
        style={{ x }}
        dragElastic={0.05}
        /* Ajuste de fuerza e inercia para evitar aceleraciones infinitas */
        dragTransition={{ power: 0.12, timeConstant: 200 }}
        className="flex gap-8 w-max cursor-grab active:cursor-grabbing items-center px-[50vw]"
      >
        {showcaseItems.map((item, index) => (
          <Card
            key={item.uniqueId}
            item={item}
            index={index}
            x={x}
            cardWidth={cardWidth}
            gap={gap}
          />
        ))}
      </motion.div>
    </div>
  );
}

function Card({
  item,
  index,
  x,
  cardWidth,
  gap,
}: {
  item: ShowcaseCard;
  index: number;
  x: MotionValue<number>;
  cardWidth: number;
  gap: number;
}) {
  const step = cardWidth + gap;
  // El valor de `x` en el que esta tarjeta coincide con el centro de la pantalla
  const targetX = -(index * step + cardWidth / 2);

  // Zoom de protagonismo: 1.10x únicamente en el centro exacto, 0.85x a los lados
  const scale = useTransform(
    x,
    [targetX - step, targetX, targetX + step],
    [0.85, 1.1, 0.85],
  );

  // Transparencia dinámica suave
  const opacity = useTransform(
    x,
    [targetX - step, targetX, targetX + step],
    [0.5, 1, 0.5],
  );

  // Capa superior: Pasa al frente cuando se acerca al centro
  const zIndex = useTransform(
    x,
    [targetX - step * 0.4, targetX, targetX + step * 0.4],
    [1, 40, 1],
  );

  return (
    <motion.div
      style={{
        width: cardWidth ? `${cardWidth}px` : "58vw",
        scale,
        opacity,
        zIndex,
      }}
className="relative h-[340px] sm:h-[400px] lg:h-[460px] rounded-3xl overflow-hidden bg-white shrink-0 origin-center"    >
      <div className="w-full h-full relative">
        <Image
          src={item.image}
          alt="Showcase"
          fill
        className="object-cover pointer-events-none mix-blend-multiply"
          unoptimized
        />
      </div>
    </motion.div>
  );
}
