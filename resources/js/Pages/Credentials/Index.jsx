import Badge from "@/Components/Badge";
import Card from "@/Components/Card";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Select from "@/Components/Select";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ credentials, categories }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            title: "",
            category: "",
            username: "",
            password: "",
            url_or_ip: "",
            notes: "",
        });

    const openModal = () => setShowModal(true);

    const closeModal = () => {
        setShowModal(false);
        clearErrors();
        reset();
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("credentials.store"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Credenciais
                </h2>
            }
        >
            <Head title="Credenciais" />

            <div className="py-12">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:px-6 lg:px-8">
                    <div className="flex justify-end">
                        <PrimaryButton onClick={openModal}>
                            Nova credencial
                        </PrimaryButton>
                    </div>

                    <Card>
                        <div className="p-6">
                            {credentials.length === 0 ? (
                                <p className="text-muted-foreground">
                                    Nenhuma credencial cadastrada ainda.
                                </p>
                            ) : (
                                <ul className="divide-y divide-border">
                                    {credentials.map((credential) => (
                                        <li
                                            key={credential.id}
                                            className="flex items-center justify-between py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <p className="font-medium text-foreground">
                                                    {credential.title}
                                                </p>
                                                {credential.category && (
                                                    <Badge>
                                                        {credential.category}
                                                    </Badge>
                                                )}
                                            </div>
                                            {credential.username && (
                                                <span className="text-sm text-muted-foreground">
                                                    {credential.username}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={submit} className="space-y-4 p-6">
                    <h3 className="text-lg font-medium text-foreground">
                        Nova credencial
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="title" value="Título" />
                            <TextInput
                                id="title"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.title}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="category" value="Categoria" />
                            <Select
                                className="mt-1"
                                value={data.category}
                                onChange={(value) => setData("category", value)}
                                options={categories}
                                placeholder="Selecione..."
                            />
                            <InputError
                                message={errors.category}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="username" value="Usuário" />
                            <TextInput
                                id="username"
                                className="mt-1 block w-full"
                                value={data.username}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.username}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Senha" />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="url_or_ip" value="URL ou IP" />
                            <TextInput
                                id="url_or_ip"
                                className="mt-1 block w-full"
                                value={data.url_or_ip}
                                onChange={(e) =>
                                    setData("url_or_ip", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.url_or_ip}
                                className="mt-2"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="notes" value="Notas" />
                            <textarea
                                id="notes"
                                className="mt-1 block w-full rounded-lg border-input bg-secondary/60 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:bg-secondary focus:ring-ring/40"
                                rows={3}
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.notes}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            Salvar
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
