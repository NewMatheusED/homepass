import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/Components/Toast';

export default function useFlashToast() {
    const { flash } = usePage().props;
    const toast = useToast();
    const lastMessage = useRef(null);

    useEffect(() => {
        if (flash?.message && flash.message !== lastMessage.current) {
            toast.success(flash.message);
            lastMessage.current = flash.message;
        }
    }, [flash?.message]);
}
