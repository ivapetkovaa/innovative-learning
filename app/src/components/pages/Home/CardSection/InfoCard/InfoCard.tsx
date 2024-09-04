/* eslint-disable @typescript-eslint/no-explicit-any */


import styles from "./InfoCard.module.css";

const InfoCard = (props: any) => {
    return (
        <div className={styles.card}>
            <div className={styles['icon-container']}>
                <img src={props.image} />
            </div>
            <h3>{props.title}</h3>
            <p>{props.text}</p>
        </div>
    )
}

export default InfoCard;