import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { GradientText, CTAGroup } from "@/components/ui-system";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white px-4 py-24 sm:px-6 lg:px-8">
        {/* Light atmospheric background */}
        <div className="pointer-events-none absolute left-0 top-16 h-96 w-96 -translate-x-1/3 rounded-full bg-royal-purple/5 blur-3xl animate-float motion-reduce:animate-none" />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/4 rounded-full bg-emerald-green/5 blur-3xl animate-float motion-reduce:animate-none"
          style={{ animationDelay: "1.2s" }}
        />

        <div className="relative z-10 mx-auto max-w-xl text-center">
          <p className="font-heading text-7xl font-bold leading-none tracking-tight md:text-8xl">
            <GradientText>404</GradientText>
          </p>
          <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight text-midnight-navy md:text-4xl">
            {t("notFound.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-cool-gray">
            {t("notFound.subtitle")}
          </p>
          <CTAGroup
            className="mt-10 justify-center"
            primary={{ label: t("notFound.goHome"), href: "/" }}
            secondary={{ label: t("notFound.contact"), href: "/contact", icon: MessageSquare }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
