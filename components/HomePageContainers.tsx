"use client";

export const HomePageContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`flex w-full justify-center ${className}

      `}
    >
      <div className="lg:w-[80%] w-full flex flex-col">{children}</div>
    </div>
  );
};
