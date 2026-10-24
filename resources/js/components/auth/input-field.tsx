export type InputFieldProps = {
    id: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'tel' | 'search';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    hint?: string;
    autoFocus?: boolean;
    autoComplete?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    inputMode?: 'text' | 'email' | 'numeric' | 'tel' | 'search' | 'url';
    name?: string;
};

export default function InputField({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    hint,
    autoFocus = false,
    autoComplete,
    required = false,
    disabled = false,
    readOnly = false,
    inputMode,
    name,
}: InputFieldProps) {
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const describedBy = error ? errorId : hint ? hintId : undefined;

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1 block text-sm font-bold text-gray-900"
            >
                {label}
            </label>

            <input
                id={id}
                name={name ?? id}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                inputMode={inputMode}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={`mk-input w-full rounded-md border border-gray-400 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 ${
                    error ? 'field-error' : ''
                }`}
            />

            {error ? (
                <p
                    id={errorId}
                    role="alert"
                    className="mt-1 flex items-start gap-1 text-xs font-medium text-[#c40000]"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden="true"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <path
                            d="M12 7v6m0 3.2v.3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                    {error}
                </p>
            ) : hint ? (
                <p id={hintId} className="mt-1 text-xs text-gray-500">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}
