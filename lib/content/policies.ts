import { CONTACT } from '../data';
import type { ContentPage } from './types';

/**
 * Policy pages: content handover P40 to P43.
 *
 * These are the handover's PROPOSED drafts, pending business approval and legal
 * review. Contact and business identity are filled from CONTACT; every other
 * bracketed field is an unmade decision and renders as a visible placeholder.
 * They must not be read as adopted terms until those fields are resolved.
 */
const SUPPORT = `${CONTACT.email} · ${CONTACT.phone}`;
const LEGAL = `${CONTACT.entity}, ${CONTACT.address}`;

export const POLICIES: ContentPage[] = [
  {
    slug: 'shipping-policy',
    seoTitle: 'Shipping and Delivery | RejuveLuxe',
    description:
      'Read RejuveLuxe shipping information, including serviceable destinations, dispatch, delivery charges, tracking and help with delivery concerns.',
    eyebrow: 'Policies',
    title: 'Shipping and Delivery',
    lead: ['Last updated: [POLICY_DATE]'],
    sections: [
      {
        t: 'text',
        title: 'Where we deliver',
        body: [
          `We currently accept orders for delivery to [SERVICEABLE_DESTINATIONS]. Enter your delivery details at checkout to see the options available for your address. For a location not listed, contact ${CONTACT.email} before placing an order.`,
        ],
      },
      {
        t: 'text',
        title: 'Dispatch and delivery times',
        body: [
          'Orders are normally prepared for dispatch within [DISPATCH_WINDOW_AND_WORKING_DAYS]. Estimated delivery after dispatch is [DELIVERY_WINDOW_BY_REGION]. Any product-specific preparation time or dispatch exception will be shown before purchase.',
          'Delivery estimates may be affected by circumstances outside the normal delivery process. If your order is delayed, contact us so we can help review its status. This does not limit your rights where delivery obligations are not met.',
        ],
      },
      {
        t: 'text',
        title: 'Delivery charges',
        body: [
          'Shipping charges are [APPROVED_SHIPPING_RATE_OR_CALCULATION]. The applicable charge and final total will be displayed before payment. Any approved free-shipping offer will state its conditions alongside the offer.',
        ],
      },
      {
        t: 'text',
        title: 'Tracking your order',
        body: [
          'After dispatch, tracking information is provided through [APPROVED_TRACKING_CHANNEL]. Use the tracking details or contact us with your order number if you need help.',
        ],
      },
      {
        t: 'text',
        title: 'Address changes and delivery issues',
        body: [
          'Please check your delivery address before confirming the order. If it needs correction, contact us promptly with the order number. We will confirm whether a change is possible at that stage and explain any applicable, previously disclosed charges before proceeding.',
          'For an unsuccessful delivery attempt, follow the carrier’s instructions or contact us. Our process for re-delivery or an undeliverable parcel is [APPROVED_FAILED_DELIVERY_PROCESS].',
        ],
      },
      {
        t: 'text',
        title: 'Spillage or damage on arrival',
        body: [
          `If an order arrives damaged or tea has spilled, contact ${CONTACT.email} with the order number and a description. Photographs of the product and packaging, if available, can help us review the concern. See Returns and Cancellations for the next steps.`,
        ],
        cta: [{ label: 'Returns and Cancellations', href: '/policies/refund-policy' }],
      },
      {
        t: 'text',
        title: 'Gifting orders',
        body: [
          'For corporate or multi-address orders, dispatch arrangements and delivery expectations will be confirmed in the written order details before purchase.',
        ],
      },
      { t: 'text', title: 'Contact', body: [SUPPORT, LEGAL] },
    ],
  },

  {
    slug: 'refund-policy',
    seoTitle: 'Returns, Refunds and Cancellations | RejuveLuxe',
    description:
      'Find RejuveLuxe guidance for product concerns, damaged deliveries, refund requests and cancellations, with contact details and next steps.',
    eyebrow: 'Policies',
    title: 'Returns, Refunds and Cancellations',
    lead: [
      'Last updated: [POLICY_DATE]',
      'We want concerns about your order to be handled clearly. If an item is damaged, spilled, incorrect, missing or appears to have a quality issue, contact us using the details below. This policy does not restrict rights available under applicable consumer law.',
    ],
    sections: [
      {
        t: 'text',
        title: 'Tell us about the concern',
        body: [
          `Send your order number, the product name and a description to ${CONTACT.email}. Please report concerns within [APPROVED_REPORTING_WINDOW], without limiting any applicable statutory rights. Photographs and batch information, if available, help us understand what has happened.`,
          'If you notice unusual lumps, moisture or another change in the tea, describe it when contacting us. Product condition is assessed in context; ordinary small clumps in a powder are not automatically evidence of a defect.',
        ],
      },
      {
        t: 'text',
        title: 'Review and resolution',
        body: [
          'We will review the information and explain the available resolution. Our normal response window is [APPROVED_RESPONSE_WINDOW]. Where a refund, replacement or return is appropriate, we will confirm the next steps and any collection arrangements in writing.',
          'You do not need to send the item back before receiving instructions. Keep the product and packaging available where reasonably possible. Return shipping or collection for a verified product or fulfilment fault will be handled under [APPROVED_FAULT_RETURN_COST_RULE], subject to applicable law.',
        ],
      },
      {
        t: 'text',
        title: 'Refunds',
        body: [
          'Approved refunds are initiated within [APPROVED_REFUND_INITIATION_WINDOW] through [APPROVED_REFUND_METHOD]. Your payment provider may require additional processing time. If a refund has not appeared after the advised period, contact us with the order and refund details.',
          'The treatment of the original delivery charge is [APPROVED_DELIVERY_CHARGE_REFUND_RULE], subject to your statutory rights.',
        ],
      },
      {
        t: 'text',
        title: 'Changing your mind',
        body: [
          'Our policy for non-defective products, including sealed tea, teaware and gift sets, is [APPROVED_CHANGE_OF_MIND_RULE]. Any specific restrictions for personalized orders will be disclosed before purchase. These conditions do not remove remedies for faulty, incorrect or misdescribed goods.',
        ],
      },
      {
        t: 'text',
        title: 'Cancelling an order',
        body: [
          'To request cancellation, contact us promptly with your order number. Orders may be cancelled until [APPROVED_CANCELLATION_STAGE]. If the order has moved beyond that stage, we will explain the available options. Any cancellation charge must have been disclosed and must comply with applicable law.',
          'For customized or corporate orders, refer to the terms agreed before payment. Statutory consumer rights remain unaffected.',
        ],
      },
      {
        t: 'text',
        title: 'Escalating a concern',
        body: [
          'If your concern remains unresolved, contact [GRIEVANCE_OFFICER_NAME_AND_ROLE] at [GRIEVANCE_EMAIL_AND_PHONE].',
          `Business details: ${LEGAL}.`,
        ],
      },
    ],
  },

  {
    slug: 'privacy-policy',
    seoTitle: 'Privacy Policy | RejuveLuxe',
    description:
      'Read how RejuveLuxe handles personal information for orders, enquiries and marketing, including contact details and privacy choices.',
    eyebrow: 'Policies',
    title: 'Privacy Policy',
    lead: ['Last updated: [POLICY_DATE]'],
    sections: [
      {
        t: 'text',
        title: 'Who handles your information',
        body: [
          `RejuveLuxe is operated by ${LEGAL}. This policy explains how we handle information when you visit our website, contact us, place an order or choose to receive updates. For privacy questions, contact [PRIVACY_CONTACT].`,
        ],
      },
      {
        t: 'text',
        title: 'Information we collect',
        body: [
          'When you place an order or make an enquiry, we collect the details needed for that interaction. These may include your name, contact information, delivery and billing address, order details and messages you send us.',
          'The information collected automatically through the website, and the tools used to collect it, are [APPROVED_DEVICE_COOKIE_AND_ANALYTICS_DETAILS]. Payment information is handled through [APPROVED_PAYMENT_PROCESSORS_AND_DATA_HANDLING].',
        ],
      },
      {
        t: 'text',
        title: 'How we use information',
        body: [
          'We use information for [APPROVED_PURPOSES_AND_APPLICABLE_BASIS], including the applicable activities of processing orders, arranging delivery, responding to enquiries and maintaining required transaction records. We send optional marketing communications only in accordance with your choices and applicable law.',
        ],
      },
      {
        t: 'text',
        title: 'Service providers and disclosures',
        body: [
          'The providers and categories of recipients that receive information are [APPROVED_PROCESSOR_AND_RECIPIENT_DETAILS]. We disclose information where needed for the stated services or where required by applicable law. Any international processing or transfer arrangements are [APPROVED_TRANSFER_DETAILS_AND_SAFEGUARDS].',
        ],
      },
      {
        t: 'text',
        title: 'Cookies and similar tools',
        body: [
          'Our website uses [APPROVED_COOKIE_CATEGORIES_AND_PURPOSES]. You can manage optional choices through [COOKIE_PREFERENCES_CONTROL]. The effect of disabling a tool is explained alongside that choice. For a full list and retention periods, see [APPROVED_COOKIE_DETAILS_LOCATION].',
        ],
      },
      {
        t: 'text',
        title: 'How long information is kept',
        body: [
          'We retain information for [APPROVED_RETENTION_PERIODS_OR_CRITERIA], taking account of the purpose for which it was collected and applicable record-keeping requirements. Our deletion or anonymization process is [APPROVED_DELETION_PROCESS].',
        ],
      },
      {
        t: 'text',
        title: 'Your choices and requests',
        body: [
          'You can unsubscribe from marketing emails using the link in the message. For requests concerning access, correction, deletion, withdrawal of consent or other applicable privacy rights, contact [PRIVACY_CONTACT]. We may need proportionate information to verify a request before acting on it.',
        ],
      },
      {
        t: 'text',
        title: 'Security',
        body: [
          'We use [APPROVED_SECURITY_MEASURES_SUMMARY] to protect information. No online system can be guaranteed completely secure. Please contact us if you believe your account or information has been compromised.',
        ],
      },
      {
        t: 'text',
        title: 'Children and age-related handling',
        body: ['Our age-related practices, including any applicable consent process, are [APPROVED_CHILDREN_AND_AGE_POLICY].'],
      },
      {
        t: 'text',
        title: 'Updates and complaints',
        body: [
          'We update this policy when our practices change. The revised date appears at the top, and significant changes are communicated through [APPROVED_CHANGE_NOTICE_PROCESS]. For a concern about our handling of information, contact [PRIVACY_GRIEVANCE_CONTACT_AND_PROCESS].',
        ],
      },
    ],
  },

  {
    slug: 'terms-of-service',
    seoTitle: 'Terms of Service | RejuveLuxe',
    description:
      'Read the terms for using the RejuveLuxe website and placing an order, including product information, payments, delivery and customer support.',
    eyebrow: 'Policies',
    title: 'Terms of Service',
    lead: ['Last updated: [POLICY_DATE]'],
    sections: [
      {
        t: 'text',
        title: 'About these terms',
        body: [
          `This website is operated by ${LEGAL} under the RejuveLuxe brand. These terms describe the use of the website and purchases made through it. Read them alongside our Shipping, Returns and Cancellations, and Privacy policies. They do not limit rights that cannot be excluded under applicable law.`,
        ],
      },
      {
        t: 'text',
        title: 'Using the website',
        body: [
          'Provide accurate information when creating an account, contacting us or placing an order. Use the website lawfully and do not interfere with its operation or access another person’s account. Purchases are subject to [APPROVED_AGE_AND_CAPACITY_REQUIREMENTS].',
        ],
      },
      {
        t: 'text',
        title: 'Product information',
        body: [
          'The selected product page and pack provide the relevant description, quantity, ingredients and use instructions. Read these before purchase and use. Product photography may show styling items; included contents must be identified in the product description. We remain responsible for providing accurate information and applicable remedies for misdescription.',
        ],
      },
      {
        t: 'text',
        title: 'Prices and payment',
        body: [
          'The price, applicable taxes, delivery charges and final total are displayed before payment. Accepted payment methods are shown at checkout. The handling of a payment authorization, capture, failure or duplicate transaction follows [APPROVED_PAYMENT_PROCESS].',
        ],
      },
      {
        t: 'text',
        title: 'Placing an order',
        body: [
          'After you submit an order, [APPROVED_ORDER_ACKNOWLEDGEMENT_AND_ACCEPTANCE_PROCESS]. If an item cannot be supplied or a material pricing or description error is found, we will contact you and explain the available options. We will not substitute a materially different item without your agreement.',
        ],
      },
      {
        t: 'text',
        title: 'Delivery and order changes',
        body: [
          'See our Shipping Policy for delivery arrangements. Cancellation, return, replacement and refund requests are handled under Returns and Cancellations and applicable law. Terms for a customized or corporate order are agreed before purchase.',
        ],
      },
      {
        t: 'text',
        title: 'Tea and preparation',
        body: [
          'Follow the guidance for the particular product. Tea is presented as a food and beverage experience. General editorial content is not a personal medical recommendation.',
        ],
      },
      {
        t: 'text',
        title: 'Website content',
        body: [
          'RejuveLuxe branding and original website materials may not be used commercially without permission, except where permitted by law. Customer feedback must be authentic and must not include unlawful material or another person’s private information.',
        ],
      },
      {
        t: 'text',
        title: 'Service availability and responsibility',
        body: [
          'We work to keep website information clear and the service available. If a website or order issue affects you, contact us promptly. Nothing in these terms excludes responsibility or remedies that applicable law does not permit us to exclude.',
        ],
      },
      {
        t: 'text',
        title: 'Changes and contact',
        body: [
          'Updated terms apply as permitted by law and are identified by the date above. The terms applicable to an existing order are not retrospectively changed to remove your rights.',
          'Governing law and dispute process: [APPROVED_GOVERNING_LAW_AND_DISPUTE_WORDING].',
          `Customer support: ${SUPPORT}.`,
          'Grievance contact: [GRIEVANCE_OFFICER_NAME_AND_ROLE] · [GRIEVANCE_EMAIL_AND_PHONE].',
        ],
      },
    ],
  },
];
