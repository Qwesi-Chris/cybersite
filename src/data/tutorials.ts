export interface TutorialSection {
  id: string;
  title: string;
  content: string;
  interactive?: {
    type: 'quiz' | 'terminal';
    question?: string;
    options?: string[];
    correctAnswer?: number;
    command?: string;
    expectedOutput?: string;
  };
}

export interface TutorialCategory {
  id: string;
  title: string;
  sections: TutorialSection[];
}

export const tutorials: TutorialCategory[] = [
  {
    id: 'intro',
    title: 'Cybersecurity Intro',
    sections: [
      {
        id: 'what-is-cybersecurity',
        title: 'What is Cybersecurity?',
        content: `Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users via ransomware; or interrupting normal business processes.

Implementing effective cybersecurity measures is particularly challenging today because there are more devices than people, and attackers are becoming more innovative.

### Key Concepts
* **Confidentiality**: Ensuring that information is not disclosed to unauthorized individuals, entities, or processes.
* **Integrity**: Maintaining the accuracy and completeness of data over its entire lifecycle.
* **Availability**: Ensuring that authorized users have access to information and associated assets when required.`,
        interactive: {
          type: 'quiz',
          question: 'Which of the following is NOT part of the CIA Triad?',
          options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
          correctAnswer: 3
        }
      },
      {
        id: 'common-threats',
        title: 'Common Cyber Threats',
        content: `Understanding the enemy is the first step in defense. Here are some of the most common cyber threats:

* **Malware**: Malicious software such as viruses, worms, trojans, ransomware, and spyware.
* **Phishing**: The practice of sending fraudulent communications that appear to come from a reputable source, usually through email.
* **Man-in-the-Middle (MitM) Attack**: Occurs when attackers insert themselves into a two-party transaction.
* **Denial-of-Service (DoS) Attack**: Floods systems, servers, or networks with traffic to exhaust resources and bandwidth.
* **SQL Injection**: Occurs when an attacker inserts malicious code into a server that uses SQL and forces the server to reveal information it normally would not.`,
        interactive: {
          type: 'quiz',
          question: 'What type of attack involves flooding a server with traffic?',
          options: ['Phishing', 'Malware', 'DoS Attack', 'SQL Injection'],
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: 'network-security',
    title: 'Network Security',
    sections: [
      {
        id: 'firewalls',
        title: 'Firewalls',
        content: `A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on an organization's previously established security policies. At its most basic, a firewall is essentially the barrier that sits between a private internal network and the public Internet.

### Types of Firewalls
* **Packet-filtering firewalls**: Examine packets in isolation and do not know the packet's context.
* **Stateful inspection firewalls**: Examine network traffic to determine whether one packet is related to another packet.
* **Proxy firewalls**: Inspect packets at the application layer of the OSI reference model.
* **Next-generation firewalls (NGFW)**: Combine a traditional firewall with other network device filtering functions, such as an application firewall using in-line deep packet inspection (DPI).`,
      },
      {
        id: 'nmap-basics',
        title: 'Network Scanning with Nmap',
        content: `Nmap (Network Mapper) is a free and open-source utility for network discovery and security auditing. Many systems and network administrators also find it useful for tasks such as network inventory, managing service upgrade schedules, and monitoring host or service uptime.

Nmap uses raw IP packets in novel ways to determine what hosts are available on the network, what services (application name and version) those hosts are offering, what operating systems (and OS versions) they are running, what type of packet filters/firewalls are in use, and dozens of other characteristics.`,
        interactive: {
          type: 'terminal',
          command: 'nmap -sV 192.168.1.1',
          expectedOutput: 'Starting Nmap 7.92 ( https://nmap.org )\nNmap scan report for 192.168.1.1\nHost is up (0.0012s latency).\nNot shown: 998 closed tcp ports (reset)\nPORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)\n80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .\nNmap done: 1 IP address (1 host up) scanned in 6.42 seconds'
        }
      }
    ]
  },
  {
    id: 'web-security',
    title: 'Web Security',
    sections: [
      {
        id: 'sql-injection',
        title: 'SQL Injection (SQLi)',
        content: `SQL injection is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database. It generally allows an attacker to view data that they are not normally able to retrieve. This might include data belonging to other users, or any other data that the application itself is able to access.

### Example
Consider an application that executes the following query:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' AND password = 'password'
\`\`\`

If the application is vulnerable, an attacker might input \`' OR '1'='1\` into the password field, resulting in:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' AND password = '' OR '1'='1'
\`\`\`
Since \`'1'='1'\` is always true, the attacker logs in without a valid password.`,
        interactive: {
          type: 'terminal',
          command: "' OR '1'='1",
          expectedOutput: "Access Granted. Welcome, admin."
        }
      },
      {
        id: 'xss',
        title: 'Cross-Site Scripting (XSS)',
        content: `Cross-Site Scripting (XSS) attacks are a type of injection, in which malicious scripts are injected into otherwise benign and trusted websites. XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user.

### Types of XSS
* **Stored XSS**: The injected script is permanently stored on the target servers, such as in a database, in a message forum, visitor log, comment field, etc.
* **Reflected XSS**: The injected script is reflected off the web server, such as in an error message, search result, or any other response that includes some or all of the input sent to the server as part of the request.
* **DOM-based XSS**: The vulnerability is in the client-side code rather than the server-side code.`
      }
    ]
  }
];

export const getTutorialSection = (categoryId: string, sectionId: string) => {
  const category = tutorials.find(c => c.id === categoryId);
  if (!category) return null;
  return category.sections.find(s => s.id === sectionId) || null;
};

export const getNextSection = (categoryId: string, sectionId: string) => {
  const categoryIndex = tutorials.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) return null;
  
  const category = tutorials[categoryIndex];
  const sectionIndex = category.sections.findIndex(s => s.id === sectionId);
  
  if (sectionIndex < category.sections.length - 1) {
    return { categoryId, sectionId: category.sections[sectionIndex + 1].id };
  } else if (categoryIndex < tutorials.length - 1) {
    return { categoryId: tutorials[categoryIndex + 1].id, sectionId: tutorials[categoryIndex + 1].sections[0].id };
  }
  return null;
};

export const getPrevSection = (categoryId: string, sectionId: string) => {
  const categoryIndex = tutorials.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) return null;
  
  const category = tutorials[categoryIndex];
  const sectionIndex = category.sections.findIndex(s => s.id === sectionId);
  
  if (sectionIndex > 0) {
    return { categoryId, sectionId: category.sections[sectionIndex - 1].id };
  } else if (categoryIndex > 0) {
    const prevCategory = tutorials[categoryIndex - 1];
    return { categoryId: prevCategory.id, sectionId: prevCategory.sections[prevCategory.sections.length - 1].id };
  }
  return null;
};
