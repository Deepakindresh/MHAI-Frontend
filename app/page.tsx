"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import { HomePageContainer } from "@/components/HomePageContainers";
import { ImageSlider } from "@/components/ImageSlider";
// import { Card } from "@/components/Card";
import Image from "next/image";
import FAQ from "@/components/FAQ";
import TestimonialCard from "@/components/TestimonialCard";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  return (
    <AuthWrapper chatScreen={false} notHomeScreen={false}>
      <div className="flex flex-col w-full bg-gray-50 z-0 relative items-center ">
        <div className="w-[100%] flex justify-end">
          <Image
            src="/paint.svg"
            alt="Paint"
            width={400}
            height={400}
            className="w-[60%]"
          />
        </div>
        <div className="w-full mb-32">
          <HomePageContainer>
            <div className="w-full flex relative">
              <div className="w-[50%]">
                <Image
                  src="/med.svg"
                  alt="Med"
                  width={500}
                  height={500}
                  // className="w-[60%]"
                />
              </div>
              <div className="w-[50%] flex flex-col justify-center items-start space-y-4">
                <p className="text-fuchsia-600 font-extrabold">
                  Your Personal Therapist
                </p>
                <h1 className="text-5xl font-bold text-gray-800">
                  Welcome to Dandelion Fly
                </h1>
                <p className="text-xl text-gray-800">
                  Your compassionate companion on the journey to better mental
                  health. Talk with our Chatbot, Connect with licensed
                  therapists, Track your progress, and access support whenever
                  you need it.
                </p>
                <div
                  className="bg-linear-to-l from-fuchsia-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:cursor-pointer hover:scale-105 z-50"
                  onClick={() => router.push("/chat")}
                >
                  Get Started
                </div>
              </div>
            </div>
          </HomePageContainer>
        </div>
        <div className="w-full mb-32">
          <HomePageContainer>
            <div className="flex flex-col space-y-8">
              <div className="w-full flex justify-between items-center">
                <div className="w-[50%] flex flex-col space-y-8">
                  <Image
                    src="/ai.svg"
                    alt="AI"
                    width={200}
                    height={200}
                    className="w-[60%]"
                  />
                  <div className="text-3xl font-bold text-black text-center">
                    Multiple AI Agents
                  </div>
                </div>
                <div className="w-[50%] flex flex-col space-y-8">
                  <Image
                    src="/data.svg"
                    alt="data"
                    width={200}
                    height={200}
                    className="w-[60%]"
                  />
                  <div className="text-3xl font-bold text-black text-center">
                    Data Privacy
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="w-[50%] flex flex-col space-y-8">
                  <Image
                    src="/time.svg"
                    alt="time"
                    width={200}
                    height={200}
                    className="w-[60%]"
                  />
                  <div className="text-3xl font-bold text-black text-center">
                    24/7 Support
                  </div>
                </div>
                <div className="w-[50%] flex flex-col space-y-8">
                  <Image
                    src="/test.svg"
                    alt="test"
                    width={200}
                    height={200}
                    className="w-[60%]"
                  />
                  <div className="text-3xl font-bold text-black text-center">
                    Self Assessment Tools
                  </div>
                </div>
              </div>
            </div>
          </HomePageContainer>
        </div>
        <div className="w-full mb-32">
          <HomePageContainer>
            <div className="w-full flex justify-between items-center"></div>
          </HomePageContainer>
        </div>
        <div className="w-full mb-32">
          <ImageSlider />
        </div>
        <div className="w-full mb-32">
          <HomePageContainer>
            <div className="w-full flex justify-between items-center">
              <div className="w-[50%]">
                <FAQ />
              </div>
              <Image
                src="/faq.svg"
                alt="Med"
                width={500}
                height={500}
                // className="w-[60%]"
              />
            </div>
          </HomePageContainer>
        </div>

        <div className="w-full mb-32 bg-[url('/blob.svg')]  bg-center bg-no-repeat bg-fit">
          <HomePageContainer>
            <div className="flex flex-col space-y-8">
              <div className="w-full flex justify-between items-center">
                <TestimonialCard
                  content={"This was a great app, helped me a lot!"}
                  name="Deepak"
                  title="Developer"
                  imageAlt="Profile Picture"
                  imageSrc="/batman.jpg"
                />
                <TestimonialCard
                  content={"This was a great app, helped me a lot!"}
                  name="Deepak"
                  title="Developer"
                  imageAlt="Profile Picture"
                  imageSrc="/batman.jpg"
                />
              </div>
              <div className="w-full flex justify-between items-center">
                <TestimonialCard
                  content={"This was a great app, helped me a lot!"}
                  name="Deepak"
                  title="Developer"
                  imageAlt="Profile Picture"
                  imageSrc="/batman.jpg"
                />
                <TestimonialCard
                  content={"This was a great app, helped me a lot!"}
                  name="Deepak"
                  title="Developer"
                  imageAlt="Profile Picture"
                  imageSrc="/batman.jpg"
                />
              </div>
            </div>
          </HomePageContainer>
        </div>
      </div>
    </AuthWrapper>
  );
}
