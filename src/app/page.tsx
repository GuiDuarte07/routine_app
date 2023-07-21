'use client'
import { RoutineTable } from "@/components/RoutineTable"

export default function Home() {
  return (
    <main style={{margin: "100px 0", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>
        <RoutineTable width={1100} heigth={1200}/>
    </main>
  )
}
