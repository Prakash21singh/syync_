'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { File, Folder, Image, Archive, FileText, Video, Music, Code, Table } from 'lucide-react';

const CYCLE_DURATION = 4;
const ICON_SPACING = 22;

const iconComponents = [File, Folder, Image, Archive, FileText, Video, Music, Code, Table];

export default function FileSerializationAnimation({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const animatedFiles = useMemo(
    () =>
      iconComponents.map((icon, index) => ({
        id: `file-${index}`,
        icon,
        delay: index * (CYCLE_DURATION / iconComponents.length),
      })),
    [],
  );

  const totalWidth = iconComponents.length * ICON_SPACING;
  const startX = -totalWidth / 2 - 80;
  const centerX = 0;
  const endX = totalWidth / 2 + 80;

  return (
    <div className="flex flex-col  items-center justify-center">
      <div
        style={{
          width: '100%',
          maxWidth: '16rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Subtle glow line in center */}
        <div
          style={{
            position: 'absolute',
            width: '60%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent)',
            top: '50%',
            left: '20%',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', width: totalWidth + 160, height: 50 }}>
          {animatedFiles.map((file) => {
            const IconComponent = file.icon;

            return (
              <motion.div
                key={file.id}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -20,
                  marginLeft: -20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 10,

                  backdropFilter: 'blur(2px)',
                }}
                initial={{
                  x: startX,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: [startX, centerX, endX],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  backgroundColor: ['rgba(222, 226, 240, 0.5)'],
                }}
                transition={{
                  duration: CYCLE_DURATION,
                  delay: file.delay,
                  repeat: Infinity,
                  ease: ['easeOut', 'easeIn'],
                  times: [0, 0.45, 1],
                }}
              >
                <IconComponent
                  style={{ width: 20, height: 20, color: 'rgba(0,0,0,0.55)' }}
                  strokeWidth={1.5}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <h1 className="text-xl mt-1 font-bold text-gray-600">{title}</h1>
      <p className="text-xs font-thin text-shadow-muted">{description}</p>
    </div>
  );
}
