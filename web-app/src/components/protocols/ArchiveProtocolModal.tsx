import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface ArchiveProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  protocolName: string;
  isArchiving: boolean;
}

export function ArchiveProtocolModal({
  isOpen,
  onClose,
  onConfirm,
  protocolName,
  isArchiving,
}: ArchiveProtocolModalProps) {
  const [confirmChecked, setConfirmChecked] = useState(false);

  const handleClose = () => {
    setConfirmChecked(false);
    onClose();
  };

  const handleConfirm = () => {
    if (confirmChecked) {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Archive Protocol">
      <div className="space-y-4">
        {/* Info Section */}
        <div className="p-4 rounded-lg bg-amber-900/30 border border-amber-800">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-amber-400 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-300">
                Archive "{protocolName}"
              </h3>
              <div className="mt-2 text-sm text-amber-400">
                <p>Archiving this protocol will:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Remove it from your active protocols</li>
                  <li>Stop including it in dose logging</li>
                  <li>Move it to your "Past Protocols" section</li>
                </ul>
                <p className="mt-2 font-medium text-amber-300">
                  Your dose history will be preserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="confirmArchive"
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              disabled={isArchiving}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-surface-border rounded"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="confirmArchive" className="text-sm text-gray-300">
              I understand this protocol will be archived and removed from my
              active protocols.
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isArchiving}
            className="flex-1 py-2 px-4 border border-surface-border rounded-lg text-sm font-medium text-gray-300 hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!confirmChecked || isArchiving}
            className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isArchiving ? "Archiving..." : "Archive Protocol"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
