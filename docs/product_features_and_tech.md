# Product Features & Technical Architecture — NyayaSetu (न्यायसेतु)

> Granular breakdown of features, architecture, tech stack, and scalability plan for an AI-powered legal navigation platform.

---

## 1. Core Features (MVP)

### Feature 1: Intelligent Legal Issue Intake

| Attribute | Details |
|-----------|---------|
| **Feature Name** | Smart Legal Issue Questionnaire |
| **Problem it solves** | Users don't know how to describe their legal problem in legal terms. They describe symptoms ("my neighbor built a wall on my land"), not legal categories ("encroachment / trespass under Section 441 IPC"). |
| **User Flow** | 1. User selects broad category (Property, Crime, Family, Consumer, Employment, Cyber, etc.) or describes problem in free text / voice. → 2. AI analyzes input and asks 5-10 targeted follow-up questions (multiple choice + free text) to narrow down the exact legal issue. → 3. System classifies the issue into a specific legal sub-category with confidence score. → 4. If confidence is low, system asks clarifying questions or suggests 2-3 possible classifications for user to confirm. |
| **Technical Complexity** | 🔴 High |
| **Dependencies** | Legal knowledge graph, NLP classification model, multilingual input processing |
| **Key Design Decisions** | Conversational UI (not form-based) to reduce cognitive load. Support both text and voice input. Progressive disclosure — don't overwhelm with 20 questions at once. Use decision-tree logic backed by AI for hybrid reliability. |

### Feature 2: Jurisdiction Detection & Mapping

| Attribute | Details |
|-----------|---------|
| **Feature Name** | Auto Jurisdiction Resolver |
| **Problem it solves** | Legal procedures, courts, and government offices differ by state, district, and sometimes taluka. Users don't know which jurisdiction applies to their problem. |
| **User Flow** | 1. User provides location (auto-detect via GPS, or manual entry of city/district/pin code). → 2. System maps location to the correct legal jurisdiction (district court, magistrate court, specific police station, consumer forum, revenue office, etc.). → 3. If the issue involves property in a different location, system asks for property location and resolves jurisdiction accordingly. → 4. System provides exact addresses, contact numbers, and office hours of relevant offices. |
| **Technical Complexity** | 🟠 Medium |
| **Dependencies** | Jurisdiction database (courts, police stations, government offices by district), geocoding API, pincode-to-district mapping |
| **Key Design Decisions** | Use India's administrative hierarchy: State → District → Taluka/Tehsil → Village/Ward. Map each hierarchical level to relevant courts and offices. Pre-populate common jurisdictions; allow crowd-sourced corrections. |

### Feature 3: AI-Powered Action Plan Generator

| Attribute | Details |
|-----------|---------|
| **Feature Name** | Dual-Horizon Action Plan |
| **Problem it solves** | Users know they have a problem but don't know what to do. They need both immediate steps (today/this week) and long-term steps (months). |
| **User Flow** | 1. After issue classification and jurisdiction detection → 2. AI generates a **Short-Term Action Plan** (Immediate: 0-7 days): safety steps, evidence preservation, initial complaint filing, emergency contacts, interim relief options. → 3. AI generates a **Long-Term Resolution Roadmap** (1-12+ months): formal legal proceedings, required documents, anticipated timeline, estimated costs, court procedures, alternative dispute resolution options. → 4. Each step in the plan includes: what to do, where to go (with address), what documents to carry, what to say/write, estimated time, and potential costs. → 5. User can mark steps as completed and the plan updates accordingly. |
| **Technical Complexity** | 🔴 High |
| **Dependencies** | Legal knowledge graph, LLM with RAG, jurisdiction database, document templates |
| **Key Design Decisions** | Use RAG (Retrieval Augmented Generation) to ground all action plan steps in verified legal database content — never rely on pure LLM generation for legal procedures. Every action step must cite the relevant law/section. Include confidence indicators. Add "Consult a lawyer before proceeding" warnings for high-stakes steps. |

### Feature 4: Legal Rights Explainer

| Attribute | Details |
|-----------|---------|
| **Feature Name** | "Know Your Rights" Module |
| **Problem it solves** | Citizens often don't know what laws protect them. A tenant doesn't know about the Rent Control Act. A harassment victim doesn't know about POSH Act. A consumer doesn't know about Consumer Protection Act 2019. |
| **User Flow** | 1. Based on the classified issue → 2. System shows relevant laws, rights, and protections in plain language (not legal jargon). → 3. Each right includes: what the law says (simplified), what protections you have, what violations look like, and what remedies are available. → 4. Available in user's preferred language. |
| **Technical Complexity** | 🟡 Low-Medium |
| **Dependencies** | Legal content database, multilingual content authoring |
| **Key Design Decisions** | Content must be written by legal professionals and reviewed for accuracy. Translations must be done by native speakers (not just machine translation). Use visual aids, infographics, and examples. |

### Feature 5: Government Office & Court Directory

| Attribute | Details |
|-----------|---------|
| **Feature Name** | Legal Services Locator |
| **Problem it solves** | Users don't know which police station, court, or government office to approach, or where it's located, or when it's open. |
| **User Flow** | 1. Based on issue type + jurisdiction → 2. System shows: relevant police station (with SHO name if available), correct court/forum, relevant government offices (Sub-Registrar, Revenue Office, Labor Commissioner, Consumer Forum, etc.), NALSA/DLSA free legal aid center. → 3. For each office: address, phone number, office hours, nearest public transport, what documents to carry, what fees to expect. → 4. Integrated map view with directions. |
| **Technical Complexity** | 🟠 Medium |
| **Dependencies** | Comprehensive directory database (must be built and maintained), mapping API (Google Maps / Mapbox), data verification process |
| **Key Design Decisions** | Start with top 5 states and top 50 districts. Crowd-source updates (like Google Maps local guides). Verify through government RTI data. Partner with DLSA offices for official data. |

### Feature 6: Emergency Legal Helplines

| Attribute | Details |
|-----------|---------|
| **Feature Name** | Emergency Connect |
| **Problem it solves** | Some legal issues are emergencies (domestic violence, threats, ongoing crime). Users need to reach help immediately, not read action plans. |
| **User Flow** | 1. If AI detects emergency keywords during intake (violence, threat, danger, hurt, attack) → 2. Immediately surface emergency helpline numbers: 100 (Police), 181 (Women Helpline), 1098 (Childline), 112 (Emergency), 1930 (Cyber Crime). → 3. One-tap calling. → 4. Show nearest police station with live map directions. → 5. Option to share live location with trusted contact. |
| **Technical Complexity** | 🟡 Low |
| **Dependencies** | Emergency number database, click-to-call API, location services |
| **Key Design Decisions** | Emergency detection must be aggressive (false positives are better than false negatives for safety). Native dialer integration on mobile. Offline capability for emergency numbers. |

### Feature 7: Multilingual Support (Hindi + English MVP)

| Attribute | Details |
|-----------|---------|
| **Feature Name** | Language-First Interface |
| **Problem it solves** | 90%+ of Indians are more comfortable in a regional language than English. Legal terms are particularly difficult in non-native languages. |
| **User Flow** | 1. Language selection on first launch (auto-detect from device settings). → 2. Entire interface, questionnaire, and action plans rendered in selected language. → 3. Voice input in Hindi and English. → 4. Legal terms shown as: simplified vernacular explanation + original English legal term in brackets for reference. |
| **Technical Complexity** | 🟠 Medium |
| **Dependencies** | Translation infrastructure, Hindi NLP model, voice-to-text for Hindi, content localization team |
| **Key Design Decisions** | Hindi and English for MVP. Don't just translate — localize. Legal concepts must be re-explained in culturally appropriate ways. Use IndicTrans2 or similar models for AI-powered translation, with human review for legal accuracy. |

---

## 2. Advanced Features (Post-MVP)

### AI Features

| Feature | Description | Timeline |
|---------|-------------|----------|
| **Voice-First Navigation** | Complete the entire intake and receive action plans via voice conversation in 10+ Indian languages. Leveraging speech-to-text (Whisper/IndicWhisper) and text-to-speech. | Month 6-9 |
| **Predictive Case Outcome** | Based on anonymized historical case data (from e-Courts), predict likely outcome, timeline, and cost for the user's specific situation. | Year 2 |
| **Smart Document Generation** | AI generates ready-to-file legal notices, complaints, RTI applications, and affidavits based on user's situation and jurisdiction. | Month 4-8 |
| **Conversational Case Tracker** | AI assistant that follows up on your case: "Your next hearing is on March 15. Here's what to prepare." Integrates with e-Courts data. | Year 2 |
| **Legal Risk Score** | For business users: analyze a contract, lease agreement, or partnership deed and highlight legal risks. | Year 2-3 |
| **AI Mediator** | For disputes between two parties (e.g., tenant-landlord), facilitate structured negotiation before formal legal action. | Year 3+ |

### Automation Features

| Feature | Description | Timeline |
|---------|-------------|----------|
| **Auto FIR Filing** | Integration with state police portals to file online FIRs/e-Complaints directly from the platform. | Month 9-12 |
| **RTI Auto-Filing** | Generate and file RTI applications with relevant Public Information Officers. | Month 6-9 |
| **Consumer Complaint Filing** | Integrate with e-Daakhil (National Consumer Disputes Redressal Commission portal). | Month 9-12 |
| **Deadline & Limitation Tracker** | Auto-calculate limitation periods for various legal actions and send alerts. | Month 4-6 |
| **Evidence Vault** | Secure, timestamped storage for photos, videos, documents, and screenshots that may serve as evidence. | Month 6-9 |

### Integrations

| Integration | Purpose | Priority |
|-------------|---------|----------|
| **e-Courts API** | Track case status, hearing dates, and court orders. | High |
| **DigiLocker** | Access user's official documents (Aadhaar, PAN, property docs) for case preparation. | Medium |
| **NALSA/DLSA Systems** | Connect eligible users to free legal aid. | High |
| **Bhulekh / State Land Records** | Verify property ownership for property disputes. | Medium |
| **UPI/Payment Gateways** | Subscription payments, document fees, lawyer consultation payments. | High |
| **WhatsApp Business API** | Deliver action plans, reminders, and updates via WhatsApp. | High |
| **Google Maps Platform** | Office locations, directions, and jurisdiction mapping. | High |

### Analytics & Insights

| Feature | Description | Audience |
|---------|-------------|----------|
| **User Journey Analytics** | Track issue types, completion rates, action plan adherence, and outcomes. | Internal team |
| **Legal Trend Dashboard** | Aggregated, anonymized view of what legal issues are rising in which regions. | B2B customers, policymakers |
| **Lawyer Performance Analytics** | Track resolution rates, response times, and user ratings for listed lawyers. | Internal (quality control) |
| **Access-to-Justice Index** | Geographic heat map of legal service gaps — districts with low lawyer density, high case loads, low awareness. | Policy advocacy, CSR reports |

### Admin Systems

| System | Description |
|--------|-------------|
| **Content Management System (CMS)** | For legal experts to create, review, and update legal knowledge base content. Version control, approval workflows, and multi-language management. |
| **Lawyer Management Portal** | Onboarding, verification (Bar Council number validation), profile management, lead management, payment reconciliation. |
| **Quality Assurance Dashboard** | Random sampling of AI-generated action plans for legal expert review. Flag inaccurate or risky outputs. Track accuracy metrics over time. |
| **User Support & Escalation System** | Ticketing system for users who need human help. Escalation to legal experts for complex cases. SLA tracking. |
| **Jurisdiction Data Management** | Interface for updating court addresses, office details, and jurisdictional boundaries. Change log and audit trail. |

---

## 3. Detailed Feature Architecture

### Backend Modules

```
backend/
├── api-gateway/                    # API Gateway & Rate Limiting
│   ├── authentication/             # JWT-based auth, OAuth2, Aadhaar-based KYC
│   ├── rate-limiter/               # Per-user and per-IP rate limiting
│   └── request-router/             # Route to appropriate microservice
│
├── user-service/                   # User management
│   ├── registration/               # Phone OTP + email registration
│   ├── profile-management/         # User profile, language preference, location
│   ├── session-management/         # JWT tokens, refresh tokens
│   └── family-management/          # Family plan user linking
│
├── intake-service/                 # Legal issue intake & classification
│   ├── questionnaire-engine/       # Dynamic question flow based on responses
│   ├── nlp-classifier/             # Issue classification from free text / voice
│   ├── voice-processor/            # Speech-to-text for voice input
│   └── issue-taxonomy/             # Hierarchical legal issue categorization
│
├── knowledge-service/              # Legal knowledge base
│   ├── knowledge-graph/            # Structured legal knowledge graph (Neo4j)
│   ├── law-database/               # Acts, sections, amendments, case law
│   ├── jurisdiction-mapper/        # Location → jurisdiction → relevant offices
│   ├── rights-explainer/           # Plain-language rights content
│   └── content-versioning/         # Track changes, approval workflow
│
├── action-plan-service/            # AI-powered action plan generation
│   ├── rag-engine/                 # Retrieval Augmented Generation pipeline
│   ├── plan-generator/             # Short-term + long-term plan creation
│   ├── plan-tracker/               # User progress tracking, step completion
│   ├── deadline-calculator/        # Limitation period computation
│   └── plan-updater/               # Re-generate plan based on new information
│
├── document-service/               # Document generation & management
│   ├── template-engine/            # Jurisdiction-specific document templates
│   ├── document-generator/         # Fill templates with user data
│   ├── evidence-vault/             # Secure document/media storage
│   └── document-export/            # PDF, DOCX export
│
├── directory-service/              # Courts, offices, helplines directory
│   ├── office-database/            # Courts, police stations, govt offices
│   ├── lawyer-directory/           # Verified lawyer listings
│   ├── nalsa-connector/            # Free legal aid service integration
│   └── geocoding/                  # Address to coordinates mapping
│
├── notification-service/           # Alerts & communications
│   ├── sms-gateway/                # OTP, alerts via SMS
│   ├── push-notifications/         # Mobile push via FCM/APNs
│   ├── whatsapp-integration/       # WhatsApp Business API
│   ├── email-service/              # Email notifications
│   └── reminder-scheduler/         # Deadline and hearing reminders
│
├── payment-service/                # Payments & subscriptions
│   ├── subscription-manager/       # Plan management, upgrades/downgrades
│   ├── payment-gateway/            # Razorpay/Cashfree integration
│   └── invoice-generator/          # GST-compliant invoicing
│
├── analytics-service/              # Data analytics & reporting
│   ├── user-analytics/             # Usage patterns, funnel analysis
│   ├── legal-trends/               # Aggregated issue trend analysis
│   └── quality-metrics/            # AI accuracy tracking
│
└── admin-service/                  # Admin panel backend
    ├── content-management/         # CMS for legal content
    ├── lawyer-management/          # Lawyer onboarding & verification
    ├── qa-dashboard/               # AI output quality assurance
    └── user-support/               # Support ticket management
```

### Frontend Modules

```
frontend/
├── web-app/                        # Next.js web application
│   ├── pages/
│   │   ├── home/                   # Landing page with issue category selection
│   │   ├── intake/                 # Conversational intake questionnaire
│   │   ├── action-plan/            # Action plan display with progress tracking
│   │   ├── rights/                 # Know Your Rights section
│   │   ├── directory/              # Office/court/lawyer directory with maps
│   │   ├── documents/              # Document generation and evidence vault
│   │   ├── profile/                # User profile and settings
│   │   ├── subscription/           # Plan selection and payment
│   │   └── community/             # Anonymized case stories (Post-MVP)
│   │
│   ├── components/
│   │   ├── chat-interface/         # Conversational UI component
│   │   ├── voice-input/            # Voice recording and processing
│   │   ├── action-plan-card/       # Step-by-step action plan display
│   │   ├── map-view/               # Integrated map for office locations
│   │   ├── language-switcher/      # Language selection and switching
│   │   ├── emergency-banner/       # Emergency helpline quick-access
│   │   └── progress-tracker/       # Visual progress for action plan steps
│   │
│   └── utils/
│       ├── i18n/                   # Internationalization utilities
│       ├── analytics/              # Event tracking
│       └── offline/                # Service worker for offline capabilities
│
├── mobile-app/                     # React Native mobile application
│   ├── screens/                    # Same structure as web pages
│   ├── native-modules/
│   │   ├── voice-recorder/         # Native voice input
│   │   ├── camera/                 # Evidence capture
│   │   ├── location/               # GPS for jurisdiction detection
│   │   ├── biometric-auth/         # Fingerprint/Face ID
│   │   └── offline-storage/        # Local DB for offline access
│   └── push-notifications/         # FCM/APNs integration
│
├── whatsapp-bot/                   # WhatsApp Business API bot
│   ├── message-handler/            # Process incoming messages
│   ├── flow-manager/               # Conversational flow for WhatsApp
│   └── media-handler/              # Handle images, documents, voice
│
└── admin-panel/                    # Internal admin web app
    ├── content-editor/             # Legal content WYSIWYG editor
    ├── qa-review/                  # AI output review interface
    ├── lawyer-management/          # Lawyer onboarding dashboard
    ├── analytics-dashboard/        # Usage and trend dashboards
    └── user-support/               # Support ticket interface
```

### Database Design Considerations

#### Primary Databases

| Database | Engine | Purpose | Justification |
|----------|--------|---------|---------------|
| **User Data** | PostgreSQL | User profiles, subscriptions, case data, action plan progress | Relational integrity for user data, ACID compliance, mature ecosystem |
| **Legal Knowledge Graph** | Neo4j | Structured relationships between legal concepts, laws, courts, jurisdictions, procedures | Legal knowledge is inherently a graph — laws connect to courts, courts to jurisdictions, jurisdictions to offices, issues to laws. Graph queries are natural and performant. |
| **Legal Content** | PostgreSQL + full-text search (or Elasticsearch) | Acts, sections, articles, explainers, templates | Structured content with full-text search capability for RAG retrieval |
| **Vector Store** | Pinecone / Weaviate / pgvector | Embeddings of legal documents for semantic search (RAG) | Essential for RAG pipeline — retrieve relevant legal context for AI generation |
| **Session/Cache** | Redis | Session tokens, rate limiting counters, frequently accessed data caching | Low-latency in-memory store for session management and caching |
| **Document/Media Storage** | S3-compatible (AWS S3 / MinIO) | User-uploaded evidence, generated documents, media files | Scalable object storage with encryption at rest |
| **Analytics** | ClickHouse or BigQuery | Event data, usage analytics, aggregated trends | Columnar store optimized for analytical queries on large datasets |

#### Key Data Models (Simplified)

```
User {
  id, phone, email, name, language_preference,
  location (state, district, pincode),
  subscription_tier, created_at
}

LegalIssue {
  id, user_id, category, sub_category,
  classification_confidence, jurisdiction,
  status (active/resolved/abandoned),
  created_at, updated_at
}

IntakeResponse {
  id, issue_id, question_id, response_text,
  response_option_id, created_at
}

ActionPlan {
  id, issue_id, plan_type (short_term/long_term),
  generated_by (ai_version), reviewed_by (expert_id),
  status (draft/active/completed), created_at
}

ActionStep {
  id, plan_id, sequence_number, title, description,
  office_to_visit, documents_needed, estimated_cost,
  deadline, status (pending/completed/skipped),
  completed_at
}

JurisdictionMap {
  state, district, taluka, court_name, court_address,
  court_type, contact_info, office_hours, lat, lng
}

LegalKnowledge (Neo4j) {
  IssueType -> [GOVERNED_BY] -> Law
  Law -> [ADJUDICATED_IN] -> CourtType
  CourtType -> [EXISTS_IN] -> Jurisdiction
  Jurisdiction -> [HAS_OFFICE] -> GovernmentOffice
  IssueType -> [REQUIRES_DOCUMENT] -> DocumentType
  IssueType -> [HAS_PROCEDURE] -> Procedure
  Procedure -> [HAS_STEP] -> ProcedureStep
}
```

### Authentication Strategy

| Method | Use Case | Implementation |
|--------|----------|----------------|
| **Phone OTP** | Primary registration and login (most Indians prefer phone-based auth) | Twilio/MSG91 for OTP delivery. 6-digit OTP with 5-minute expiry. Rate limiting: max 5 OTPs per phone per hour. |
| **Email + Password** | Secondary option, mainly for web users and NRIs. | bcrypt hashing, password strength enforcement, email verification. |
| **Google/Apple OAuth** | Quick sign-in for tech-savvy users. | OAuth 2.0 via Google Sign-In and Apple Sign-In. |
| **Aadhaar-based eKYC** | Optional, for premium features requiring identity verification (document filing, lawyer consultations). | Integration with UIDAI eKYC API. Requires agency license. |
| **Session Management** | JWT tokens with refresh token rotation. | Access token: 1-hour expiry. Refresh token: 30-day expiry with rotation. Stored in httpOnly cookies (web) / secure storage (mobile). |
| **Guest Mode** | Allow basic navigation without registration to reduce friction. | No auth required for browsing rights information and directory. Registration required to generate action plans. |

### Role Management

| Role | Permissions |
|------|-------------|
| **Guest User** | Browse rights info, view directory, access emergency helplines. Cannot save data or generate action plans. |
| **Free User** | Register, basic issue classification, general guidance, basic action plan outline. Save one active case. |
| **Plus User** | Full action plan generation, document templates, deadline tracking, 3 active cases. |
| **Pro User** | Unlimited cases, lawyer matching, document drafting, case tracking, priority support. |
| **Lawyer** | Receive leads, manage profile, respond to consultations, view analytics on own performance. |
| **Legal Expert (Internal)** | Review AI-generated content, approve knowledge base changes, handle escalated support tickets. |
| **Content Manager** | Create/edit/publish legal content, manage translations, update jurisdiction data. |
| **Admin** | Full platform access, user management, system configuration, analytics, billing management. |
| **Super Admin** | Everything + system health, deployment, security configuration, data access controls. |

---

## 4. Recommended Tech Stack

### Frontend

| Layer | Technology | Reasoning |
|-------|-----------|-----------|
| **Web Framework** | **Next.js 14+ (App Router)** | SSR for SEO (critical for organic discovery), excellent performance, React ecosystem, great DX. Legal content pages must rank on Google — SSR is non-negotiable. |
| **UI Library** | **Tailwind CSS + shadcn/ui** | Rapid development, consistent design system, highly customizable. shadcn/ui provides accessible, well-designed components without framework lock-in. |
| **State Management** | **Zustand + TanStack Query** | Zustand for client state (lightweight, simple). TanStack Query for server state (caching, polling, optimistic updates). Avoids Redux complexity. |
| **Mobile App** | **React Native (Expo)** | Share business logic with web. Expo simplifies build/deploy. Critical for India where 95%+ internet usage is mobile. |
| **Internationalization** | **next-intl + custom i18n layer** | Robust i18n with ICU message format support for Hindi, regional languages. |
| **Maps** | **Mapbox GL JS** | More cost-effective than Google Maps at scale. Good Indian map data. Customizable styling. Alternatively, Mappls (MapMyIndia) for better Indian data. |
| **Voice Input** | **Web Speech API + IndicWhisper fallback** | Browser-native speech recognition where available, with server-side IndicWhisper for better Indic language accuracy. |
| **Offline Support** | **Workbox (Service Worker)** | Cache emergency helplines, basic rights info, and nearby directory data for offline access. Critical for areas with spotty internet. |

### Backend

| Layer | Technology | Reasoning |
|-------|-----------|-----------|
| **Runtime** | **Node.js (v20 LTS)** | Shares language with frontend (TypeScript everywhere), excellent async I/O for API-heavy workloads, massive ecosystem. |
| **API Framework** | **Fastify** | Significantly faster than Express, built-in schema validation (JSON Schema), good plugin architecture. For a latency-sensitive app (users expect fast responses), Fastify's performance matters. |
| **API Style** | **REST + WebSocket** | REST for standard CRUD. WebSocket for real-time conversational intake flow (chat-like experience). GraphQL considered but adds complexity not justified at MVP. |
| **AI/ML Services** | **Python (FastAPI)** | Separate Python microservice for AI/ML workloads. FastAPI for async performance. Python is the only viable choice for ML — all major AI libraries are Python-first. |
| **Task Queue** | **BullMQ (Redis-backed)** | Background job processing: action plan generation, document creation, notification delivery, analytics aggregation. |
| **Search Engine** | **Elasticsearch / OpenSearch** | Full-text search across legal content, acts, and knowledge base. Supports Hindi and other Indic language analyzers. |

### Database

| Database | Technology | Reasoning |
|----------|-----------|-----------|
| **Primary RDBMS** | **PostgreSQL 16** | Battle-tested, rich feature set (JSONB, full-text search, PostGIS for geo queries), excellent performance. pgvector extension enables vector search without additional infrastructure initially. |
| **Knowledge Graph** | **Neo4j** | Purpose-built for graph data. Legal knowledge relationships (Law → Court → Jurisdiction → Office) are natural graph traversals. Cypher query language is expressive for legal knowledge queries. |
| **Vector Store (Scale)** | **Pinecone** (or **Weaviate** for self-hosted) | When pgvector performance is insufficient at scale, migrate vector search to a dedicated store. Pinecone for managed simplicity; Weaviate for cost control and self-hosting. |
| **Cache** | **Redis 7** | Session management, rate limiting, caching hot data (popular jurisdiction info, frequently asked rights). |
| **Object Storage** | **AWS S3** | Documents, evidence uploads, generated PDFs. With CloudFront CDN for static content delivery. |

### Infrastructure

| Layer | Technology | Reasoning |
|-------|-----------|-----------|
| **Cloud Provider** | **AWS (Mumbai region ap-south-1)** | Data residency compliance (DPDPA requires data to be stored in India for certain categories). Mumbai region provides lowest latency for Indian users. Mature services. |
| **Container Orchestration** | **AWS ECS Fargate** (MVP) → **EKS** (scale) | Fargate: serverless containers, no cluster management overhead for small team. Migrate to EKS when operational complexity justifies Kubernetes. |
| **CDN** | **CloudFront** | Global edge caching for static assets, legal content pages, and API responses where appropriate. |
| **DNS** | **Route 53** | Reliable DNS with health checks and failover. |
| **Load Balancer** | **ALB (Application Load Balancer)** | Layer 7 load balancing, WebSocket support, path-based routing to different services. |
| **Monitoring** | **CloudWatch + Grafana + Sentry** | CloudWatch for infrastructure metrics, Grafana for custom dashboards, Sentry for error tracking and alerting. |
| **Logging** | **ELK Stack (Elasticsearch, Logstash, Kibana)** or **AWS CloudWatch Logs + OpenSearch** | Centralized logging for debugging and audit trails. Legal platform requires audit logs for compliance. |

### DevOps

| Layer | Technology | Reasoning |
|-------|-----------|-----------|
| **CI/CD** | **GitHub Actions** | Integrated with GitHub repositories. Cost-effective for startups. Supports complex workflows (build, test, deploy, quality gates). |
| **Infrastructure as Code** | **Terraform** | Multi-cloud option (if needed to switch from AWS). Declarative, version-controlled infrastructure. Large community and module ecosystem. |
| **Container Registry** | **AWS ECR** | Tight integration with ECS/EKS. Private registry for Docker images. |
| **Secret Management** | **AWS Secrets Manager** | API keys, database credentials, third-party service tokens. Automatic rotation support. |
| **Environment Management** | **Development → Staging → Production** | Three environments with promotion-based deployment. Staging mirrors production configuration. |
| **Code Quality** | **ESLint + Prettier + Husky (pre-commit hooks)** | Enforce code standards, formatting, and prevent bad commits. TypeScript strict mode enabled. |
| **Testing** | **Vitest (unit) + Playwright (e2e) + k6 (load)** | Vitest for fast unit/integration tests. Playwright for cross-browser e2e tests. k6 for load testing (critical for launch readiness). |

### AI Stack

| Component | Technology | Reasoning |
|-----------|-----------|-----------|
| **LLM (Primary)** | **GPT-4o / GPT-4o-mini (OpenAI API)** | Best-in-class reasoning for legal analysis, multilingual support including Hindi. Use GPT-4o for complex classification, GPT-4o-mini for simpler tasks (cost optimization). |
| **LLM (Fallback/Cost Optimization)** | **Claude 3.5 Sonnet / Llama 3.1 70B (self-hosted)** | Claude for quality. Self-hosted Llama for cost reduction at scale and data privacy (sensitive legal queries never leave your infra). |
| **RAG Framework** | **LangChain + LlamaIndex** | LangChain for orchestration (chains, agents, tools). LlamaIndex for advanced retrieval over the legal knowledge base. |
| **Embeddings** | **text-embedding-3-small (OpenAI)** or **BGE-M3 (self-hosted)** | OpenAI embeddings for quality. BGE-M3 for multilingual embedding without API costs. |
| **Speech-to-Text** | **OpenAI Whisper / IndicWhisper** | Whisper for English. IndicWhisper (AI4Bharat) for Indian languages — significantly better accuracy for Hindi, Tamil, etc. |
| **Text-to-Speech** | **LIMMITS (AI4Bharat) / Google Cloud TTS** | Indian language TTS for voice-first features. AI4Bharat's models are optimized for Indian languages. |
| **NLP (Classification)** | **Fine-tuned IndicBERT / MuRIL** | Google's MuRIL (Multilingual Representations for Indian Languages) for issue classification from vernacular text input. |
| **Prompt Management** | **Promptfoo or LangSmith** | Version control prompts, A/B test different prompt strategies, track LLM performance metrics. |
| **Guardrails** | **NeMo Guardrails (NVIDIA)** or custom | Prevent AI from generating harmful, inaccurate, or out-of-scope legal content. Enforce response boundaries. |

### Mobile

| Component | Technology | Reasoning |
|-----------|-----------|-----------|
| **Framework** | **React Native + Expo** | Code sharing with web (React). Expo SDKs for camera, location, notifications, biometrics. Faster development cycle. |
| **Navigation** | **React Navigation** | Industry standard for React Native. Supports deep linking (critical for WhatsApp bot → app handoff). |
| **Local Storage** | **WatermelonDB** | Offline-first database for React Native. Sync with server when online. Essential for users in low-connectivity areas. |
| **Push Notifications** | **Firebase Cloud Messaging (FCM) + APNs** | Hearing reminders, deadline alerts, plan updates. |
| **Analytics** | **Mixpanel or Amplitude** | User behavior analytics, funnel tracking, retention analysis. |

---

## 5. Scalability Plan

### Phase 1: 0 → 10,000 Users (Months 1-6)

**Architecture: Simple Monolith + Managed Services**

```
User → CloudFront CDN → ALB → Single ECS Service (Fastify API)
                                    ├── PostgreSQL (RDS, db.t3.medium)
                                    ├── Redis (ElastiCache, cache.t3.micro)
                                    ├── S3 (document storage)
                                    └── OpenAI API (LLM calls)

AI Service → Single ECS Service (FastAPI/Python)
                ├── pgvector (in same PostgreSQL)
                └── LangChain RAG pipeline
```

**Monthly infrastructure cost: ~$500-800/month**

- Single PostgreSQL instance with pgvector (no separate vector DB yet)
- Single Redis instance
- 2-3 ECS Fargate tasks (auto-scaling on CPU)
- OpenAI API costs: ~$200-500/month (depends on usage, use GPT-4o-mini aggressively)
- No Neo4j yet — use PostgreSQL JSONB for knowledge graph (sufficient at this scale)

**Key decisions:**
- Don't over-engineer. Ship fast.
- Use managed services everywhere (RDS, ElastiCache, S3).
- Focus on content quality, not infrastructure.
- Manual content updates are fine at this scale.

### Phase 2: 10,000 → 100,000 Users (Months 6-18)

**Architecture: Service-Oriented + Dedicated AI Infrastructure**

```
User → CloudFront → ALB → ECS Service Cluster
                            ├── API Service (3-5 tasks, auto-scaling)
                            ├── Intake Service (2-3 tasks)
                            ├── Action Plan Service (2-3 tasks)
                            ├── Notification Service (1-2 tasks)
                            └── Document Service (1-2 tasks)

Data Layer:
├── PostgreSQL (RDS, db.r6g.large, read replica)
├── Neo4j (AuraDB managed, or self-hosted on EC2)
├── Redis Cluster (ElastiCache, 3 nodes)
├── Elasticsearch (OpenSearch, 3 nodes)
├── Pinecone (managed vector DB)
└── S3 + CloudFront

AI Layer:
├── Python AI Service (ECS, 3-5 tasks with GPU)
├── Self-hosted Llama 3.1 (for cost-sensitive queries)
├── OpenAI API (for complex queries)
└── IndicWhisper (for voice processing)
```

**Monthly infrastructure cost: ~$3,000-6,000/month**

**Key changes:**
- Split monolith into 4-5 services (not full microservices — that's premature).
- Introduce Neo4j for knowledge graph (JSONB queries become unwieldy).
- Add Elasticsearch for full-text legal content search.
- Move vector search to Pinecone for better performance.
- Add PostgreSQL read replica for analytics queries.
- Self-host Llama for cost reduction on simpler classification tasks.
- Add Redis cluster for higher availability.
- Implement proper observability (Grafana dashboards, alerting).

**Scaling challenges at this phase:**
- Knowledge base maintenance becomes a full-time job. Need dedicated legal content team (2-3 people).
- AI accuracy issues will surface more frequently with diverse user queries. Need QA process.
- Multilingual content demands increase. Need to add at least 3-4 more languages.
- WhatsApp bot traffic may exceed web/app traffic. Need to scale bot infrastructure.

### Phase 3: 100,000 → 1,000,000 Users (Months 18-36)

**Architecture: Microservices + Event-Driven + Multi-Region**

```
User → Global CDN → Regional ALBs → EKS Cluster (Kubernetes)
                                      ├── API Gateway (Kong/AWS API Gateway)
                                      ├── 10+ Microservices
                                      ├── Event Bus (Amazon EventBridge/Kafka)
                                      └── Service Mesh (Istio, optional)

Data Layer:
├── PostgreSQL (Aurora PostgreSQL, multi-AZ, auto-scaling)
├── Neo4j Cluster (3-node causal cluster)
├── Redis Cluster (6 nodes)
├── OpenSearch Cluster (5 nodes)
├── Pinecone (scaled tier)
├── ClickHouse (analytics data warehouse)
└── S3 + CloudFront

AI Layer:
├── AI Service Cluster (EKS with GPU nodes)
├── Model Serving (Triton Inference Server or vLLM)
├── Fine-tuned Indian Legal LLM (custom model)
├── Real-time voice processing pipeline
└── Batch pipeline for trend analysis
```

**Monthly infrastructure cost: ~$15,000-30,000/month**

**Key changes:**
- Migrate to EKS (Kubernetes) for complex orchestration.
- Event-driven architecture (EventBridge/Kafka) for decoupled services.
- Aurora PostgreSQL for auto-scaling and multi-AZ reliability.
- ClickHouse data warehouse for analytics at scale.
- Custom fine-tuned LLM on Indian legal data (trained on accumulated user interactions and legal knowledge base).
- GPU-accelerated model serving for self-hosted models.
- Multi-region consideration (Mumbai primary, Hyderabad secondary) for disaster recovery.
- API platform for B2B integrations.

**Critical decisions at this phase:**
- Fine-tune vs. RAG: At 1M users, fine-tuning a smaller model on Indian legal data may outperform RAG with GPT-4o — evaluate carefully.
- Build vs. buy for knowledge graph: At this scale, the knowledge graph is your core IP. Consider building custom tooling for content management rather than relying on off-the-shelf CMS.
- Team scaling: Need 20-30 person engineering team, 5-10 person legal content team, dedicated ML/AI team (3-5 people).
- Compliance: SOC 2 certification, DPDPA compliance audit, regular security penetration testing.

### Cost Projection Summary

| Phase | Users | Monthly Infra Cost | Monthly AI Cost | Total Monthly | Per-User/Month |
|-------|-------|-------------------|-----------------|---------------|----------------|
| Phase 1 | 1K-10K | $500-800 | $200-500 | $700-1,300 | $0.07-0.13 |
| Phase 2 | 10K-100K | $3,000-6,000 | $2,000-5,000 | $5,000-11,000 | $0.05-0.11 |
| Phase 3 | 100K-1M | $15,000-30,000 | $10,000-25,000 | $25,000-55,000 | $0.03-0.06 |

**Per-user cost decreases with scale** — this is a good sign for unit economics. The key risk is AI cost: if action plan generation requires multiple LLM calls per user, costs can escalate. Strategies to manage:
1. Cache common action plans (80% of queries likely map to top 200 issue-jurisdiction combinations).
2. Use smaller/cheaper models for classification, reserve expensive models for plan generation.
3. Self-host open-source models for high-volume, simpler tasks.
4. Implement smart rate limiting on plan generation for free-tier users.

---

## Appendix: MVP Build Timeline (Realistic)

| Month | Milestone | Key Deliverables |
|-------|-----------|------------------|
| **Month 1** | Foundation | Tech stack setup, database schema, auth system, basic API structure, CI/CD pipeline. Begin legal knowledge base curation (top 10 issue types for Maharashtra and Delhi). |
| **Month 2** | Intake Engine | Intake questionnaire for 10 issue types, basic NLP classification, jurisdiction detection for 2 states (MH, DL). |
| **Month 3** | Action Plan v1 | RAG pipeline with legal knowledge base, action plan generation for 10 issue types, rights explainer content for 10 issues. Hindi language support. |
| **Month 4** | Directory + UX | Government office directory for 2 states, emergency helplines, map integration, UX polish, mobile-responsive web app. |
| **Month 5** | Testing + Refinement | Legal expert review of AI outputs, user testing with 100 beta users, accuracy improvements, performance optimization. |
| **Month 6** | Launch MVP | Public launch (web + mobile web), 3 additional states (UP, KA, TN), marketing push, feedback collection. |

**Team needed for MVP:**
- 2 Full-stack developers (Node.js + React)
- 1 AI/ML engineer (Python, RAG, LLM integration)
- 1 Legal domain expert (content curation, accuracy review)
- 1 Designer (UI/UX, multilingual design)
- 1 Founder/PM (product decisions, partnerships, operations)

**Total: 6 people, 6 months. Estimated pre-revenue cost: ₹30-50 lakhs** (assuming team in India, including salaries, infrastructure, and AI API costs).

---

## Appendix: Key Technical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI hallucination in legal guidance | Critical — wrong advice could harm users and invite lawsuits | RAG-only approach (never pure generation), mandatory source citations, confidence scores, human review for high-stakes topics, clear disclaimers |
| Knowledge base becomes stale | High — laws change, offices move, procedures update | Automated monitoring of legal gazette, crowd-sourced corrections with expert review, quarterly content audits, partnerships with law universities for updates |
| Single LLM provider dependency (OpenAI) | Medium — price increases, outages, or policy changes could disrupt service | Abstract LLM calls behind provider-agnostic interface, maintain fallback to Claude/self-hosted Llama, cache common responses |
| User data breach | Critical — legal problems are deeply sensitive personal information | End-to-end encryption for sensitive fields, minimal data retention, SOC 2 compliance from early stage, regular pen testing, responsible disclosure policy |
| Jurisdictional data accuracy | High — wrong court address or outdated office information erodes trust | Multi-source verification (government data + crowd-sourced + manual audits), user feedback loop for data corrections, freshness timestamps visible to users |
