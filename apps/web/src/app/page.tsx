import { Construction } from 'lucide-react';
import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-6 text-center">
        <Construction size={64} className="text-amber-500 animate-bounce" />
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          CampusCore ERP
        </h1>
        <p className="text-xl text-slate-600">
          We are currently building the next generation of Campus Management Systems.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <span className="rounded-md bg-amber-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500">
            Coming Soon
          </span>
          <a href="#" className="text-sm font-semibold leading-6 text-slate-900">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </main>
  );
}
