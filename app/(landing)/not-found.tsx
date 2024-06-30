import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <main className="text-center">
        <h2 className="text-3xl font-bold">Uh-oh</h2>
        <p>We can't seem to find that page.</p>
        <Link href="/dashboard">Back to dashboard</Link>
    </main>
  )
}
