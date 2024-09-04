/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import styles from "./Selector.module.css";


const Selector = (props: any) => {
    const { options, selected, onSelect } = props;
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuOpen(!menuOpen);
    }

    return (
        <div className={styles.dropdown} onClick={handleClick}>
            <div className={`${styles.select} ${menuOpen && styles["select-clicked"]}`}>
                <span className={styles.selected}>{selected}</span>
            </div>
            <ul className={`${styles.menu} ${menuOpen && styles["menu-open"]}`}>
                {options?.map(([language, version]: any) => <li onClick={() => onSelect(language)} className={language === selected ? `${styles.active}` : ''} key={language}>{language}&nbsp;<span>v{version}</span></li>)}
            </ul>
        </div>
    )
}

export default Selector;