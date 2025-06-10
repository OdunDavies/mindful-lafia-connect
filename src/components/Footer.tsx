
import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">FULAFIA Counselling</span>
            </div>
            <p className="text-slate-300 mb-4">
              Supporting student mental health and wellbeing at Federal University of Lafia.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-300">
              <li><a href="/resources" className="hover:text-white transition-colors">Mental Health Resources</a></li>
              <li><a href="/emergency" className="hover:text-white transition-colors">Emergency Support</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-slate-300">
              <li><a href="/crisis-support" className="hover:text-white transition-colors">Crisis Support</a></li>
              <li><a href="/counselling" className="hover:text-white transition-colors">Counselling Services</a></li>
              <li><a href="/peer-support" className="hover:text-white transition-colors">Peer Support</a></li>
              <li><a href="/workshops" className="hover:text-white transition-colors">Workshops</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+234 806 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>counselling@fulafia.edu.ng</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Student Affairs Division, FULAFIA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 Federal University of Lafia Student Affairs Division. All rights reserved.</p>
          <p className="mt-2">24/7 Crisis Hotline: 988 (Suicide & Crisis Lifeline)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
