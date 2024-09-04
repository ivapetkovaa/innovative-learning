import styles from "./Loader.module.css";

import LoaderGif from "../../assets/Loading_2.gif";

const Loader = (props: { width?: string; height?: string; text?: string }) => {
  const { width, height, text } = props;
  return (
    <div className={styles.preloader}>
      <div className={styles["loader-container"]}>
        <img style={{ width: width, height: height }} src={LoaderGif} />
        {text && <p>{text}</p>}
      </div>
    </div>
  );
};

export default Loader;
