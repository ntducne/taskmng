'use client';

import Header from "./header"
import Sidebar from "./sidebar"
import { useSidebarStore } from '@/stores/useSidebarStore'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const isOpen = useSidebarStore((state) => state.isOpen)
    return (
        <div className="flex">
            <Sidebar />
            <div className={`flex-1 transition-all duration-300 transform ${isOpen ? 'ps-14' : 'ps-60'}`}>
                <Header />
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}