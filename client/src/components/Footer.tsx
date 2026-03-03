"use client";

import { useAppStore } from "@/lib/store";
import { Scale, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const { language } = useAppStore();
  const isHi = language === "hi";

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="tricolour-top" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-6 h-6 text-saffron-500" />
              <span className="text-xl font-bold text-white">{isHi ? "न्यायसेतु" : "NyayaSetu"}</span>
            </div>
            <p className="text-sm text-gray-400">
              {isHi
                ? "AI-संचालित कानूनी नेविगेशन प्लेटफॉर्म। यह कानूनी सलाह नहीं है।"
                : "AI-powered legal navigation platform. This is not legal advice."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">{isHi ? "त्वरित लिंक" : "Quick Links"}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/rights" className="hover:text-white transition-colors">{isHi ? "अपने अधिकार जानें" : "Know Your Rights"}</Link></li>
              <li><Link href="/directory" className="hover:text-white transition-colors">{isHi ? "कार्यालय खोजें" : "Find Offices"}</Link></li>
              <li><Link href="/helplines" className="hover:text-white transition-colors">{isHi ? "हेल्पलाइन" : "Helplines"}</Link></li>
            </ul>
          </div>

          {/* Important Numbers */}
          <div>
            <h3 className="text-white font-semibold mb-3">{isHi ? "महत्वपूर्ण नंबर" : "Important Numbers"}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:112" className="hover:text-white">112 — {isHi ? "आपातकालीन" : "Emergency"}</a></li>
              <li><a href="tel:181" className="hover:text-white">181 — {isHi ? "महिला हेल्पलाइन" : "Women Helpline"}</a></li>
              <li><a href="tel:1098" className="hover:text-white">1098 — {isHi ? "बाल हेल्पलाइन" : "Child Helpline"}</a></li>
              <li><a href="tel:1930" className="hover:text-white">1930 — {isHi ? "साइबर अपराध" : "Cyber Crime"}</a></li>
              <li><a href="tel:15100" className="hover:text-white">15100 — {isHi ? "कानूनी सहायता (नालसा)" : "Legal Aid (NALSA)"}</a></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-white font-semibold mb-3">{isHi ? "अस्वीकरण" : "Disclaimer"}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {isHi
                ? "न्यायसेतु AI-आधारित मार्गदर्शन प्रदान करता है और पेशेवर कानूनी सलाह का विकल्प नहीं है। गंभीर मामलों में कृपया योग्य वकील से परामर्श करें।"
                : "NyayaSetu provides AI-based guidance and is not a substitute for professional legal advice. Please consult a qualified lawyer for serious matters."}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} NyayaSetu. All rights reserved.</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for India
          </p>
        </div>
      </div>
    </footer>
  );
}
