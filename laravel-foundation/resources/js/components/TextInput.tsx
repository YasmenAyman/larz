import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'h-[50px] w-full rounded-xl border border-white/15 bg-[#1e1e22]/90 px-4 text-sm text-white placeholder-white/40 shadow-inner transition-all duration-200 focus:border-[#C5A880] focus:bg-[#25252a] focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 disabled:opacity-50 ' +
                className
            }
            ref={localRef}
        />
    );
});
