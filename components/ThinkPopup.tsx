import { X } from "lucide-react";

interface ThinkPopupProps {
  isOpen: boolean;
  onClose: () => void;
  messageContent: string;
}

const ThinkPopup = ({
  isOpen,
  onClose,
  messageContent = "",
}: ThinkPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-150 rounded-lg w-[80%] justify-self-center align-self-center mt-[5%]">
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm hover:cursor-pointer w-full"
        onClick={onClose}
      />

      <div className="relative z-50 w-full  rounded-lg bg-white p-12 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="overflow-auto text-black h-120 w-full p-4">
          {messageContent}
        </div>
      </div>
    </div>
  );
};

export default ThinkPopup;
