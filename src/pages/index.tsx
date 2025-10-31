
import { Geist, Geist_Mono } from "next/font/google";
import { BadgeCheck } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="h-screen p-5 mt-5">
      <div className="w-2/3 text-center mx-auto">
        <h1 className="text-3xl font-bold text-primary">Welcome to RAG Engine</h1>
        <p className="mt-5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been  It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
      </div>

      <div className="w-2/3 mx-auto p-3 mt-5">
        <h1 className="text-center text-3xl text-primary font-bold mb-5">Pricing plan</h1>
        <div className="flex gap-3">
          <div className="card p-5 bg-base-100/90">
            <h1 className="text-md">Free plan</h1>
            <p className="text-sm text-white/60">For developers testing to be used in rag testimonials.</p>
            <p className="text-md my-3"><span className="text-2xl">$0</span> /month</p>

            <button className="btn btn-primary">Get Started</button>

            <div className="mt-3">
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">50 queries/month</span>
              </p>
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">1000 tokens</span>
              </p>
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">Low Response Speed</span>
              </p>
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">Basic RAH Response</span>
              </p>
            </div>
          </div>

          <div className="card p-5 bg-base-100/90">
            <h1 className="text-md">Free plan</h1>
            <p className="text-sm text-white/60">For developers testing to be used in rag testimonials.</p>
            <p className="text-md my-3"><span className="text-2xl">$0</span> /month</p>

            <button className="btn btn-primary">Get Started</button>

            <div className="mt-3">
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">50 queries/month</span>
              </p>
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">1000 tokens</span>
              </p>
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">Low Response Speed</span>
              </p>
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">Basic RAH Response</span>
              </p>
            </div>
          </div>

          <div className="card p-5 bg-base-100/90">
            <h1 className="text-md">Free plan</h1>
            <p className="text-sm text-white/60">For developers testing to be used in rag testimonials.</p>
            <p className="text-md my-3"><span className="text-2xl">$0</span> /month</p>

            <button className="btn btn-primary">Get Started</button>

            <div className="mt-3">
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">50 queries/month</span>
              </p>
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">1000 tokens</span>
              </p>
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">Low Response Speed</span>
              </p>
              <p className="flex items-center">
                <BadgeCheck size={16}/>
                <span className="ml-3">Basic RAH Response</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
