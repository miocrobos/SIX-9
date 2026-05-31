'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronDown, Globe2 } from 'lucide-react'
import { SIX_BRANCHES } from '@/lib/branches'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * Renders a dropdown allowing the user to choose a SIX Group branch and navigates to that branch's page.
 *
 * The menu is populated from SIX_BRANCHES and displays each branch's flag, city, and name. Selecting an entry navigates to `/branch/{code}` (lowercased).
 *
 * @returns A React element containing the branch selection dropdown; selecting an item navigates to the corresponding branch route.
 */
export default function BranchSelector() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E0E0E0] dark:border-[#333] bg-white dark:bg-transparent text-[#555] dark:text-white text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#D92525] focus:ring-offset-1 hover:border-[#D92525] dark:hover:border-[#D92525] hover:text-[#D92525] dark:hover:text-[#D92525] hover:bg-[#FDF0F0] dark:hover:bg-[#D92525]/10"
        >
          <Globe2 size={13} />
          Select Branch
          <ChevronDown size={13} className="transition-transform data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-[0.6rem] tracking-widest uppercase text-gray-400">
          SIX Group Branches
        </DropdownMenuLabel>
        {SIX_BRANCHES.map((branch) => (
          <DropdownMenuItem
            key={branch.code}
            onClick={() => router.push(`/branch/${branch.code.toLowerCase()}`)}
            className="gap-3 cursor-pointer hover:bg-[#FDF0F0] focus:bg-[#FDF0F0]"
          >
            <div className="rounded overflow-hidden flex-shrink-0 border border-[#E8E8E8]" style={{ width: 28, height: 20 }}>
              <Image
                src={branch.flag}
                alt={branch.name}
                width={28}
                height={20}
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[0.8rem] text-[#1A1A1A] dark:text-white leading-tight">{branch.city}</p>
              <p className="text-[0.7rem] text-gray-400 leading-tight">{branch.name}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


