import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, ChevronDown, ChevronUp, Lightbulb, Search, X } from 'lucide-react';

// FAQ interface
interface FAQItem {
  question: string;
  answer: string;
}

const FAQsPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is cancer?",
      answer: "Your body is made up of tiny building blocks called cells. When these cells change and grow out of control, it's called cancer. The abnormal cells crowd out normal, healthy cells, making it hard for your body to work in the right way. Normal cells grow when your body needs them, and die when they are no longer needed. Cancer is made up of abnormal cells that grow even though your body doesn't need them. In most types of cancer, the abnormal cells grow to form a lump or mass called a tumor."
    },
    {
      question: "What causes cancer?",
      answer: "Two types of factors contribute to the cause of cancer. One is a tendency or predisposition to develop cancer. The other is exposure to the triggers that start it off. Examples are cigarettes, environmental toxins, sun exposure, or liver damage."
    },
    {
      question: "Why do some people get cancer and not others?",
      answer: "Some cancers seem to be partly inherited. These include a type of eye cancer, and a small number of breast and ovarian cancers. But for most cancers, healthcare providers think that some people's cells may be more likely to become cancer (malignant). These people may develop a cancer with relatively less exposure to a cancer trigger, such as cigarettes or the sun, than people whose cells have a higher threshold."
    },
    {
      question: "Do we get cancer from what we eat?",
      answer: "Certain eating patterns can increase or decrease your risk for cancer. The high-fat, low-fiber diet common in developed countries may play a role in about a third of all cancers. The American Cancer Society (ACS) recommends a healthy eating pattern than includes a variety of fruits and vegetables as well as whole grains. ACS recommends that people limit or not eat red and processed meat, sugar-sweetened drinks, highly processed foods, and alcohol. It's also important to stay at a healthy body weight. Ask your provider what a healthy weight is for you."
    },
    {
      question: "Are chemicals and pollutants causing cancer?",
      answer: "Exposure to specific chemicals or pollution can raise your risk for cancer. In some jobs, prolonged exposure to a few chemicals may cause certain kinds of cancers. Certain cancer-causing substances (carcinogens) have been identified and are regulated. The American Cancer Society has more information on chemicals, cancer risk, and how to limit your exposure."
    },
    {
      question: "Does smoking really cause cancer?",
      answer: "Yes. Cigarettes cause most cancers of the lung. They are a big factor in cancers of the bladder, pancreas, mouth, larynx, esophagus, and kidney. Smoking cigars is associated with risk of lung, oral, larynx, and esophageal cancer. There's also a link between secondhand smoke and cancer in both adults and children. The long-term health effects of e-cigarettes are still being studied."
    },
    {
      question: "Can cancer be prevented?",
      answer: "Healthcare providers think a lot of cancer can be prevented. Prevention methods include not smoking, preventing sun damage, practicing safe sexual behavior, and eating a healthy diet. These can reduce the incidence of cancer. Getting recommended cancer screenings can help find and treat pre-cancers and cancers early. Screenings may be done for cervical, breast, colorectal, and lung cancer. Ask your provider what screenings you may need. It's important to note that many people who get cancer don't have any known risk factors. But more could probably be prevented if more information was known, so research is very active in this field."
    },
    {
      question: "Why does the diagnosis seem to be so delayed in so many cases?",
      answer: "Cancer cells can multiply to produce literally billions of cells before a tumor becomes big enough to detect or cause symptoms. That is why prevention and some methods of screening are so important. Screening tests help find cancer before a person has symptoms."
    },
    {
      question: "Why isn't there a simple, universal test for cancer?",
      answer: "Because cancer cells are very similar to normal cells, and a cancer begins with a very small number of cells. In a small number of cancers, certain tests can detect early changes. The best example is cancer of the cervix (the Pap test). Also, cancer is not one disease but a category of diseases. For example, breast cancer is much different from lung cancer, so tests to detect or diagnose it are different."
    },
    {
      question: "Why do people with the same cancer get different treatment and have different problems?",
      answer: "A lot depends on the stage of the disease and on the particular person. For instance, in breast cancer with involved lymph nodes, if you are postmenopausal, the best treatment may be a hormone tablet. If you are premenopausal, it may be chemotherapy."
    }
  ];

  const additionalFaqs: FAQItem[] = [
    {
      question: "Does conventional treatment work?",
      answer: "Surgery, chemotherapy, and radiation are examples of conventional cancer treatments. It's possible for some cancers to be cured. But the goal of cancer treatment is different for each person. The goal may be to cure the cancer, control the cancer, or ease symptoms (palliation). Talk to your healthcare team about the goal of your cancer treatment so you know what to expect."
    },
    {
      question: "Does treatment cause side effects?",
      answer: "Many treatments are very well-tolerated. But treatment can cause side effects because cancer cells are very much like normal cells. So to kill cancer cells, you often risk damaging normal cells or tissues. This is different from other illnesses like bacterial infections for instance. Because bacteria are completely different from your body's cells, antibiotics can kill them and not affect you very much. Normal cells that are often damaged by cancer treatment include hair follicles, cells in the bone marrow that form new blood cells, and cells that line the mouth, digestive tract, and reproductive system. Damage to these cells cause side effects such as hair loss, fatigue, anemia, nausea, vomiting, diarrhea, and changes in sexual function and fertility. Your healthcare team can help you know what side effects to expect, when to report them, and how to manage them."
    },
    {
      question: "Can fatigue be prevented?",
      answer: "Fatigue can't be prevented because the exact cause of fatigue is not always known. But you can decrease the effect of fatigue, such as conserving energy. If your fatigue is related to low red blood cell count (anemia), there are ways to raise your level and relieve fatigue. See the information in the fatigue topic zone, and talk with your nurse or doctor so that he or she can help you to manage fatigue."
    },
    {
      question: "How does fatigue affect a person?",
      answer: "Fatigue is a real symptom. It can lead to a decrease in quality of life. Factors such as treatment, low red blood cell count (anemia), stress, problem sleeping, and poor nutrition can all add to fatigue. Still, since no one else can see your fatigue, it's common to question yourself about it. Don't. Fatigue is often a real part of cancer and its treatment. Fatigue affects each person differently. Plus, there are many degrees of fatigue. Some people may find that they are unable to do simple things that they used to do, such as climbing stairs without stopping or holding onto the handrail. Others may have trouble standing up in the shower, and get too tired, so a shower chair is helpful. Changes in mental processes can happen, causing \"fuzzy thinking.\" It may be hard to concentrate or focus on things, such as reading or watching television. Visiting with family, cooking, or other activities that you used to enjoy before starting cancer treatment may now be too exhausting. But there are tips to help conserve your energy for the activities that are important to you."
    },
    {
      question: "Will my hair grow back?",
      answer: "Yes, hair loss from chemotherapy is temporary. It will grow back, usually after therapy is finished. In some cases, hair can grow back during therapy. Usually the texture of the hair is different for the first year. Then, after a year or so, it usually goes back to how it was before you took chemotherapy. Hair loss from radiation therapy may be irreversible."
    },
    {
      question: "Should everyone get a second opinion?",
      answer: "Many people with cancer get a second opinion from another doctor. There are many reasons to get a second opinion, including if you are not comfortable with the treatment decision, if the type of cancer is rare, if there are different ways to treat the cancer, or if you are not able to see a cancer expert. Also, some health insurance companies require a second opinion before treatment begins. A second opinion can help you have more confidence in the cancer diagnosis, treatment plan, or treatment team."
    },
    {
      question: "How can someone get a second opinion?",
      answer: "You can get a second opinion in many ways:\n- Your primary doctor may be able to recommend a specialist, such as a surgeon, medical oncologist, or radiation oncologist. Sometimes these doctors work together at cancer centers or programs.\n- You can call the Cancer Information Service at 800-4-CANCER (800-422-6237). This service informs callers about treatment facilities, including cancer centers and other programs supported by the National Cancer Institute.\n- You can get names of doctors from your local medical society, a nearby hospital, a medical school, or local cancer advocacy groups, as well as from other people who have had that type of cancer."
    },
    {
      question: "Will there ever be a cure for cancer?",
      answer: "Many cancers ARE cured. Since every cancer is different, finding a single universal cure is unlikely. This is similar to there not being a single antibiotic that cures all infections. It's quite likely that researchers will make further advances in some cancers. The biggest changes in cancer may come from prevention or from other directions, such as treatments or vaccines to prevent spread after the primary cancer has been removed. Obviously nobody knows what is going to happen, but a single, sudden breakthrough that produces a universal miracle cure is very unlikely."
    },
    {
      question: "How is anemia treated?",
      answer: "Treatment depends on the cause of the anemia. If the anemia is caused by not enough building blocks in the body (like iron, folic acid, or vitamin B12), the treatment includes adding these back to the body. Red blood cells can then be made, and the blood values return to normal. If the cause is chemotherapy, or sometimes radiation, then red blood cell transfusions or injections of erythropoietin can be given in some cases. Erythropoietin is a natural hormone made by the kidneys. It tells the bone marrow to make more red blood cells."
    }
  ];

  // Combine all FAQs
  const allFaqs = [...faqs, ...additionalFaqs];

  // Handle expanding/collapsing FAQ items
  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const categories = [
    'General',
    'Causes',
    'Prevention',
    'Symptoms',
    'Diagnosis',
    'Treatment',
    'Side Effects',
    'Emotional Support'
  ];

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    setExpandedIndex(null);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredFAQs = allFaqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === null || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-sage-600" />
              <span className="ml-2 text-xl font-semibold text-sage-900">ChemoCare</span>
            </div>
            <button onClick={() => navigate('/')} className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700">
              Back Home
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-sage-900 sm:text-5xl md:text-6xl">
              <span className="block">Cancer:</span>
              <span className="block text-sage-600">Frequently Asked Questions</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-warm-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Find answers to common questions about cancer, treatments, and managing side effects.
            </p>
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center py-2 px-4 rounded-md bg-sage-100">
                <Lightbulb className="h-6 w-6 text-sage-600 mr-2" />
                <p className="text-sage-700 text-sm">
                  These FAQs provide general information and are not a substitute for professional medical advice. Always consult with your healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-medium text-sage-900">{faq.question}</span>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-sage-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-sage-600" />
                  )}
                </button>
                {expandedIndex === index && (
                  <div className="px-6 py-5 bg-sage-50">
                    <p className="text-base text-sage-700 whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-sage-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Still have questions?</span>
            <span className="block text-sage-200">Speak with our AI assistant or connect with our community</span>
          </h2>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <button 
                onClick={() => navigate('/assistant')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-sage-700 bg-white hover:bg-sage-50"
              >
                Chat with Assistant
              </button>
            </div>
            <div className="ml-3 inline-flex">
              <button 
                onClick={() => navigate('/community')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sage-800 hover:bg-sage-900"
              >
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 ChemoCare. Medical information provided is for informational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FAQsPage;
