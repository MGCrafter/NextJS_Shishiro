import { DIRECTUS_URL, MODELS } from "../lib/config.js"; 
import Spinner from "../components/ui/spinner";
import Footer from "@/components/footer.js";
import InteractiveContent from "@/components/InteractiveContent";

// Importiere die Typdefinitionen
import { HeaderMessageData, WelcomeMessageData, LinkData } from "../types/directus";

async function getHomePageData() {
  console.log("Fetching data from Directus on the server...");

  try {
    const [headerRes, welcomeRes, linksRes] = await Promise.all([
      fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`),
      fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}`),
      fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}`),
    ]);

    if (!headerRes.ok || !welcomeRes.ok || !linksRes.ok) {
      throw new Error("Failed to fetch data from Directus");
    }

    const headerData = await headerRes.json();
    const welcomeData = await welcomeRes.json();
    const linksData = await linksRes.json();

    console.log("Data fetched successfully on the server.");

    return {
      header: headerData.data[0] as HeaderMessageData,
      welcome: welcomeData.data[0] as WelcomeMessageData,
      links: linksData.data as LinkData[],
    };
  } catch (err) {
    console.error("Error fetching global data:", err);
    throw new Error("Could not load data for the home page. Please try again later.");
  }
}

export default async function HomePage() {
  const { header, welcome, links } = await getHomePageData();

  if (!header || links.length === 0) {
    return <div>Could not load page content.</div>;
  }

  return (
    <div className="video min-h-screen w-full overflow-auto relative">
      {/* Video Background */}
      <div className="absolute inset-0 z-10">
        <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
          <source src="/website.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="m relative z-20 flex flex-col items-center justify-center h-full">
        <h1 className="md:text-6xl text-4xl text-white mt-12">{header.header}</h1>

        {welcome && (
          <h2 className="md:text-4xl text-2xl text-center mt-8 text-white">
            {welcome.message}
          </h2>
        )}

        {/* Hier übergeben wir die Daten an unsere neue Client Component */}
        <InteractiveContent links={links} />
      </div>
    </div>
  );
}