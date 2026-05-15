"use client";

import { CarFront } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export function SplineSceneBasic() {
  return (
    <Card className="relative h-[360px] w-full overflow-hidden bg-black/[0.96] text-white">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />

      <div className="grid h-full md:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10 flex flex-col justify-center p-6">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-neutral-200">
            <CarFront className="h-4 w-4" />
            Showroom interactif
          </span>
          <h2 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-3xl font-bold leading-tight text-transparent">
            AutoPilot 3D
          </h2>
          <p className="mt-4 max-w-[220px] text-sm leading-6 text-neutral-300">
            Scene Spline premium pour habiller le showroom et renforcer la demo
            du chatbot SAV.
          </p>
        </div>

        <div className="relative min-h-[180px]">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </div>
      </div>
    </Card>
  );
}
