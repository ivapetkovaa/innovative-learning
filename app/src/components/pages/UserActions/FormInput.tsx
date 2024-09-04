/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import styles from "./FormInput.module.css";

export type InputProps = {
    id?: string,
    name?: string,
    placeholder?: string,
    onChange?: (e: any) => void,
    className?: string,
    type?: string,
    errorMessage?: string,
    pattern?: string
}

const FormInput = (props: InputProps) => {
    const [focused, setFocused] = useState<string>("false");

    const handleBlur = () => {
        setFocused("true");
    }

    return (
        <div className={styles["form-input"]}>
            <input 
                id={`${props.id}`} 
                name={props.name}  
                placeholder={props.placeholder} 
                type={props.type}
                pattern={props.pattern}
                className={props.className}
                onChange={props.onChange} 
                onBlur={handleBlur} 
                onFocus={() => props.name === 'repassword' && setFocused("true")} focused={focused}
                required 
            />
            <span className="error">{props.errorMessage}</span>
        </div>
    );
}

export default FormInput;