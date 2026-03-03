import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding NyayaSetu database...");

  // ═══════════════════════════════════════════
  //  LEGAL CATEGORIES
  // ═══════════════════════════════════════════
  const categories = await Promise.all([
    prisma.legalCategory.create({
      data: {
        name: "Family & Matrimonial",
        nameHi: "परिवार और वैवाहिक",
        description: "Divorce, custody, domestic violence, maintenance, inheritance",
        descriptionHi: "तलाक, बच्चों की अभिरक्षा, घरेलू हिंसा, भरण-पोषण, विरासत",
        icon: "Users",
        sortOrder: 1,
      },
    }),
    prisma.legalCategory.create({
      data: {
        name: "Property & Land",
        nameHi: "संपत्ति और भूमि",
        description: "Land disputes, tenant issues, registration, encroachment, partition",
        descriptionHi: "भूमि विवाद, किरायेदार मुद्दे, पंजीकरण, अतिक्रमण, विभाजन",
        icon: "Home",
        sortOrder: 2,
      },
    }),
    prisma.legalCategory.create({
      data: {
        name: "Criminal",
        nameHi: "आपराधिक",
        description: "FIR filing, bail, assault, fraud, theft, cybercrime",
        descriptionHi: "एफआईआर दर्ज करना, जमानत, मारपीट, धोखाधड़ी, चोरी, साइबर अपराध",
        icon: "Shield",
        sortOrder: 3,
      },
    }),
    prisma.legalCategory.create({
      data: {
        name: "Labour & Employment",
        nameHi: "श्रम और रोजगार",
        description: "Wrongful termination, wages, workplace harassment, PF/ESI",
        descriptionHi: "गलत बर्खास्तगी, वेतन, कार्यस्थल उत्पीड़न, पीएफ/ईएसआई",
        icon: "Briefcase",
        sortOrder: 4,
      },
    }),
    prisma.legalCategory.create({
      data: {
        name: "Consumer Protection",
        nameHi: "उपभोक्ता संरक्षण",
        description: "Product defects, service deficiency, unfair trade practices",
        descriptionHi: "उत्पाद दोष, सेवा की कमी, अनुचित व्यापार व्यवहार",
        icon: "ShoppingBag",
        sortOrder: 5,
      },
    }),
    prisma.legalCategory.create({
      data: {
        name: "Women & Child Rights",
        nameHi: "महिला और बाल अधिकार",
        description: "Sexual harassment, dowry, child abuse, POCSO, trafficking",
        descriptionHi: "यौन उत्पीड़न, दहेज, बाल शोषण, पॉक्सो, तस्करी",
        icon: "Heart",
        sortOrder: 6,
      },
    }),
    prisma.legalCategory.create({
      data: {
        name: "Cyber & Digital",
        nameHi: "साइबर और डिजिटल",
        description: "Online fraud, data privacy, social media harassment, identity theft",
        descriptionHi: "ऑनलाइन धोखाधड़ी, डेटा गोपनीयता, सोशल मीडिया उत्पीड़न, पहचान की चोरी",
        icon: "Monitor",
        sortOrder: 7,
      },
    }),
    prisma.legalCategory.create({
      data: {
        name: "RTI & Government Services",
        nameHi: "आरटीआई और सरकारी सेवाएं",
        description: "Right to information, pension, ration card, government scheme denials",
        descriptionHi: "सूचना का अधिकार, पेंशन, राशन कार्ड, सरकारी योजना अस्वीकृति",
        icon: "FileText",
        sortOrder: 8,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ═══════════════════════════════════════════
  //  SUB-CATEGORIES
  // ═══════════════════════════════════════════
  const familyCat = categories[0];
  const propertyCat = categories[1];
  const criminalCat = categories[2];
  const labourCat = categories[3];
  const consumerCat = categories[4];
  const womenCat = categories[5];
  const cyberCat = categories[6];

  const subCategories = await Promise.all([
    // Family
    prisma.legalSubCategory.create({
      data: {
        categoryId: familyCat.id, name: "Domestic Violence", nameHi: "घरेलू हिंसा",
        description: "Physical, emotional, economic abuse by family members",
        descriptionHi: "परिवार के सदस्यों द्वारा शारीरिक, भावनात्मक, आर्थिक शोषण",
        applicableLaws: ["Protection of Women from Domestic Violence Act, 2005", "Section 498A IPC"],
        sortOrder: 1,
      },
    }),
    prisma.legalSubCategory.create({
      data: {
        categoryId: familyCat.id, name: "Divorce & Separation", nameHi: "तलाक और अलगाव",
        description: "Mutual or contested divorce proceedings",
        descriptionHi: "पारस्परिक या विवादित तलाक की कार्यवाही",
        applicableLaws: ["Hindu Marriage Act, 1955", "Special Marriage Act, 1954", "Muslim Personal Law"],
        sortOrder: 2,
      },
    }),
    prisma.legalSubCategory.create({
      data: {
        categoryId: familyCat.id, name: "Child Custody & Maintenance", nameHi: "बाल अभिरक्षा और भरण-पोषण",
        description: "Child custody disputes and maintenance claims",
        descriptionHi: "बाल अभिरक्षा विवाद और भरण-पोषण के दावे",
        applicableLaws: ["Guardian and Wards Act, 1890", "Hindu Minority and Guardianship Act, 1956", "Section 125 CrPC"],
        sortOrder: 3,
      },
    }),
    // Property
    prisma.legalSubCategory.create({
      data: {
        categoryId: propertyCat.id, name: "Land Dispute", nameHi: "भूमि विवाद",
        description: "Ownership disputes, boundary issues, encroachment",
        descriptionHi: "स्वामित्व विवाद, सीमा मुद्दे, अतिक्रमण",
        applicableLaws: ["Transfer of Property Act, 1882", "Indian Registration Act, 1908"],
        sortOrder: 1,
      },
    }),
    prisma.legalSubCategory.create({
      data: {
        categoryId: propertyCat.id, name: "Tenant-Landlord Dispute", nameHi: "किरायेदार-मकान मालिक विवाद",
        description: "Eviction, rent disputes, deposit issues",
        descriptionHi: "बेदखली, किराया विवाद, जमा मुद्दे",
        applicableLaws: ["State Rent Control Acts", "Transfer of Property Act, 1882"],
        sortOrder: 2,
      },
    }),
    // Criminal
    prisma.legalSubCategory.create({
      data: {
        categoryId: criminalCat.id, name: "Fraud & Cheating", nameHi: "धोखाधड़ी और ठगी",
        description: "Financial fraud, cheating, criminal breach of trust",
        descriptionHi: "वित्तीय धोखाधड़ी, ठगी, आपराधिक विश्वासघात",
        applicableLaws: ["Section 420 IPC", "Section 406 IPC", "Section 34 IPC"],
        sortOrder: 1,
      },
    }),
    prisma.legalSubCategory.create({
      data: {
        categoryId: criminalCat.id, name: "Assault & Threat", nameHi: "मारपीट और धमकी",
        description: "Physical assault, criminal intimidation, threats",
        descriptionHi: "शारीरिक हमला, आपराधिक डराना, धमकी",
        applicableLaws: ["Section 323-326 IPC", "Section 503-506 IPC"],
        sortOrder: 2,
      },
    }),
    // Labour
    prisma.legalSubCategory.create({
      data: {
        categoryId: labourCat.id, name: "Wrongful Termination", nameHi: "गलत बर्खास्तगी",
        description: "Illegal firing, retrenchment without notice",
        descriptionHi: "अवैध बर्खास्तगी, बिना नोटिस के छंटनी",
        applicableLaws: ["Industrial Disputes Act, 1947", "Shops and Establishments Act"],
        sortOrder: 1,
      },
    }),
    prisma.legalSubCategory.create({
      data: {
        categoryId: labourCat.id, name: "Unpaid Wages", nameHi: "अवैतनिक वेतन",
        description: "Non-payment or delayed payment of wages",
        descriptionHi: "वेतन का भुगतान न करना या देरी से भुगतान",
        applicableLaws: ["Payment of Wages Act, 1936", "Minimum Wages Act, 1948"],
        sortOrder: 2,
      },
    }),
    // Consumer
    prisma.legalSubCategory.create({
      data: {
        categoryId: consumerCat.id, name: "Product Defect", nameHi: "उत्पाद दोष",
        description: "Defective products, warranty claims",
        descriptionHi: "दोषपूर्ण उत्पाद, वारंटी दावे",
        applicableLaws: ["Consumer Protection Act, 2019"],
        sortOrder: 1,
      },
    }),
    prisma.legalSubCategory.create({
      data: {
        categoryId: consumerCat.id, name: "Service Deficiency", nameHi: "सेवा की कमी",
        description: "Banks, insurance, telecom, hospital service failures",
        descriptionHi: "बैंक, बीमा, दूरसंचार, अस्पताल सेवा विफलताएँ",
        applicableLaws: ["Consumer Protection Act, 2019", "IRDAI guidelines", "RBI circulars"],
        sortOrder: 2,
      },
    }),
    // Women & Child
    prisma.legalSubCategory.create({
      data: {
        categoryId: womenCat.id, name: "Sexual Harassment at Workplace", nameHi: "कार्यस्थल पर यौन उत्पीड़न",
        description: "POSH Act complaints, ICC/LCC process",
        descriptionHi: "पॉश अधिनियम शिकायत, आईसीसी/एलसीसी प्रक्रिया",
        applicableLaws: ["Sexual Harassment of Women at Workplace Act, 2013 (POSH)", "Section 354A IPC"],
        sortOrder: 1,
      },
    }),
    prisma.legalSubCategory.create({
      data: {
        categoryId: womenCat.id, name: "Dowry Harassment", nameHi: "दहेज उत्पीड़न",
        description: "Dowry demands, harassment for dowry",
        descriptionHi: "दहेज की मांग, दहेज के लिए उत्पीड़न",
        applicableLaws: ["Dowry Prohibition Act, 1961", "Section 498A IPC", "Section 304B IPC"],
        sortOrder: 2,
      },
    }),
    // Cyber
    prisma.legalSubCategory.create({
      data: {
        categoryId: cyberCat.id, name: "Online Financial Fraud", nameHi: "ऑनलाइन वित्तीय धोखाधड़ी",
        description: "UPI fraud, phishing, credit card fraud, banking scams",
        descriptionHi: "यूपीआई धोखाधड़ी, फ़िशिंग, क्रेडिट कार्ड धोखाधड़ी, बैंकिंग घोटाले",
        applicableLaws: ["IT Act, 2000 Section 66C/66D", "Section 420 IPC"],
        sortOrder: 1,
      },
    }),
    prisma.legalSubCategory.create({
      data: {
        categoryId: cyberCat.id, name: "Cyberstalking & Harassment", nameHi: "साइबरस्टॉकिंग और उत्पीड़न",
        description: "Online threats, morphing, revenge porn, trolling",
        descriptionHi: "ऑनलाइन धमकी, मॉर्फिंग, बदला अश्लील, ट्रोलिंग",
        applicableLaws: ["IT Act, 2000 Section 66A/67", "Section 354D IPC", "Section 509 IPC"],
        sortOrder: 2,
      },
    }),
  ]);

  console.log(`✅ Created ${subCategories.length} sub-categories`);

  // ═══════════════════════════════════════════
  //  INTAKE QUESTIONS (sample for Family)
  // ═══════════════════════════════════════════
  const questions = await Promise.all([
    prisma.intakeQuestion.create({
      data: {
        categoryId: familyCat.id,
        questionText: "What is your relationship with the person involved?",
        questionTextHi: "संबंधित व्यक्ति के साथ आपका क्या रिश्ता है?",
        questionType: "SINGLE_CHOICE",
        options: ["Spouse", "Parent", "In-law", "Sibling", "Other relative"],
        optionsHi: ["पति/पत्नी", "माता-पिता", "ससुराल", "भाई-बहन", "अन्य रिश्तेदार"],
        sequence: 1,
        isRequired: true,
      },
    }),
    prisma.intakeQuestion.create({
      data: {
        categoryId: familyCat.id,
        questionText: "How long has this issue been going on?",
        questionTextHi: "यह समस्या कब से चल रही है?",
        questionType: "SINGLE_CHOICE",
        options: ["Less than a month", "1-6 months", "6 months - 1 year", "More than 1 year", "More than 5 years"],
        optionsHi: ["एक महीने से कम", "1-6 महीने", "6 महीने - 1 साल", "1 साल से अधिक", "5 साल से अधिक"],
        sequence: 2,
        isRequired: true,
      },
    }),
    prisma.intakeQuestion.create({
      data: {
        categoryId: familyCat.id,
        questionText: "Have you filed any complaint or case before?",
        questionTextHi: "क्या आपने पहले कोई शिकायत या मामला दर्ज किया है?",
        questionType: "YES_NO",
        options: ["Yes", "No"],
        optionsHi: ["हां", "नहीं"],
        sequence: 3,
        isRequired: true,
      },
    }),
    prisma.intakeQuestion.create({
      data: {
        categoryId: familyCat.id,
        questionText: "Is there any immediate threat to your safety?",
        questionTextHi: "क्या आपकी सुरक्षा को कोई तात्कालिक खतरा है?",
        questionType: "YES_NO",
        options: ["Yes", "No"],
        optionsHi: ["हां", "नहीं"],
        sequence: 4,
        isRequired: true,
      },
    }),
    prisma.intakeQuestion.create({
      data: {
        categoryId: familyCat.id,
        questionText: "Describe your situation in detail",
        questionTextHi: "अपनी स्थिति का विस्तार से वर्णन करें",
        questionType: "FREE_TEXT",
        options: [],
        optionsHi: [],
        sequence: 5,
        isRequired: true,
      },
    }),
    // Criminal category questions
    prisma.intakeQuestion.create({
      data: {
        categoryId: criminalCat.id,
        questionText: "What type of crime has occurred?",
        questionTextHi: "किस प्रकार का अपराध हुआ है?",
        questionType: "SINGLE_CHOICE",
        options: ["Fraud/Cheating", "Assault/Violence", "Theft/Robbery", "Threats/Intimidation", "Other"],
        optionsHi: ["धोखाधड़ी/ठगी", "मारपीट/हिंसा", "चोरी/डकैती", "धमकी/डराना", "अन्य"],
        sequence: 1,
        isRequired: true,
      },
    }),
    prisma.intakeQuestion.create({
      data: {
        categoryId: criminalCat.id,
        questionText: "When did this incident occur?",
        questionTextHi: "यह घटना कब हुई?",
        questionType: "SINGLE_CHOICE",
        options: ["Today", "Within last week", "Within last month", "More than a month ago", "Ongoing"],
        optionsHi: ["आज", "पिछले सप्ताह में", "पिछले महीने में", "एक महीने से अधिक पहले", "जारी"],
        sequence: 2,
        isRequired: true,
      },
    }),
    prisma.intakeQuestion.create({
      data: {
        categoryId: criminalCat.id,
        questionText: "Have you filed an FIR?",
        questionTextHi: "क्या आपने एफआईआर दर्ज कराई है?",
        questionType: "YES_NO",
        options: ["Yes", "No"],
        optionsHi: ["हां", "नहीं"],
        sequence: 3,
        isRequired: true,
      },
    }),
    // Property category questions
    prisma.intakeQuestion.create({
      data: {
        categoryId: propertyCat.id,
        questionText: "What type of property is involved?",
        questionTextHi: "किस प्रकार की संपत्ति शामिल है?",
        questionType: "SINGLE_CHOICE",
        options: ["Residential", "Commercial", "Agricultural land", "Ancestral property", "Rented"],
        optionsHi: ["आवासीय", "व्यावसायिक", "कृषि भूमि", "पैतृक संपत्ति", "किराये पर"],
        sequence: 1,
        isRequired: true,
      },
    }),
    prisma.intakeQuestion.create({
      data: {
        categoryId: propertyCat.id,
        questionText: "Do you have ownership documents (registry/deed)?",
        questionTextHi: "क्या आपके पास स्वामित्व दस्तावेज (रजिस्ट्री/दस्तावेज़) हैं?",
        questionType: "SINGLE_CHOICE",
        options: ["Yes, complete", "Partial documents", "No documents", "Documents with other party"],
        optionsHi: ["हां, पूरे", "आंशिक दस्तावेज", "कोई दस्तावेज नहीं", "दस्तावेज दूसरे पक्ष के पास"],
        sequence: 2,
        isRequired: true,
      },
    }),
  ]);

  console.log(`✅ Created ${questions.length} intake questions`);

  // ═══════════════════════════════════════════
  //  LEGAL RIGHTS (sample)
  // ═══════════════════════════════════════════
  const dvSubCat = subCategories[0]; // Domestic Violence
  const fraudSubCat = subCategories[5]; // Fraud & Cheating

  await Promise.all([
    prisma.legalRight.create({
      data: {
        subCategoryId: dvSubCat.id,
        title: "Right to Reside in Shared Household",
        titleHi: "साझा घर में रहने का अधिकार",
        description: "An aggrieved woman has the right to reside in the shared household regardless of who owns it. She cannot be evicted without due process.",
        descriptionHi: "एक पीड़ित महिला को साझा घर में रहने का अधिकार है, भले ही वह किसी का भी हो। उचित प्रक्रिया के बिना उसे निकाला नहीं जा सकता।",
        applicableLaw: "Section 17, Protection of Women from Domestic Violence Act, 2005",
        protections: ["Right to reside", "Cannot be evicted by respondent", "Court can grant residence order"],
        protectionsHi: ["रहने का अधिकार", "प्रतिवादी न निकाल सके", "कोर्ट निवास आदेश दे सकता है"],
        remedies: ["File complaint under DV Act", "Seek residence order from Magistrate", "Approach Protection Officer"],
        remediesHi: ["डीवी एक्ट के तहत शिकायत दर्ज करें", "मजिस्ट्रेट से निवास आदेश लें", "संरक्षण अधिकारी से संपर्क करें"],
        sortOrder: 1,
      },
    }),
    prisma.legalRight.create({
      data: {
        subCategoryId: dvSubCat.id,
        title: "Right to Protection Order",
        titleHi: "संरक्षण आदेश का अधिकार",
        description: "A Magistrate can issue a protection order prohibiting the respondent from committing any act of domestic violence.",
        descriptionHi: "एक मजिस्ट्रेट संरक्षण आदेश जारी कर सकता है जो प्रतिवादी को घरेलू हिंसा का कोई भी कार्य करने से रोकता है।",
        applicableLaw: "Section 18, Protection of Women from Domestic Violence Act, 2005",
        protections: ["Protection from violence", "Restraining order against abuser", "Include child protection"],
        protectionsHi: ["हिंसा से सुरक्षा", "दुर्व्यवहार करने वाले के खिलाफ निरोधक आदेश", "बाल संरक्षण शामिल"],
        remedies: ["Approach Magistrate Court", "File through Protection Officer", "Can also seek monetary relief"],
        remediesHi: ["मजिस्ट्रेट कोर्ट जाएं", "संरक्षण अधिकारी के माध्यम से दाखिल करें", "आर्थिक राहत भी मांग सकती हैं"],
        sortOrder: 2,
      },
    }),
    prisma.legalRight.create({
      data: {
        subCategoryId: fraudSubCat.id,
        title: "Right to File FIR",
        titleHi: "एफआईआर दर्ज करने का अधिकार",
        description: "Every person has the right to file an FIR at any police station for a cognizable offence. Police cannot refuse to register an FIR.",
        descriptionHi: "प्रत्येक व्यक्ति को किसी भी पुलिस स्टेशन में संज्ञेय अपराध के लिए एफआईआर दर्ज करने का अधिकार है। पुलिस एफआईआर दर्ज करने से इनकार नहीं कर सकती।",
        applicableLaw: "Section 154, Code of Criminal Procedure (CrPC)",
        protections: ["FIR is mandatory for cognizable offences", "Zero FIR can be filed at any station", "Online FIR also available"],
        protectionsHi: ["संज्ञेय अपराधों के लिए एफआईआर अनिवार्य", "कोई भी थाने में जीरो एफआईआर दर्ज", "ऑनलाइन एफआईआर भी उपलब्ध"],
        remedies: ["File FIR at nearest station", "Approach SP if police refuses", "File private complaint in court"],
        remediesHi: ["नजदीकी थाने में एफआईआर दर्ज करें", "पुलिस मना करे तो एसपी से संपर्क", "कोर्ट में निजी शिकायत दर्ज करें"],
        sortOrder: 1,
      },
    }),
  ]);

  console.log("✅ Created sample legal rights");

  // ═══════════════════════════════════════════
  //  EMERGENCY HELPLINES
  // ═══════════════════════════════════════════
  await Promise.all([
    prisma.emergencyHelpline.create({
      data: { name: "Police", nameHi: "पुलिस", number: "100", description: "Police emergency helpline", descriptionHi: "पुलिस आपातकालीन हेल्पलाइन", category: "Emergency", isNational: true, sortOrder: 1 },
    }),
    prisma.emergencyHelpline.create({
      data: { name: "Emergency (Unified)", nameHi: "आपातकालीन (एकीकृत)", number: "112", description: "Single emergency number for police, fire, ambulance", descriptionHi: "पुलिस, अग्निशमन, एम्बुलेंस के लिए एकल आपातकालीन नंबर", category: "Emergency", isNational: true, sortOrder: 2 },
    }),
    prisma.emergencyHelpline.create({
      data: { name: "Women Helpline", nameHi: "महिला हेल्पलाइन", number: "181", description: "24/7 women helpline for reporting violence, abuse, harassment", descriptionHi: "हिंसा, दुरुपयोग, उत्पीड़न की रिपोर्ट के लिए 24/7 महिला हेल्पलाइन", category: "Women & Child", isNational: true, sortOrder: 3 },
    }),
    prisma.emergencyHelpline.create({
      data: { name: "Women Helpline (NCW)", nameHi: "महिला हेल्पलाइन (एनसीडब्ल्यू)", number: "7827-170-170", description: "National Commission for Women helpline", descriptionHi: "राष्ट्रीय महिला आयोग हेल्पलाइन", category: "Women & Child", isNational: true, sortOrder: 4 },
    }),
    prisma.emergencyHelpline.create({
      data: { name: "Child Helpline", nameHi: "बाल हेल्पलाइन", number: "1098", description: "24/7 child helpline for children in distress", descriptionHi: "संकट में बच्चों के लिए 24/7 बाल हेल्पलाइन", category: "Women & Child", isNational: true, sortOrder: 5 },
    }),
    prisma.emergencyHelpline.create({
      data: { name: "Cyber Crime Helpline", nameHi: "साइबर अपराध हेल्पलाइन", number: "1930", description: "National cyber crime reporting helpline", descriptionHi: "राष्ट्रीय साइबर अपराध रिपोर्टिंग हेल्पलाइन", category: "Cyber", isNational: true, sortOrder: 6 },
    }),
    prisma.emergencyHelpline.create({
      data: { name: "Legal Aid (NALSA)", nameHi: "कानूनी सहायता (नालसा)", number: "15100", description: "Free legal aid helpline by NALSA", descriptionHi: "नालसा द्वारा मुफ्त कानूनी सहायता हेल्पलाइन", category: "Legal Aid", isNational: true, sortOrder: 7 },
    }),
    prisma.emergencyHelpline.create({
      data: { name: "Senior Citizen Helpline", nameHi: "वरिष्ठ नागरिक हेल्पलाइन", number: "14567", description: "Elderline - support for senior citizens", descriptionHi: "एल्डरलाइन - वरिष्ठ नागरिकों के लिए सहायता", category: "General", isNational: true, sortOrder: 8 },
    }),
    prisma.emergencyHelpline.create({
      data: { name: "Consumer Helpline", nameHi: "उपभोक्ता हेल्पलाइन", number: "1800-11-4000", description: "National Consumer Helpline (toll-free)", descriptionHi: "राष्ट्रीय उपभोक्ता हेल्पलाइन (टोल-फ्री)", category: "Consumer", isNational: true, sortOrder: 9 },
    }),
    prisma.emergencyHelpline.create({
      data: { name: "Anti-Corruption Helpline", nameHi: "भ्रष्टाचार विरोधी हेल्पलाइन", number: "1031", description: "Vigilance/anti-corruption reporting", descriptionHi: "सतर्कता/भ्रष्टाचार विरोधी रिपोर्टिंग", category: "Government", isNational: true, sortOrder: 10 },
    }),
  ]);

  console.log("✅ Created emergency helplines");

  // ═══════════════════════════════════════════
  //  GOVERNMENT OFFICES (sample – Delhi + Maharashtra)
  // ═══════════════════════════════════════════
  await Promise.all([
    prisma.governmentOffice.create({
      data: {
        name: "Tis Hazari District Court", nameHi: "तीस हज़ारी ज़िला न्यायालय",
        officeType: "District Court", state: "Delhi", district: "Central Delhi",
        address: "Tis Hazari Court Complex, Old Delhi, Delhi - 110054",
        phone: "011-23968484", officeHours: "Mon-Sat: 10:00 AM - 5:00 PM", isVerified: true,
      },
    }),
    prisma.governmentOffice.create({
      data: {
        name: "Delhi State Legal Services Authority", nameHi: "दिल्ली राज्य कानूनी सेवा प्राधिकरण",
        officeType: "Legal Aid", state: "Delhi", district: "Central Delhi",
        address: "Patiala House Courts, India Gate, New Delhi - 110001",
        phone: "011-23073768", email: "dslsa@nic.in", officeHours: "Mon-Fri: 10:00 AM - 5:00 PM", isVerified: true,
      },
    }),
    prisma.governmentOffice.create({
      data: {
        name: "Delhi Commission for Women", nameHi: "दिल्ली महिला आयोग",
        officeType: "Women Commission", state: "Delhi", district: "New Delhi",
        address: "C Block, Vikas Bhawan, IP Estate, New Delhi - 110002",
        phone: "011-23379150", email: "dcw@delhi.gov.in", officeHours: "Mon-Fri: 9:30 AM - 5:30 PM", isVerified: true,
      },
    }),
    prisma.governmentOffice.create({
      data: {
        name: "Cyber Crime Cell, Delhi Police", nameHi: "साइबर अपराध प्रकोष्ठ, दिल्ली पुलिस",
        officeType: "Cyber Crime Cell", state: "Delhi", district: "Central Delhi",
        address: "Mandir Marg, New Delhi - 110001",
        phone: "011-23490095", officeHours: "24/7", isVerified: true,
      },
    }),
    prisma.governmentOffice.create({
      data: {
        name: "Bombay High Court", nameHi: "बॉम्बे उच्च न्यायालय",
        officeType: "High Court", state: "Maharashtra", district: "Mumbai",
        address: "Fort, Mumbai - 400032, Maharashtra",
        phone: "022-22620831", officeHours: "Mon-Sat: 10:30 AM - 5:00 PM", isVerified: true,
      },
    }),
    prisma.governmentOffice.create({
      data: {
        name: "Maharashtra State Legal Services Authority", nameHi: "महाराष्ट्र राज्य कानूनी सेवा प्राधिकरण",
        officeType: "Legal Aid", state: "Maharashtra", district: "Mumbai",
        address: "Bombay High Court, Fort, Mumbai - 400032",
        phone: "022-22630919", officeHours: "Mon-Fri: 10:00 AM - 5:00 PM", isVerified: true,
      },
    }),
    prisma.governmentOffice.create({
      data: {
        name: "Pune District Court", nameHi: "पुणे जिला न्यायालय",
        officeType: "District Court", state: "Maharashtra", district: "Pune",
        address: "Shivajinagar, Pune - 411005, Maharashtra",
        phone: "020-25501250", officeHours: "Mon-Sat: 10:00 AM - 5:00 PM", isVerified: true,
      },
    }),
    prisma.governmentOffice.create({
      data: {
        name: "Consumer Forum, Mumbai", nameHi: "उपभोक्ता फोरम, मुंबई",
        officeType: "Consumer Forum", state: "Maharashtra", district: "Mumbai",
        address: "Bandra East, Mumbai - 400051, Maharashtra",
        phone: "022-26598900", officeHours: "Mon-Fri: 10:30 AM - 4:30 PM", isVerified: true,
      },
    }),
  ]);

  console.log("✅ Created sample government offices");
  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
