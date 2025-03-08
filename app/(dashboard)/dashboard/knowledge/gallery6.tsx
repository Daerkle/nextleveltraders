"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader } from "./card"
import { GlowingEffect } from "@/components/ui/glowing-effect"

interface Gallery6Props {
  heading: string
  demoUrl?: string
  items: {
    id: string
    title: string
    summary: string
    url: string
    image: string
  }[]
}

export function Gallery6({ heading, items }: Gallery6Props) {
  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          {items.map((item) => (
            <Link key={item.id} href={item.url} className="block">
              <div className="relative group cursor-pointer">
                <Card className="relative overflow-hidden transition-colors hover:bg-zinc-900/50">
                  <div className="absolute inset-0">
                    <GlowingEffect>
                      <div />
                    </GlowingEffect>
                  </div>
                  <CardHeader className="relative h-40 overflow-hidden">
                    <div className="flex items-center justify-center h-full">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={100}
                        height={100}
                        className="object-contain transition-transform group-hover:scale-105"
                        priority={true}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-20 p-6">
                    <h3 className="text-xl font-semibold tracking-tight text-zinc-100 group-hover:underline mb-2">
                      {item.title}
                    </h3>
                    <CardDescription className="line-clamp-3 text-zinc-400">
                      {item.summary}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
