import Link from "next/link";

export default function Footer() {
    const email = "ellenbrage@outlook.com";
    return <footer><Link href={`mailto:${email}`}>{email}</Link></footer>
}