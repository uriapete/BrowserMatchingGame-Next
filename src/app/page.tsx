import Card from '@/components/card'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <h1 className="text-4xl">Matching Game!</h1>
      <div className="gameboardcontainer mx-auto grid grid-cols-3">
        <Card frontTxt='1' />
        <Card frontTxt='1' />
        <Card frontTxt='1' />
        <Card frontTxt='1' />
        <Card frontTxt='1' />
        <Card frontTxt='1' />
      </div>
    </main>
  )
}
