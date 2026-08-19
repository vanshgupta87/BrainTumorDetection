'use client';

import { useEffect, useRef } from 'react';
import { BoundingBox } from '@/types/api';
import { drawBoundingBoxes } from '@/lib/utils';

interface ImagePreviewProps {
  imageUrl: string;
  boxes?: BoundingBox[];
  alt?: string;
  filter?: 'normal' | 'invert' | 'thermal';
  brightness?: number;
  contrast?: number;
}

export default function ImagePreview({
  imageUrl,
  boxes = [],
  alt = 'MRI Image',
  filter = 'normal',
  brightness = 100,
  contrast = 100,
}: ImagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const getFilterString = () => {
    let filterString = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (filter === 'invert') {
      filterString += ' invert(100%)';
    } else if (filter === 'thermal') {
      filterString += ' url(#thermal-preview-filter)';
    }
    return filterString;
  };

  useEffect(() => {
    if (imageRef.current && canvasRef.current && boxes.length > 0) {
      const img = imageRef.current;
      const canvas = canvasRef.current;

      const draw = () => {
        drawBoundingBoxes(canvas, img, boxes, getFilterString());
      };

      if (img.complete) {
        draw();
      } else {
        img.onload = draw;
      }
    }
  }, [imageUrl, boxes, filter, brightness, contrast]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Hidden SVG filters for the canvas to reference */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="thermal-preview-filter">
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0 0 0.5 1 1 1 0.5" />
              <feFuncG type="table" tableValues="0 0 0 0 0.5 1 1" />
              <feFuncB type="table" tableValues="0.5 1 1 0 0 0 0" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <img
        ref={imageRef}
        src={imageUrl}
        alt={alt}
        style={{ filter: getFilterString() }}
        className={`w-full h-auto rounded-lg ${boxes.length > 0 ? 'hidden' : ''}`}
      />
      {boxes.length > 0 && (
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-lg border-2 border-white/[0.08]"
        />
      )}
    </div>
  );
}
