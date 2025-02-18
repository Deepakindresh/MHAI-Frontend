"use client";
import { Quote } from "lucide-react";
import Image from "next/image";

interface TestimonialCardProps {
  content: string;
  name: string;
  title?: string;
  imageSrc: string;
  imageAlt: string;
}

export default function TestimonialCard({
  content,
  name,
  title,
  imageSrc,
  imageAlt,
}: TestimonialCardProps) {
  return (
    <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 mt-12">
      {/* Image Container */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 text-center">
        {/* Quote Icon */}
        <div className="flex justify-center mb-4">
          <Quote className="text-blue-500 w-8 h-8" />
        </div>

        {/* Testimonial Text */}
        <p className="text-gray-700 text-lg mb-6 italic">{content}</p>

        {/* Name and Title */}
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          {title && <p className="text-gray-500 text-sm mt-1">{title}</p>}
        </div>
      </div>
    </div>
  );
}
