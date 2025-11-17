"use client";

import * as motion from "framer-motion/client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import ReviewCard from "@/components/common/ReviewCard";
import { reviewsData } from "../../../utils/mockData";
import { cn } from "@/lib/utils";

export default function ReviewsCarousel() {
  return (
    <motion.div
      initial={{ x: "100px", opacity: 0 }}
      whileInView={{ x: "0", opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className=" mb-6 md:mb-9"
      >
        <div className="flex items-end sm:items-center max-w-7xl mx-auto mb-6 md:mb-10 px-4 xl:px-0">
          <motion.h2
            initial={{ y: "100px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className={cn([
              "text-[32px] leading-[36px] md:text-5xl capitalize mr-auto",
            ])}
          >
            OUR HAPPY CUSTOMERS
          </motion.h2>
        </div>

        <CarouselContent>
          {reviewsData.map((review) => (
            <CarouselItem
              key={review.id}
              className=" max-w-[358px] sm:max-w-[400px] pl-5"
            >
              <ReviewCard className="h-full" data={review} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </motion.div>
  );
}
