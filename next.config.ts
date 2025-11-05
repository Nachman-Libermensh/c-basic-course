import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // הגדרות לGitHub Pages
  // אם הריפו נמצא ב-https://github.com/username/repo-name
  // פתחו את ההערה למשתנה basePath:
  basePath: "/c-basic-course",
  images: {
    unoptimized: true, // נדרש לstatic export
  },
};

export default nextConfig;
