'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SavingsChallenge } from '@/types/savings'
import { Download, FileSpreadsheet } from 'lucide-react'
import { formatCurrency } from '@/utils/format-currency'
import { CURRENCIES } from '@/types/savings'

interface ExportDataProps {
    challenges: SavingsChallenge[]
}

export function ExportData({ challenges }: ExportDataProps) {
    const [isExporting, setIsExporting] = useState(false)

    const exportToCSV = () => {
        setIsExporting(true)
        try {
            const headers = [
                'Challenge Name',
                'Type',
                'Base Amount',
                'Currency',
                'Start Date',
                'Status',
                'Progress',
                'Total Saved',
                'Target Amount'
            ]

            const rows = challenges.map(challenge => {
                const currency = CURRENCIES.find(c => c.code === challenge.currencyCode) || CURRENCIES[0]
                const completedCount = challenge.progress.filter(m => m.isCompleted).length
                const totalMonths = challenge.progress.length
                const progress = `${completedCount}/${totalMonths}`
                const totalSaved = challenge.progress
                    .filter(m => m.isCompleted)
                    .reduce((sum, m) => sum + m.amount, 0)
                const targetAmount = challenge.progress
                    .reduce((sum, m) => sum + m.amount, 0)

                return [
                    challenge.name,
                    challenge.type,
                    formatCurrency(challenge.baseAmount, currency),
                    challenge.currencyCode,
                    new Date(challenge.startDate).toLocaleDateString(),
                    challenge.isArchived ? 'Archived' : 'Active',
                    progress,
                    formatCurrency(totalSaved, currency),
                    formatCurrency(targetAmount, currency)
                ]
            })

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', `savings-challenges-${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error exporting data:', error)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={exportToCSV}
            disabled={isExporting || challenges.length === 0}
        >
            {isExporting ? (
                <>
                    <FileSpreadsheet className="h-4 w-4 animate-pulse" />
                    Exporting...
                </>
            ) : (
                <>
                    <Download className="h-4 w-4" />
                    Export Data
                </>
            )}
        </Button>
    )
}

