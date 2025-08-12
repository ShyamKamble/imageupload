"use client";
import { useState } from "react";
import { supabase } from "../../../lib/superbaseClient";
import { FileUpload } from "../../../componentbyme/Fileupload"; // <-- use the minimal B/W version
import ThemeToggleButton from "@/components/ui/theme-toggle-button.jsx";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../components/ui/alert-dialog"; // adjust import path based on your setup
import { NavigationMenuDemo } from "@/componentbyme/Navbar.jsx";


export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const uploadImage = async () => {
    try {
      setUploading(true);

      if (!file) {
        alert("Please select a file first!");
        return;
      }

      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("firstproject")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("firstproject")
        .getPublicUrl(fileName);

      setImageUrl(publicUrlData.publicUrl);
      setAlertOpen(true);  // show shadcn dialog instead of alert
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center p-6 bg-background">
       <div className="
       fixed top-0 left-1/2 
        w-full max-w-2xl md:max-w-4xl 
        transform -translate-x-1/2
        z-50
        bg-transparent
        backdrop-blur-md
        shadow-lg  
        rounded-xl 
       
        px-6 py-4
        transition-all duration-300
      ">
        <NavigationMenuDemo />
      </div>
      <div className="max-w-xl w-full bg-card border border-border rounded-xl shadow-sm animate-fade-in flex flex-col items-center p-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">
          Upload Image to Supabase
        </h1>

        {/* File upload dropzone */}
        <FileUpload
          onChange={(files) => {
            if (files.length > 0) setFile(files[0]);
          }}
        />

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={uploadImage}
            disabled={uploading}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          {file && (
            <span className="text-sm text-muted-foreground truncate max-w-xs">
              {file.name}
            </span>
          )}
        </div>

        {imageUrl && (
          <div className="mt-6 w-full">
            <h3 className="text-sm font-medium mb-2">Uploaded Image:</h3>
            <div className="rounded-lg overflow-hidden border border-border">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Shadcn alert dialog for success message */}
       <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Upload successful!</AlertDialogTitle>
              <AlertDialogDescription>
                Your file has been successfully uploaded to Supabase storage.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAlertOpen(false)}>
                Close
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => setAlertOpen(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
       <div className="fixed bottom-5 right-5 z-50">
              <ThemeToggleButton
                showLabel
                variant="gif"
                url="https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s"
              />
            </div>
    </section>
  );
}
