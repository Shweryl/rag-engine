Project Structure

rag_engine/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── (static assets)
│
├── src/
│   ├── components/
│   │   └── Navbar/
│   │       └── index.tsx
│   │
│   ├── embedding-model/
│   │   └── (embedding model code, e.g. all-MiniLM-L6-v2)
│   │
│   ├── lib/
│   │   ├── auth.ts        # auth helpers (session checks, NextAuth helpers)
│   │   └── db.ts          # Prisma client / DB helpers
│   │
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth].ts   # NextAuth config + callbacks
│   │   │   │   └── register.ts        # custom registration API
│   │   │   │
│   │   │   ├── check-user-access.ts  # checks if user can access a given resource
│   │   │   ├── doc-rag-data.ts       # returns RAG data for a document
│   │   │   ├── embed-doc.ts          # endpoint to embed uploaded documents
│   │   │   ├── generate-url.ts       # generate unique userUrl / shareable URLs
│   │   │   ├── rag-res.ts            # RAG response endpoint (chat response)
│   │   │   └── upload-doc.ts         # file upload endpoint (store & trigger embed)
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── index.tsx
│   │   │   └── register/
│   │   │       └── index.tsx
│   │   │
│   │   ├── chat/
│   │   │   └── [userUrl].tsx         # chat UI per userUrl
│   │   │
│   │   ├── getUrl/
│   │   │   └── index.tsx             # page to request/generate userUrl
│   │   │
│   │   ├── unauthorized/
│   │   │   └── index.tsx
│   │   │
│   │   ├── upload/
│   │   │   └── [userUrl].tsx         # upload UI (uploads tied to userUrl)
│   │   │
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   └── index.tsx                 # home page
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── tmp/                          # temporary files / processing temporay images
│
├── .env
├── package.json
├── tsconfig.json
├── next.config.js
└── .gitignore


