import allProjects from "@/data/all_projects.json";

export type Project = {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  thumbnail: string;
  tags: string[];
  github_url?: string;
  demo_url?: string | null;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  featured_image?: string | null;
  published: boolean;
  published_at?: string;
  reading_time: number;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
};

// Get all projects
export async function getProjects() {
  try {
    // Ensure the JSON data matches the Project type
    const projects = allProjects || ([] as Project[]);
    // Sort by order_index (ascending)
    return projects
      .filter((project) => project.show)
      .sort((a, b) => a.order_index - b.order_index);
  } catch (error) {
    throw new Error("Failed to load projects from JSON");
  }
}

// Get featured projects
export async function getFeaturedProjects() {
  try {
    const projects = allProjects || ([] as Project[]);
    // Filter featured projects and sort by order_index
    return projects
      .filter((project) => project.featured)
      .sort((a, b) => a.order_index - b.order_index);
  } catch (error) {
    throw new Error("Failed to load featured projects from JSON");
  }
}

// Handle contact form submissions
export async function submitContactForm(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  try {
    // Since JSON is static, you can't insert new data.
    // Option 1: Log to console (for testing)
    console.log("Contact form submission:", data);

    // Option 2: Write to a file (if you want to persist submissions locally)
    /*
      import fs from 'fs/promises';
      import path from 'path';
      const submissionsPath = path.join(process.cwd(), 'data', 'contact_submissions.json');
      const submissions = JSON.parse(await fs.readFile(submissionsPath, 'utf-8')) || [];
      submissions.push({
        ...data,
        id: crypto.randomUUID(),
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      await fs.writeFile(submissionsPath, JSON.stringify(submissions, null, 2));
      */

    // Option 3: Send to an external service (e.g., email or third-party API)
    // Example: Integrate with an email service like SendGrid or a webhook
    /*
      const response = await fetch('https://api.email-service.com/send', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to send contact form');
      */

    return true;
  } catch (error) {
    throw new Error("Failed to process contact form submission");
  }
}
