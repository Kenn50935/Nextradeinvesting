'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export const dynamic = 'force-dynamic';

import {
  TrendingUp,
  Shield,
  Users,
  Wallet,
  ArrowRight,
  Star,
} from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
          <TrendingUp className="w-7 h-7 text-primary" />
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Shield,
      title: 'Secure Investments',
      description: 'Your funds are protected with enterprise-grade security',
    },
    {
      icon: TrendingUp,
      title: 'Daily Profits',
      description: 'Earn consistent returns on your investments',
    },
    {
      icon: Users,
      title: 'Referral Rewards',
      description: 'Earn commissions by inviting friends',
    },
    {
      icon: Wallet,
      title: 'Easy Withdrawals',
      description: 'Fast and reliable withdrawal processing',
    },
  ];

  const stats = [
    { value: '$50M+', label: 'Total Invested' },
    { value: '25K+', label: 'Active Users' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Nextradeinvest</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Star className="w-4 h-4" />
            Trusted by 25,000+ investors worldwide
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-4xl mx-auto">
            Build Your Wealth with{' '}
            <span className="text-gradient">Smart Investments</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of investors growing their financial future through our secure, transparent, and profitable investment platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-4">
              Start Investing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="#plans" className="btn-secondary text-lg px-8 py-4">
              View Plans
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide a secure and transparent platform for your investment journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="stat-card">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans Preview */}
      <section id="plans" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Investment Plans</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose an investment plan that suits your financial goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:text-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: 10, daily: 1.5 },
              { name: 'Silver', price: 50, daily: 2.0 },
              { name: 'Gold', price: 100, daily: 2.5 },
              { name: 'VIP', price: 500, daily: 3.0 },
            ].map((plan, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name} Plan</h3>
                  <div className="text-4xl font-bold text-foreground mb-4">${plan.price}</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {plan.daily}% daily profit for 30 days
                  </div>
                  <Link
                    href="/auth/register"
                    className="inline-block w-full py-3 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-y border-blue-500/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust Nextradeinvest with their financial growth
          </p>
          <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 inline-flex">
            Create Free Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Nextradeinvest</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Nextradeinvest. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}