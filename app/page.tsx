import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HomeMarketing } from "@/components/landing/home-marketing";
import "./landing-glass.css";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <HomeMarketing />;
}
