import { InputProps } from "@/@types/inputProps";

export function Input(props: InputProps) {
    return (
        <div>
            <label className="text-gray-700">{props.label}</label>
            <input
                {...props}
                className="bg-gray-100 text-gray-600 py-1 px-2 rounded-xl w-full border border-gray-300"
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                onKeyDown={props.onKeyDown}
                disabled={props.disabled}
                min={props.min}
                max={props.max}
                step={props.step}
                required                
            />
        </div>
    )
}