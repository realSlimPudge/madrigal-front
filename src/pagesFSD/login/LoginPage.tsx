import AuthWidget from "@/widgets/Auth/ui/AuthWidget";

export default function LoginPage() {
    return (
        <section className="flex min-h-screen items-center justify-center px-4">
            <AuthWidget mode="login" />
        </section>
    );
}
