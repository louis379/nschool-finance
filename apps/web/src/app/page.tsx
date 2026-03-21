import AppLayout from '@/components/layout/AppLayout';
import AssetOverview from '@/components/dashboard/AssetOverview';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import MarketOverview from '@/components/dashboard/MarketOverview';
import FinancialHealth from '@/components/dashboard/FinancialHealth';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            早安！投資新手 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">來看看你的財務狀況吧</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <AssetOverview />
            <QuickActions />
            <RecentTransactions />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <FinancialHealth />
            <MarketOverview />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
