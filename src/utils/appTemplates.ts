import { LucideIcon } from 'lucide-react';
import { 
  Scissors, 
  Wrench, 
  Sparkles, 
  Hammer, 
  PaintBucket, 
  TreePine, 
  Heart, 
  Baby, 
  Coffee 
} from 'lucide-react';

export interface AppTemplate {
  id: string;
  title: string;
  category: TemplateCategory;
  idealFor: string[];
  overview: string;
  icon: LucideIcon;
  keyFeatures: string[];
  personalizationOptions: string[];
  image_url?: string;
  // New pricing structure
  sale_price?: number;
  customization_price?: number;
  foundation_features?: string[];
  core_industry_features?: string[];
  premium_features?: {name: string, price: number}[];
  // Legacy pricing (for backward compatibility)
  pricing: {
    base: number;
    customization: number;
    subscription: {
      monthly: number;
      benefits: string[];
    };
    deposit: {
      amount: number;
      serviceMonthly: number;
      description: string;
    };
    installments: {
      available: boolean;
      plans: {
        months: number;
        monthlyAmount: number;
        totalAmount: number;
      }[];
    };
    ownership: {
      buyOutright: number;
      serviceContract: {
        deposit: number;
        monthly: number;
        benefits: string[];
      };
    };
  };
  popular?: boolean;
}

export type TemplateCategory = 
  | 'beauty-wellness' 
  | 'service-industry' 
  | 'care-food';

export const templateCategories: Record<TemplateCategory, { 
  label: string; 
  description: string; 
  icon: LucideIcon;
}> = {
  'beauty-wellness': {
    label: 'Beauty & Wellness',
    description: 'Apps for beauty professionals and wellness practitioners',
    icon: Sparkles
  },
  'service-industry': {
    label: 'Service Industry',
    description: 'Apps for trades and professional services',
    icon: Hammer
  },
  'care-food': {
    label: 'Care & Food Services',
    description: 'Apps for childcare and mobile food services',
    icon: Heart
  }
};

export const appTemplates: AppTemplate[] = [
  {
    id: 'hair-beauty-pro',
    title: 'Hair & Beauty Pro App',
    category: 'beauty-wellness',
    idealFor: ['Hairdressers', 'Barbers', 'Beauticians', 'Nail technicians'],
    overview: 'This app allows beauty professionals to present their services, manage appointments, engage their clients, and showcase their work — all in one elegant and customizable solution.',
    icon: Scissors,
    keyFeatures: [
      'Service Menu with pricing and duration',
      'Booking Calendar with automatic reminders',
      'Mobile/Salon Toggle for service locations',
      'Client Notes and visit history tracking',
      'Before/After Gallery showcase',
      'Location Integration with GPS',
      'Push Notifications and alerts',
      'Loyalty System with rewards'
    ],
    personalizationOptions: [
      'Upload business logo and stylist photo',
      'Customize app colors, buttons, icons, and fonts',
      'Edit service names, prices, and descriptions',
      'Define location radius and availability',
      'Create custom loyalty rules and branding',
      'Add social media links integration'
    ],
    pricing: {
      base: 2500,
      customization: 500,
      subscription: {
        monthly: 199,
        benefits: ['Monthly updates', 'Priority support', 'Feature requests', 'Backup & maintenance']
      },
      deposit: {
        amount: 750,
        serviceMonthly: 149,
        description: 'Pay deposit + monthly service fee for ongoing management'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: 450, totalAmount: 2700 },
          { months: 12, monthlyAmount: 240, totalAmount: 2880 }
        ]
      },
      ownership: {
        buyOutright: 2500,
        serviceContract: {
          deposit: 750,
          monthly: 149,
          benefits: ['App hosting', 'Updates & maintenance', 'Technical support', 'Feature additions']
        }
      }
    },
    popular: true
  },
  {
    id: 'mobile-mechanic',
    title: 'Mobile Mechanic App',
    category: 'service-industry',
    idealFor: ['Freelance mechanics', 'Diagnostics specialists', 'Roadside service operators'],
    overview: 'A perfect solution for mechanics who work remotely and need to receive job requests, manage schedules, and stay in control of parts, vehicles, and payments.',
    icon: Wrench,
    keyFeatures: [
      'Job Request Form with car details',
      'Location Sharing for roadside help',
      'Quote Management and approval system',
      'Job Status Tracking workflow',
      'Photo Documentation pre/post repair',
      'Service Records and vehicle history',
      'Parts Log with costs tracking',
      'Payment Integration and invoicing'
    ],
    personalizationOptions: [
      'Add mechanic branding and logo',
      'Customize pricing and labor rates',
      'Edit automated messages and quotes',
      'Define service zones and availability',
      'Adjust invoice templates with VAT',
      'Upload portfolio and reviews'
    ],
    pricing: {
      base: 3000,
      customization: 750,
      subscription: {
        monthly: 249,
        benefits: ['Monthly updates', 'Priority support', 'Job tracking analytics', 'Backup & maintenance']
      },
      deposit: {
        amount: 900,
        serviceMonthly: 199,
        description: 'Pay deposit + monthly service fee for ongoing management'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: 540, totalAmount: 3240 },
          { months: 12, monthlyAmount: 280, totalAmount: 3360 }
        ]
      },
      ownership: {
        buyOutright: 3000,
        serviceContract: {
          deposit: 900,
          monthly: 199,
          benefits: ['App hosting', 'Updates & maintenance', 'Technical support', 'Job tracking tools']
        }
      }
    }
  },
  {
    id: 'cleaning-services',
    title: 'Cleaning Services App',
    category: 'service-industry',
    idealFor: ['Domestic cleaners', 'Office cleaners', 'End-of-tenancy teams', 'Cleaning agencies'],
    overview: 'An all-in-one app to accept bookings, manage tasks, bill clients, and deliver outstanding cleaning services to both residential and commercial clients.',
    icon: Sparkles,
    keyFeatures: [
      'Booking System for one-time and recurring',
      'Service Checklists room-by-room',
      'Client Notes and preferences storage',
      'Photo Log before and after cleaning',
      'Quote Generator with auto-calculation',
      'Team Management and route tracking',
      'Recurring Invoices automation',
      'Live Chat and booking confirmations'
    ],
    personalizationOptions: [
      'Company name, logo, and custom theme',
      'Customize job types and rates',
      'Edit invoice terms and tax settings',
      'Choose icons for rooms and tasks',
      'Set welcome messages and auto-replies'
    ],
    pricing: {
      base: 2800,
      customization: 600,
      subscription: {
        monthly: 229,
        benefits: ['Monthly updates', 'Priority support', 'Team management tools', 'Backup & maintenance']
      },
      deposit: {
        amount: 840,
        serviceMonthly: 179,
        description: 'Pay deposit + monthly service fee for ongoing management'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: 500, totalAmount: 3000 },
          { months: 12, monthlyAmount: 260, totalAmount: 3120 }
        ]
      },
      ownership: {
        buyOutright: 2800,
        serviceContract: {
          deposit: 840,
          monthly: 179,
          benefits: ['App hosting', 'Updates & maintenance', 'Technical support', 'Team coordination']
        }
      }
    }
  },
  {
    id: 'trades-pro',
    title: 'Trades Pro App',
    category: 'service-industry',
    idealFor: ['Electricians', 'Plumbers', 'Handymen', 'Builders', 'Painters'],
    overview: 'This app helps professionals in the trades provide quotes, manage jobs, and communicate with customers clearly while documenting their work and boosting credibility.',
    icon: Hammer,
    keyFeatures: [
      'Quote Builder with detailed estimates',
      'Job Tracking and status updates',
      'Photos & Documents upload system',
      'Client Messaging real-time updates',
      'Invoice System with branding',
      'Team Scheduling multi-worker support',
      'Materials List and usage tracking',
      'Job History for repeat customers'
    ],
    personalizationOptions: [
      'Business logo and work photos',
      'Customize service types and pricing',
      'Edit estimate and invoice templates',
      'Define job locations and availability',
      'Add contact numbers and certifications'
    ],
    pricing: {
      base: 3200,
      customization: 800,
      subscription: {
        monthly: 269,
        benefits: ['Monthly updates', 'Priority support', 'Advanced reporting', 'Backup & maintenance']
      },
      deposit: {
        amount: 960,
        serviceMonthly: 219,
        description: 'Pay deposit + monthly service fee for ongoing management'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: 580, totalAmount: 3480 },
          { months: 12, monthlyAmount: 300, totalAmount: 3600 }
        ]
      },
      ownership: {
        buyOutright: 3200,
        serviceContract: {
          deposit: 960,
          monthly: 219,
          benefits: ['App hosting', 'Updates & maintenance', 'Technical support', 'Advanced reporting tools']
        }
      }
    },
    popular: true
  },
  {
    id: 'mobile-hair-nail',
    title: 'Mobile Hair & Nail App',
    category: 'beauty-wellness',
    idealFor: ['Mobile stylists', 'Nail artists', 'Makeup artists', 'Freelance beauticians'],
    overview: 'A beautiful and lightweight app that helps freelancers manage travel-based bookings, pricing, photos, and client histories all from one place.',
    icon: PaintBucket,
    keyFeatures: [
      'Flexible Schedule with travel breaks',
      'Location Radius and zone settings',
      'Custom Pricing for locations/groups',
      'Visit Notes and style history',
      'Portfolio Builder with galleries',
      'Rebooking Prompts auto-reminders',
      'Push Alerts for confirmations',
      'Discount Codes and referral rewards'
    ],
    personalizationOptions: [
      'Upload logo, header, and contact info',
      'Set pricing, timings, and services',
      'Adjust messaging tone for alerts',
      'Include Instagram feed integration',
      'Customize photo portfolio questions'
    ],
    pricing: {
      base: 2200,
      customization: 450,
      subscription: {
        monthly: 179,
        benefits: ['Monthly updates', 'Priority support', 'Portfolio enhancements', 'Backup & maintenance']
      },
      deposit: {
        amount: 660,
        serviceMonthly: 129,
        description: 'Pay deposit + monthly service fee for ongoing management'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: 400, totalAmount: 2400 },
          { months: 12, monthlyAmount: 210, totalAmount: 2520 }
        ]
      },
      ownership: {
        buyOutright: 2200,
        serviceContract: {
          deposit: 660,
          monthly: 129,
          benefits: ['App hosting', 'Updates & maintenance', 'Technical support', 'Portfolio tools']
        }
      }
    }
  },
  {
    id: 'landscaping-gardening',
    title: 'Landscaping & Gardening App',
    category: 'service-industry',
    idealFor: ['Landscapers', 'Gardeners', 'Yard maintenance', 'Seasonal decorators'],
    overview: 'An operational hub for professionals to manage clients\' outdoor spaces, with seasonal tools, scheduling, and detailed service tracking.',
    icon: TreePine,
    keyFeatures: [
      'Recurring Jobs seasonal cycles',
      'Task Lists property-specific',
      'Progress Photos with visit notes',
      'Job Quotes itemized proposals',
      'Geo Scheduling by location route',
      'Client Portal for history access',
      'Plant Care Notes and treatments',
      'Weather Integration for scheduling'
    ],
    personalizationOptions: [
      'Set color theme and logo',
      'Define service types and pricing',
      'Edit quote and maintenance templates',
      'Customize weather delay notifications',
      'Add garden makeover gallery'
    ],
    pricing: {
      base: 2900,
      customization: 650,
      subscription: {
        monthly: 239,
        benefits: ['Monthly updates', 'Priority support', 'Weather integrations', 'Backup & maintenance']
      },
      deposit: {
        amount: 870,
        serviceMonthly: 189,
        description: 'Pay deposit + monthly service fee for ongoing management'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: 520, totalAmount: 3120 },
          { months: 12, monthlyAmount: 270, totalAmount: 3240 }
        ]
      },
      ownership: {
        buyOutright: 2900,
        serviceContract: {
          deposit: 870,
          monthly: 189,
          benefits: ['App hosting', 'Updates & maintenance', 'Technical support', 'Weather features']
        }
      }
    }
  },
  {
    id: 'massage-wellness',
    title: 'Massage & Wellness App',
    category: 'beauty-wellness',
    idealFor: ['Massage therapists', 'Holistic healers', 'Spa practitioners', 'Wellness coaches'],
    overview: 'A soothing, professionally designed app to manage bookings, offer memberships, take payments, and maintain professional client care.',
    icon: Heart,
    keyFeatures: [
      'Treatment Menu with durations/prices',
      'Online Booking time slot selection',
      'Health Intake Forms wellness details',
      'Session History and client notes',
      'Package Deals and memberships',
      'Auto-Reminders for sessions',
      'Optional Video Calls consultations',
      'Performance Metrics dashboard'
    ],
    personalizationOptions: [
      'Calming color scheme and spa logo',
      'Background music/video ambiance',
      'Custom intake forms and feedback',
      'Tip options and payment rules',
      'Service categories and messaging'
    ],
    pricing: {
      base: 2600,
      customization: 550,
      subscription: {
        monthly: 209,
        benefits: ['Monthly updates', 'Priority support', 'Health integrations', 'Backup & maintenance']
      },
      deposit: {
        amount: 780,
        serviceMonthly: 159,
        description: 'Pay deposit + monthly service fee for ongoing management'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: 470, totalAmount: 2820 },
          { months: 12, monthlyAmount: 245, totalAmount: 2940 }
        ]
      },
      ownership: {
        buyOutright: 2600,
        serviceContract: {
          deposit: 780,
          monthly: 159,
          benefits: ['App hosting', 'Updates & maintenance', 'Technical support', 'Health features']
        }
      }
    }
  },
  {
    id: 'childcare-nanny',
    title: 'Childcare & Nanny App',
    category: 'care-food',
    idealFor: ['Nannies', 'Babysitters', 'Early childhood providers', 'Small daycare operators'],
    overview: 'A secure and parent-friendly app for caregivers to log daily activities, send live updates, and manage routines while showcasing trustworthiness and organization.',
    icon: Baby,
    keyFeatures: [
      'Daily Scheduler for routines',
      'Child Profiles with emergency info',
      'Daily Reports with photos to parents',
      'Check-In/Out secure PIN system',
      'Live Messaging parent communication',
      'Feedback Requests post-session',
      'Repeat Booking with preferences',
      'Emergency Protocols and contacts'
    ],
    personalizationOptions: [
      'Warm color themes and logo',
      'Upload welcome message and photos',
      'Edit daily report sections',
      'Add booking policies and rates',
      'Include parent support resources'
    ],
    pricing: {
      base: 2400,
      customization: 500,
      subscription: {
        monthly: 189,
        benefits: ['Monthly updates', 'Priority support', 'Safety features', 'Backup & maintenance']
      },
      deposit: {
        amount: 720,
        serviceMonthly: 139,
        description: 'Pay deposit + monthly service fee for ongoing management'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: 430, totalAmount: 2580 },
          { months: 12, monthlyAmount: 225, totalAmount: 2700 }
        ]
      },
      ownership: {
        buyOutright: 2400,
        serviceContract: {
          deposit: 720,
          monthly: 139,
          benefits: ['App hosting', 'Updates & maintenance', 'Technical support', 'Safety monitoring']
        }
      }
    }
  },
  {
    id: 'mobile-food-coffee',
    title: 'Mobile Food & Coffee Van App',
    category: 'care-food',
    idealFor: ['Snack vans', 'Coffee trucks', 'Mobile lunch services', 'Pop-up food vendors'],
    overview: 'This high-energy app helps food vans post their location, sell daily menus, notify locals, and build loyalty.',
    icon: Coffee,
    keyFeatures: [
      'Live Map Route with time ranges',
      'Menu Display with photos/pricing',
      'Pre-Ordering item reservation',
      'Loyalty Cards and visit rewards',
      'Stock Updates and sold-out alerts',
      'Push Alerts location notifications',
      'Ratings & Comments customer feedback',
      'Payment Options card/mobile'
    ],
    personalizationOptions: [
      'Upload truck branding and slogan',
      'Set colors, icons, daily messages',
      'Customize order flow and displays',
      'Add background image and team info',
      'Set operating hours and zones'
    ],
    pricing: {
      base: 2700,
      customization: 600,
      subscription: {
        monthly: 219,
        benefits: ['Monthly updates', 'Priority support', 'Location analytics', 'Backup & maintenance']
      },
      deposit: {
        amount: 810,
        serviceMonthly: 169,
        description: 'Pay deposit + monthly service fee for ongoing management'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: 485, totalAmount: 2910 },
          { months: 12, monthlyAmount: 250, totalAmount: 3000 }
        ]
      },
      ownership: {
        buyOutright: 2700,
        serviceContract: {
          deposit: 810,
          monthly: 169,
          benefits: ['App hosting', 'Updates & maintenance', 'Technical support', 'Location tracking']
        }
      }
    }
  }
];

export const getTemplatesByCategory = (category: TemplateCategory): AppTemplate[] => {
  return appTemplates.filter(template => template.category === category);
};

export const getPopularTemplates = (): AppTemplate[] => {
  return appTemplates.filter(template => template.popular);
};

export const getAllCategories = (): TemplateCategory[] => {
  return Object.keys(templateCategories) as TemplateCategory[];
};