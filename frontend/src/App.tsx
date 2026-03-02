import Navbar from "./components/Navbar";
import Workers from "./components/Workers";
import ProjectSection from "./components/ProjectSection";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <Workers />
        <ProjectSection />
      </main>
    </div>
  );
}

export default App;
