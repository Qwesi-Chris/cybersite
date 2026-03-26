import React, { useState } from 'react';
import { Shield, BookOpen, Server, Lock } from 'lucide-react';

export const References: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ports' | 'owasp'>('ports');

  const commonPorts = [
    { port: 20, service: 'FTP-DATA', description: 'File Transfer Protocol (Data Channel)' },
    { port: 21, service: 'FTP', description: 'File Transfer Protocol (Control Channel)' },
    { port: 22, service: 'SSH', description: 'Secure Shell' },
    { port: 23, service: 'Telnet', description: 'Telnet (Insecure)' },
    { port: 25, service: 'SMTP', description: 'Simple Mail Transfer Protocol' },
    { port: 53, service: 'DNS', description: 'Domain Name System' },
    { port: 80, service: 'HTTP', description: 'Hypertext Transfer Protocol' },
    { port: 110, service: 'POP3', description: 'Post Office Protocol v3' },
    { port: 143, service: 'IMAP', description: 'Internet Message Access Protocol' },
    { port: 443, service: 'HTTPS', description: 'HTTP Secure (TLS/SSL)' },
    { port: 3306, service: 'MySQL', description: 'MySQL Database System' },
    { port: 3389, service: 'RDP', description: 'Remote Desktop Protocol' },
  ];

  const owaspTop10 = [
    { id: 'A01:2021', name: 'Broken Access Control', description: 'Restrictions on what authenticated users are allowed to do are often not properly enforced.' },
    { id: 'A02:2021', name: 'Cryptographic Failures', description: 'Failures related to cryptography (or lack thereof), which often leads to sensitive data exposure.' },
    { id: 'A03:2021', name: 'Injection', description: 'User-supplied data is not validated, filtered, or sanitized by the application.' },
    { id: 'A04:2021', name: 'Insecure Design', description: 'Risks related to design and architectural flaws, calling for more use of threat modeling.' },
    { id: 'A05:2021', name: 'Security Misconfiguration', description: 'Insecure default settings, incomplete configurations, open cloud storage, misconfigured HTTP headers.' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-8 h-8 text-emerald-500" />
        <h1 className="text-4xl font-extrabold text-white tracking-tight">References</h1>
      </div>
      
      <p className="text-zinc-400 text-lg mb-8">
        Quick reference guides for common cybersecurity concepts, ports, and vulnerabilities.
      </p>

      <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-px">
        <button 
          onClick={() => setActiveTab('ports')}
          className={`pb-2 px-1 font-medium transition-colors border-b-2 ${activeTab === 'ports' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          Common Ports
        </button>
        <button 
          onClick={() => setActiveTab('owasp')}
          className={`pb-2 px-1 font-medium transition-colors border-b-2 ${activeTab === 'owasp' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          OWASP Top 10
        </button>
      </div>

      {activeTab === 'ports' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-800/50 text-zinc-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Port</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {commonPorts.map((port) => (
                  <tr key={port.port} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-emerald-400">{port.port}</td>
                    <td className="px-6 py-4 font-medium text-zinc-200">{port.service}</td>
                    <td className="px-6 py-4">{port.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'owasp' && (
        <div className="grid gap-4">
          {owaspTop10.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-800 p-3 rounded-lg text-emerald-500 shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-1">
                    <span className="text-zinc-500 mr-2">{item.id}</span>
                    {item.name}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
