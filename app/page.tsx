import { DIRECTUS_URL, MODELS } from "../lib/config.js";
import Spinner from "../components/ui/spinner";
import Footer from "@/components/footer.js";
import InteractiveContent from "@/components/InteractiveContent";
import { HeaderMessageData, WelcomeMessageData, LinkData, BackgroundVideoData } from "../types/directus";

export const dynamic = 'force-dynamic';

async function getHomePageData() {
  console.log("Fetching data from Directus on the server...");

  try {
    const [headerRes, welcomeRes, linksRes, videoRes, appearanceRes] = await Promise.all([
      fetch(`${DIRECTUS_URL}/items/${MODELS.HEADER}`, { cache: 'no-store' }),
      fetch(`${DIRECTUS_URL}/items/${MODELS.WELCOME}`, { cache: 'no-store' }),
      fetch(`${DIRECTUS_URL}/items/${MODELS.LINKS}?sort=sort`, { cache: 'no-store' }),
      fetch(`${DIRECTUS_URL}/items/${MODELS.BACKGROUND_VIDEO}`, { cache: 'no-store' }),
      fetch(`${DIRECTUS_URL}/items/${MODELS.APPEARANCE}?limit=1`, { cache: 'no-store' })
    ]);

    if (!headerRes.ok || !welcomeRes.ok || !linksRes.ok) {
      throw new Error("Failed to fetch data from Directus");
    }

    const headerData = await headerRes.json();
    const welcomeData = await welcomeRes.json();
    const linksData = await linksRes.json();
    const videoData = await videoRes.json();
    const appearanceData = await appearanceRes.json();

    console.log("Data fetched successfully on the server.");

    const activeVideo = videoData.data?.find((v: BackgroundVideoData) => v.is_active) || videoData.data?.[0];

    return {
      header: headerData.data[0] as HeaderMessageData,
      welcome: welcomeData.data[0] as WelcomeMessageData,
      links: linksData.data as LinkData[],
      video: activeVideo as BackgroundVideoData | null,
      appearance: appearanceData.data?.[0] || null,
    };
  } catch (err) {
    console.error("Error fetching global data:", err);
    throw new Error("Could not load data for the home page. Please try again later.");
  }
}

export default async function HomePage() {
  const { header, welcome, links, video, appearance } = await getHomePageData();

  if (!header || links.length === 0) {
    return <div>Could not load page content.</div>;
  }

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