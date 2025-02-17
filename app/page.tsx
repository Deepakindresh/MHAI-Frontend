import { AuthWrapper } from "@/components/AuthWrapper";
import { HomePageContainer } from "@/components/HomePageContainers";
import { ImageSlider } from "@/components/ImageSlider";
import { Card } from "@/components/Card";
import Image from "next/image";
import FAQ from "@/components/FAQ";
import { Testimonial } from "@/components/Testimonial";
export default function Home() {
  return (
    <AuthWrapper chatScreen={false} notHomeScreen={false}>
      <div className="flex flex-col w-full bg-gray-50 -z-50 relative items-center ">
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
            <div className="w-full flex ">
              <div className="w-[50%]">
                <Image
                  src="/med.svg"
                  alt="Med"
                  width={500}
                  height={500}
                  // className="w-[60%]"
                />
              </div>
              <div className="w-[50%] flex flex-col justify-center items-center ">
                <h1 className="text-5xl font-bold text-gray-800">
                  Welcome to Dandelion Fly
                </h1>
                <p className="text-xl text-gray-800">
                  Your personal health assistant
                </p>
              </div>
            </div>
          </HomePageContainer>
        </div>
        <div className="w-full mb-32">
          <HomePageContainer>
            <div className="w-full flex justify-between items-center">
              <Card title="Medical Reminder"></Card>
              <Card title="Medical Reminder" color="blue"></Card>
              <Card title="Medical Reminder" color="orange"></Card>
              {/* <Card title="Medical Reminder"></Card> */}
            </div>
          </HomePageContainer>
        </div>
        <div className="w-full mb-32">
          <ImageSlider />
        </div>
        <div className="w-full mb-32">
          <HomePageContainer>
            <div className="w-full flex justify-between items-center">
              <FAQ />
            </div>
          </HomePageContainer>
        </div>
        <div className="w-full mb-32">
          <HomePageContainer>
            <div className="w-full flex justify-between items-center">
              <Testimonial />
            </div>
          </HomePageContainer>
        </div>
      </div>
    </AuthWrapper>
  );
}
