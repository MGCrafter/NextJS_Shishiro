import { DIRECTUS_URL, MODELS } from "../lib/config.js";
import InteractiveContent from "@/components/InteractiveContent";
import { fetchCollection } from "@/lib/directus-home";
import { AppearanceSettings, HeaderMessageData, WelcomeMessageData, LinkData, BackgroundVideoData } from "../types/directus";

export const dynamic = 'force-dynamic';
const DIRECTUS_SERVER_URL = process.env.DIRECTUS_INTERNAL_URL || DIRECTUS_URL;

async function getHomePageData() {
  console.log("Fetching data from Directus on the server...");

  try {
    const optional = <T,>(url: string) =>
      fetchCollection<T>(url).catch((error) => {
        console.warn("Could not load optional Directus content:", error);
        return [] as T[];
      });

    const [headerData, welcomeData, linksData, videoData, appearanceData] = await Promise.all([
      fetchCollection<HeaderMessageData>(`${DIRECTUS_SERVER_URL}/items/${MODELS.HEADER}`, { requireItems: true }),
      optional<WelcomeMessageData>(`${DIRECTUS_SERVER_URL}/items/${MODELS.WELCOME}`),
      fetchCollection<LinkData>(`${DIRECTUS_SERVER_URL}/items/${MODELS.LINKS}?sort=sort`, { requireItems: true }),
      optional<BackgroundVideoData>(`${DIRECTUS_SERVER_URL}/items/${MODELS.BACKGROUND_VIDEO}`),
      optional<AppearanceSettings>(`${DIRECTUS_SERVER_URL}/items/${MODELS.APPEARANCE}?limit=1`),
    ]);

    console.log("Data fetched successfully on the server.");

    const activeVideo = videoData.find((v) => v.is_active) || videoData[0];

    return {
      header: headerData[0],
      welcome: welcomeData[0],
      links: linksData,
      video: activeVideo as BackgroundVideoData | null,
      appearance: appearanceData[0] || undefined,
    };
  } catch (err) {
    console.error("Error fetching global data:", err);
    throw new Error("Could not load data for the home page. Please try again later.");
  }
}

export default async function HomePage() {
  const { header, welcome, links, video, appearance } = await getHomePageData();

  const videoUrl = video?.video_url || "/website.mp4";
  const isGif = videoUrl.toLowerCase().endsWith('.gif');

  const fontUrl = header.font
    ? `https://fonts.googleapis.com/css2?family=${header.font.replace(/ /g, '+')}:wght@400;700&display=swap`
    : null;

  return (
    <>
      {fontUrl && (
        <link rel="stylesheet" href={fontUrl} />
      )}
      <div className="video min-h-screen w-full overflow-auto relative">
      <div className="absolute inset-0 z-10">
        {isGif ? (
          <img src={videoUrl} alt="Background" className="w-full h-full object-cover" />
        ) : (
          <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className="m relative z-20 flex flex-col items-center justify-center h-full">
        <h1
          className="md:text-6xl text-4xl text-white mt-12"
          style={header.font ? { fontFamily: header.font } : undefined}
        >
          {header.header}
        </h1>

        {welcome && (
          <h2 className="md:text-4xl text-2xl text-center mt-8 text-white">
            {welcome.message}
          </h2>
        )}

        <InteractiveContent links={links} appearanceSettings={appearance} />
      </div>
    </div>
    </>
  );
}
