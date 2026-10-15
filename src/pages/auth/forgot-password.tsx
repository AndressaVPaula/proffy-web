import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useNavigate } from "react-router"

import { BackgroundIntro } from "../../components/backgroundIntro"
import { Button } from "../../components/button"
import { Input } from "../../components/input"

import goBack from "../../assets/goback.svg"

const forgotPasswordForm = z.object({
    email: z.email("E-mail inválido"),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordForm>

// Simulação da API (troque por fetch/axios quando a API estiver pronta).
// A API deve responder 404 quando o e-mail não estiver cadastrado.
async function sendRecoveryEmail(email: string) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (email.toLowerCase() === "naoexiste@email.com") {
        throw new Error("EMAIL_NOT_FOUND")
    }
}

export function ForgotPassword() {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors, isValid }
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordForm),
        mode: "onChange"
    })

    async function handleForgotPassword(data: ForgotPasswordForm) {
        try {
            await sendRecoveryEmail(data.email)
            navigate("/forgot-password/finally")
        } catch (error) {
            if (error instanceof Error && error.message === "EMAIL_NOT_FOUND") {
                setError("email", { type: "server", message: "E-mail não cadastrado" })
                toast.error("E-mail não cadastrado")
                return
            }
            toast.error("Não foi possível enviar o e-mail. Tente novamente.")
        }
    }

    function goBackPage() {
        navigate(-1)
    }

    return (
        <div className="grid min-h-screen grid-cols-5 antialiased">
            <div className="bg-background col-span-2 flex flex-col h-full items-center justify-center">
                <div className='w-[352px] relative'>
                    <button type="button" className="absolute left-0 cursor-pointer mt-[-100px]" onClick={goBackPage}>
                        <img src={goBack} alt="Seta para voltar a página anterior" className="w-8 h-12" />
                    </button>
                    <div className='flex flex-col justify-center gap-6'>
                        <h1 className='text-3xl font-poppins-semibold text-text-title'>
                            Eita, esqueceu<br />sua senha?
                        </h1>
                        <h3 className="text-base font-poppins-regular text-text-base">
                            Não esquenta,<br />vamos dar um jeito nisso.
                        </h3>

                        <form onSubmit={handleSubmit(handleForgotPassword)}>
                            <Input
                                type="email"
                                id="email"
                                placeholder="E-mail"
                                rounded="all"
                                register={register}
                                error={errors.email}
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm font-poppins-regular text-red-500">
                                    {errors.email.message}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                                title={isSubmitting ? "Enviando..." : "Enviar"}
                            />
                        </form>
                    </div>
                </div>
            </div>
            <BackgroundIntro />
        </div>
    )
}