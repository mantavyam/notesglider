
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavigationTray from '../components/NavigationTray';
import { useNavigate } from 'react-router-dom';

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDocType, setActiveDocType] = useState(0);
  const [clickedDocument, setClickedDocument] = useState<number | null>(null);

  const documents = [
    { 
      id: 0,
      title: 'NEWSLETTER', 
      subTitle: 'Daily Notes',
      path: '/task',
      image: '/landing-assets/landing-2.png',
      location: "NEWSLETTER"
    },
    { 
      id: 1,
      title: 'COMPILATION', 
      subTitle: 'Weekly Compilation',
      path: '/compilation',
      image: '/landing-assets/sample-weekly-compile-notesglider.png',
      location: 'COMPILATION'
    },
    { 
      id: 2,
      title: 'MAGAZINE', 
      subTitle: 'Monthly Outlook',
      path: '/magazine',
      image: '/landing-assets/landing-1.png',
      location: 'MAGAZINE'
    }
  ];

  // Get the active document
  const activeDocument = documents[activeDocType];

  useEffect(() => {
    // If a document is clicked and then clicked again, navigate to its path
    if (clickedDocument !== null && clickedDocument === activeDocType) {
      navigate(documents[clickedDocument].path);
    }
  }, [clickedDocument, navigate, activeDocType, documents]);

  const handleDocumentSelect = (id: number) => {
    // If already selected, set as clicked, otherwise just select it
    if (activeDocType === id) {
      setClickedDocument(id);
    } else {
      setActiveDocType(id);
      setClickedDocument(null);
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          setActiveDocType(prev => (prev > 0 ? prev - 1 : documents.length - 1));
          setClickedDocument(null);
          break;
        case 'ArrowRight':
          setActiveDocType(prev => (prev < documents.length - 1 ? prev + 1 : 0));
          setClickedDocument(null);
          break;
        case 'Enter':
          // Navigate to the selected document's path
          navigate(documents[activeDocType].path);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDocType, navigate, documents]);

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Background overlay with opacity */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-900 to-black opacity-90"></div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      ></div>
      
      {/* Full screen background image for selected document */}
      <motion.div 
        key={activeDocument.image}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-0"
      >
        <img 
          src={activeDocument.image} 
          alt={activeDocument.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0"></div>
      </motion.div>
      
      {/* Content with proper z-index */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Tray */}
        <NavigationTray />
        
        {/* Flex spacer */}
        <div className="flex-1"></div>
        
        {/* Bottom document selection - moved up to avoid overlap with stats bar */}
        <div className="flex items-stretch mb-36">
          {documents.map((doc, index) => {
            const isActive = activeDocType === index;
            
            return (
              <div 
                key={index}
                className={`flex-1 cursor-pointer ${
                  isActive ? 'border-t-4 border-red-600' : ''
                } ${index > 0 ? 'ml-px' : ''}`}
                onClick={() => handleDocumentSelect(index)}
                onMouseEnter={() => setActiveDocType(index)}
                tabIndex={0}
              >
                <div className={`px-4 py-6 ${
                  isActive ? 'bg-red-600' : 'bg-white'
                }`}>
                  <div className="text-xs font-bold mb-1 tracking-wider" style={{ 
                    color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                  }}>
                    {doc.subTitle}
                  </div>
                  <h3 className={`text-xl font-bold tracking-wide ${
                    isActive ? 'text-white' : 'text-black'
                  }`}>
                    {doc.location}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
