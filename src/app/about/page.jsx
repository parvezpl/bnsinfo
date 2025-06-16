'use client';
import React from "react";
import { Card, CardContent } from "../../components/ui/card"; // Adjust the import path as necessary
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">About BNSINFO</h1>
        
        <Card className="shadow-lg rounded-2xl p-6 bg-white">
          <CardContent>
            <p className="text-lg mb-4">
              <strong>BNSINFO</strong> is your intelligent legal assistant dedicated to providing comprehensive details of the <strong>Bhartiya Nyan Sahita 2023</strong> (भारतीय ज्ञान संहिता 2023).
            </p>

            <p className="text-lg mb-4">
              Using cutting-edge <strong>AI-powered search technology</strong>, BNSINFO allows users to dynamically search and explore legal sections, acts, and provisions with accuracy and speed. Whether you are a lawyer, student, researcher, or just curious about Indian law, BNSINFO simplifies legal research and makes the law more accessible.
            </p>

            <p className="text-lg mb-4">
              Our platform leverages modern technologies like <strong>Next.js</strong>, <strong>MongoDB</strong>, and <strong>Machine Learning models</strong> to process complex legal texts, enabling smart suggestions, predictive search, and detailed explanations for each section of the BNS 2023.
            </p>

            <p className="text-lg mb-4">
              Our goal is to bridge the gap between complex legal information and everyday users by making legal knowledge simple, searchable, and understandable.
            </p>

            <p className="text-lg text-center text-blue-700 font-semibold">
              Welcome to the future of legal search — Welcome to BNSINFO.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}