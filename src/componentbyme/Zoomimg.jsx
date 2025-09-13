// "use client";

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Trash2 } from "lucide-react";

// export default function ZoomImage({
//   src,
//   alt,
//   onDelete, // callback for delete action
//   thumbClass = "w-full h-60 md:h-96", // same card size as FocusCards
//   layoutKey,
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const id = layoutKey || src;

//   return (
//     <>
//       {/* Thumbnail */}
//       <motion.div
//         layoutId={`image-${id}`}
//         className={`overflow-hidden rounded-lg cursor-pointer ${thumbClass}`}
//         onClick={() => setIsOpen(true)}
//       >
//         <img src={src} alt={alt} className="w-full h-full object-cover" />
//       </motion.div>

//       {/* Zoom Modal */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setIsOpen(false)}
//           >
//             <motion.div
//               layoutId={`image-${id}`}
//               className="relative overflow-hidden rounded-2xl shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <img
//                 src={src}
//                 alt={alt}
//                 className="w-[400px] h-[400px] object-cover"
//               />

//               {/* Trash Button */}
//               <button
//                 onClick={() => {
//                   if (onDelete) onDelete(src);
//                   setIsOpen(false);
//                 }}
//                 className="absolute bottom-3 right-3 backdrop-blur-sm bg-white/30 p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
//               >
//                 <Trash2 size={20} />
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ZoomImage({
  src,
  alt,
  storagePath, // pass the file path from Supabase (e.g., "folder/image.jpg")
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

    const { error } = await supabase
      .storage
      .from("firstproject") // bucket name
      .remove([storagePath]); // exact file path in the bucket

    setDeleting(false);

    if (error) {
      console.error("Error deleting file:", error);
    } else {
      console.log("File deleted:", storagePath);
      if (onDeleted) onDeleted(storagePath);
      setIsOpen(false);
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
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="w-[400px] h-[400px] object-cover"
              />

              {/* Trash Button */}
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="absolute bottom-3 right-3 backdrop-blur-sm bg-white/30 p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
