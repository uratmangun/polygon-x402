export default function Footer() {
    return (
        <footer className="relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center glow-primary">
                                <span className="text-white font-bold text-xl">X</span>
                            </div>
                            <span className="text-2xl font-bold text-white">x402</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            The first truly gasless marketplace on Polygon. Trade with USDC, no MATIC required.
                        </p>
                        <div className="flex gap-3">
                            {['Twitter', 'Discord', 'GitHub'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all text-gray-400 hover:text-white"
                                    aria-label={social}
                                >
                                    <span className="text-sm">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Marketplace */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Marketplace</h3>
                        <ul className="space-y-3">
                            {['Explore', 'Top Collections', 'New Drops', 'Activity'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {['Documentation', 'API', 'Learn', 'Support'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © 2025 x402. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
