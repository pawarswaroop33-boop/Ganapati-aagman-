export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  photoUrl?: string;
  blessing?: string;
}

export interface ScheduleEvent {
  time: string;
  title: string;
  marathiTitle: string;
  description: string;
  tag: string;
}

export interface PreparationPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface InvitationDetails {
  familyHeading: string; // e.g. "देशपांडे परिवाराकडून"
  familyName: string; // e.g. "देशपांडे परिवार"
  hostName: string; // e.g. "श्री. राजेश देशपांडे"
  venueName: string; // e.g. "देशपांडे निवास"
  fullAddress: string;
  landmark: string;
  googleMapsUrl: string;
  startDate: string; // e.g. "२७ ऑगस्ट २०२५"
  endDate: string; // e.g. "०६ सप्टेंबर २०२५"
  tithi: string; // e.g. "भाद्रपद शुक्ल चतुर्थी ते अनंत चतुर्दशी"
  invitationMessage: string;
  closingQuote: string;
  contactNumber: string;
  bappaImageUrl: string; // 1st Upload: Ganapati Bappa's image
  inviterImageUrl: string; // 2nd Upload: Invitator's / Family's image
  familyMembers: FamilyMember[]; // All family members whose names show below inviter image
  schedule: ScheduleEvent[];
  preparations: PreparationPhoto[];
}
