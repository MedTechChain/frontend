import { redirect } from "next/navigation";

// default path when going to the website, automatically redirects to login

export default function Home() {
    redirect("/login");

    return (
        <main>
            <div>OK</div>
        </main>
    );
}
