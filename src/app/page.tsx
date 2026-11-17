"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/lib/sesion";
import { rutaInicio } from "@/lib/menu";

export default function Home() {
  const router = useRouter();
  const sesion = useSesion();

  useEffect(() => {
    if (sesion === null) router.replace("/login");
    else if (sesion) router.replace(rutaInicio(sesion.rol));
  }, [sesion, router]);

  return null;
}
