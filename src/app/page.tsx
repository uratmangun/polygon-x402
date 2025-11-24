import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MarketplaceGrid from '@/components/MarketplaceGrid';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <MarketplaceGrid />

      {/* How It Works Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How <span className="text-gradient">x402</span> Works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience seamless trading powered by Polygon's x402 technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Your Wallet',
                description: 'Link your wallet without needing MATIC for gas. Just USDC is enough.',
                icon: '🔗',
              },
              {
                step: '02',
                title: 'Browse & Select',
                description: 'Explore thousands of products from electronics to fashion.',
                icon: '🛒',
              },
              {
                step: '03',
                title: 'Trade Instantly',
                description: 'Buy or sell using USDC. Zero gas fees, instant settlement.',
                icon: '⚡',
              },
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-6xl mb-6">{item.icon}</div>
                <div className="text-cyan-400 font-mono text-sm mb-3">{item.step}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel rounded-3xl p-12 md:p-16 border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Trade <span className="text-gradient">Gas-Free</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of traders experiencing the future of gasless transactions on Polygon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_30px_-5px_var(--primary)] transition-all duration-300 transform hover:-translate-y-1">
                Get Started Now
              </button>
              <button className="px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
