import "../style.css";
import CreatePostForm from "./post-form";

export const metadata = {
  title: "Create Post • BNS Info",
  description: "Create a new forum post for BNS Info community.",
};

export default function CreatePostPage() {
  return (
    <main className="forums-page">
      <section className="forums-hero">
        <div className="forums-hero-inner">
          <div className="forums-badge">New Post</div>
          <h1>नया पोस्ट बनाएं</h1>
          <p>अपना प्रश्न या चर्चा लिखें और समुदाय के साथ साझा करें।</p>
        </div>
      </section>

      <CreatePostForm />
    </main>
  );
}
