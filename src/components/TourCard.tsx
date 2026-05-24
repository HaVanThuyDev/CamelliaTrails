import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import type { Tour } from '../data/mockData';
import { MapPin, Clock, Star, Heart, ArrowRight } from 'lucide-react';

interface TourCardProps {
  tour: Tour;
}

export const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const { wishlist, toggleWishlist } = useApp();

  const translateCategory = (cat: string) => {
    switch (cat) {
      case 'Wellness': return 'Trị liệu & Sức khỏe';
      case 'Eco-Tourism': return 'Du lịch Sinh thái';
      case 'Tea Ceremony': return 'Trà đạo';
      case 'Adventure': return 'Khám phá';
      default: return cat;
    }
  };
  const isWishlisted = wishlist.includes(tour.id);

  // Map category to a soothing soft tag color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Wellness':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/30';
      case 'Eco-Tourism':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-900/30';
      case 'Tea Ceremony':
        return 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 border-green-200/50 dark:border-green-900/30';
      case 'Adventure':
        return 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200/50 dark:border-blue-900/30';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group relative rounded-3xl overflow-hidden glass border border-primary/10 dark:border-cream/10 shadow-lg flex flex-col h-full hover:shadow-2xl transition-all duration-300"
    >
      {/* Top Banner Image with Zoom on Hover */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={tour.images[0]}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Transparent Black to Clear Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Favorite Icon Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(tour.id);
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/95 dark:bg-dark-surface/95 flex items-center justify-center border border-primary/15 dark:border-cream/15 text-primary hover:text-accent shadow-md transition-all active:scale-95 cursor-pointer z-10"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              isWishlisted ? 'fill-accent text-accent scale-110' : 'text-primary dark:text-cream/80'
            }`}
          />
        </button>

        {/* Category Tag overlay */}
        <span
          className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full border ${getCategoryColor(
            tour.category
          )}`}
        >
          {translateCategory(tour.category)}
        </span>

        {/* Rating and Duration details at bottom edge of image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 font-medium">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span>{tour.rating.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 font-medium">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>{tour.duration} Ngày</span>
          </div>
        </div>
      </div>

      {/* Card Text & Information Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-xs text-primary/60 dark:text-cream/60 mb-2 font-medium">
          <MapPin className="w-3.5 h-3.5 text-accent" />
          <span>
            {tour.location}, {tour.country}
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold leading-snug text-primary dark:text-cream group-hover:text-accent transition-colors mb-2">
          {tour.title}
        </h3>

        <p className="text-xs text-primary/70 dark:text-cream/70 line-clamp-3 mb-6 font-light leading-relaxed">
          {tour.description}
        </p>

        {/* Pricing & Call to Action button */}
        <div className="mt-auto pt-4 border-t border-primary/5 dark:border-cream/5 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-primary/50 dark:text-cream/50">
              Mỗi khách
            </span>
            <span className="font-serif text-lg font-bold text-primary dark:text-cream">
              ${tour.price.toLocaleString()}
            </span>
          </div>

          <Link
            to={`/tours/${tour.id}`}
            className="flex items-center gap-1 text-xs font-semibold px-4.5 py-2.5 rounded-xl bg-primary dark:bg-accent text-cream dark:text-primary group-hover:gap-2.5 transition-all shadow-md group-hover:shadow-lg"
          >
            <span>Chi tiết Tour</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
