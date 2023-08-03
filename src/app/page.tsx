import Card from '@/components/Card'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <h1 className="text-4xl">Matching Game!</h1>
      <div className="gameboard flex flex-row justify-center flex-initial container mx-auto w-1/4 flex-wrap">
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
