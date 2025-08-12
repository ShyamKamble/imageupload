import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const fadeVariant = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
};

export const FileUpload = ({ onChange }) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.01 }}
        className="p-8 group/file rounded-lg cursor-pointer w-full relative overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-all"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <p className="font-medium text-neutral-800 dark:text-neutral-200">
            Upload file
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Drag & drop or click to browse
          </p>

          <div className="relative w-full mt-6 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  variants={fadeVariant}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "relative z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start p-4 mt-3 w-full mx-auto rounded-md border border-neutral-200 dark:border-neutral-800",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  <div className="flex text-xs flex-col sm:flex-row sm:items-center w-full mt-1 justify-between text-neutral-500 dark:text-neutral-400">
                    <p>{file.type}</p>
                    <p>Modified {new Date(file.lastModified).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}

            {!files.length && (
              <motion.div
                variants={fadeVariant}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.25 }}
                className="relative z-40 flex items-center justify-center h-28 mt-4 w-full max-w-[8rem] mx-auto rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              >
                {isDragActive ? (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Drop it here
                  </p>
                ) : (
                  <IconUpload className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
