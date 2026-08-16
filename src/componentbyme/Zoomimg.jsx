"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { imageAPI } from "../lib/api";

export default function ZoomImage({
  src,
  alt,
  storagePath, // file path/ID for deletion
  thumbClass = "w-full h-60 md:h-96",
  layoutKey,
  onDeleted, // optional: update parent state after deletion
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const id = layoutKey || src;

  const handleDelete = async () => {
    if (!storagePath) {
      console.error("No storagePath provided for deletion");
      return;
    }

    setDeleting(true);

    try {
      await imageAPI.deleteImageByPath(storagePath);
      console.log("File deleted:", storagePath);
      if (onDeleted) onDeleted(storagePath);
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete image. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Thumbnail */}
      <motion.div
        layoutId={`image-${id}`}
        className={`overflow-hidden rounded-lg cursor-pointer ${thumbClass}`}
        onClick={() => setIsOpen(true)}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              layoutId={`image-${id}`}
              className="relative overflow-hidden rounded-2xl shadow-2xl max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-full max-w-[400px] max-h-[400px] object-cover"
              />

              {/* Trash Button */}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="absolute bottom-3 right-3 backdrop-blur-sm bg-white/30 p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                title={deleting ? "Deleting..." : "Delete image"}
              >
                {deleting ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Trash2 size={20} />
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
