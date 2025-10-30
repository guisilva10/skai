"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/_components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section
      id="contato"
      className="relative flex w-full flex-col items-center justify-center overflow-visible px-5 pb-10"
    >
      <div className="absolute inset-0 top-[-90px]">
        <svg
          className="h-full w-full"
          viewBox="0 0 1388 825"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <mask
            id="mask0_182_1049"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="269"
            y="27"
            width="850"
            height="493"
          >
            <rect
              x="269.215"
              y="27.4062"
              width="849.57"
              height="492.311"
              fill="url(#paint0_linear_182_1049)"
            />
          </mask>
          <g mask="url(#mask0_182_1049)">
            <g filter="url(#filter0_f_182_1049)">
              <ellipse
                cx="694"
                cy="-93.0414"
                rx="670.109"
                ry="354.908"
                fill="url(#paint1_radial_182_1049)"
                fillOpacity="0.8"
              />
            </g>
            <ellipse
              cx="694"
              cy="-91.5385"
              rx="670.109"
              ry="354.908"
              fill="url(#paint2_linear_182_1049)"
            />
            <ellipse
              cx="694"
              cy="-93.0414"
              rx="670.109"
              ry="354.908"
              fill="url(#paint3_linear_182_1049)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_182_1049"
              x="-234.109"
              y="-705.949"
              width="1856.22"
              height="1225.82"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="129"
                result="effect1_foregroundBlur_182_1049"
              />
            </filter>
            <linearGradient
              id="paint0_linear_182_1049"
              x1="1118.79"
              y1="273.562"
              x2="269.215"
              y2="273.562"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--background)" stopOpacity="0" />
              <stop
                offset="0.2"
                stopColor="var(--background)"
                stopOpacity="0.8"
              />
              <stop
                offset="0.8"
                stopColor="var(--background)"
                stopOpacity="0.8"
              />
              <stop offset="1" stopColor="var(--background)" stopOpacity="0" />
            </linearGradient>
            <radialGradient
              id="paint1_radial_182_1049"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(683.482 245.884) rotate(-3.78676) scale(469.009 248.4)"
            >
              <stop offset="0.1294" stopColor="var(--primary)" />
              <stop offset="0.2347" stopColor="var(--primary)" />
              <stop offset="0.3" stopColor="var(--primary)" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id="paint2_linear_182_1049"
              x1="694"
              y1="-446.446"
              x2="694"
              y2="263.369"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_182_1049"
              x1="694"
              y1="-447.949"
              x2="694"
              y2="261.866"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--background)" />
              <stop offset="1" stopColor="var(--background)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="mx-auto w-full lg:max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary relative overflow-hidden rounded-3xl border p-12 text-center md:p-16"
        >
          <div className="relative z-10">
            <h2 className="mb-6 text-4xl font-bold text-balance md:text-5xl lg:text-6xl">
              Pronta para descobrir sua rotina ideal?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-pretty text-white md:text-xl">
              Chega de gastar com produtos que não funcionam. Responda nosso
              quiz rápido e deixe nossa IA encontrar a rotina de skincare
              perfeita para você.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                className="group bg-foreground hover:bg-foreground/80 rounded-full px-4 py-6 text-base font-semibold text-white transition-all duration-300 lg:w-[23em]"
              >
                <Link href="/quiz" className="px-0">
                  Iniciar Questionário
                  <span className="rounded-full bg-white p-1 transition-all duration-300 group-hover:translate-x-1">
                    <ArrowRight className="text-foreground size-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
