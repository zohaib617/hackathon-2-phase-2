'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Yes, Continue',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantColors = {
    danger: {
      icon: '⚠️',
      button: 'danger',
    },
    primary: {
      icon: 'ℹ️',
      button: 'primary',
    },
    warning: {
      icon: '!',
      button: 'warning',
    },
  };

  const selectedVariant = variantColors[variant];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 text-center">
            <div className="mb-3 text-4xl">{selectedVariant.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>

          <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
            {message}
          </p>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              variant={selectedVariant.button as any}
              className="flex-1"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}