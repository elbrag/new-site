import { FontList } from "@/pages/_app";
import Link from "next/link";

export default function Hero() {
    const fontNames = Object.keys(FontList)
    console.log(fontNames)

    const text = "Ellen Brage"
    const splitText = text.split("").map((l, i) => <span className={`font-${fontNames[i]}`} key={`hero-text-${i}`}>{l}</span>)


    return <div className="hero h-full w-full flex items-center justify-center flex-grow">
        <h1 className="text-5xl">{...splitText}</h1>
    </div>
}