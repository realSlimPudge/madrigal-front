import AuthWidget from "@/widgets/Auth/ui/AuthWidget";

export default function RegisterPage() {
    return (
        <section className="flex min-h-screen items-center justify-center px-4">
            <AuthWidget mode="register" />
        </section>
    );
}
