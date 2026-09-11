import { InvitationDetails } from '../types';

export const defaultInvitationData: InvitationDetails = {
  familyHeading: 'देशपांडे परिवाराकडून',
  familyName: 'देशपांडे परिवार',
  hostName: 'श्री. राजेश देशपांडे',
  venueName: 'देशपांडे निवास',
  fullAddress: 'फ्लॅट क्र. ४०२, सिद्धिविनायक हाइट्स, रामबाग कॉलनी, पौड रोड, कोथरूड, पुणे',
  landmark: 'आनंद नगर मेट्रो स्टेशन जवळ, पुणे - ४११०३८',
  googleMapsUrl: 'https://maps.google.com/?q=Kothrud,Pune,Maharashtra',
  startDate: '२७ ऑगस्ट २०२५',
  endDate: '०६ सप्टेंबर २०२५',
  tithi: 'भाद्रपद शुक्ल चतुर्थी ते अनंत चतुर्दशी',
  invitationMessage:
    'गणेशोत्सवाच्या या मंगलमय पर्वावर, विघ्नहर्ता श्री गणरायाचे आगमन आमच्या घरी मोठ्या उत्साहात व भक्तीभावात होत आहे. तरी आपण सर्वांनी सपरिवार उपस्थित राहून लाडक्या बाप्पांचे दर्शन घ्यावे व महाप्रसादाचा लाभ घेऊन उत्सवाची शोभा वाढवावी, ही नम्र विनंती.',
  closingQuote: 'आपली उपस्थिती हेच आमच्यासाठी बाप्पांचे आशीर्वाद आहेत.',
  contactNumber: '+91 98765 43210',
  adminPassword: '1234',
  // 1st Upload image: Divine Ganapati Bappa idol
  bappaImageUrl:
    'https://images.unsplash.com/photo-1567591974584-f1832d98c6a0?auto=format&fit=crop&w=1200&q=80',
  // 2nd Upload image: The inviter / family photo
  inviterImageUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  // Family members list displayed below the inviter photo
  familyMembers: [
    {
      id: '1',
      name: 'श्री. राजेश देशपांडे',
      relation: 'कुटुंबप्रमुख / मुख्य निमंत्रक',
      blessing: 'बाप्पांच्या कृपेने सर्वांचे जीवन सुख-समृद्धीने भरून जावो!',
    },
    {
      id: '2',
      name: 'सौ. सुवर्णा देशपांडे',
      relation: 'सहधर्मचारिणी',
      blessing: 'आपल्या सदिच्छा व स्नेहाने आमचा आनंद द्विगुणित होईल.',
    },
    {
      id: '3',
      name: 'चि. कौस्तुभ देशपांडे',
      relation: 'पुत्र',
      blessing: 'गणपती बाप्पा मोरया! सर्व मित्रपरिवाराचे मनापासून स्वागत.',
    },
    {
      id: '4',
      name: 'कु. तन्वी देशपांडे',
      relation: 'कन्या',
      blessing: 'बाप्पांच्या आगमनाचा मंगलमय उत्साह!',
    },
    {
      id: '5',
      name: 'श्री. विनायक देशपांडे',
      relation: 'ज्येष्ठ सदस्य',
    },
    {
      id: '6',
      name: 'समस्त देशपांडे परिवार',
      relation: 'स्नेही व आप्तेष्ट',
    },
  ],
  schedule: [
    {
      time: 'दुपारी ०२:००',
      title: 'बाप्पांचे आगमन व मिरवणूक',
      marathiTitle: 'मूर्ती आगमन व स्वागत',
      description: 'ढोल-ताशांच्या गजरात आणि गुलालाच्या उधळणीत बाप्पांचे वाजत-गाजत आगमन.',
      tag: 'आगमन',
    },
    {
      time: 'दुपारी ०४:३०',
      title: 'मूर्ती प्रतिष्ठापना व महापूजा',
      marathiTitle: 'प्रतिष्ठापना विधी',
      description: 'वेदोक्त मंत्रोच्चारात आणि अथर्वशीर्ष पठणाने बाप्पांची सिंहासनावर स्थापना.',
      tag: 'पूजा',
    },
    {
      time: 'सकाळी ०८:००',
      title: 'सकाळची मंगल आरती',
      marathiTitle: 'प्रातःकालीन आरती',
      description: 'सुखकर्ता दुखहर्ता व दुर्गे दुर्घट भारी आरती आणि सुगंधी धूप दीप अर्पण.',
      tag: 'नित्य आरती',
    },
    {
      time: 'सायंकाळी ०७:३०',
      title: 'सायंकाळची भव्य महाआरती',
      marathiTitle: 'संध्या महाआरती',
      description: 'शेंदूर लाल चढायो व घालीन लोटांगण सह सामूहिक भक्तिमय महाआरती.',
      tag: 'महाआरती',
    },
    {
      time: 'रात्री ०८:३०',
      title: 'उकडीचे मोदक व महाप्रसाद',
      marathiTitle: 'महाप्रसाद वाटप',
      description: 'पारंपारिक तुपातले उकडीचे मोदक, पुरणपोळी व पंचामृत महाप्रसाद भोजन.',
      tag: 'प्रसाद',
    },
  ],
  preparations: [
    {
      id: 'p1',
      title: 'उकडीचे मोदक तयारी',
      description: 'गुळ, खोबरे आणि जायफळाच्या सुगंधात अस्सल घरगुती मोदक.',
      imageUrl:
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p2',
      title: 'पारंपारिक मखर व सजावट',
      description: 'झेंडूची फुले आणि दिव्यांच्या रोषणाईने सजलेले सुंदर मखर.',
      imageUrl:
        'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p3',
      title: 'बाप्पांची मूर्ती निवड',
      description: 'पेणच्या सुप्रसिद्ध मूर्तिकारांकडून निवडलेली मनमोहक शाडूची मूर्ती.',
      imageUrl:
        'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p4',
      title: 'दीप प्रज्वलन व रांगोळी',
      description: 'प्रवेशद्वारावर काढलेली आकर्षक संस्कारभारती रांगोळी व समईचे तेज.',
      imageUrl:
        'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80',
    },
  ],
};
