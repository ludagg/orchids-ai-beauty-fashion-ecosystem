"use client";

import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Scissors,
  Star,
  ShieldCheck,
  CreditCard
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const steps = ["Service", "Date & Time", "Payment"];

const availableServices = [
  { id: 1, name: "Premium Haircut", price: "₹800", duration: "45 min" },
  { id: 2, name: "Hydra Facial", price: "₹2,500", duration: "60 min" },
  { id: 3, name: "Hair Coloring", price: "₹4,500", duration: "120 min" },
  { id: 4, name: "Beard Styling", price: "₹500", duration: "30 min" }
];

const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

export default function SalonBookingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null as any);
  const [selectedDate, setSelectedDate] = useState(15);
  const [selectedTime, setSelectedTime] = useState("");

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/app/salons">
          <button className="flex items-center gap-2 text-sm font-bold text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-8">
            <ChevronLeft className="w-4 h-4" />
            Back to Salon
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Booking Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep >= i ? "bg-[#1a1a1a] text-white" : "bg-white border border-[#e5e5e5] text-[#c4c4c4]"
                  }`}>
                    {currentStep > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${
                    currentStep >= i ? "text-[#1a1a1a]" : "text-[#c4c4c4]"
                  }`}>
                    {step}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="h-px bg-[#e5e5e5] flex-1 mx-4 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>

            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-[#1a1a1a]">Select Service</h2>
                <div className="grid grid-cols-1 gap-4">
                  {availableServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`w-full p-6 rounded-[24px] border-2 transition-all flex items-center justify-between group ${
                        selectedService?.id === service.id
                          ? "border-[#1a1a1a] bg-white shadow-xl shadow-black/5"
                          : "border-[#e5e5e5] bg-white hover:border-[#c4c4c4]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl transition-colors ${
                          selectedService?.id === service.id ? "bg-[#1a1a1a] text-white" : "bg-[#f5f5f5] text-[#6b6b6b] group-hover:bg-[#e5e5e5]"
                        }`}>
                          <Scissors className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-[#1a1a1a]">{service.name}</h3>
                          <div className="flex items-center gap-1.5 text-xs text-[#6b6b6b] font-medium mt-1">
                            <Clock className="w-3 h-3" />
                            {service.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-[#1a1a1a]">{service.price}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#1a1a1a]">Select Date</h2>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(15 + i)}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                          selectedDate === 15 + i
                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                            : "border-[#e5e5e5] bg-white hover:border-[#c4c4c4]"
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}
                        </span>
                        <span className="text-lg font-bold">{15 + i}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#1a1a1a]">Available Slots</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                          selectedTime === time
                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                            : "border-[#e5e5e5] bg-white hover:border-[#c4c4c4]"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="pt-8 border-t border-[#e5e5e5] flex justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                  currentStep === 0 ? "opacity-0 pointer-events-none" : "hover:bg-[#f5f5f5] text-[#6b6b6b]"
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
                disabled={(currentStep === 0 && !selectedService) || (currentStep === 1 && !selectedTime)}
                className="px-10 py-4 rounded-2xl bg-[#1a1a1a] text-white font-bold hover:bg-[#333] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {currentStep === 2 ? "Confirm Booking" : "Next Step"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="p-6 bg-white border border-[#e5e5e5] rounded-[32px] shadow-sm space-y-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop"
                      alt="Salon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a1a]">Aura Luxury Spa</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-[#6b6b6b]">4.9 (1.2k reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#f5f5f5]">
                  {selectedService && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b6b6b] font-medium">{selectedService.name}</span>
                      <span className="font-bold text-[#1a1a1a]">{selectedService.price}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b6b6b] font-medium">Schedule</span>
                      <span className="font-bold text-[#1a1a1a]">Sep {selectedDate}, {selectedTime}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-[#f5f5f5] flex justify-between items-end">
                    <span className="font-bold text-[#1a1a1a]">Total</span>
                    <span className="text-2xl font-bold text-[#1a1a1a]">{selectedService?.price || "₹0"}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                    Your booking is protected by Priisme Guarantee. Secure payments & verified professionals.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
