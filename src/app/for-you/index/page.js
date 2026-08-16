"use client";
import { useState, useEffect } from "react";
import { FileUpload } from "../../../componentbyme/Fileupload";
import ThemeToggleButton from "@/components/ui/theme-toggle-button.jsx";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../components/ui/alert-dialog";
import { NavigationMenuDemo } from "@/componentbyme/Navbar.jsx";
import { imageAPI } from "@/lib/api";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userImages, setUserImages] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      loadUserImages();
    }
  }, []);

  const loadUserImages = async () => {
    setLoading(true);
    try {
      const images = await imageAPI.getImages();
      setUserImages(images || []);
    } catch (err) {
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    try {
      setUploading(true);

      if (!file) {
        alert('Please select a file first!');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in to upload images!');
        return;
      }

      const result = await imageAPI.uploadImage(file);
      console.log('Upload success:', result);
      
      setAlertOpen(true);
      setFile(null);
      await loadUserImages();
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (fullPath, fileName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delete-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fullPath }),
      });

      if (!res.ok) throw new Error('Failed to delete image');

      await loadUserImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen flex justify-center items-center p-6 bg-background">
        <div className="fixed top-0 left-0 right-0 w-full z-50 bg-transparent backdrop-blur-md shadow-lg rounded-xl px-4 md:px-6 py-4 transition-all duration-300">
          <NavigationMenuDemo />
        </div>
        <div className="max-w-xl w-full bg-card border border-border rounded-xl shadow-sm animate-fade-in flex flex-col items-center p-6">
          <h1 className="text-2xl font-semibold tracking-tight mb-4">Please sign in to upload images</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex justify-center items-center p-6 bg-background">
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-transparent backdrop-blur-md shadow-lg rounded-xl px-4 md:px-6 py-4 transition-all duration-300">
        <NavigationMenuDemo />
      </div>

      <div className="max-w-xl w-full bg-card border border-border rounded-xl shadow-sm animate-fade-in flex flex-col items-center p-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Upload Image</h1>

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
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {file && (
            <span className="text-sm text-muted-foreground truncate max-w-xs">
              {file.name}
            </span>
          )}
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-muted-foreground">Loading your images...</div>
        ) : userImages.length > 0 ? (
          <div className="mt-6 w-full">
            <h3 className="text-sm font-medium mb-2">Your Uploaded Images:</h3>
            <div className="space-y-4">
              {userImages.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={image.url}
                    alt={image.fileName || 'Uploaded image'}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  <div className="p-2 bg-muted/50 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground truncate">
                      {image.fileName}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(image.url);
                          alert("Share link copied!");
                        }}
                        className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        Copy Link
                      </button>

                      <button
                        onClick={() => deleteImage(image.s3_key, image.fileName)}
                        className="text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 text-sm text-muted-foreground">No images uploaded yet.</div>
        )}

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Upload successful!</AlertDialogTitle>
              <AlertDialogDescription>
                Your file has been successfully uploaded.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAlertOpen(false)}>Close</AlertDialogCancel>
              <AlertDialogAction onClick={() => setAlertOpen(false)}>OK</AlertDialogAction>
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
