import SavingsCalculator from '@/components/savings-calculator'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="container py-10 space-y-8">
                <SavingsCalculator isAuthenticated={false} />
            </div>
        </div>
    )
}

