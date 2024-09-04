import styles from "./Error.module.css";
import ErrorIcon from "../../assets/error.svg";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className={styles.container}>
      <Link className={styles.home} to="/">
        Back to Home
      </Link>
      <div className={styles.img}>
        <img src={ErrorIcon} />
      </div>
      <h1 className={styles.h1}>Oooops...</h1>
      <div className={styles.messages}>
        <h2>Something went wrong...</h2>
      </div>
    </div>
  );
};

export default Error;
