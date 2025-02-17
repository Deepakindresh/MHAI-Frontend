export const Card = ({
  title,
  color = "",
}: {
  title: string;
  color?: string;
}) =>
  color === "orange" ? (
    <div
      className={`w-56 h-72 bg-white rounded-2xl p-4 flex justify-center items-center shadow-md shadow-[#FF6200]`}
    >
      <h2 className="text-2xl text-black font-semibold text-center">{title}</h2>
    </div>
  ) : color === "blue" ? (
    <div
      className={`w-56 h-72 bg-white rounded-2xl p-4 flex justify-center items-center shadow-md shadow-violet-600`}
    >
      <h2 className="text-2xl text-black font-semibold text-center">{title}</h2>
    </div>
  ) : (
    <div
      className={`w-56 h-72 bg-white rounded-2xl p-4 flex justify-center items-center shadow-md shadow-fuchsia-600`}
    >
      <h2 className="text-2xl text-black font-semibold text-center">{title}</h2>
    </div>
  );
