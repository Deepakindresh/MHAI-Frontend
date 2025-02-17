"use client";
import TestimonialCard from "material-testimonial-card";
import image1 from "@/public/batman.jpg";

export const Testimonial = ({
  name = "Batman",
  image = image1,
  content,
  company,
}: {
  name?: string;
  image?: string;
  content?: string;
  company?: string;
}) => (
  <TestimonialCard
    name={name}
    image={image1}
    content={
      "Wow! This testimonial card is so amazing! I would like to use it in my project!"
    }
    project={"Testimonial card"}
  />
);
