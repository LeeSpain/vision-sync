export type Priority = 'Low' | 'Medium' | 'High';

export interface Prospect {
    id: string;
    businessName: string;
    industry: string;
    location: string;
    website: string | null;
    facebook: string | null;
    instagram: string | null;
    googleProfile: string | null;
    email: string | null;
    phone: string | null;
    websiteScore: number;
    opportunityScore: number;
    priority: Priority;
    aiSummary: string | null;
    analysis: Record<string, any> | null;
    createdAt: string;
    updatedAt: string;
}

export interface Lead {
    id: string;
    prospectId: string | null;
    businessName: string;
    contactName: string;
    title: string | null;
    email: string | null;
    phone: string | null;
    source: string;
    industry: string;
    location: string;
    status: string; // e.g. "New", "Contacted", "Qualified"
    websiteScore: number | null;
    opportunityScore: number | null;
    recommendedPackage: string | null;
    notes: string | null;
    followUpDate: string | null;
    assignedTo: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Deal {
    id: string;
    leadId: string;
    businessName: string;
    currentStage: string; // e.g. "Prospect Found", "Contacted", "Demo Created", "Won"
    estimatedValue: number;
    priority: Priority;
    nextAction: string | null;
    followUpDate: string | null;
    quoteStatus: string | null;
    contractStatus: string | null;
    paymentStatus: string | null;
    demoId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Demo {
    id: string;
    dealId: string;
    templateId: string;
    businessName: string;
    previewUrl: string | null;
    sections: string[];
    theme: Record<string, any> | null;
    content: Record<string, any> | null;
    status: string; // "Draft", "Ready", "Sent"
    createdAt: string;
    updatedAt: string;
}

export interface Quote {
    id: string;
    dealId: string;
    setupFee: number;
    monthlyFee: number;
    addOns: string[];
    term: number; // in months
    status: string; // "Draft", "Sent", "Accepted", "Declined"
    validUntil: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Contract {
    id: string;
    dealId: string;
    status: string; // "Draft", "Sent", "Signed"
    sentAt: string | null;
    signedAt: string | null;
    startDate: string | null;
    term: number;
    content: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: string;
    dealId: string;
    amount: number;
    type: string; // "Setup", "Subscription"
    status: string; // "Pending", "Paid", "Failed"
    requestedAt: string | null;
    paidAt: string | null;
    reference: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface TimelineEvent {
    id: string;
    dealId: string;
    type: string;
    message: string;
    createdAt: string;
    actor: string;
}
