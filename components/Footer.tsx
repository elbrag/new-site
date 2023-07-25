import Link from "next/link";

export default function Footer() {
    const email = "ellenbrage@outlook.com";
    return <footer className="p-6 lg:p-12"><Link href={`mailto:${email}`}>{email}</Link></footer>
}