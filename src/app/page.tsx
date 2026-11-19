"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { rutaInicio } from "@/lib/menu";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session === null) router.replace("/catalogo");
    else if (session) router.replace(rutaInicio(session.role));
  }, [session, router]);

  return null;
}
