'use client';

import { HouseFill, ListTimeline } from "@gravity-ui/icons";
import Link from "next/link";
import { usePathname } from 'next/navigation'

import { useSidebarStore } from '@/stores/useSidebarStore'

export default function Sidebar() {
    const pathname = usePathname();
    const isOpen = useSidebarStore((state) => state.isOpen)
    return (
        <div className={`hidden lg:block ${isOpen ? 'w-14' : 'w-60'} border-r border-gray-200 transition-all duration-300 transform h-full fixed top-0 start-0 bottom-0 z-50`} role="dialog" aria-label="Sidebar" >
            <div className="relative flex flex-col h-full max-h-full ">
                <header className="h-20 p-4 flex justify-between items-center gap-x-2">
                    <Link className="flex-none font-semibold text-xl text-layer-foreground focus:outline-hidden focus:opacity-80 " href="/" aria-label="Logo">
                        {!isOpen ? 'Nguyen Duc Site' : ''}
                    </Link>
                    <div className="lg:hidden -me-2">
                        <button type="button" className="flex justify-center items-center gap-x-3 size-6 bg-layer border border-layer-line text-sm text-muted-foreground-2 hover:bg-layer-hover rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-layer-focus" data-hs-overlay="#hs-sidebar-basic-usage">
                            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                </header>
                <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb">
                    <div className="pb-0 px-2 w-full flex flex-col flex-wrap" >
                        <ul className="space-y-1">
                            <li>
                                <Link className={`flex items-center gap-x-3.5 py-2 px-2.5 rounded-xl transition duration-150 ${pathname === '/' ? 'bg-gray-200 hover:bg-gray-300' : 'hover:bg-gray-200'}`} href="/">
                                    <HouseFill className={`${isOpen ? 'size-6' : 'size-4'} transition-all duration-300 transform`}/>
                                    {!isOpen ? 'Dashboard' : ''}
                                </Link>
                            </li>
                            <li>
                                <Link className={`flex items-center gap-x-3.5 py-2 px-2.5 rounded-xl transition duration-150 ${pathname === '/taskmng' ? 'bg-gray-200 hover:bg-gray-300' : 'hover:bg-gray-200'}`} href="/taskmng">
                                    <ListTimeline className={`${isOpen ? 'size-6' : 'size-4'} transition-all duration-300 transform`}/>
                                    {!isOpen ? 'Task List' : ''}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    )
}