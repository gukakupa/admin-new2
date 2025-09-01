export const translations = {
  ka: {
    // Header
    services: "სერვისები",
    about: "ჩვენ შესახებ",
    contact: "კონტაქტი",
    caseTracking: "საქმის თვალთვალი",
    
    // Hero Section
    heroTitle: "მონაცემთა აღდგენის პროფესიონალები",
    heroSubtitle: "DataLab Georgia - საქართველოს წამყვანი მონაცემთა აღდგენის სერვისი. ჩვენ ვაღვადგენთ თქვენს მნიშვნელოვან ინფორმაციას ნებისმიერი მოწყობილობიდან.",
    getStarted: "დაიწყეთ ახლავე",
    freeConsultation: "უფასო კონსულტაცია",
    
    // Services
    servicesTitle: "ჩვენი სერვისები",
    servicesSubtitle: "თანამედროვე ტექნოლოგიებითა და გამოცდილი სპეციალისტებით ვაღვადგენთ მონაცემებს",
    
    dataRecovery: "მონაცემთა აღდგენა",
    dataRecoveryDesc: "HDD, SSD, RAID, USB, SD ბარათებიდან მონაცემთა აღდგენა",
    
    dataBackup: "მონაცემთა სარეზერვო კოპირება",
    dataBackupDesc: "რეგულარული სარეზერვო კოპირება და მონაცემთა უსაფრთხოება",
    
    hardwareRepair: "აპარატული შეკეთება",
    hardwareRepairDesc: "დაზიანებული მონაცემთა შენახვის მოწყობილობების შეკეთება",
    
    forensicRecovery: "სასამართლო მონაცემთა აღდგენა",
    forensicRecoveryDesc: "იურიდიული მიზნებისთვის მონაცემთა აღდგენა და ანალიზი",
    
    // Service Request
    serviceRequestTitle: "სერვისის მოთხოვნა",
    serviceRequestSubtitle: "მოგვწერეთ თქვენი პრობლემის შესახებ და მიიღეთ პროფესიონალური რჩევა",
    
    // Price Estimation
    priceEstimationTitle: "ფასის გაანგარიშება",
    priceEstimationSubtitle: "მიიღეთ წინასწარი ფასის შეფასება",
    
    // Case Tracking
    caseTrackingTitle: "საქმის თვალთვალი",
    caseTrackingSubtitle: "შეამოწმეთ თქვენი საქმის სტატუსი",
    
    // Testimonials
    testimonialsTitle: "მომხმარებელთა გამოხმაურება",
    testimonialsSubtitle: "რას ამბობენ ჩვენი კმაყოფილი კლიენტები",
    
    // Contact
    contactTitle: "დაგვიკავშირდით",
    contactSubtitle: "მზად ვართ გაგეხმაროთ 24/7",
    
    // Footer
    footerDesc: "DataLab Georgia - საქართველოს საიმედო მონაცემთა აღდგენის სერვისი",
    quickLinks: "სწრაფი ლინკები",
    contactInfo: "საკონტაქტო ინფორმაცია",
    allRightsReserved: "ყველა უფლება დაცულია"
  },
  
  en: {
    // Header
    services: "Services",
    about: "About",
    contact: "Contact",
    caseTracking: "Case Tracking",
    
    // Hero Section
    heroTitle: "Data Recovery Professionals",
    heroSubtitle: "DataLab Georgia - Georgia's leading data recovery service. We restore your important information from any device.",
    getStarted: "Get Started",
    freeConsultation: "Free Consultation",
    
    // Services
    servicesTitle: "Our Services",
    servicesSubtitle: "We recover data using modern technologies and experienced specialists",
    
    dataRecovery: "Data Recovery",
    dataRecoveryDesc: "Data recovery from HDD, SSD, RAID, USB, SD cards",
    
    dataBackup: "Data Backup Solutions",
    dataBackupDesc: "Regular backup and data security solutions",
    
    hardwareRepair: "Hardware Repair",
    hardwareRepairDesc: "Repair of damaged data storage devices",
    
    forensicRecovery: "Forensic Data Recovery",
    forensicRecoveryDesc: "Data recovery and analysis for legal purposes",
    
    // Service Request
    serviceRequestTitle: "Service Request",
    serviceRequestSubtitle: "Tell us about your problem and get professional advice",
    
    // Price Estimation
    priceEstimationTitle: "Price Estimation",
    priceEstimationSubtitle: "Get a preliminary price assessment",
    
    // Case Tracking
    caseTrackingTitle: "Case Tracking",
    caseTrackingSubtitle: "Check the status of your case",
    
    // Testimonials
    testimonialsTitle: "Customer Testimonials",
    testimonialsSubtitle: "What our satisfied clients say",
    
    // Contact
    contactTitle: "Contact Us",
    contactSubtitle: "We're ready to help you 24/7",
    
    // Footer
    footerDesc: "DataLab Georgia - Georgia's reliable data recovery service",
    quickLinks: "Quick Links",
    contactInfo: "Contact Information",
    allRightsReserved: "All rights reserved"
  }
};

// Mock data for services
export const services = [
  {
    id: 1,
    icon: "HardDrive",
    titleKey: "dataRecovery",
    descKey: "dataRecoveryDesc",
    features: ["HDD Recovery", "SSD Recovery", "RAID Recovery", "USB Recovery", "SD Card Recovery"],
    price: "დან 100₾"
  },
  {
    id: 2,
    icon: "Shield",
    titleKey: "dataBackup",
    descKey: "dataBackupDesc",
    features: ["Cloud Backup", "Local Backup", "Automated Backup", "Data Encryption"],
    price: "დან 50₾"
  },
  {
    id: 3,
    icon: "Wrench",
    titleKey: "hardwareRepair",
    descKey: "hardwareRepairDesc",
    features: ["PCB Repair", "Head Replacement", "Component Repair", "Clean Room Service"],
    price: "დან 150₾"
  },
  {
    id: 4,
    icon: "Search",
    titleKey: "forensicRecovery",
    descKey: "forensicRecoveryDesc",
    features: ["Legal Documentation", "Chain of Custody", "Expert Testimony", "Court Admissible"],
    price: "დან 300₾"
  }
];

// Mock testimonials
export const testimonials = [
  {
    id: 1,
    name: "ნინო ღაღანიძე",
    nameEn: "Nino Ghaganidze",
    position: "ბიზნეს ანალიტიკოსი",
    positionEn: "Business Analyst",
    rating: 5,
    textKa: "DataLab Georgia-მ ჩემი კომპანიის მნიშვნელოვანი მონაცემები აღადგინა დაზიანებული SSD-დან. შედეგი შესანიშნავი იყო!",
    textEn: "DataLab Georgia recovered my company's important data from a damaged SSD. The result was excellent!",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b754?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "გიორგი კვარაცხელია",
    nameEn: "Giorgi Kvaratskhelia",
    position: "IT მენეჯერი",
    positionEn: "IT Manager",
    rating: 5,
    textKa: "პროფესიონალური მიდგომა და სწრაფი მომსახურება. RAID მასივიდან 100% მონაცემები აღადგინეს.",
    textEn: "Professional approach and fast service. They recovered 100% of data from our RAID array.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "ელენე მამუკელაშვილი",
    nameEn: "Elene Mamukelashvili",
    position: "ფოტოგრაფი",
    positionEn: "Photographer",
    rating: 5,
    textKa: "დაზიანებული SD ბარათიდან ყველა ფოტო აღადგინეს. ძალიან კმაყოფილი ვარ სერვისით!",
    textEn: "They recovered all photos from my damaged SD card. Very satisfied with the service!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

// Mock case tracking data
export const mockCases = [
  {
    id: "DL2024001",
    deviceType: "HDD",
    status: "completed",
    progress: 100,
    createdAt: "2024-01-15",
    estimatedCompletion: "2024-01-17"
  },
  {
    id: "DL2024002", 
    deviceType: "SSD",
    status: "in_progress",
    progress: 75,
    createdAt: "2024-01-18",
    estimatedCompletion: "2024-01-20"
  }
];