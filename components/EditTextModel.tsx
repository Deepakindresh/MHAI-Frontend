import React, { useState } from "react";
import { X } from "lucide-react";

interface EditTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  value?: string;
  messageId?: string;
  onSubmit: (id: string, newText: string) => Promise<void>;
}

const EditTextModal = ({
  isOpen,
  onClose,
  value = "",
  messageId = "",
  onSubmit,
}: EditTextModalProps) => {
  const [newText, setNewText] = useState(value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageId || !newText) return;

    setIsSubmitting(true);
    try {
      await onSubmit(messageId, newText);
      //   setId("");
      //   setNewText("");
      onClose();
    } catch (error) {
      console.error("Error updating text:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm hover:cursor-pointer"
        onClick={onClose}
      />

      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
        >
          <X size={24} />
        </button>

        <h2 className="mb-4 text-xl font-semibold text-black">Edit Text</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label
              htmlFor="newText"
              className="block text-sm font-medium text-gray-700"
            >
              Modify this text and click submit
            </label>
            <textarea
              id="newText"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-linear-to-l from-fuchsia-600 to-violet-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 hover:cursor-pointer"
          >
            {isSubmitting ? "Updating..." : "Update Text"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTextModal;
