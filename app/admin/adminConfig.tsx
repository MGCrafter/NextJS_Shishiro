import LinkEditor from "../../components/admin/LinkEditor";
import HeaderEditor from "../../components/admin/HeaderEditor";
import WelcomeEditor from "../../components/admin/WelcomeEditor";
import VideoEditor from "../../components/admin/VideoEditor";

export const adminTabs = [
  {
    title: "Links",
    value: "links",
    content: (
      <div className="w-full max-h-[calc(100vh-350px)] overflow-y-auto p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="mb-8 border-b border-slate-800 pb-4">
          <h2 className="text-3xl font-bold text-white">Links verwalten</h2>
          <p className="text-slate-400 mt-2">Hier kannst du die Links auf der Hauptseite bearbeiten, hinzufügen oder löschen.</p>
        </div>
        <LinkEditor />
      </div>
    ),
  },
  {
    title: "Header",
    value: "header",
    content: (
      <div className="w-full max-h-[calc(100vh-350px)] overflow-y-auto p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="mb-8 border-b border-slate-800 pb-4">
          <h2 className="text-3xl font-bold text-white">Header verwalten</h2>
          <p className="text-slate-400 mt-2">Passe den Haupttitel der Seite an.</p>
        </div>
        <HeaderEditor />
      </div>
    ),
  },
  {
    title: "Welcome",
    value: "welcome",
    content: (
      <div className="w-full max-h-[calc(100vh-350px)] overflow-y-auto p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="mb-8 border-b border-slate-800 pb-4">
          <h2 className="text-3xl font-bold text-white">Welcome Message verwalten</h2>
          <p className="text-slate-400 mt-2">Bearbeite die Begrüßungsnachricht unter dem Header.</p>
        </div>
        <WelcomeEditor />
      </div>
    ),
  },
  {
    title: "Video",
    value: "video",
    content: (
      <div className="w-full max-h-[calc(100vh-350px)] overflow-y-auto p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="mb-8 border-b border-slate-800 pb-4">
          <h2 className="text-3xl font-bold text-white">Background Video/GIF verwalten</h2>
          <p className="text-slate-400 mt-2">Ändere das Hintergrundvideo oder GIF der Hauptseite. Du kannst Videos/GIFs in den public-Ordner legen oder eine externe URL verwenden (z.B. Discord CDN Links).</p>
        </div>
        <VideoEditor />
      </div>
    ),
  },
];