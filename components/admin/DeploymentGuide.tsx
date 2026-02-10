import React from 'react';
import { 
  Terminal, Server, Globe, Database, Cpu, CheckCircle2, AlertCircle, 
  Copy, Code, ChevronRight, Key, Github, FileEdit, ShieldCheck, 
  HardDrive, Zap, Package, Lock, Settings 
} from 'lucide-react';

const DeploymentGuide: React.FC = () => {
  const steps = [
    {
      id: '01',
      title: 'Server Requirements',
      icon: Cpu,
      content: 'Recommended: Ubuntu 20.04 or 22.04 LTS. Ensure you have a registered domain name (e.g., nouncrm.com) and root/sudo SSH access.',
      commands: []
    },
    {
      id: '02',
      title: 'Update Server',
      icon: Terminal,
      content: 'Refresh the local package index and upgrade the installed packages.',
      commands: ['sudo apt update && sudo apt upgrade -y']
    },
    {
      id: '03',
      title: 'Install Nginx',
      icon: Globe,
      content: 'Install the Nginx web server and enable it to start on boot.',
      commands: [
        'sudo apt install nginx -y',
        'sudo systemctl start nginx',
        'sudo systemctl enable nginx'
      ]
    },
    {
      id: '04',
      title: 'Install PHP',
      icon: Code,
      content: 'Install PHP-FPM and essential extensions for Laravel performance.',
      commands: [
        'sudo apt install php php-fpm php-mysql php-xml php-mbstring php-curl php-zip unzip -y',
        'php -v'
      ]
    },
    {
      id: '05',
      title: 'Install MySQL',
      icon: Database,
      content: 'Install MySQL Server, secure it, and create the NOUN CRM database and user.',
      commands: [
        'sudo apt install mysql-server -y',
        'sudo mysql_secure_installation',
        '# Login to MySQL: mysql -u root -p',
        'CREATE DATABASE nouncrm;',
        "CREATE USER 'nouncrm_user'@'localhost' IDENTIFIED BY 'password123';",
        "GRANT ALL PRIVILEGES ON nouncrm.* TO 'nouncrm_user'@'localhost';",
        'FLUSH PRIVILEGES;',
        'EXIT;'
      ]
    },
    {
      id: '06',
      title: 'Install Composer',
      icon: Package,
      content: 'Download and install the PHP dependency manager globally.',
      commands: [
        'curl -sS https://getcomposer.org/installer | php',
        'sudo mv composer.phar /usr/local/bin/composer'
      ]
    },
    {
      id: '07',
      title: 'Upload Project',
      icon: Github,
      content: 'Clone your repository and set correct permissions for the web server.',
      commands: [
        'cd /var/www',
        'sudo git clone https://github.com/yourrepo/nouncrm.git',
        'sudo chown -R www-data:www-data nouncrm',
        'cd nouncrm',
        'composer install'
      ]
    },
    {
      id: '08',
      title: 'Environment Setup',
      icon: FileEdit,
      content: 'Configure your .env file with database credentials and generate the app key.',
      commands: [
        'cp .env.example .env',
        'nano .env',
        '# Set DB_DATABASE=nouncrm, DB_USERNAME=nouncrm_user, DB_PASSWORD=password123',
        'php artisan key:generate',
        'php artisan migrate'
      ]
    },
    {
      id: '09',
      title: 'Nginx Configuration',
      icon: Settings,
      content: 'Create a new Nginx site configuration block for your domain.',
      commands: [
        'sudo nano /etc/nginx/sites-available/nouncrm',
        '# Paste the server block (see documentation side panel)',
        'sudo ln -s /etc/nginx/sites-available/nouncrm /etc/nginx/sites-enabled',
        'sudo nginx -t',
        'sudo systemctl reload nginx'
      ]
    },
    {
      id: '10',
      title: 'SSL (HTTPS)',
      icon: Lock,
      content: 'Secure your site using Let\'s Encrypt SSL certificates.',
      commands: [
        'sudo apt install certbot python3-certbot-nginx -y',
        'sudo certbot --nginx'
      ]
    },
    {
      id: '11',
      title: 'Queue & Storage',
      icon: HardDrive,
      content: 'Link public storage and set writable permissions for cache and logs.',
      commands: [
        'php artisan storage:link',
        'sudo chmod -R 775 storage bootstrap/cache'
      ]
    },
    {
      id: '12',
      title: 'Firewall Setup',
      icon: ShieldCheck,
      content: 'Enable UFW and allow Nginx traffic.',
      commands: [
        'sudo ufw allow OpenSSH',
        'sudo ufw allow \'Nginx Full\'',
        'sudo ufw enable'
      ]
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-gray-900 flex items-center gap-3 italic uppercase tracking-tighter">
            <Server className="text-brand-blue" />
            Deployment Center
          </h2>
          <p className="text-gray-500 mt-1">Full stack installation guide for Ubuntu & Laravel.</p>
        </div>
        <div className="bg-brand-yellow text-brand-blue px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm">
           <Zap size={14} className="fill-brand-blue" /> System Live Protocol
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Timeline */}
        <div className="lg:col-span-8 space-y-10">
           {steps.map((step, idx) => (
             <div key={idx} className="relative pl-12 group">
                {/* Timeline Line */}
                {idx !== steps.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-100 group-hover:bg-brand-yellow transition-colors duration-500"></div>
                )}
                
                {/* Step Number Bubble */}
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-black text-xs z-10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                   {step.id}
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:translate-x-1 transition-all">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-brand-light rounded-lg">
                        <step.icon className="text-brand-blue" size={20} />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{step.title}</h3>
                   </div>
                   <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">{step.content}</p>
                   
                   {step.commands.length > 0 && (
                     <div className="space-y-2">
                        {step.commands.map((cmd, cIdx) => (
                          <div key={cIdx} className="bg-gray-900 rounded-xl p-4 font-mono text-[11px] text-blue-300 flex justify-between items-center group/cmd overflow-hidden">
                             <span className="truncate mr-4 text-blue-100 opacity-90">
                               {cmd.startsWith('#') ? <span className="text-gray-500">{cmd}</span> : <span><span className="text-brand-yellow mr-2">$</span>{cmd}</span>}
                             </span>
                             {!cmd.startsWith('#') && (
                               <button 
                                  onClick={() => copyToClipboard(cmd)}
                                  className="opacity-0 group-hover/cmd:opacity-100 p-1.5 hover:bg-white/10 rounded transition-all flex-shrink-0"
                                  title="Copy command"
                                >
                                  <Copy size={12} className="text-white" />
                               </button>
                             )}
                          </div>
                        ))}
                     </div>
                   )}
                </div>
             </div>
           ))}

           {/* Production Optimization Section */}
           <div className="bg-brand-blue rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 <Zap size={200} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4">Production Optimization</h3>
                <p className="text-blue-200 text-sm mb-8 max-w-md">Run these commands once your system is fully configured to cache routes, config, and views for maximum performance.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {['config', 'route', 'view'].map(type => (
                     <div key={type} className="bg-white/10 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-black uppercase text-brand-yellow mb-2">{type} Cache</p>
                        <code className="text-xs font-mono">php artisan {type}:cache</code>
                     </div>
                   ))}
                </div>
              </div>
           </div>
        </div>

        {/* Sidebar Info & Config Snippets */}
        <div className="lg:col-span-4">
           <div className="sticky top-24 space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                 <h4 className="font-black text-brand-blue uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Code size={16} className="text-brand-yellow" />
                    Nginx Config Snippet
                 </h4>
                 <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 overflow-hidden">
                    <pre className="text-[9px] font-mono text-gray-500 overflow-x-auto">
{`server {
    listen 80;
    server_name nouncrm.com;
    root /var/www/nouncrm/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
    }

    location ~ /\\.ht {
        deny all;
    }
}`}
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(`server {
    listen 80;
    server_name nouncrm.com;
    root /var/www/nouncrm/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
    }

    location ~ /\\.ht {
        deny all;
    }
}`)}
                      className="w-full mt-4 py-2 bg-brand-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Copy size={12} /> Copy Server Block
                    </button>
                 </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                 <div className="flex items-center gap-3 text-brand-blue font-bold mb-4">
                    <Database size={20} className="text-brand-yellow" />
                    <span>Database Credentials</span>
                 </div>
                 <div className="space-y-3">
                    {[
                      { label: 'DB Name', val: 'nouncrm' },
                      { label: 'DB User', val: 'nouncrm_user' },
                      { label: 'DB Pass', val: 'password123' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                         <span className="text-[10px] font-black text-gray-400 uppercase">{item.label}</span>
                         <span className="text-xs font-mono font-bold text-gray-700">{item.val}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-8 text-center">
                 <AlertCircle className="mx-auto text-amber-500 mb-4" size={32} />
                 <h4 className="font-black text-amber-900 uppercase text-xs mb-2">Final Verification</h4>
                 <p className="text-xs text-amber-700 font-medium leading-relaxed mb-6">
                    Once all steps are complete, visit your domain to verify the NOUN CRM dashboard is accessible.
                 </p>
                 <a 
                   href="https://nouncrm.com" 
                   target="_blank" 
                   className="inline-block w-full py-3 bg-white text-amber-800 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-amber-200 hover:bg-amber-100 transition-colors"
                 >
                   Open Production URL
                 </a>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentGuide;
