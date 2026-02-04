'use client';

import Link from 'next/link'
import { LayoutDashboard, Ticket, Users, Settings, Wrench } from 'lucide-react'
import NotificationPanel from './NotificationPanel'

const navItems = [
  { name: 'Panel Control', href: '/', icon: LayoutDashboard },
  { name: 'Tickets / Ordenes', href: '/tickets', icon: Ticket },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-card text-card-foreground flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b mb-4">
        <div className="bg-primary rounded-lg p-2 text-primary-foreground">
          <Wrench size={24} />
        </div>
        <h1 className="font-bold text-xl tracking-tight flex-1">TallerPro</h1>
        <NotificationPanel />
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all group"
          >
            <item.icon size={20} className="group-hover:text-primary transition-colors" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="bg-muted p-4 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">Usuario Taller</p>
            <p className="text-xs text-muted-foreground truncate">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  )
}
