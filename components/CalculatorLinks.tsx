import { Calculator, TrendingUp, Shield, Target, Coins } from "lucide-react";
import Link from "next/link";

interface CalculatorLink {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const calculators: CalculatorLink[] = [
  {
    title: "Pip Calculator",
    description: "Calculate pip values for forex pairs and commodities",
    icon: <TrendingUp className="w-5 h-5" />,
    href: "/calculators/pip-calculator",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Profit Calculator",
    description: "Calculate potential profits and losses on trades",
    icon: <Calculator className="w-5 h-5" />,
    href: "/calculators/profit-calculator",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Margin Calculator",
    description: "Determine required margin for your trades",
    icon: <Shield className="w-5 h-5" />,
    href: "/calculators/margin-calculator",
    color: "from-amber-500 to-amber-600",
  },
  {
    title: "Lot Size Calculator",
    description: "Calculate optimal position size based on risk",
    icon: <Target className="w-5 h-5" />,
    href: "/calculators/lot-size-calculator",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Gold Price Calculator",
    description: "Compare live gold price with Indian physical gold cost",
    icon: <Coins className="w-5 h-5" />,
    href: "/calculators/gold-calculator",
    color: "from-yellow-500 to-yellow-600",
  },
];

interface CalculatorLinksProps {
  currentPath?: string;
}

export function CalculatorLinks({ currentPath }: CalculatorLinksProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-bold text-white">All Calculators</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {calculators.map((calc) => {
          const isActive = currentPath === calc.href;
          return (
            <Link
              key={calc.href}
              href={calc.href}
              className={`group bg-zinc-900 border rounded-xl p-4 transition-all ${
                isActive
                  ? "border-amber-400 bg-amber-400/5"
                  : "border-zinc-800 hover:border-amber-400/50"
              }`}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${calc.color} mb-3 group-hover:scale-110 transition-transform`}>
                <div className="text-white">
                  {calc.icon}
                </div>
              </div>
              <h3 className={`font-semibold mb-1 text-sm ${
                isActive ? "text-amber-400" : "text-white group-hover:text-amber-400"
              } transition-colors`}>
                {calc.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {calc.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
